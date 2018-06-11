/**
  Add reaction to a slack message

  For full documentation see: https://api.slack.com/methods/reactions.add
*/

const request = require('request');
// TODO use the slack node sdk instead!
module.exports = (token, channel, timestamp, emojiName) => {

  return new Promise((resolve, reject) => {
    // If no token, assume development
    if (!token) {
      console.log('Warning: No token provided for reaction');
      return resolve(`Reacted locally with emoji ${emoji}`);
    }

    if (!emojiName) {
      console.log('Warning: No emoji provided for reaction');
      return callback(new Error('Warning: No emoji provided for reaction'));
    }

    if (!timestamp) {
      console.log('Warning: No emoji provided for reaction');
      return callback(new Error('Warning: No msg timestamp provided for reaction'));
    }
    const data = {
      channel,
      token,
      name: emojiName,
      timestamp,
    };
    console.log('adding reaction via slack', emojiName);
    request.post({
      uri: 'https://slack.com/api/reactions.add',
      form: data,
    }, (err, result) => {
      if (err) {
        console.log('error adding reaction', err);
        return reject(err);
      }

      let body;
      try {
        body = JSON.parse(result.body);
      } catch (e) {
        body = {}
      }

      if (!body.ok) {
        console.log('slack said reaction no good', err);
        return reject(new Error(body.error ? `Slack Error: ${body.error}` : 'Invalid JSON Response from Slack'));
      }

      console.log('successfully added a reaction via slack', emojiName);
      return resolve();
    });
  });

};
