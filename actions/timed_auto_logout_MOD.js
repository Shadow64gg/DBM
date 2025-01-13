const fs = require("fs");

module.exports = {
  name: "Timed Auto Logout",
  section: "Accounts",
  meta: {
    version: "2.1.9",
    preciseCheck: false,
    author: "Shadow",
    authorUrl: null,
    downloadURL: null,
  },

  fields: ["login", "timeout", "branch"],

  subtitle(data) {
    return `Automatic logout after time`;
  },

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


<div style="padding: 8px; display: flex; flex-direction: column; align-items: center;">
<!-- Login Field -->
<div style="width: 100%; margin-bottom: 10px;">
  <span class="dbminputlabel">Login</span>
  <input id="login" class="round" type="text" style="width: 100%; padding: 8px; font-size: 14px; border-radius: 4px; border: 1px solid #ccc;">
</div>

<!-- Time Field -->
<div style="width: 100%; margin-bottom: 10px;">
  <span class="dbminputlabel">Time (in minutes)</span>
  <input id="timeout" class="round" type="number" min="1" value="5" style="width: 100%; padding: 8px; font-size: 14px; border-radius: 4px; border: 1px solid #ccc;">
</div>
</div>
`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const login = this.evalMessage(data.login, cache);
    const timeout = parseInt(this.evalMessage(data.timeout, cache));

    if (!login) {
      console.error("Login not provided.");
      return this.callNextAction(cache);
    }

    const filePath = "./data/accounts.json";
    const defaultContent = {
      accounts: [],
    };

    function ensureFileExists() {
      if (!fs.existsSync(filePath)) {
        try {
          fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
        } catch (err) {
          console.error("Error creating accounts.json file:", err);
        }
      }
    }

    function monitorLoginStatus() {
      ensureFileExists();

      let accounts;
      try {
        const fileData = fs.readFileSync(filePath, "utf-8");
        accounts = JSON.parse(fileData);
      } catch (err) {
        console.error("accounts.json parsing error:", err);
        return;
      }

      let validAccount = accounts.accounts.find((acc) => acc.login === login);

      if (!validAccount) {
        console.error(
          `Login "${login}" does not exist. I'm creating a new account.`
        );
        validAccount = {
          login: login,
          password: "qwerty123", // Default password
          loggedIn: [],
          loggedInTime: {},
        };
        accounts.accounts.push(validAccount);

        try {
          fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
          setTimeout(monitorLoginStatus, 3000); // Restart the action after 3 seconds
        } catch (err) {
          console.error(
            "Error when writing a new account to the accounts.json file:",
            err
          );
        }
        return;
      }

      if (validAccount.loggedIn && validAccount.loggedIn.length > 0) {
        startMonitoring(validAccount);
      } else {
        setTimeout(monitorLoginStatus, 60000); // Retrieve monitoring in a minute
      }
    }

    function startMonitoring(validAccount) {
      validAccount.loggedIn.forEach((userId) => {
        if (!validAccount.loggedInTime) {
          validAccount.loggedInTime = {};
        }
        if (!validAccount.loggedInTime[userId]) {
          validAccount.loggedInTime[userId] = new Date();
        }
      });

      const interval = setInterval(() => {
        validAccount.loggedIn.forEach((userId) => {
          if (validAccount.loggedInTime && validAccount.loggedInTime[userId]) {
            const loginTime = new Date(validAccount.loggedInTime[userId]);
            const currentTime = new Date();
            const diffMinutes = Math.floor((currentTime - loginTime) / 60000);

            if (diffMinutes >= timeout) {
              logoutUser(validAccount, userId, filePath);
            }
          }
        });
      }, 60000);

      function logoutUser(account, userId, filePath) {
        account.loggedIn = account.loggedIn.filter((id) => id !== userId);
        if (account.loggedInTime) {
          delete account.loggedInTime[userId];
        }

        let accounts;
        try {
          const fileData = fs.readFileSync(filePath, "utf-8");
          accounts = JSON.parse(fileData);
        } catch (err) {
          console.error("Error reading accounts.json file:", err);
          return;
        }

        const targetAccount = accounts.accounts.find(
          (acc) => acc.login === account.login
        );
        if (targetAccount) {
          targetAccount.loggedIn = account.loggedIn;
          targetAccount.loggedInTime = account.loggedInTime || {};
        }

        try {
          fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
          clearInterval(interval); // Stop interval after logout
          monitorLoginStatus(); // Start monitoring again after logging out
        } catch (err) {
          console.error("Error writing to accounts.json file:", err);
        }
      }
    }

    ensureFileExists();
    monitorLoginStatus();
  },

  mod() {},
};
