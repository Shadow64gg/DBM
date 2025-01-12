const axios = require("axios");

module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------
  name: "Monitoring Epic Games API",

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------
  section: "Epic Games Store",

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------
  subtitle(data, presets) {
    return `Monitoring Epic Games Promotions`;
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //---------------------------------------------------------------------
  meta: {
    version: "2.1.9",
    preciseCheck: true,
    author: "Shadow",
    authorUrl: null,
    downloadUrl: null,
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //---------------------------------------------------------------------
  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, "Game Data"];
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------
  fields: ["storage", "varName2"],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------
  html(isEvent, data) {
    return `
      <br>this action monitors the epic games API, if it detects any new promotions, it continues the action<br>
      <div>
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
      </div>
    `;
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------
  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);

    let lastCheckedData = await fetchSalesGameData();

    while (true) {
      const currentData = await fetchSalesGameData();

      if (!currentData) {
        return;
      }

      // Porównujemy aktualne dane z poprzednimi
      if (JSON.stringify(currentData) !== JSON.stringify(lastCheckedData)) {
        // Zapisujemy dane, jeśli wykryto zmiany
        this.storeValue(currentData, storage, varName2, cache);

        // Kontynuujemy, jeśli są zmiany
        lastCheckedData = currentData;
      }

      // Dajemy chwilę, aby nie przeciążać API
      await new Promise((resolve) => setTimeout(resolve, 30000)); // Czekaj 30 sekund
    }
  },
};

async function fetchSalesGameData() {
  try {
    const response = await axios.get(
      "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US"
    );

    if (
      !response.data ||
      !response.data.data ||
      !response.data.data.Catalog.searchStore.elements
    ) {
      console.error("No games found in API response");
      return null;
    }

    const games = response.data.data.Catalog.searchStore.elements;

    const game = games[5]; // Szósta gra na liście

    if (!game) {
      console.error("Game not found");
      return null;
    }

    return {
      title: game.title,
      originalPrice:
        game.price?.totalPrice?.fmtPrice?.originalPrice || "Not available",
      discountedPrice:
        game.price?.totalPrice?.fmtPrice?.discountPrice || "Free",
      coverImage:
        game.keyImages.find((image) => image.type === "OfferImageWide")?.url ||
        "No image available",
      gameLink: `https://store.epicgames.com/pl/p/${
        game.catalogNs?.mappings[0]?.pageSlug || "default-slug"
      }`,
      description: game.description || "No description available",
      promotionEndTimestamp:
        game.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0]
          ?.endDate || "No end date",
    };
  } catch (error) {
    console.error("Error fetching data from Epic Games API:", error);
    return null;
  }
}
