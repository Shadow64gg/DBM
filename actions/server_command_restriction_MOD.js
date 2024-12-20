module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Server Command Restriction",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "DBM POLAND",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data) {
    return `Checking Server ID: ${data.serverID}`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
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
  // These are the fields for the action.
  //---------------------------------------------------------------------

  fields: ["serverID", "comparison", "branch"],

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
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
  
        <div style="float: left; width: 35%;">
            <span class="dbminputlabel">Server ID</span><br>
            <input id="serverID" class="round" type="text" name="serverID">
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
  // Action Editor Pre-Init Code
  //---------------------------------------------------------------------

  preInit(data, formatters) {
    return formatters.compatibility_2_0_0_iftruefalse_to_branch(data);
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //---------------------------------------------------------------------

  init() {
    const { glob, document } = this;
    glob.onComparisonChanged = function (event) {
      // No extra actions needed here for now
    };
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const serverID = this.evalMessage(data.serverID, cache);
    const comparison = parseInt(data.comparison, 10);

    // Get the server ID where the command was used
    const member = cache.server;
    const currentServerID = member.id;

    let result = false;

    // Compare server IDs
    switch (comparison) {
      case 0: // Equals
        result = serverID === currentServerID;
        break;
      case 1: // Not Equals
        result = serverID !== currentServerID;
        break;
    }

    this.executeResults(result, data?.branch ?? data, cache);
  },

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
