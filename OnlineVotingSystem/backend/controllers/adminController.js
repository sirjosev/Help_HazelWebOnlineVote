const db = require('../models');
const Event = db.Event;
const Candidate = db.Candidate;

// Create a new voting event
exports.createEvent = async (req, res) => {
  const { name, position, region, startDate, endDate } = req.body;
  try {
    const event = await Event.create({ name, position, region, startDate, endDate });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event', details: error.message });
  }
};

// Update an existing event
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const [updated] = await Event.update(req.body, { where: { id: eventId } });
    if (updated) {
      const updatedEvent = await Event.findByPk(eventId);
      res.status(200).json(updatedEvent);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event', details: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { confirmationName } = req.body;

    // Find the event first
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if confirmation name matches
    if (event.name !== confirmationName) {
      return res.status(400).json({ error: 'Confirmation name does not match. Deletion cancelled.' });
    }

    // If names match, proceed with deletion
    await event.destroy();
    res.status(204).send(); // No Content

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event', details: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
      const events = await Event.findAll({ include: [Candidate] });
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events', details: error.message });
    }
  };

// Add a candidate to an event
exports.addCandidateToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, party } = req.body;
    const candidate = await Candidate.create({ name, party, EventId: eventId });
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add candidate', details: error.message });
  }
};

// Update a candidate
exports.updateCandidate = async (req, res) => {
    try {
      const { candidateId } = req.params;
      const [updated] = await Candidate.update(req.body, { where: { id: candidateId } });
      if (updated) {
        const updatedCandidate = await Candidate.findByPk(candidateId);
        res.status(200).json(updatedCandidate);
      } else {
        res.status(404).json({ error: 'Candidate not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update candidate', details: error.message });
    }
  };

// Delete a candidate
exports.deleteCandidate = async (req, res) => {
    try {
      const { candidateId } = req.params;
      const deleted = await Candidate.destroy({ where: { id: candidateId } });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Candidate not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete candidate', details: error.message });
    }
  };

// Get results for a specific event
exports.getEventResults = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId, {
      include: [{
        model: Candidate,
        order: [['votes', 'DESC']]
      }]
    });
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results', details: error.message });
  }
};
