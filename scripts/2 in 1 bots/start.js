const { spawn } = require("child_process");
const path = require("path");

// Funkcja auto-uruchamiania: true = włączone, false = wyłączone
const autoRestart = true;

// Czas oczekiwania przed ponownym uruchomieniem bota w milisekundach (np. 5000 = 5 sekund)
const restartDelay = 5000;

// Funkcja działania kodu (tego lepiej nie zmieniać).
function startBot(botFolder) {
  const originalDir = process.cwd();
  const botPath = path.join(originalDir, botFolder);

  function runBot() {
    const processInstance = spawn("node", ["bot.js"], {
      cwd: botPath,
      stdio: "inherit",
    });

    processInstance.on("error", (error) => {
      console.error(`Błąd przy uruchamianiu bota ${botFolder}:`, error.message);
    });

    processInstance.on("close", (code) => {
      if (code === 0) {
        console.log(`Bot ${botFolder} zakończył działanie.`);
      } else {
        console.error(`Bot ${botFolder} zakończył działanie z kodem ${code}.`);
      }

      // Funkcja auto-uruchamiania botów w przypadku ich wyłączenia lub błędu (tego lepiej nie zmieniać).
      if (autoRestart) {
        console.log(
          `Uruchamianie bota ${botFolder} ponownie za ${
            restartDelay / 1000
          } sekund...`
        );
        setTimeout(runBot, restartDelay);
      }
    });
  }

  // Funkcja rozpoczęcia procesu botów (tego lepiej nie zmieniać).
  runBot();
}

// Tu możesz dodać więcej botów (pamiętaj o prawidłowej nazwie folderu)
startBot("NAZWA FOLDERU TWOJEGO PIERWSZEGO BOTA");
startBot("NAZWA FOLDERU TWOJEGO DRUGIEGO BOTA");
