const { User, Thought } = require("../models");

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single thought by ID
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought is associated with this ID!" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const userId = req.body.userId;
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { thoughts: thought },
        },
        { new: true }
      );
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json({ message: "Thought deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // add a reaction to thought's reaction array
  async addReaction(req, res) {
    try {
      const reaction = req.body;
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: reaction } },
        { runValidators: true, new: true }
      );
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete a reaction from thought's reaction array
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({
          message: `No thought found with this ID: ${req.params.userId}`,
        });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
