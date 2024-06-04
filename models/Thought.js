const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // need to use 'getter' method to format timestamp on query
  },
  username: {
    type: Date,
    required: true,
  },
  reactions: [reactionSchema],
  // Create a virtual called `reactionCount` that retrieves the length of the thought's `reactions` array field on query.
});

const Thought = model("thoughts", thoughtSchema);

module.exports = Thought;
