const path = require("path");
const fs = require("fs");

module.exports = {
  name: "Transcript",
  section: "Moderation",
  meta: {
    version: "2.1.9",
    preciseCheck: false,
    author: "Shadow",
    authorUrl: null,
    downloadURL: null,
  },

  subtitle(data, presets) {
    return `${presets.getChannelText(data.channel, data.varName)} - Transcript`;
  },

  fields: [
    "channel",
    "filename",
    "folder",
    "storage",
    "varName",
    "varName2",
    "maxMessages",
  ],

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



      <channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>
      <br><br>
      <div style="margin-top: 30px; display: flex; align-items: center; justify-content: space-between;">
        <div style="width: 48%;">
          <span class="dbminputlabel">File Name</span><br>
          <input type="text" id="filename" class="round" value="transcript">
        </div>
        <div style="width: 48%;">
          <span class="dbminputlabel">Folder Path</span><br>
          <input type="text" id="folder" class="round" value="data/transcripts">
        </div>
      </div>
      <br><br>
      <div style="width: 48%;">
  <span class="dbminputlabel">Max Messages (max 100)</span><br>
  <input type="number" id="maxMessages" class="round" value="100" min="1" max="100">
</div>

      <hr class="subtlebar" style="width: 100%; margin-top: 30px; margin-bottom: 30px;">

      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
    `;
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(
      data.channel,
      data.varName,
      cache
    );
    const filename = this.evalMessage(data.filename, cache);
    const folder = this.evalMessage(data.folder, cache);

    try {
      const { shadowTranscript } = require("shadow-modules");

      // Rozwiązanie pełnej ścieżki do folderu
      const resolvedFolderPath = path.resolve(process.cwd(), folder);

      // Sprawdzamy, czy folder istnieje, jeśli nie, tworzymy go
      if (!fs.existsSync(resolvedFolderPath)) {
        fs.mkdirSync(resolvedFolderPath, { recursive: true });
      }

      // Generowanie pełnej ścieżki pliku w wybranym folderze
      const fullFilePath = path.join(resolvedFolderPath, `${filename}.html`);

      // Generowanie transkryptu z modułu
      const maxMessages =
        parseInt(this.evalMessage(data.maxMessages, cache), 10) || 100; // Odczytujemy wartość, domyślnie 100

      const transcript = await shadowTranscript.createTranscript(channel, {
        limit: maxMessages, // Używamy wartości z pola
      });

      if (!transcript) {
        console.error("Failed to generate transcript.");
        return;
      }

      // Zapisanie transkryptu do pliku HTML
      fs.writeFileSync(fullFilePath, transcript);

      // Generujemy relatywną ścieżkę od katalogu roboczego
      const relativeFilePath = path
        .relative(process.cwd(), fullFilePath)
        .replace(/\\/g, "/");

      // Jeśli użytkownik chce przechować folder ścieżki, zapisujemy go do zmiennej
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName2, cache); // Zapewniamy, że używamy varName2

      this.storeValue(relativeFilePath, storage, varName, cache); // Zapisujemy relatywną ścieżkę

      this.callNextAction(cache); // Kontynuuj wykonywanie akcji
    } catch (error) {
      console.error("Error generating transcript:", error);
      this.callNextAction(cache);
    }
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, data.dontSend ? "Message Options" : "File Location"];
  },

  mod() {},
};
