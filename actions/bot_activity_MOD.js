module.exports = {
  name: "Bot Activity",
  section: "DBM POLAND",
  meta: {
    version: "2.1.7",
    preciseCheck: true,
    author: "Shadow",
    authorUrl: "https://github.com/Shadow64gg/DBM",
    downloadURL: null,
  },

  subtitle: function (data) {
    const activities = [
      "Playing",
      "Listening",
      "Watching",
      "Streaming",
      "Competing",
      "Custom",
    ];

    const stats = ["Online", "Idle", "Invisible", "Do Not Disturb"];

    return `Status: ${stats[data.stats]} - ${activities[data.activity]}: ${
      data.nameText
    }`;
  },

  fields: ["activity", "nameText", "url", "stats"],

  //---------------------------------------------------------------------
  // MOD INFO
  //---------------------------------------------------------------------
  html: function (isEvent, data) {
    return `
    <div class="dbmmodsbr1" style="height: 59px;">
  <p>Mod Info:</p>
  <p>Created by Shadow</p>
  <p><a href="https://discord.gg/9HYB4n3Dz4" target="_blank" style="color: #00aaff; text-decoration: none;">Help: https://discord.gg/9HYB4n3Dz4</a></p>
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
  height: auto;
  width: 210px;
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
}
.dbmmodsbr1 a:hover {
  text-decoration: underline;
}
</style>


<div
  class="dbmmodsbr2 xinelaslink"
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







        <div style="display: flex;">
          <div style="width: 50%; padding-right: 10px">
             <span class="dbminputlabel">Type</span><br>
            <select id="activity" class="round" style="width: 100%;" onchange="glob.onComparisonChanged(this)">
              <option value="0">Playing</option>
              <option value="1">Listening</option>
              <option value="2">Watching</option>
              <option value="3">Streaming</option>
              <option value="4">Competing</option>
              <option value="5">Custom</option>
            </select>
          </div>
          <div style="width: 50%; padding-left: 10px">
             <span class="dbminputlabel">Status</span><br>
            <select id="stats" class="round" style="width: 100%;">
              <option value="0">Online</option>
              <option value="1">Idle</option>
              <option value="2">Invisible</option>
              <option value="3">Do Not Disturb</option>
            </select>
          </div>
        </div>
        <br>
         <span class="dbminputlabel">Activity Name</span><br>
        <input id="nameText" class="round" type="text" style="width: 100%;"><br>
        
<div id="containerxin" class="hidden">
         <span class="dbminputlabel">URL</span><br>
        <input id="url" class="round" type="text" autofocus="autofocus" style="width: 100%;">
      </div>

  <style>
.dbmmodsbr1{position:absolute;bottom:0px;border: 0px solid rgba(50,50,50,0.7);background:rgba(0,0,0,0.7);color:#999;padding:5px;left:0px;z-index:999999;cursor:pointer}
.dbmmodsbr2{position:absolute;bottom:0px;border: 0px solid rgba(50,50,50,0.7);background:rgba(0,0,0,0.7);color:#999;padding:5px;right:0px;z-index:999999;cursor:pointer}
</style>`;
  },

  init: function () {
    const { glob, document } = this;

    glob.onComparisonChanged = function (event) {
      if (event.value == 3) {
        document.getElementById("containerxin").style.display = "block";
      } else {
        document.getElementById("containerxin").style.display = "none";
      }
    };

    glob.onComparisonChanged(document.getElementById("activity"));

    const xinelaslinks = document.getElementsByClassName("xinelaslink");
    for (let x = 0; x < xinelaslinks.length; x++) {
      const xinelaslink = xinelaslinks[x];
      const url = xinelaslink.getAttribute("data-url");
      if (url) {
        xinelaslink.setAttribute("title", url);
        xinelaslink.addEventListener("click", (e) => {
          e.stopImmediatePropagation();
          console.log(`Launching URL: [${url}] in your default browser.`);
          require("child_process").execSync(`start ${url}`);
        });
      }
    }
  },

  async action(cache) {
    const botClient = this.getDBM().Bot.bot.user;
    const data = cache.actions[cache.index];

    const nameText = this.evalMessage(data.nameText, cache);
    const url = this.evalMessage(data.url, cache);
    const activitys = parseInt(data.activity);
    const stats = parseInt(data.stats);

    let obj;

    let target;
    if (activitys >= 0) {
      switch (activitys) {
        case 0:
          target = "PLAYING";
          break;
        case 1:
          target = "LISTENING";
          break;
        case 2:
          target = "WATCHING";
          break;
        case 3:
          target = "STREAMING";
          break;
        case 4:
          target = "COMPETING";
          break;
        case 5:
          target = "CUSTOM";
          break;
      }
    }

    let statustarget;
    if (stats >= 0) {
      switch (stats) {
        case 0:
          statustarget = "online";
          break;
        case 1:
          statustarget = "idle";
          break;
        case 2:
          statustarget = "invisible";
          break;
        case 3:
          statustarget = "dnd";
          break;
      }
    }

    if (botClient) {
      if (nameText) {
        if (target === "STREAMING") {
          obj = {
            activities: [{ name: nameText, type: target, url: url }],
            status: statustarget,
          };
        } else {
          obj = {
            activities: [{ name: nameText, type: target }],
            status: statustarget,
          };
        }
      }
    }

    try {
      botClient.setPresence(obj);
    } catch (error) {
      console.log(
        "ERROR: " +
          cache.toString() +
          " - Action " +
          (cache.index + 1) +
          "# " +
          data.name
      );
      console.log(`${error.stack ? error.stack : error}`);
    }

    this.callNextAction(cache);
  },

  mod: function (DBM) {},
};
