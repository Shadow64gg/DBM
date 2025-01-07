const fs = require("fs");
const path = require("path");

module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------
  name: "Last Letter Game",

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------
  section: "Economy",

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------
  subtitle(data, presets) {
    return `Plays the Last Letter Game`;
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
  fields: ["channelSelect", "enableLastUserCheck"],

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
        <p>This action plays the Last Letter Game.</p>
        <div style="padding-bottom: 8px;">
            <label>Channel ID:</label><br>
            <input id="channelSelect" class="round" style="width: 100%;" type="text" placeholder="Enter the channel ID">
        </div>
        <div style="padding-bottom: 8px;">
            <label>Enable Last User Check:</label><br>
            <select id="enableLastUserCheck" class="round" style="width: 100%;">
                <option value="true">True</option>
                <option value="false">False</option>
            </select>
            <span style="font-size: 12px;">Select "True" to prevent the same user from posting the next word.</span>
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
    const enableLastUserCheck = data.enableLastUserCheck === "true";

    // Path to the lastletter.json file
    const lastLetterFilePath = path.join(
      __dirname,
      "..",
      "data",
      "lastletter.json"
    );

    // Check if the lastletter.json file exists, if not, create it
    if (!fs.existsSync(lastLetterFilePath)) {
      const initialData = {};
      fs.writeFileSync(
        lastLetterFilePath,
        JSON.stringify(initialData, null, 2)
      );
    }

    // Load data from lastletter.json
    const lastLetterData = JSON.parse(fs.readFileSync(lastLetterFilePath));

    // Ensure the channel has an entry in lastLetterData
    if (!lastLetterData[channelID]) {
      lastLetterData[channelID] = { lastUser: null, lastLetter: null };
    }

    const currentChannelData = lastLetterData[channelID];
    const messageContent = cache.msg.content.trim();
    const firstLetter = messageContent[0].toLowerCase();
    const lastLetter = messageContent.slice(-1).toLowerCase();

    // Check if the message is sent in the correct channel
    if (cache.msg.channel.id !== channelID) {
      return; // End the action silently if the message is from the wrong channel
    }

    // Check if the option to prevent the same user is enabled
    if (
      enableLastUserCheck &&
      cache.msg.author.id === currentChannelData.lastUser
    ) {
      // Delete the message if the same user tries to play again
      cache.msg.delete().catch((error) => {
        if (error.code === 50013) {
          console.log("Insufficient bot permissions to delete messages.");
        } else {
          console.error(error);
        }
      });
      return; // Stop further execution
    }

    // Check if the first letter matches the last letter of the previous word
    if (
      currentChannelData.lastLetter &&
      currentChannelData.lastLetter !== firstLetter
    ) {
      // Delete the message if the first letter does not match
      cache.msg.delete().catch((error) => {
        if (error.code === 50013) {
          console.log("Insufficient bot permissions to delete messages.");
        } else {
          console.error(error);
        }
      });
      return; // Stop further execution
    }

    // Update the data for the channel
    currentChannelData.lastUser = cache.msg.author.id;
    currentChannelData.lastLetter = lastLetter;

    // Save the updated data back to the file
    fs.writeFileSync(
      lastLetterFilePath,
      JSON.stringify(lastLetterData, null, 2)
    );

    // Proceed to the next action
    this.callNextAction(cache);
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
