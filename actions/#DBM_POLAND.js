module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "INFO",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "#DBM POLAND",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data) {
    return "General information about DBM POLAND.";
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  //---------------------------------------------------------------------

  meta: {
    version: "2.1.9",
    preciseCheck: false,
    author: "Shadow",
    authorUrl: "https://github.com/Shadow64gg/DBM",
    downloadUrl: null,
  },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML.
  //---------------------------------------------------------------------

  fields: [],

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //---------------------------------------------------------------------

  html() {
    return `
  <div style="padding: 10px; font-family: Arial, sans-serif; color: #ddd; max-height: 70vh; overflow-y: auto;">
    <h1 style="text-align: center; color: #fff;">Welcome!</h1>
    <p>Thank you for using the DBM Mod Collection!</p>
    <p>If you want to tell us something, join the Discord Guild below. If you want to tell us something, join the guild Discord below. And if something doesn't work, join our discord and create a post on a special channel.</p>
  
    <h3 style="color: #7289da;">Discord:</h3>
    <p><a href="https://discord.gg/9HYB4n3Dz4" target="_blank" style="color: #7289da; text-decoration: none;">https://discord.gg/9HYB4n3Dz4</a></p>
  
    <h3 style="color: #43b581;">Your version:</h3>
    <div style="background-color: #23272a; color: #fff; display: inline-block; padding: 5px 10px; border-radius: 5px;">1.0.1</div>
  
    <div style="margin-top: 20px;">
      <h2 style="color: #fff;">Mod Creators:</h2>
      <div style="background-color: #2c2f33; padding: 10px; border-left: 4px solid #ff4500; border-radius: 5px; color: #ddd;">
        <h3 style="color: #fff; margin: 0;">Mod Creators</h3>
        <ul style="list-style-type: none; padding: 0; margin-top: 10px;">
          <li>Shadow</li>
        </ul>
      </div>
    </div>
  
    <div style="margin-top: 20px;">
      <h2 style="color: #fff;">GitHub:</h2>
      <p>Visit us on GitHub! The whole mod collection is on GitHub and everyone is invited to join us developing new mods!</p>
      <p>Copy and paste the link to view the site in your browser.</p>
      <p><a href="https://github.com/Shadow64gg/DBM" target="_blank" style="color: #7289da; text-decoration: none;">https://github.com/Shadow64gg/DBM</a></p>
  
      <h2 style="color: #fff; margin-top: 20px;">Current List of Mods</h2>

      <div style="background-color: #2c2f33; border-radius: 5px; overflow-y: auto; max-height: 200px; margin-bottom: 20px;">
  <table style="width: 100%; border-collapse: collapse; color: #ddd; font-size: 14px; table-layout: fixed;">
    <thead>
      <tr style="color: #fff; text-align: left; position: sticky; top: 0; background-color: #23272a; z-index: 2;">
        <th style="padding: 10px; border-bottom: 2px solid #7289da; width: 33%;">Name</th>
        <th style="padding: 10px; border-bottom: 2px solid #7289da; width: 33%;">Section</th>
        <th style="padding: 10px; border-bottom: 2px solid #7289da; width: 33%;">Author(s)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Automod</td>
        <td style="padding: 10px;">Moderation</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>

      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Channel Command Restriction</td>
        <td style="padding: 10px;">Moderation</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>
      
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Role Command Restriction</td>
        <td style="padding: 10px;">Moderation</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>
      
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Server Command Restriction</td>
        <td style="padding: 10px;">Moderation</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>
      
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Disable Buttons and Selects</td>
        <td style="padding: 10px;">Messaging</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>
      
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Generate</td>
        <td style="padding: 10px;">Economy</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>

      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Count Game</td>
        <td style="padding: 10px;">Economy</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>

      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Top Members</td>
        <td style="padding: 10px;">Economy</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>

      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Last Letter Game</td>
        <td style="padding: 10px;">Economy</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>

      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Giveaway Check Member</td>
        <td style="padding: 10px;">Giveaway</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>
      
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Giveaway END</td>
        <td style="padding: 10px;">Giveaway</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>
      
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Giveaway INFO</td>
        <td style="padding: 10px;">Giveaway</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>
      
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Giveaway JOIN</td>
        <td style="padding: 10px;">Giveaway</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>
      
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Giveaway LEAVE</td>
        <td style="padding: 10px;">Giveaway</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>
      
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Giveaway REROLL</td>
        <td style="padding: 10px;">Giveaway</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>
      
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Giveaway START</td>
        <td style="padding: 10px;">Giveaway</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>
      
      <tr style="border-bottom: 1px solid #444;">
        <td style="padding: 10px;">Bot Activity</td>
        <td style="padding: 10px;">Bot</td>
        <td style="padding: 10px;">Shadow</td>
      </tr>

      <tr style="border-bottom: 1px solid #444;">
      <td style="padding: 10px;">Monitoring Epic Games Api</td>
      <td style="padding: 10px;">Epic Games Store</td>
      <td style="padding: 10px;">Shadow</td>
    </tr>

    <tr style="border-bottom: 1px solid #444;">
      <td style="padding: 10px;">Store Epic Free Games Info</td>
      <td style="padding: 10px;">Epic Games Store</td>
      <td style="padding: 10px;">Shadow</td>
    </tr>

    <tr style="border-bottom: 1px solid #444;">
      <td style="padding: 10px;">Register</td>
      <td style="padding: 10px;">Accounts</td>
      <td style="padding: 10px;">Shadow</td>
    </tr>
    
    <tr style="border-bottom: 1px solid #444;">
      <td style="padding: 10px;">Unregister</td>
      <td style="padding: 10px;">Accounts</td>
      <td style="padding: 10px;">Shadow</td>
    </tr>
    
    <tr style="border-bottom: 1px solid #444;">
      <td style="padding: 10px;">Login</td>
      <td style="padding: 10px;">Accounts</td>
      <td style="padding: 10px;">Shadow</td>
    </tr>
    
    <tr style="border-bottom: 1px solid #444;">
      <td style="padding: 10px;">Logout</td>
      <td style="padding: 10px;">Accounts</td>
      <td style="padding: 10px;">Shadow</td>
    </tr>
    
    <tr style="border-bottom: 1px solid #444;">
      <td style="padding: 10px;">Change Password</td>
      <td style="padding: 10px;">Accounts</td>
      <td style="padding: 10px;">Shadow</td>
    </tr>
    
    <tr style="border-bottom: 1px solid #444;">
      <td style="padding: 10px;">Timed Auto Logout</td>
      <td style="padding: 10px;">Accounts</td>
      <td style="padding: 10px;">Shadow</td>
    </tr>

    <tr style="border-bottom: 1px solid #444;">
      <td style="padding: 10px;">Check If Member Logged</td>
      <td style="padding: 10px;">Accounts</td>
      <td style="padding: 10px;">Shadow</td>
    </tr>

    </tbody>
  </table>
</div>


      </div>
    </div>
  </div>`;
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  //---------------------------------------------------------------------

  async action(cache) {
    console.log("and why do you need this action in the command XD.");
    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  //---------------------------------------------------------------------

  mod() {},
};
