module.exports = {
  name: "Generate Password",
  section: "DBM POLAND",
  meta: {
    version: "2.1.9",
    preciseCheck: false,
    author: "Shadow",
    authorUrl: null,
    downloadURL: null,
  },

  subtitle() {
    return "Generate a random password";
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, "Text"];
  },

  fields: ["difficulty", "min", "max", "storage", "varName"],

  html() {
    return `
    <div>
    <p>
        <u>Mod Info:</u><br>
        Created by Shadow<br>
        Help: https://discord.gg/9HYB4n3Dz4<br>
    </p>
</div><br>

  <div>
    <div style="float: left; width: 45%;">
      <span class="dbminputlabel">Minimum Length</span>
      <input id="min" class="round" type="text"><br>
    </div>
    <div style="padding-left: 5%; float: left; width: 50%;">
      <span class="dbminputlabel">Maximum Length</span>
      <input id="max" class="round" type="text"><br>
    </div>
    <br>
    
    <div style="padding-top: 8px;">
      <span class="dbminputlabel">Difficulty</span><br>
      <select id="difficulty" class="round">
        <option value="easy" selected>Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
    <br>
    
    <div style="padding-top: 8px;">
      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
    </div>
  </div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const min = parseInt(this.evalMessage(data.min, cache), 10);
    const max = parseInt(this.evalMessage(data.max, cache), 10);
    const difficulty = this.evalMessage(data.difficulty, cache);
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    if (isNaN(min) || isNaN(max) || min < 1 || max < min) {
      console.log("Error: Invalid minimum or maximum length for password.");
      return this.callNextAction(cache);
    }

    const length = Math.floor(Math.random() * (max - min + 1)) + min;

    const charSets = {
      easy: "abcdefghijklmnopqrstuvwxyz",
      medium: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      hard: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?",
    };

    const chars = charSets[difficulty];
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    this.storeValue(password, type, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
