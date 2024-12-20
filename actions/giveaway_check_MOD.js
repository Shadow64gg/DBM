const fs = require("fs");

module.exports = {
  name: "Giveaway Check Member",

  section: "Economy",

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
  },

  meta: {
    version: "2.1.9",
    preciseCheck: true,
    author: "Shadow",
    authorUrl: null,
    downloadUrl: null,
  },

  fields: ["member", "varName", "branch"],

  html(isEvent, data) {
    return `
    <div>
    <p>
        <u>Mod Info:</u><br>
        Created by Shadow<br>
        Help: https://discord.gg/9HYB4n3Dz4<br>
    </p>
</div><br>

<member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>
<br><br>
<hr class="subtlebar">
<conditional-input id="branch" style="padding-top: 16px;"></conditional-input>`;
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const member = await this.getMemberFromData(
      data.member,
      data.varName,
      cache
    );
    const filePath = "./data/giveaways.json";

    if (!member) {
      this.executeResults(false, data?.branch ?? data, cache);
      return;
    }

    let giveaways;
    try {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
        console.log(
          "File giveaways.json did not exist. A new file has been created."
        );
      }

      const fileData = fs.readFileSync(filePath, "utf8");
      giveaways = JSON.parse(fileData);
    } catch (err) {
      console.error("Error reading giveaways.json:", err);
      this.executeResults(false, data?.branch ?? data, cache);
      return;
    }

    const guildId = member.guild.id;
    const giveawayList = giveaways[guildId];

    if (
      !giveawayList ||
      !Array.isArray(giveawayList) ||
      giveawayList.length === 0
    ) {
      console.error("No giveaway found for this guild or invalid format.");
      this.executeResults(false, data?.branch ?? data, cache);
      return;
    }

    const giveaway = giveawayList[0]; // Zakładamy, że jest tylko jeden giveaway na serwer

    if (!giveaway.members || !Array.isArray(giveaway.members)) {
      console.error("Giveaway members data is missing or invalid.");
      this.executeResults(false, data?.branch ?? data, cache);
      return;
    }

    const result = giveaway.members.includes(member.id);
    this.executeResults(result, data?.branch ?? data, cache);
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};
