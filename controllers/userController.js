// ObjectId() method for converting studentId string into an ObjectId for querying database
const { ObjectId } = require("mongoose").Types;
const { User, Thought, Reaction } = require("../models");

module.exports = {
  // // Get all users
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
  // create a new student
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a user and remove their name from associated thoughts
  // TODO: remove deleted user's name from any associated reactions (extra)
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
  // // Add an assignment to a student
  // async addAssignment(req, res) {
  //   try {
  //     console.log('You are adding an assignment');
  //     console.log(req.body);
  //     const student = await Student.findOneAndUpdate(
  //       { _id: req.params.studentId },
  //       { $addToSet: { assignments: req.body } },
  //       { runValidators: true, new: true }
  //     );
  //     if (!student) {
  //       return res
  //         .status(404)
  //         .json({ message: 'No student found with that ID :(' })
  //     }
  //     res.json(student);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // },
  // // Remove assignment from a student
  // async removeAssignment(req, res) {
  //   try {
  //     const student = await Student.findOneAndUpdate(
  //       { _id: req.params.studentId },
  //       { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
  //       { runValidators: true, new: true }
  //     );
  //     if (!student) {
  //       return res
  //         .status(404)
  //         .json({ message: 'No student found with that ID :(' });
  //     }
  //     res.json(student);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // },
};
