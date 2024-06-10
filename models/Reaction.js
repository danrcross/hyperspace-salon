const { Schema, Types } = require("mongoose");
// import formatTimestamp method for use as a 'getter'
const { formatTimestamp } = require("../utils/helpers");

// reaction schema will NOT be a model, but a schema for reaction subdocuments within the 'thoughts' collection
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 250,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: formatTimestamp,
    },
  },
  {
    toJSON: {
      getters: true,
    },
    _id: false,
  }
);

// export the reactionSchema
module.exports = reactionSchema;
