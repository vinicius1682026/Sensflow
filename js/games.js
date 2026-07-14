/* ══════════════════════════════════════
   SENSFLOW — Game Yaw Data
   Fórmula: cm/360 = (360 / (yaw * sens * DPI)) * 2.54
   Validado contra GamingSmart.com
   ══════════════════════════════════════ */
const GAME_CATEGORIES = {
  "Táticos / Competitivos": {
    "Valorant":               0.07,
    "CS2":                    0.022,
    "CS:GO":                  0.022,
    "Counter-Strike: Source": 0.022,
    "Rainbow Six Siege":      0.005729486,
    "Apex Legends":           0.022,
    "Titanfall 2":            0.022,
    "Deadlock":               0.044,
    "FragPunk":               0.0066,
    "Spectre Divide":         0.0066,
    "XDefiant":               0.0066,
  },
  "Battle Royale": {
    "Fortnite":               0.005555,
    "PUBG: Battlegrounds":    0.002222,
    "Apex Legends (BR)":      0.022,
    "Call of Duty: Warzone":  0.0066,
    "Splitgate 2":            0.022,
  },
  "Call of Duty": {
    "CoD: Black Ops 6":       0.0066,
    "CoD: Modern Warfare 3":  0.0066,
    "CoD: Warzone":           0.0066,
  },
  "Hero Shooters": {
    "Overwatch 2":            0.0066,
    "Marvel Rivals":          0.0066,
    "The Finals":             0.0066,
  },
  "Extração / Sobrevivência": {
    "Escape from Tarkov":        0.022,
    "Gray Zone Warfare":         0.0066,
    "Arena Breakout: Infinite":  0.0066,
    "Hunt: Showdown":            0.0066,
    "Rust":                      0.022,
  },
  "Militares / Guerra": {
    "Battlefield 2042":  0.0066,
    "Battlefield 6":     0.0066,
    "Delta Force":       0.0066,
    "Helldivers 2":      0.0066,
  },
  "Sci-fi / Outros FPS": {
    "Destiny 2":     0.0066,
    "Halo Infinite": 0.022,
  },
  "Clássicos": {
    "Team Fortress 2":  0.022,
    "Half-Life 2":      0.022,
    "Left 4 Dead 2":    0.022,
    "Portal 2":         0.022,
  },
  "Outros": {
    "Minecraft": 0.1,
    "osu!":      0.022,
  },
};

const GAMES = Object.assign({}, ...Object.values(GAME_CATEGORIES));

function populateGameSelect(selectEl, defaultValue = "Valorant") {
  Object.entries(GAME_CATEGORIES).forEach(([cat, list]) => {
    const og = document.createElement("optgroup");
    og.label = cat;
    Object.keys(list).forEach(g => {
      const o = document.createElement("option");
      o.value = g; o.textContent = g;
      og.appendChild(o);
    });
    selectEl.appendChild(og);
  });
  if (selectEl.querySelector(`option[value="${defaultValue}"]`))
    selectEl.value = defaultValue;
}

function populateGameStrip(stripEl) {
  Object.keys(GAMES).forEach(g => {
    const s = document.createElement("span");
    s.textContent = g;
    stripEl.appendChild(s);
  });
}
