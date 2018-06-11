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
  callback(null, {
    text: `You triggered a command to display a button with text *${text}*\n`,
    attachments: [{
      text: 'Hit the button and I will display the example action',
      fallback: 'Can\'t display attachment',
      callback_id: 'callback_id',
      actions: [
        {
          name: 'example',
          text: `${text}`,
          type: 'button',
          value: 'value'
        }
      ]
    }]
  });
};
