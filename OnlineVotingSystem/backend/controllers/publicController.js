const { Op } = require('sequelize');
const db = require('../models');
const Event = db.Event;
const Candidate = db.Candidate;

// Get live results for all ongoing events
exports.getLiveResults = async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await Event.findAll({
      where: {
        // Event must be currently active
        startDate: { [Op.lte]: currentDate },
        endDate: { [Op.gte]: currentDate },
      },
      include: [{
        model: Candidate,
        attributes: ['id', 'name', 'party', 'votes'],
      }],
      order: [
        // Order events, then order candidates by votes within each event
        ['startDate', 'DESC'],
        [Candidate, 'votes', 'DESC'],
      ],
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch live results', details: error.message });
  }
};
