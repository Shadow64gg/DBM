const axios = require("axios");

module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //---------------------------------------------------------------------
  name: "Store Epic Free Games Info",

  //---------------------------------------------------------------------
  // Action Section
  //---------------------------------------------------------------------
  section: "Epic Games Store",

  //---------------------------------------------------------------------
  // Action Subtitle
  //---------------------------------------------------------------------
  subtitle(data, presets) {
    return `Get info for the selected game from the Epic Games Store`;
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
    return [data.varName2, "Epic Games Info"];
  },

  //---------------------------------------------------------------------
  // Action Fields
  //---------------------------------------------------------------------
  fields: ["storage", "varName2", "infoType", "currency"],

  //---------------------------------------------------------------------
  // Command HTML
  //---------------------------------------------------------------------
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

      <div style="padding-top: 8px;">
        <span class="dbminputlabel">Select Information to Fetch</span><br>
        <select id="infoType" class="round">
          <option value="0" ${
            data.infoType == 0 ? "selected" : ""
          }>Game Title</option>
          <option value="1" ${
            data.infoType == 1 ? "selected" : ""
          }>Original Price</option>
          <option value="2" ${
            data.infoType == 2 ? "selected" : ""
          }>Discounted Price</option>
          <option value="3" ${
            data.infoType == 3 ? "selected" : ""
          }>Cover Image</option>
          <option value="4" ${
            data.infoType == 4 ? "selected" : ""
          }>Game Link</option>
          <option value="5" ${
            data.infoType == 5 ? "selected" : ""
          }>Game Description</option>
          <option value="6" ${
            data.infoType == 6 ? "selected" : ""
          }>Promotion End Timestamp</option>
        </select>
      </div>

      <div style="padding-top: 8px;">
        <span class="dbminputlabel">Select Currency</span><br>
        <select id="currency" class="round">
          <option value="USD" ${
            data.currency == "USD" ? "selected" : ""
          }>USD</option>
          <option value="EUR" ${
            data.currency == "EUR" ? "selected" : ""
          }>EUR</option>
          <option value="PLN" ${
            data.currency == "PLN" ? "selected" : ""
          }>PLN</option>
        </select>
      </div>
  
      <br><br>
  
      <div>
        <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
      </div>
    `;
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //---------------------------------------------------------------------
  async action(cache) {
    const data = cache.actions[cache.index];

    // Pobieramy dane z API Epic Games
    const gameData = await fetchSalesGameData();

    if (!gameData) {
      this.callNextAction(cache);
      return;
    }

    const infoType = parseInt(data.infoType, 10);
    const selectedCurrency = this.evalMessage(data.currency, cache); // Odczytanie wybranej waluty
    let selectedResult;

    // Sprawdzamy, czy wybrano "Original Price"
    if (infoType === 1) {
      const originalPrice = gameData.originalPrice;
      const originalCurrency = "USD"; // Zakładamy, że cena w API jest w USD

      // Jeśli wybrano inną walutę, konwertujemy cenę
      if (selectedCurrency && selectedCurrency !== originalCurrency) {
        selectedResult = await convertCurrency(
          originalPrice,
          originalCurrency,
          selectedCurrency
        );
      } else {
        selectedResult = originalPrice;
      }
    } else if (infoType === 2) {
      // Jeśli wybrano "Discounted Price", nie wykonujemy wymiany walutowej
      selectedResult = gameData.discountedPrice;
    } else {
      // Inne typy informacji (np. tytuł gry, link)
      switch (infoType) {
        case 0:
          selectedResult = gameData.title;
          break;
        case 3:
          selectedResult = gameData.coverImage;
          break;
        case 4:
          selectedResult = gameData.gameLink;
          break;
        case 5:
          selectedResult = gameData.description; // Pobieramy opis gry
          break;
        case 6:
          // Konwertowanie daty na format Discordowego timestampu względnego
          const promotionEndTimestamp = gameData.promotionEndTimestamp;
          if (promotionEndTimestamp !== "No end date") {
            selectedResult = `<t:${Math.floor(
              new Date(promotionEndTimestamp).getTime() / 1000
            )}:R>`; // ":R" oznacza względny czas (np. "za 4 dni" lub "3 dni temu")
          } else {
            selectedResult = "No promotion end date available";
          }
          break;
        default:
          selectedResult = "Information not available";
      }
    }

    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);

    this.storeValue(selectedResult, storage, varName2, cache);

    this.callNextAction(cache);
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
      platforms: game.platforms || ["No platforms available"],
      description: game.description || "No description available", // Dodajemy opis gry
      promotionEndTimestamp:
        game.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0]
          ?.endDate || "No end date",
    };
  } catch (error) {
    console.error("Error fetching data from Epic Games API:", error);
    return null;
  }
}

async function convertCurrency(price, fromCurrency, toCurrency) {
  // Usuń znaki waluty, jak '$', '€' itd.
  price = parseFloat(price.replace(/[^\d.-]/g, "")); // Usuwamy wszelkie znaki waluty

  if (isNaN(price)) {
    console.error("Nieprawidłowa cena:", price);
    return "Nieprawidłowa cena"; // Zwróć komunikat, jeśli cena jest nieprawidłowa
  }

  // Pobierz kurs wymiany
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  if (!exchangeRate) {
    return "Błąd konwersji"; // Jeśli nie udało się pobrać kursu, zwróć błąd
  }

  // Przelicz cenę na nową walutę
  return (price * exchangeRate).toFixed(2);
}

// Pobieranie kursów walut
async function getExchangeRate(fromCurrency, toCurrency) {
  try {
    const apiKey = "23da783f0cf0619caf488782"; // Twój klucz API
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;

    const response = await axios.get(url);
    const rates = response.data.conversion_rates;

    if (!rates[toCurrency]) {
      console.error("Kurs wymiany dla waluty nieznany");
      return null;
    }

    return rates[toCurrency];
  } catch (error) {
    console.error("Błąd pobierania kursów:", error);
    return null;
  }
}
