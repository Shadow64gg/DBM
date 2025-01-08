const fs = require("fs");

module.exports = {
  name: "Automod",
  section: "DBM POLAND",
  subtitle(data) {
    const wordCount = data.words?.length || 0;
    return `${wordCount} moderated words configured`;
  },

  meta: {
    version: "2.1.9",
    preciseCheck: true,
    author: "Shadow",
    authorUrl: null,
    downloadUrl: null,
  },

  fields: ["words"],

  html() {
    return `
      <div style="width: 500px; height: 400px; overflow-y: auto;">
        <p>
          <u>Mod Info:</u><br>
          Created by Shadow<br>
          Help: https://discord.gg/9HYB4n3Dz4<br>
        </p>
        <div style="padding: 10px;">
          <dialog-list
            id="words"
            fields='["word", "ignoredRoles", "ignoredChannels", "punishment", "iftrue", "iftrueVal", "iffalse", "iffalseVal"]'
            dialogResizable
            dialogTitle="Moderated Word"
            dialogWidth="500"
            dialogHeight="500"
            listLabel="Words List"
            listStyle="height: calc(100vh - 250px); overflow-y: auto;"
            itemName="Word"
            itemCols="1"
            itemHeight="30px;"
            itemTextFunction="glob.formatItem(data)"
            itemStyle="text-align: left; line-height: 30px;">
            <div style="padding: 10px;">
              <span class="dbminputlabel">Word</span>
              <input id="word" type="text" class="round">
  
              <div style="margin-top: 10px;">
                <span class="dbminputlabel">Ignored Roles (by ID)</span>
                <input id="ignoredRoles" type="text" class="round" style="width: 100%;">
              </div>
  
              <div style="margin-top: 10px;">
                <span class="dbminputlabel">Ignored Channels (by ID)</span>
                <input id="ignoredChannels" type="text" class="round" style="width: 100%;">
              </div>
  
              <div style="margin-top: 10px; z-index: 2; position: relative;">
                <span class="dbminputlabel">Punishment</span>
                <select id="punishment" class="round" style="width: 100%;">
                  <option value="none" selected>No Punishment</option>
                  <option value="delete">Delete Message</option>
                  <option value="warn">Warn User</option>
                </select>
              </div>
  
              <div style="display: flex; flex-direction: column; align-items: flex-start; margin-top: -10px;">
                <div style="position: absolute; left: -9999px; visibility: hidden;">
                  <span class="dbminputlabel">If True</span>
                  <select id="iftrue" class="round">
                    <option value="0" selected>Continue Actions</option>
                    <option value="1">Stop Action Sequence</option>
                    <option value="2">Jump to Action</option>
                    <option value="3">Run Extra Actions</option>
                  </select>
                </div>
                <div style="width: 100%; margin-top: -10px; z-index: 1; position: relative;">
                  <span class="dbminputlabel">Actions</span>
                  <action-list-input id="iftrueVal" style="margin-top: 20px; width: 100%; height: 170px; overflow-y: auto; background: rgba(0, 0, 0, 0.1);"></action-list-input>
                </div>
              </div>
  
              <div style="position: absolute; left: -9999px; top: 0; visibility: hidden;">
                <span class="dbminputlabel">If False</span>
                <select id="iffalse" class="round">
                  <option value="0" selected>Continue Actions</option>
                  <option value="1">Stop Action Sequence</option>
                  <option value="2">Jump to Action</option>
                  <option value="3">Run Extra Actions</option>
                </select>
                <action-list-input id="iffalseVal" style="margin-top: 10px;"></action-list-input>
              </div>
            </div>
          </dialog-list>
        </div>
      </div>`;
  },

  init() {
    const { glob } = this;

    // Formatowanie elementów listy
    glob.formatItem = function (data) {
      if (!data.punishment || data.punishment === "none") {
        return `Word: ${data.word || "No word provided"}`;
      } else {
        return `Word: ${data.word || "No word provided"}`;
      }
    };

    // Sortowanie elementów listy
    glob.customDataSorter = function (list) {
      return list.sort((a, b) => {
        const punishmentA = a.punishment === "none" || !a.punishment;
        const punishmentB = b.punishment === "none" || !b.punishment;
        return punishmentA === punishmentB ? 0 : punishmentA ? -1 : 1;
      });
    };

    // Funkcja do przeciągania elementów
    const originalDialogListDraggable = glob.dialogList.draggable;
    glob.dialogList.draggable = function (list) {
      const sortedList = glob.customDataSorter(list);
      return originalDialogListDraggable.call(this, sortedList);
    };
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const msg = cache.msg;

    const words = data.words || [];

    const moderatedWords = words
      .map((w) => w.word && w.word.trim())
      .filter(Boolean);

    if (!moderatedWords.length) {
      console.log("No moderated words configured.");
      return this.callNextAction(cache);
    }

    const filePath = "./data/automod.json";

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync("./data", { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify({ words: [] }, null, 2));
    }

    const automodData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    automodData.words = moderatedWords;
    fs.writeFileSync(filePath, JSON.stringify(automodData, null, 2));

    if (msg && msg.content) {
      let applyPunishment = true;
      let punishmentAction = null;
      let wordMatched = null;

      for (const wordData of words) {
        const word = wordData.word;
        if (!word || !msg.content.toLowerCase().includes(word.toLowerCase())) {
          continue;
        }

        const ignoredRoles =
          wordData.ignoredRoles?.split(",").map((id) => id.trim()) || [];
        const ignoredChannels =
          wordData.ignoredChannels?.split(",").map((id) => id.trim()) || [];

        if (
          msg.member.roles.cache.some((role) =>
            ignoredRoles.includes(role.id)
          ) ||
          ignoredChannels.includes(msg.channel.id)
        ) {
          continue;
        }

        // Execute Actions from If True field
        const iftrueVal = wordData.iftrueVal;
        if (iftrueVal && iftrueVal.length > 0) {
          this.executeSubActions(iftrueVal, cache);
        }

        if (wordData.punishment === "none") {
          applyPunishment = false;
          punishmentAction = null;
          wordMatched = word;
          break;
        }

        if (applyPunishment && !punishmentAction) {
          punishmentAction = wordData.punishment;
          wordMatched = word;
        }
      }

      if (applyPunishment && punishmentAction) {
        if (punishmentAction === "delete") {
          msg.delete().catch(console.error);
        } else if (punishmentAction === "warn") {
          msg.channel
            .send(
              `${msg.author}, your message contained a prohibited word: "${wordMatched}"!`
            )
            .then((sentMsg) => {
              setTimeout(() => sentMsg.delete().catch(console.error), 5000);
            });
        }
      }
    }

    this.callNextAction(cache);
  },

  mod() {},
};
