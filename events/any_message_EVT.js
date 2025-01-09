module.exports = {
  name: "Any Message Event",
  isEvent: true,

  fields: [
    "Temp Variable Name (stores member who sent the message):",
    "Temp Variable Name (stores channel where the message was sent):",
    "Temp Variable Name (stores message content):",
  ],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    // Funkcja obsługująca event "messageCreate"
    DBM.Events.anyMessage = function anyMessage(message) {
      if (!Bot.$evts["Any Message Event"]) return;
      if (message.author.bot) return; // Ignoruje wiadomości od botów

      const server = message.guild;
      const temp = {};

      // Ustawia zmienne tymczasowe
      if (message.member)
        temp[Bot.$evts["Any Message Event"][0].temp] = message.member; // Przechowuje członka
      if (message.channel)
        temp[Bot.$evts["Any Message Event"][0].temp2] = message.channel; // Przechowuje kanał
      temp[Bot.$evts["Any Message Event"][0].temp3] = message.content; // Przechowuje treść wiadomości

      // Wywołuje event z przypisanymi zmiennymi
      for (const event of Bot.$evts["Any Message Event"]) {
        Actions.invokeEvent(event, server, temp);
      }
    };

    // Inicjalizacja eventu po uruchomieniu bota
    const { onReady } = Bot;
    Bot.onReady = function anyMessageOnReady(...params) {
      Bot.bot.on("messageCreate", DBM.Events.anyMessage);
      if (onReady) onReady.apply(this, params);
    };
  },
};
