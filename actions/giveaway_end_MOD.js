module.exports = {
  name: "Giveaway END",

  section: "Giveaway",

  subtitle(data, presets) {
    return `Ending the giveaway`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    let dataType = "Giveaway Data";
    return [data.varName, dataType];
  },

  meta: {
    version: "2.1.9",
    preciseCheck: true,
    author: "Shadow",
    authorUrl: null,
    downloadUrl: null,
  },

  fields: ["call", "storage", "varName"],

  html(isEvent, data) {
    return `
      <div style="float: left; width: calc(50% - 12px);">
        <span class="dbminputlabel">Jump To Action</span>
        <input id="call" class="round" type="number">
      </div>
      <div style="float: left; width: calc(100% - 12px);">
        <br>
        <store-in-variable dropdownLabel="Store Giveaway In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
      </div>
    `;
  },

  init() {},

  async action(cache) {
    const {
      existsSync,
      writeFileSync,
      readFileSync,
      mkdirSync,
    } = require("fs");
    const data = cache.actions[cache.index];
    const { Bot } = this.getDBM();
    const client = Bot.bot;
    const dataDir = "./data";
    const giveawaysPath = `${dataDir}/giveaways.json`;

    // Sprawdzenie i tworzenie katalogu, jeśli nie istnieje
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir);
    }

    // Sprawdzenie i tworzenie pliku, jeśli nie istnieje
    if (!existsSync(giveawaysPath)) {
      const defaultContent = {};
      writeFileSync(giveawaysPath, JSON.stringify(defaultContent, null, 2));
    }

    let giveaways;
    try {
      giveaways = JSON.parse(readFileSync(giveawaysPath, "utf8"));
    } catch (error) {
      console.error("Błąd podczas odczytu pliku giveaways.json:", error);
      return this.callNextAction(cache);
    }

    setInterval(() => {
      Object.keys(giveaways).forEach(async (giveawayid) => {
        const giveawayList = giveaways[giveawayid];
        if (!Array.isArray(giveawayList)) return;

        giveawayList.forEach(async (giveaway) => {
          if (new Date().getTime() > giveaway.end && !giveaway.ended) {
            let winner = [];

            if (giveaway.members.length > 0) {
              while (
                winner.length < giveaway.winners &&
                winner.length < giveaway.members.length
              ) {
                const winnerr =
                  giveaway.members[
                    Math.floor(Math.random() * giveaway.members.length)
                  ];
                if (!winner.includes(winnerr)) {
                  winner.push(winnerr);
                }
              }
            }

            giveaway.ended = true;
            giveaway.end = new Date().getTime();

            writeFileSync(giveawaysPath, JSON.stringify(giveaways, null, 2));

            const gData = {};
            const guild = client.guilds.cache.get(giveaway.guild);
            if (!guild) return;

            gData.guild = guild;
            gData.channel =
              guild.channels.cache.get(giveaway.channel) ||
              (await guild.channels.fetch(giveaway.channel));
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
        });
      });
    }, 1000);
  },

  mod() {},
};
