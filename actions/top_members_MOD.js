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
    <div>
        <p>
            <u>Mod Info:</u><br>
            Created by Shadow<br>
            Help: https://discord.gg/9HYB4n3Dz4
        </p>
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
