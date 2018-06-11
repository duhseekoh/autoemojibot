const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const addReaction = require('../../../utils/add_reaction');
const emojiDataArray = require('../../../emoji_pretty.json');
const emojiCustomAssociations = require('../../../emoji_associations_custom.json');
// TODO add support for custom emojis, not just custom associations.
//  requires using slack api to get the available custom emojis

// go through all the supported slack emojis and make a map of the
// emoji trigger text -> emoji entry
const emojiDataMap = emojiDataArray.reduce((accumulator = {}, entry) => {
  // several short names can be associated with an emoji
  entry.short_names.forEach(shortName => {
    accumulator[shortName] = entry;
  });
  return accumulator;
});
/**
* message event
*
*   All events use this template, simply create additional files with different
*   names to add event responses
*
*   See https://api.slack.com/events-api for more details.
*
* @param {string} user The user id of the user that invoked this event (name is usable as well)
* @param {string} channel The channel id the event was executed in (name is usable as well)
* @param {string} text The text contents of the event
* @param {object} event The full Slack event object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', event = {}, botToken = null, callback) => {

  // Only send a response to certain messages
  if (text.match(/hey|hello|hi|sup/i)) {
    callback(null, {
      text: `Hey there! <@${user}> said ${text}`,
      attachments: [
        // You can customize your messages with attachments.
        // See https://api.slack.com/docs/message-attachments for more info.
      ]
    });
  } else {
    // send out emoji reactions for any matching text.
    // sends them to slack in order, but order of reactions being applied is not
    // guaranteed. to do that, would need to syncronously kick off the reaction
    // requests.
    // TODO all the emoji extraction work should be in its own service
    const emojis = extractEmojis(text);
    const reactionPromises = [];
    emojis.forEach(emoji => {
      reactionPromises.push(addReaction(botToken, channel, event.ts, emoji));
    });

    if (emojis.length > 0) {
      console.log('sending emojis back for event', event);
    }

    return Promise.all(reactionPromises)
      .then(() => callback(null, {}))
      .catch(() => callback(new Error('Couldnt react with at least one emoji')));
  }
};

/**
 * Given a sentence return a filtered array of the words that map to an emoji,
 * discarding any non-emoji words.
 */
function extractEmojis(text) {
  console.log('extracting emojis from text', text);
  const splitText = text.split(' ');
  const emojiNames = text // :cactus: owl cooking domino haha
    .replace(/:/g, '') // cactus owl cooking domino haha
    .split(' ') // ['cactus', 'owl', 'cooking', 'domino', 'haha']
    .map(word => expandCustomAssociation(word)) // ['cactus', 'owl', 'cooking', 'older_man dog', 'haha']
    .join(' ') // 'cactus owl cooking older_man dog haha'
    .split(' ') // ['cactus', 'owl', 'cooking', 'older_man', 'dog', 'haha']
    .map(word => translateWordToEmoji(word)) // ['cactus', 'owl', 'cooking', 'older_man', 'dog', null]
    .filter(word => !!word); // ['cactus', 'owl', 'cooking', 'older_man', 'dog']
  const unique = [...new Set(emojiNames)];
  console.log('deduped emoji names', unique);
  return unique;
}

/**
 * Given a word, map it to a string of emoji names.
 * If an entry doesn't exist, just return the original word.
 */
function expandCustomAssociation(word) {
  const customAssociation = emojiCustomAssociations[word];
  if (customAssociation) {
    return customAssociation;
  }

  return word;
}

/**
 * Given a word, map it to a slack emoji trigger name.
 * If an entry doesn't exist, return null, because we only want words that will
 * display an emoji from this function.
 */
function translateWordToEmoji(word) {
  const emojiEntry = emojiDataMap[word];
  if (emojiEntry) {
    return `${emojiEntry.short_name}`;
  } else {
    return null;
  }
}
