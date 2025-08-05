const { Op } = require('sequelize');
const db = require('../models');
const Event = db.Event;
const Candidate = db.Candidate;
const UserVote = db.UserVote;
const sequelize = db.sequelize;

// Get events that a specific voter is eligible for
exports.getEligibleEvents = async (req, res) => {
  try {
    const user = req.user;
    const currentDate = new Date();

    const events = await Event.findAll({
      where: {
        // User's region must match event region OR event is 'Nasional'
        [Op.or]: [
          { region: user.region },
          { region: 'Nasional' }
        ],
        // Event must be currently active
        startDate: { [Op.lte]: currentDate },
        endDate: { [Op.gte]: currentDate },
      },
      include: [
        {
          model: Candidate,
          attributes: ['id', 'name', 'party'],
        },
      ],
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch eligible events', details: error.message });
  }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
    try {
      const { eventId } = req.params;
      const event = await Event.findByPk(eventId, {
        include: [{ model: Candidate }]
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event', details: error.message });
    }
  };


// Cast a vote in an event
exports.castVote = async (req, res) => {
  const { eventId } = req.params;
  const { candidateId } = req.body;
  const userId = req.user.id;

  // Start a transaction
  const t = await sequelize.transaction();

  try {
    // 0. Verify that the event is currently active
    const event = await Event.findByPk(eventId, { transaction: t });
    const currentDate = new Date();
    if (!event || currentDate < event.startDate || currentDate > event.endDate) {
      await t.rollback();
      return res.status(403).json({ error: 'This event is not currently active for voting.' });
    }

    // 1. Check if the user has already voted in this event
    const existingVote = await UserVote.findOne({
      where: {
        UserId: userId,
        EventId: eventId,
      },
      transaction: t,
    });

    if (existingVote) {
      await t.rollback();
      return res.status(403).json({ error: 'You have already voted in this event.' });
    }

    // 2. Check if the candidate belongs to the event
    const candidate = await Candidate.findOne({
        where: { id: candidateId, EventId: eventId },
        transaction: t,
    });

    if (!candidate) {
        await t.rollback();
        return res.status(400).json({ error: 'Invalid candidate for this event.' });
    }

    // 3. Record the new vote
    await UserVote.create({
      UserId: userId,
      EventId: eventId,
    }, { transaction: t });

    // 4. Increment the vote count for the candidate
    await candidate.increment('votes', { by: 1, transaction: t });

    // If everything is successful, commit the transaction
    await t.commit();

    res.status(200).json({ message: 'Vote cast successfully.' });

  } catch (error) {
    // If any step fails, roll back the transaction
    await t.rollback();
    res.status(500).json({ error: 'Failed to cast vote', details: error.message });
  }
};
