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
    <div class="dbmmodsbr1" style="height: 59px;">
  <p>Mod Info:</p>
  <p>Created by Shadow</p>
  <p>Help: <a href="https://discord.gg/9HYB4n3Dz4" target="_blank" style="color: #00aaff; text-decoration: none;">discord</a></p>
</div>

<style>
.dbmmodsbr1 {
  position: absolute;
  bottom: 0px;
  border: 2px solid rgba(50, 50, 50, 0.7);
  background: rgba(0, 0, 0, 0.7);
  color: #999;
  padding: 5px;
  font-size: 12px;
  left: 0px;
  z-index: 999999;
  cursor: default;
  line-height: 1.2;
  border-radius: 8px;
  height: 59px;
  width: auto;
  transition: transform 0.3s ease, background-color 0.6s ease, color 0.6s ease;
}
.dbmmodsbr1:hover {
  transform: scale(1.01);
  background-color: rgba(29, 29, 29, 0.9);
  color: #fff;
}
.dbmmodsbr1 p {
  margin: 0;
  padding: 0;
}
.dbmmodsbr1 a {
  font-size: 12px;
  color: #00aaff;
  text-decoration: none;
}
.dbmmodsbr1 a:hover {
  text-decoration: underline;
}
</style>



<div
  class="dbmmodsbr2"
  data-url="https://github.com/Shadow64gg/DBM"
  onclick="openExternalLink(event, 'https://github.com/Shadow64gg/DBM')"
>
  <p>Mod Version:</p>
  <p>1.1</p>
</div>

<style>
.dbmmodsbr2 {
  position: absolute;
  bottom: 0px;
  right: 0px;
  border: 0px solid rgba(50, 50, 50, 0.7);
  background: rgba(0, 0, 0, 0.7);
  color: #999;
  padding: 5px;
  font-size: 12px;
  z-index: 999999;
  cursor: pointer;
  line-height: 1.2;
  border-radius: 8px;
  text-align: center;
  height: auto;
  transition: transform 0.3s ease, background-color 0.6s ease, color 0.6s ease;
}

.dbmmodsbr2:hover {
  transform: scale(1.01);
  background-color: rgba(29, 29, 29, 0.9);
  color: #fff;
}

.dbmmodsbr2 p {
  margin: 0;
  padding: 0;
}
</style>

<script>
function openExternalLink(event, url) {
  event.preventDefault();
  window.open(url, "_blank");
}
</script>
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

    let messageContent, firstLetter, lastLetter;
    try {
      messageContent = cache.msg.content.trim();
      firstLetter = messageContent[0].toLowerCase();
      lastLetter = messageContent.slice(-1).toLowerCase();
    } catch (error) {
      // Ignoruje błąd bez wyświetlania go w konsoli
      return; // Kończy akcję w przypadku błędu
    }

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
