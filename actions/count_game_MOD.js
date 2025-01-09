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
  <p>1.0</p>
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
        <p>This action checks if the number in the message is one greater than the current number in the <code>counts.json</code> file. If so, the action proceeds to the next one. Otherwise, the message is deleted.</p>
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
            <span style="font-size: 12px;">Select "True" to prevent the same user from posting the next number.</span>
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
    const enableLastUserCheck = data.enableLastUserCheck === "true"; // Check the option correctly

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
      countsData[channelID] = { count: 0, lastUser: null }; // Initial count and no user
    }

    // Use the Discord client
    const channel = cache.server.channels.cache.get(channelID);

    if (!channel) {
      return; // Simply return if the channel is not found, without logging an error
    }

    // Check if the message is sent in the correct channel
    if (cache.msg.channel.id !== channel.id) {
      return; // End the action silently if the message is from the wrong channel
    }

    // Check if the option to prevent same user is enabled
    const message = cache.msg.content; // Message sent by the user
    const currentCount = countsData[channelID].count;
    const lastUser = countsData[channelID].lastUser;

    // If the option is enabled and the user is the same as the last one who sent the number
    if (enableLastUserCheck && cache.msg.author.id === lastUser) {
      // Attempt to delete the message if the user is the same
      cache.msg.delete().catch((error) => {
        if (error.code === 50013) {
          console.log("Insufficient bot permissions to delete messages.");
        } else {
          console.error(error);
        }
      });
      return; // Do not proceed further if the message is from the same user
    }

    // Check if the number in the message is one greater
    const messageNumber = parseInt(message, 10);
    if (messageNumber === currentCount + 1) {
      // Update counts for the channel
      countsData[channelID].count = messageNumber;
      countsData[channelID].lastUser = cache.msg.author.id; // Update last user

      fs.writeFileSync(countsFilePath, JSON.stringify(countsData, null, 2));

      // Proceed to the next action
      this.callNextAction(cache);
    } else {
      // Attempt to delete the message if the number is incorrect
      cache.msg.delete().catch((error) => {
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
