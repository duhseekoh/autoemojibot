const lib = require('lib')({token: process.env.STDLIB_TOKEN});
/**
* /triggerexampleaction
*
* Just triggers
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
  // TODO - get all slack teammates
  callback(null, {
    text: `Are you assigning an emoji to yourself or a teammate?`,
    attachments: [{
      text: 'Hit the button and I will display the example action',
      fallback: 'Can\'t display attachment',
      callback_id: 'callback_id',
      actions: [
        {
          name: 'assign-emoji-select-user',
          text: `Me`,
          type: 'button',
          value: user,
        },
        {
          name: 'assign-emoji-view-users',
          text: `Teammate`,
          type: 'button',
          value: 'teammate',
        },
      ]
    }]
  });
};
