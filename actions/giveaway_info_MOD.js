module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Giveaway INFO",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "Economy",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    let dataType;
    switch (data.source) {
      case "host":
        dataType = "Giveaway Host";
        break;
      case "prize":
        dataType = "Giveaway Gift";
        break;
      case "users":
        dataType = "Giveaway Users";
        break;
      case "end":
        dataType = "Giveaway endTime";
        break;
      case "guild":
        dataType = "Giveaway Server";
        break;
      case "channel":
        dataType = "Giveaway Channel";
        break;
      case "message":
        dataType = "Giveaway Message";
        break;
      case "winners":
        dataType = "Giveaway Winners";
        break;
    }
    return `Get ${dataType}!`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    let dataType;
    switch (data.source) {
      case "host":
        dataType = "Member";
        break;
      case "prize":
        dataType = "Text";
        break;
      case "users":
        dataType = "Number";
        break;
      case "end":
        dataType = "Unix Timestamp";
        break;
      case "guild":
        dataType = "Server";
        break;
      case "channel":
        dataType = "Text Channel";
        break;
      case "message":
        dataType = "Message";
        break;
      case "winners":
        dataType = "Text";
        break;
    }
    return [data.varName, dataType];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
  // This will make it so the patch version (0.0.X) is not checked.
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
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["type", "giveaway", "source", "storage", "varName"],

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
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
      <div style="float: left; width: calc(85% - 12px);">
        <br>
        <retrieve-from-variable dropdownLabel="Giveaway Data" selectId="type" variableContainerId="varNameContainer" variableInputId="giveaway"></retrieve-from-variable>
      </div>
      <div style="float: left; width: calc(50% - 12px);">
        <span class="dbminputlabel">Information</span><br>
        <select id="source" class="round">
          <option value="host">Host</option>
          <option value="prize">Gift</option>
          <option value="users">Users</option>
          ${!isEvent && '<option value="end">Endtime (unix)</option>'}
          ${isEvent && '<option value="guild">Server</option>'}
          ${isEvent && '<option value="channel">Channel</option>'}
          ${isEvent && '<option value="message">Message</option>'}
          ${isEvent && '<option value="winners">Winners</option>'}
        </select>
      </div>
      <div style="float: left; width: calc(85% - 12px);">
      <br>
      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName"></store-in-variable>
      </div>
    `;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  //---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const giveaway = this.getVariable(
      parseInt(data.type),
      data.giveaway,
      cache
    );

    this.storeValue(
      giveaway[data.source],
      parseInt(data.storage, 10),
      data.varName,
      cache
    );
    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  //---------------------------------------------------------------------

  mod() {},
};
