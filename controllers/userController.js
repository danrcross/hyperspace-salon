const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate("friends")
        .populate("thoughts");
      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a user and remove their name from associated thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });
      if (!user) {
        return res.status(404).json({ message: "No such user exists" });
      }
      const thoughtNum = user.thoughts.length;
      if (thoughtNum > 0) {
        for (var i = 0; i < thoughtNum; i++) {
          const thought = await Thought.findOneAndDelete({
            username: user.username,
          });
        }
      } else {
        return res.status(404).json({
          message: "User deleted, but no thoughts found for user",
        });
      }

      res.json({ message: "Deleted user and user's thoughts" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Update a single user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!user) {
        res.status(404).json({ message: "No user with this id!" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a friend ID to friends array for a certain user
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: `No user found with this ID: ${req.params.userId}`,
        });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a friend ID from friends array for a certain user
  async deleteFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: `No user found with this ID: ${req.params.userId}`,
        });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
