/**
  StdLib Storage Utility for Slack

  Using your StdLib Library Token, connect to `utils.storage` (key-value storage)
  and save team identity data (bot access token, etc.) for future reference.
*/

const lib = require('lib')({token: process.env.STDLIB_TOKEN});

function formatTeamKey(teamId) {
  return `SLACK::${process.env.SLACK_APP_NAME}::${teamId}`;
};

function formatUserKey(userId) {
  return `SLACK::${process.env.SLACK_APP_NAME}::${userId}`;
}

const TEAM_CACHE = {};

module.exports = {
  setTeam: (teamId, value, callback) => {
    lib.utils.storage.set(formatTeamKey(teamId), value, (err, value) => {
      if (!err) {
        TEAM_CACHE[teamId] = value;
      }
      callback(err, value);
    });
  },
  getTeam: (teamId, callback) => {
    if (TEAM_CACHE[teamId]) {
      return callback(null, TEAM_CACHE[teamId]);
    }
    lib.utils.storage.get(formatTeamKey(teamId), (err, value) => {
      if (!err) {
        TEAM_CACHE[teamId] = value;
      }
      callback(err, value);
    });
  },
  setUserEmoji(userId, emoji, callback) => {
    lib.utils.storage.get(`${formatUserKey(userId)}::emoji`, (err, value) => {
      callback(err, value);
    });
  },
  getUserEmoji(userId, emoji, callback) => {
    lib.utils.storage.get(`${formatUserKey(userId)}::emoji`, (err, value) => {
      callback(err, value);
    });
  },
};
