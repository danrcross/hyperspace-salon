const { Schema, Types, model } = require("mongoose");
const reactionSchema = require("./Reaction");
const { formatTimestamp } = require("../controllers/reactionController");

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: formatTimestamp,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual("reactionCount")
  // Getter
  .get(function () {
    return this.reactions.length;
  });
const Thought = model("thoughts", thoughtSchema);

module.exports = Thought;
