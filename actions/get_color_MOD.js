module.exports = {
  name: "Get Color",
  section: "Other Stuff",
  meta: {
    version: "3.2.4",
    preciseCheck: false,
    author: "Shadow",
    authorUrl: "https://github.com/Shadow64gg",
    downloadURL: null,
  },

  subtitle(data) {
    return `Get color: <font color="${data.color || "#000000"}">${
      data.color || "No Color Selected"
    }</font>`;
  },

  fields: ["color", "storage", "varName2"],

  html() {
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


  <div style="margin-bottom: 10px;">
  <span class="dbminputlabel">Color</span><br>
  <input type="color" id="color" class="round" style="height: 50px;">
</div>

  
        <hr class="subtlebar" style="width: 100%; margin-top: 30px; margin-bottom: 30px;">

        <store-in-variable 
          dropdownLabel="Store In" 
          selectId="storage" 
          variableContainerId="varNameContainer2" 
          variableInputId="varName2">
        </store-in-variable>
      `;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const color = this.evalMessage(data.color, cache);
    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);

    if (color) {
      this.storeValue(color, storage, varName2, cache);
    }

    this.callNextAction(cache);
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, "Color HEX"];
  },

  mod() {},
};
