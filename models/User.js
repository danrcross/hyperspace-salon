const { Schema, model } = require("mongoose");

// define userSchema
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
    // two arrays below will hold IDs, but can be expanded by request with .populate() method
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
  },
  // settings defined here...
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// will add property 'friendCount' that will give the length of the array of friends
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// defines the model 'User': applies userSchema as schema for documents in 'users' collection
const User = model("User", userSchema);

module.exports = User;
