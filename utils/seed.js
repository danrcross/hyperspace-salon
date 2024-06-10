const connection = require("../config/connection");
const { User, Thought, Reaction } = require("../models");
const { Types } = require("mongoose");
const {
  getAllUsernames,
  getRandomThoughts,
  getRandomReactions,
  getRandomUsername,
} = require("./data");

connection.on("error", (err) => err);
console.log(User);
connection.once("open", async () => {
  console.log("connected");
  // Delete the collections if they exist
  let thoughtCheck = await connection.db
    .listCollections({ name: "thoughts" })
    .toArray();
  if (thoughtCheck.length) {
    await connection.dropCollection("thoughts");
  }

  let usersCheck = await connection.db
    .listCollections({ name: "users" })
    .toArray();
  if (usersCheck.length) {
    await connection.dropCollection("users");
  }

  // populate thoughts collection first
  var reactions = [];
  var thoughtTextArr = getRandomThoughts(20);

  var thoughts = [];
  for (var i = 0; i < 20; i++) {
    var reactionBodies = getRandomReactions(5);
    var reactions = [];
    for (var j = 0; j < 5; j++) {
      var username = getRandomUsername();
      var reaction = {
        reactionId: new Types.ObjectId(),
        reactionBody: reactionBodies[j].reactionBody,
        username,
      };
      reactions.push(reaction);
    }

    var username = getRandomUsername();
    var thought = thoughtTextArr[i].thoughtText;
    // var { thoughtText } = thoughtText[i];
    var thought = {
      thoughtText: thought,
      username,
      reactions,
    };
    thoughts.push(thought);
  }
  const thoughtData = await Thought.insertMany(thoughts);

  // then, populate users collection
  const users = [];

  for (var i = 0; i < 10; i++) {
    const name = getAllUsernames(i);
    const email = `${name}@email.com`;
    const thoughts = thoughtData.filter((thought) => {
      if (thought.username === name) {
        return thought;
      }
    });

    const thoughtIds = thoughts.map((thought) => thought._id);

    users.push({
      username: getAllUsernames(i),
      email: email,
      thoughts: thoughtIds,
    });
  }
  await User.insertMany(users);
  var allUsers = await User.find();
  for (var i = 0; i < allUsers.length; i++) {
    const user = allUsers[i];
    var friendsArray = [];
    for (var j = 0; j < allUsers.length; j++) {
      const friend = allUsers[j];
      if (j !== i) {
        friendsArray.push({ _id: friend._id });
      }
    }
    try {
      const newUser = await User.findByIdAndUpdate(
        { _id: user._id },
        { friends: friendsArray },
        { new: true, upsert: true }
      );
    } catch (error) {
      console.error("error updating:" + error);
    }
  }

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
