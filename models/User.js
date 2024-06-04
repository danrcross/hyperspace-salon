const { Schema, model } = require("mongoose");
const thoughtSchema = require("./Thought");

// Schema to create Student model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // info on custom validators found here: https://mongoosejs.com/docs/validation.html
      validate: {
        validator: function (v) {
          // found information on rules for valid email address here: https://knowledge.validity.com/s/articles/What-are-the-rules-for-email-address-syntax?language=en_US#:~:text=The%20domain%20name%20is%20a,Digits%20from%200%20to%209
          // created this regex myself!
          return /[\w\.\+\^'=-]{1,64}@[A-Za-z\d\.-]{1,253}\.[a-z\d-]{2,63}/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thoughts",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    assignments: [assignmentSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const User = model("user", userSchema);

module.exports = Student;
