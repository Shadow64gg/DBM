module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Giveaway LEAVE",

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
    return `Leave the giveaway`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = "<Yes>";
    return ["error", dataType];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
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

  fields: [],

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
        <div>
        <p>
            <u>Mod Info:</u><br>
            Created by Shadow<br>
            Help: https://discord.gg/9HYB4n3Dz4
        </p>
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
    const { interaction } = cache;
    const giveaways = require("../data/giveaways.json");
    const { writeFileSync } = require("fs");

    // Znajduje giveaway powiązane z wiadomością
    const gg = giveaways[interaction.guild.id].find(
      (a) => a.msg === interaction.message.id
    );

    // Jeśli użytkownik jest zapisany, usuwa jego ID z listy uczestników
    if (gg.members.includes(interaction.user.id)) {
      gg.members = gg.members.filter((id) => id !== interaction.user.id); // Usunięcie użytkownika
    } else {
      this.storeValue("no", 1, "error", cache); // Jeśli użytkownik nie jest zapisany, przechowuje wartość "no"
    }

    // Zapisuje zmodyfikowane dane do pliku
    writeFileSync("./data/giveaways.json", JSON.stringify(giveaways));
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
