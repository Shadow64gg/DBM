const fs = require("fs");

module.exports = {
  name: "Login",
  section: "Accounts",
  meta: {
    version: "2.1.9",
    preciseCheck: false,
    author: "Shadow",
    authorUrl: null,
    downloadURL: null,
  },

  fields: ["login", "password", "branch"],

  subtitle(data) {
    return `User login`;
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

  <!-- Password Field -->
  <div style="width: 100%; margin-bottom: 10px;">
    <span class="dbminputlabel">Password</span>
    <input id="password" class="round" type="password" style="width: 100%; padding: 8px; font-size: 14px; border-radius: 4px; border: 1px solid #ccc;">
  </div>
  
  <!-- Conditional Input -->
  <div style="width: 100%; margin-bottom: 10px;">
    <conditional-input id="branch" style="width: 100%;"></conditional-input>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const login = this.evalMessage(data.login, cache);
    const password = this.evalMessage(data.password, cache);

    if (!login || !password) {
      console.error("Login or password not provided.");
      return this.callNextAction(cache);
    }

    const filePath = "./data/accounts.json";

    // Creating the file if it does not exist
    if (!fs.existsSync(filePath)) {
      const initialData = { accounts: [] };
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
    }

    // Loading data from a file
    let accounts;
    try {
      const fileData = fs.readFileSync(filePath, "utf-8");
      accounts = JSON.parse(fileData);
    } catch (err) {
      console.error("accounts.json parsing error:", err);
      return this.callNextAction(cache);
    }

    // Checking if the login and password are correct
    const validAccount = accounts.accounts.find(
      (acc) => acc.login === login && acc.password === password
    );

    if (!validAccount) {
      this.executeResults(false, data.branch, cache);
      return;
    }

    // Checking if the user is already logged in elsewhere
    const discordId = cache.interaction.user.id; // We collect the ID of the user who issued the command (for Slash Commands)
    let loggedOut = false;

    // Check all accounts to see if the user is logged in elsewhere
    accounts.accounts.forEach((account) => {
      if (account.loggedIn && account.loggedIn.includes(discordId)) {
        // If the user is logged in to another account, log them out
        account.loggedIn = account.loggedIn.filter((id) => id !== discordId);
        loggedOut = true;

        // Save the updated accounts.json file
        fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
      }
    });

    // If the user is not logged in anywhere, or after logging them out from another account, log them into the new account
    if (!validAccount.loggedIn) {
      validAccount.loggedIn = []; // If the loggedIn field does not exist, we create it
    }

    validAccount.loggedIn.push(discordId);

    // Saving the modified data to a file
    fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));

    this.executeResults(true, data.branch, cache); // If the login/password is correct, do if true
  },

  mod() {},
};
