const fs = require("fs");
const path = require("path");

module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------
  name: "Counting Game",

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------
  section: "Economy",

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------
  subtitle(data, presets) {
    return `Moderates the channel (counting)`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------
  meta: {
    version: "2.1.9",
    preciseCheck: true,
    author: "Shadow",
    authorUrl: null,
    downloadUrl: null,
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------
  fields: ["channelSelect"],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------
  html(isEvent, data) {
    return `
    <div>
      <p>
          <u>Mod Info:</u><br>
          Created by Shadow<br>
          Help: https://discord.gg/9HYB4n3Dz4<br>
      </p>
  </div><br>

    <div style="padding: 8px;">
        <p>This action checks if the number in the message is one greater than the current number in the <code>counts.json</code> file. If so, the action proceeds to the next one. Otherwise, the message is deleted.</p>
        <div style="padding-bottom: 8px;">
            <label>Channel ID:</label><br>
            <input id="channelSelect" class="round" style="width: 100%;" type="text" placeholder="Enter the channel ID">
        </div>
    </div>
    `;
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------
  action(cache) {
    const data = cache.actions[cache.index];
    const channelID = this.evalMessage(data.channelSelect, cache);

    // Path to the counts.json file
    const countsFilePath = path.join(__dirname, "..", "data", "counts.json");

    // Check if the counts.json file exists, if not, create it
    if (!fs.existsSync(countsFilePath)) {
      const initialData = {}; // Empty object to hold channel counts
      fs.writeFileSync(countsFilePath, JSON.stringify(initialData, null, 2));
    }

    // Load data from counts.json
    const countsData = JSON.parse(fs.readFileSync(countsFilePath));

    // Ensure the channel has an entry in countsData
    if (!countsData[channelID]) {
      countsData[channelID] = { count: 0 }; // Initial count for the channel
    }

    // Use the Discord client
    const channel = cache.server.channels.cache.get(channelID);

    if (!channel) {
      console.error("Channel not found.");
      return;
    }

    // Check if the message is sent in the correct channel
    if (cache.msg.channel.id !== channel.id) {
      return; // End the action silently if the message is from the wrong channel
    }

    // Check the number in the message
    const message = cache.msg.content; // Message sent by the user
    const currentCount = countsData[channelID].count;

    // Check if the number in the message is one greater
    const messageNumber = parseInt(message, 10);
    if (messageNumber === currentCount + 1) {
      // Update counts for the channel
      countsData[channelID].count = messageNumber;
      fs.writeFileSync(countsFilePath, JSON.stringify(countsData, null, 2));

      // Proceed to the next action
      this.callNextAction(cache);
    } else {
      // Attempt to delete the message if the number is incorrect
      cache.msg.delete().catch((error) => {
        // Only log the permission error to the console
        if (error.code === 50013) {
          console.log("Insufficient bot permissions to delete messages.");
        } else {
          console.error(error);
        }
      });
    }
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------
  init() {},

  //---------------------------------------------------------------------
  // Action Bot Mod Init
  //---------------------------------------------------------------------
  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------
  mod() {},
};
