const fs = require("fs"); // Required library for file system operations
const path = require("path"); // Required library for path operations

module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------
  name: "Top Members",

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------
  section: "Economy",

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------
  subtitle(data, presets) {
    return `Top ${data.topCount || 5} members (${data.dataName})`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------
  meta: {
    version: "2.1.7",
    preciseCheck: true,
    author: "Shadow",
    authorUrl: "https://discord.gg/9HYB4n3Dz4",
    downloadUrl: null,
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------
  fields: [
    "dataName",
    "topCount",
    "useNumbers",
    "showValues",
    "suffix",
    "storage",
    "varName",
  ],

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
      </div>
      <div style="display: flex; gap: 10px; padding: 10px;">
        <div style="flex: 1;">
          <span class="dbminputlabel">Data Name</span><br>
          <input id="dataName" class="round" type="text" placeholder="">
        </div>
        <div style="flex: 1;">
          <span class="dbminputlabel">Number of Members</span><br>
          <input id="topCount" class="round" type="number" placeholder="Default 5" min="1">
        </div>
      </div>
      <div style="display: flex; gap: 10px; padding: 10px;">
        <div style="flex: 1;">
          <span class="dbminputlabel">Number The Members?</span><br>
          <select id="useNumbers" class="round">
            <option value="true" selected>Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div style="flex: 1;">
          <span class="dbminputlabel">Show Data Value?</span><br>
          <select id="showValues" class="round">
            <option value="true" selected>Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      <div style="padding: 10px;">
        <span class="dbminputlabel">Suffix</span><br>
        <input id="suffix" class="round" type="text" placeholder="">
      </div>
      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
    `;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------
  variableStorage(data, varType) {
    const storageType = parseInt(data.storage, 10);
    if (storageType !== varType) return;
    return [data.varName, "Text"]; // Return the variable type
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------
  async action(cache) {
    const data = cache.actions[cache.index];
    const filePath = path.join(__dirname, "../data/players.json"); // Path to the players.json file

    // Fetch configuration
    const dataName = this.evalMessage(data.dataName, cache) || "bank";
    const topCount = parseInt(this.evalMessage(data.topCount, cache), 10) || 5;
    const useNumbers = this.evalMessage(data.useNumbers, cache) === "true"; // Should members be numbered?
    const showValues = this.evalMessage(data.showValues, cache) === "true"; // Should data values be displayed?
    const suffix = this.evalMessage(data.suffix, cache) || "";

    // Read data from players.json
    let playerData;
    try {
      playerData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      console.error("Error reading the players.json file:", err);
      return this.callNextAction(cache);
    }

    const guild = cache.interaction.guild;
    if (!guild) {
      console.error("Guild is undefined. Cannot access members.");
      return this.callNextAction(cache);
    }

    const allMembers = await guild.members.fetch();

    // Filter players who are in the server and have the specified field
    const validPlayers = Object.entries(playerData).filter(
      ([userId, data]) =>
        allMembers.has(userId) &&
        data[dataName] !== undefined &&
        data[dataName] !== null
    );

    if (validPlayers.length === 0) {
      this.storeValue(
        "No members to display in the ranking.",
        parseInt(data.storage, 10),
        this.evalMessage(data.varName, cache),
        cache
      );
      return this.callNextAction(cache);
    }

    const sortedPlayers = validPlayers.sort(
      ([, a], [, b]) => b[dataName] - a[dataName]
    );
    const topPlayers = sortedPlayers.slice(0, topCount);

    let response = "\n";
    topPlayers.forEach(([userId, data], index) => {
      const number = useNumbers ? `${index + 1}. ` : ""; // Add numbering if enabled
      const value = showValues ? `${data[dataName]}` : ""; // Add data value if enabled
      const displaySuffix = suffix ? ` ${value}${suffix}` : ""; // Always add suffix text if set
      response += `${number}<@${userId}>${displaySuffix}\n`;
    });

    if (response === "\n") {
      response = "No members to display in the ranking.";
    }

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(response, storage, varName, cache);
    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //---------------------------------------------------------------------
  mod() {},
};
