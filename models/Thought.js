const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
const { formatTimestamp } = require("../utils/helpers");

// thoughtSchema defined here...
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    // uses imported 'formatTimestamp' getter method to format date and time
    createdAt: {
      type: Date,
      default: Date.now,
      get: formatTimestamp,
    },
    username: {
      type: String,
      required: true,
    },
    // 'reactions' will hold an array of objects that must conform to reactionSchema (defined in 'Reaction.js')
    reactions: [reactionSchema],
  },
  // settings: virtuals and getters active; don't include default 'id' object
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// will give a property 'reactionCount' that will give the integer value of the number of reactions to this thought
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// initializes the 'Thought' model, using mongoose.model. first argument, 'Thought', defines 'thoughts' as the name of the collection that the model is for. (looks for pluralized, lowercased version of string)
// second argument, 'thoughtSchema', defines the schema for documents within this collection
const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
