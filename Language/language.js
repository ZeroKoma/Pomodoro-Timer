let currentLanguage = "english";

const spanish = {
  alarmTrigered: "Alarma Disparada",
  menuWork: "Trabajo",
  menuBreak: "Descanso",
  menuLastBreak: "Último descanso",
};

const english = {
  alarmTrigered: "Alarm trigered",
  menuWork: "Work",
  menuBreak: "Break",
  menuLastBreak: "Last break",
};

const translate = () => {
  document.getElementById("menu-trabajo").innerHTML =
    stringTranslated("menuWork");
  document.getElementById("menu-descando").innerHTML =
    stringTranslated("menuBreak");
  document.getElementById("menu-ultimo-descanso").innerHTML =
    stringTranslated("menuLastBreak");
};

const stringTranslated = (item) => {
  let result = null;
  switch (currentLanguage) {
    case "spanish":
      for (const x in spanish) {
        if (x == item) result = spanish[x];
      }
      return result;
    case "english":
      for (const x in english) {
        if (x == item) result = english[x];
      }
      return result;
  }
};

const setLanguage = (userLanguage) => {
  switch (userLanguage) {
    case "spanish":
      currentLanguage = "spanish";
      break;
    case "english":
      currentLanguage = "english";
      break;
  }
  translate();
};
