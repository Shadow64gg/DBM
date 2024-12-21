module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  name: "Channel Command Restriction",

  //---------------------------------------------------------------------
  // Action Section
  section: "DBM POLAND",

  //---------------------------------------------------------------------
  // Action Subtitle
  subtitle(data) {
    return `Checking Channel ID: ${data.channelID}`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  meta: {
    version: "2.1.9",
    preciseCheck: true,
    author: "Shadow",
    authorUrl: null,
    downloadUrl: null,
  },

  //---------------------------------------------------------------------
  // Action Fields
  fields: ["channelID", "comparison", "branch"],

  //---------------------------------------------------------------------
  // Command HTML
  html(isEvent, data) {
    return `
      <div>
        <p>
          <u>Mod Info:</u><br>
          Created by Shadow<br>
          Help: https://discord.gg/9HYB4n3Dz4<br>
        </p>
      </div><br>
      <div style="float: left; width: 35%;">
        <span class="dbminputlabel">Channel ID</span><br>
        <input id="channelID" class="round" type="text" name="channelID">
      </div>
      <br><br><br>
      <div style="float: left; width: 35%;">
        <span class="dbminputlabel">Comparison Type</span><br>
        <select id="comparison" class="round">
          <option value="0">Equals</option>
          <option value="1">Not Equals</option>
        </select>
      </div>
      <br><br><br><br>
      <hr class="subtlebar">
      <br>
      <conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  action(cache) {
    const data = cache.actions[cache.index];
    const channelID = this.evalMessage(data.channelID, cache);
    const comparison = parseInt(data.comparison, 10);

    let currentChannelID = null;

    if (cache.msg) {
      // Komenda tekstowa
      currentChannelID = cache.msg.channel?.id;
    } else if (cache.interaction) {
      // Komenda slash
      currentChannelID = cache.interaction.channel?.id;
    } else if (cache.channel) {
      // Event
      currentChannelID = cache.channel.id;
    }

    if (!currentChannelID) {
      console.error("Channel Command Restriction: Nie można pobrać ID kanału.");
      return this.callNextAction(cache);
    }

    let result = false;

    // Porównanie ID kanału
    switch (comparison) {
      case 0: // Equals
        result = channelID === currentChannelID;
        break;
      case 1: // Not Equals
        result = channelID !== currentChannelID;
        break;
    }

    this.executeResults(result, data?.branch ?? data, cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  mod() {},
};
