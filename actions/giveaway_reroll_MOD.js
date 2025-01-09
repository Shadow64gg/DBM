module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Giveaway REROLL",

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
    return `Reroll the new winner!`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    let dataType = "Winner Id";
    return ["error", "<Notfound, None>", data.varName, dataType];
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

  fields: ["msgid", "storage", "varName"],

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
      <div style="float: left; width: calc(50% - 12px);">
        <br>
        <span class="dbminputlabel">Message ID</span>
        <input id="msgid" class="round" type="text">
      </div>
      <div style="float: left; width: calc(85% - 12px);">
      <br>
      <store-in-variable dropdownLabel="Store Winner ID In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
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
    const { interaction, msg } = cache;
    const giveaways = require("../data/giveaways.json");
    const data = cache.actions[cache.index];
    const givid = this.evalMessage(data.msgid, cache);
    const mess = interaction ?? msg;
    if (!giveaways[mess.guild.id]) {
      this.storeValue("notfound", 1, "error", cache);
      this.callNextAction(cache);
      return;
    }
    const giveaway = giveaways[mess.guild.id].find((a) => a.msg === givid);
    if (!giveaway) {
      this.storeValue("notfound", 1, "error", cache);
      this.callNextAction(cache);
      return;
    }
    const winner =
      giveaway.members[Math.floor(Math.random() * giveaway.members.length)];
    this.storeValue("none", parseInt(data.storage, 10), "error", cache);
    this.storeValue(winner, parseInt(data.storage, 10), data.varName, cache);
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
