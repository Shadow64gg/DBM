module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Giveaway END",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "Giveaway",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Ending the giveaway`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    let dataType = "Giveaway Data";
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

  fields: ["call", "storage", "varName"],

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
  </div><br>
  <div style="float: left; width: calc(50% - 12px);">
    <span class="dbminputlabel">Jump To Action</span>
    <input id="call" class="round" type="number">
   </div>
   </div>
   <div style="float: left; width: calc(100% - 12px);">
    <br>
    <store-in-variable dropdownLabel="Store Giveaway In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
   </div>
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
    const giveaways = require("../data/giveaways.json");
    const { writeFileSync } = require("fs");
    const client = this.getDBM().Bot.bot;

    setInterval(() => {
      Object.keys(giveaways).forEach(async (giveawayid) => {
        for (var i in giveaways[giveawayid]) {
          const giveaway = giveaways[giveawayid].at(i);
          if (new Date().getTime() > giveaway.end && giveaway.ended == false) {
            let winner = [];

            if (giveaway.members.length > 0) {
              while (
                winner.length < giveaway.winners &&
                winner.length < giveaway.members.length
              ) {
                for (o = 0; o < giveaway.winners; o++) {
                  let winnerr =
                    giveaway.members[
                      Math.floor(Math.random() * giveaway.members.length)
                    ];

                  if (!winner.includes(winnerr)) {
                    winner.push(winnerr);
                  }
                }
              }
            }

            giveaway.ended = true;
            giveaway.end = new Date().getTime();

            writeFileSync("./data/giveaways.json", JSON.stringify(giveaways));
            const gData = {};
            gData.guild = client.guilds.cache.get(giveaway.guild);
            gData.channel =
              gData.guild.channels.cache.get(giveaway.channel) ||
              (await gData.guild.channels.fetch(giveaway.channel));
            gData.message =
              gData.channel.messages.cache.get(giveaway.msg) ||
              (await gData.channel.messages.fetch(giveaway.msg));
            gData.users = giveaway.members.length;
            gData.prize = giveaway.prize;
            gData.host = giveaway.host;
            gData.winners = `<@!${winner.join(">, <@!")}>`;

            this.storeValue(
              gData,
              parseInt(data.storage, 10),
              data.varName,
              cache
            );
            const val = parseInt(data.call, 10);
            const index = Math.max(val - 1, 0);
            if (cache.actions[index]) {
              cache.index = index - 1;
              this.callNextAction(cache);
            }
          }
        }
      });
    }, 1000);
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
