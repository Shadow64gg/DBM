module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  name: "Role Command Restriction",

  //---------------------------------------------------------------------
  // Action Section
  section: "DBM POLAND",

  //---------------------------------------------------------------------
  // Action Subtitle
  subtitle(data) {
    return `Checking if user has Role ID: ${data.roleID}`;
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
  fields: ["roleID", "comparison", "branch"],

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
          <span class="dbminputlabel">Role ID</span><br>
          <input id="roleID" class="round" type="text" name="roleID">
        </div>
        <br><br><br>
        <div style="float: left; width: 35%;">
          <span class="dbminputlabel">Comparison Type</span><br>
          <select id="comparison" class="round">
            <option value="0">User has the role</option>
            <option value="1">User does not have the role</option>
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
    const roleID = this.evalMessage(data.roleID, cache);
    const comparison = parseInt(data.comparison, 10);

    let member = null;

    if (cache.msg) {
      // Komenda tekstowa
      member = cache.msg.member;
    } else if (cache.interaction) {
      // Komenda slash
      member = cache.interaction.member;
    } else if (cache.member) {
      // Event
      member = cache.member;
    }

    if (!member) {
      console.error("Role Check Restriction: Nie można pobrać obiektu member.");
      return this.callNextAction(cache);
    }

    const hasRole = member.roles.cache.has(roleID);
    let result = false;

    // Porównanie
    switch (comparison) {
      case 0: // User has the role
        result = hasRole;
        break;
      case 1: // User does not have the role
        result = !hasRole;
        break;
    }

    this.executeResults(result, data?.branch ?? data, cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  mod() {},
};
