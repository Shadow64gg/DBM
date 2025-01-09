module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  name: "Role Command Restriction",

  //---------------------------------------------------------------------
  // Action Section
  section: "Moderation",

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
