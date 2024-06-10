const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { Types } = require("mongoose");
const {
  getAllUsernames,
  getRandomThoughts,
  getRandomReactions,
  getRandomUsername,
} = require("./data");

connection.on("error", (err) => err);
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

  // populate 'thoughts' collection first
  var reactions = [];
  // Gets 15 random thoughts, using method/ array in data.js
  var thoughtTextArr = getRandomThoughts(15);
  var thoughts = [];
  // loops over array of random thoughts...
  for (var i = 0; i < 15; i++) {
    var reactionBodies = getRandomReactions(5);
    var reactions = [];
    // loops over random reactions; incorporates reaction into an object consistent with schema defined in 'Reaction.js'; pushes 'reaction' object to 'reactions' array
    for (var j = 0; j < 5; j++) {
      var username = getRandomUsername();
      var reaction = {
        reactionId: new Types.ObjectId(),
        reactionBody: reactionBodies[j].reactionBody,
        username,
      };
      reactions.push(reaction);
    }

    // gets a random username to associate with currently-iterated thought
    var username = getRandomUsername();
    var thought = thoughtTextArr[i].thoughtText;
    // creates object consistent with schema defined in 'Thought.js'; includes thoughtText, random username, and array of reactions (generated above)
    var thought = {
      thoughtText: thought,
      username,
      reactions,
    };
    // thought object pushed to 'thoughts' array
    thoughts.push(thought);
  }

  // array 'thoughts' of many 'thought' objects is inserted into database
  const thoughtData = await Thought.insertMany(thoughts);

  // then, populate 'users' collection...
  const users = [];

  // loop over each user from array in 'data.js'...
  for (var i = 0; i < 10; i++) {
    const name = getAllUsernames(i);
    const email = `${name}@email.com`;
    // filters each 'thought' that matches the currently-iterated username, returns array 'thoughts' containing all matches
    const thoughts = thoughtData.filter((thought) => {
      if (thought.username === name) {
        return thought;
      }
    });
    // creates array of id's from the array of thoughts
    const thoughtIds = thoughts.map((thought) => thought._id);
    // push to array 'users' an object consistent with schema defined in 'User.js', including a simple username, simple email address, and array of thoughtIds associated with user
    users.push({
      username: getAllUsernames(i),
      email: email,
      thoughts: thoughtIds,
    });
  }
  // insert array of user objects
  await User.insertMany(users);
  var allUsers = await User.find();
  // loop over users; for current user, find all other users and add them to user's friends array
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
      // update current user's friends array with array of user ids created above
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
