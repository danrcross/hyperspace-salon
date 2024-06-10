const users = [
  "user1",
  "user2",
  "user3",
  "user4",
  "user5",
  "user6",
  "user7",
  "user8",
  "user9",
  "user10",
];

const thoughts = [
  "mTECQuwhrU",
  "OwHLoGmLTn",
  "VfDNhHMmrI",
  "jFhRDdOMUu",
  "UbZxLrbJxT",
  "JnzdWtnpUo",
  "TWeCzrbcaJ",
  "fqNzgCJMCs",
  "RPMLyBUlOo",
  "GokBGYtCuL",
  "MYHaiwxlpz",
  "JfgtqniMXH",
  "gBLTkPoQLI",
  "WrqSdLTZHJ",
  "GhYUKKDRZH",
  "WEjJkgujvb",
  "UoQwggkiwc",
  "TpOeaxxvRV",
  "KljqUGuNYj",
  "ZITIQYuVDK",
];

const reactions = [
  "ROchIlA",
  "IkqHKSw",
  "HVofand",
  "auEeOXr",
  "JBYVhIM",
  "OqJGQAs",
  "jLHLTVS",
  "bpAHcGj",
  "gBdbWwL",
  "ATnUrSW",
  "BIBlDMO",
  "EgoAqgZ",
  "FcwBOmo",
  "nxcGegj",
  "slyqmVv",
  "mFCYQAH",
  "YzNyxKH",
  "QRUHjTg",
  "oGeaKLV",
  "AcsnnlL",
];
// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random full name
const getAllUsernames = (i) => users[i];
const getRandomUsername = () => `${getRandomArrItem(users)}`;

// Function to generate random assignments that we can add to student object.
const getRandomThoughts = (int) => {
  const results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      thoughtText: getRandomArrItem(thoughts),
    });
  }
  return results;
};
const getRandomReactions = (int) => {
  const results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      reactionBody: getRandomArrItem(reactions),
    });
  }
  return results;
};

// Export the functions for use in seed.js
module.exports = {
  getAllUsernames,
  getRandomThoughts,
  getRandomReactions,
  getRandomUsername,
};
