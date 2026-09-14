/* Shared engine for both birthday sites. Reads everything from SITE_DATA (defined in each site's data.js). */

const COLOR_KEYS = { 1: "g1", 2: "g2", 3: "g3", 4: "g4" };
const LEVEL_LABELS = { easy: "קל", intermediate: "בינוני", hard: "קשה" };

const KEYBOARD_ROWS = [
  ["ק", "ר", "א", "ט", "ו", "ן", "ם", "פ"],
  ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", "ך", "ף"],
  ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת", "ץ"],
];

// finals map to their base letter for guess comparisons (ך=כ, ם=מ, ן=נ, ף=פ, ץ=צ)
const FINAL_TO_BASE = { "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ" };
function normalizeLetter(ch) {
  return FINAL_TO_BASE[ch] || ch;
}

function storageKey() {
  return "savta_ima_" + SITE_DATA.siteId;
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey());
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { connections: {}, wordle: {} };
}

function saveState() {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(STATE));
  } catch (e) {}
}

const STATE = loadState();

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- App bootstrap ---------- */

function initApp() {
  document.title = SITE_DATA.pageTitle;
  renderHero();
  setupTabs();
  renderConnectionsList();
  renderWordleList();
}

function renderHero() {
  document.getElementById("hero-name").textContent = SITE_DATA.personName;
  document.getElementById("hero-age").textContent = SITE_DATA.age;
  document.getElementById("hero-msg").textContent = SITE_DATA.message;
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tabbtn");
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tabpanel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("panel-" + btn.dataset.tab).classList.add("active");
    });
  });
}

async function shareOrCopy(text) {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return;
    } catch (e) {
      /* user cancelled or share failed, fall back to copy */
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    alert("הועתק! עכשיו אפשר להדביק בוואטסאפ 💬");
  } catch (e) {
    prompt("העתיקו את התוצאה ושלחו בוואטסאפ:", text);
  }
}

/* =========================================================
   CONNECTIONS (מה הקשר)
   ========================================================= */

let currentBoardIndex = null;
let boardRuntime = null; // { order, selected, solvedGroups, triesLeft, clueUsed, solveHistory }

function renderConnectionsList() {
  const container = document.getElementById("connections-list");
  const boards = SITE_DATA.connectionsBoards || [];
  if (boards.length === 0) {
    container.innerHTML = '<div class="empty-note">הלוחות עוד בדרך... 🎨<br>בקרוב יעלו כאן חידות "מה הקשר" חדשות.</div>';
    return;
  }
  container.innerHTML = "";
  boards.forEach((board, idx) => {
    const st = STATE.connections[idx];
    const solvedCount = st ? st.solvedGroups.length : 0;
    let pillClass = "status-pill";
    let pillText = "טרם נפתר";
    if (solvedCount === 4) {
      pillClass += " solved";
      pillText = "נפתר! 🎉";
    } else if (st && st.triesLeft === 0) {
      pillClass += " failed";
      pillText = "נגמרו הנסיונות";
    } else if (solvedCount > 0) {
      pillText = solvedCount + "/4";
    }
    const div = document.createElement("div");
    div.className = "card card-list-item";
    div.innerHTML = `
      <div>
        <div class="title">לוח ${idx + 1}</div>
        <div class="sub">רמה: ${LEVEL_LABELS[board.level]}</div>
      </div>
      <div class="${pillClass}">${pillText}</div>
    `;
    div.addEventListener("click", () => openBoard(idx));
    container.appendChild(div);
  });
}

function getOrInitBoardState(idx) {
  if (!STATE.connections[idx]) {
    STATE.connections[idx] = {
      order: shuffle([0, 1, 2, 3].flatMap((g) => SITE_DATA.connectionsBoards[idx].categories[g].words.map((w) => ({ word: w, group: g + 1 })))).map((x) => x),
      solvedGroups: [],
      triesLeft: SITE_DATA.connectionsTries,
      clueUsed: false,
      solveHistory: [],
      guessHistory: [],
    };
    saveState();
  }
  return STATE.connections[idx];
}

function openBoard(idx) {
  currentBoardIndex = idx;
  boardRuntime = getOrInitBoardState(idx);
  boardRuntime.selected = [];
  boardRuntime.message = "";
  renderBoardView();
  document.getElementById("connections-list-view").style.display = "none";
  document.getElementById("connections-board-view").style.display = "block";
}

function closeBoard() {
  document.getElementById("connections-board-view").style.display = "none";
  document.getElementById("connections-list-view").style.display = "block";
  renderConnectionsList();
}

function renderBoardView() {
  const board = SITE_DATA.connectionsBoards[currentBoardIndex];
  const st = boardRuntime;
  const view = document.getElementById("connections-board-view");

  const solvedRowsHtml = st.solveHistory
    .map((g) => {
      const cat = board.categories[g - 1];
      return `<div class="solved-row ${COLOR_KEYS[g]}">
        <div class="cat-title">${cat.title}</div>
        ${cat.words.map((w) => `<div class="word">${w}</div>`).join("")}
      </div>`;
    })
    .join("");

  const remainingTiles = st.order.filter((t) => !st.solvedGroups.includes(t.group));

  const finished = st.solvedGroups.length === 4 || st.triesLeft === 0;

  let tilesHtml = "";
  if (!finished) {
    tilesHtml = `<div class="conn-grid">${remainingTiles
      .map((t) => {
        const isSelected = st.selected.includes(t.word);
        const cls = ["conn-tile"];
        if (isSelected) cls.push("selected");
        return `<div class="${cls.join(" ")}" data-word="${t.word}">${t.word}</div>`;
      })
      .join("")}</div>`;
  }

  let endHtml = "";
  if (finished) {
    const won = st.solvedGroups.length === 4;
    endHtml = `
      <div class="msg-banner">${won ? "כל הכבוד! פתרתם את הלוח! 🎉" : "נגמרו הנסיונות... הנה הפתרון:"}</div>
      ${!won ? renderUnsolvedReveal(board, st) : ""}
      <div class="btn-row">
        <button class="action primary" id="share-btn">שתפו תוצאה בוואטסאפ 💬</button>
      </div>
    `;
  }

  view.innerHTML = `
    <div class="board-head">
      <button class="back" id="back-btn">→ חזרה ללוחות</button>
      <div class="credit">נכתב על ידי: ${SITE_DATA.createdBy}</div>
      <div class="level">רמה: ${LEVEL_LABELS[board.level]}</div>
      ${!finished ? `<div class="tries">נסיונות שנותרו: ${st.triesLeft}</div>` : ""}
    </div>
    <div class="msg-banner" id="msg-banner">${st.message || ""}</div>
    ${solvedRowsHtml}
    ${tilesHtml}
    ${
      !finished
        ? `<div class="btn-row">
            <button class="action secondary" id="clue-btn" ${st.solvedGroups.includes(4) ? "disabled" : ""}>רמז 💡</button>
            <button class="action secondary" id="clear-btn">נקו בחירה</button>
            <button class="action primary" id="submit-btn" ${st.selected.length === 4 ? "" : "disabled"}>הגישו</button>
          </div>`
        : ""
    }
    ${endHtml}
  `;

  view.querySelector("#back-btn").addEventListener("click", closeBoard);

  if (!finished) {
    view.querySelectorAll(".conn-tile").forEach((el) => {
      el.addEventListener("click", () => toggleTile(el.dataset.word));
    });
    view.querySelector("#clue-btn").addEventListener("click", useClue);
    view.querySelector("#clear-btn").addEventListener("click", () => {
      st.selected = [];
      renderBoardView();
    });
    view.querySelector("#submit-btn").addEventListener("click", submitGuess);
  } else {
    view.querySelector("#share-btn").addEventListener("click", () => shareOrCopy(buildConnectionsShareText(board, st)));
  }
}

function renderUnsolvedReveal(board, st) {
  let html = "";
  for (let g = 1; g <= 4; g++) {
    if (!st.solvedGroups.includes(g)) {
      const cat = board.categories[g - 1];
      html += `<div class="solved-row ${COLOR_KEYS[g]}">
        <div class="cat-title">${cat.title}</div>
        ${cat.words.map((w) => `<div class="word">${w}</div>`).join("")}
      </div>`;
    }
  }
  return html;
}

function toggleTile(word) {
  const st = boardRuntime;
  const i = st.selected.indexOf(word);
  if (i >= 0) {
    st.selected.splice(i, 1);
  } else {
    if (st.selected.length >= 4) return;
    st.selected.push(word);
  }
  renderBoardView();
}

function useClue() {
  const board = SITE_DATA.connectionsBoards[currentBoardIndex];
  const st = boardRuntime;
  if (st.solvedGroups.includes(4)) return; // hardest category already solved, no clue needed
  const hardWords = board.categories[3].words; // category 4 = hardest = red, always
  st.selected = shuffle(hardWords).slice(0, 2);
  st.clueUsed = true;
  st.message = "רמז: שתי המילים שנבחרו שייכות לאותה קטגוריה (הקשה ביותר) 🔴";
  saveState();
  renderBoardView();
}

function submitGuess() {
  const board = SITE_DATA.connectionsBoards[currentBoardIndex];
  const st = boardRuntime;
  if (st.selected.length !== 4) return;

  // count matches per group among selected words, and record the guess (in selection order)
  // for the share text, regardless of whether it was right or wrong
  const counts = {};
  const guessGroups = st.selected.map((word) => {
    const tile = st.order.find((t) => t.word === word);
    counts[tile.group] = (counts[tile.group] || 0) + 1;
    return tile.group;
  });
  if (!st.guessHistory) st.guessHistory = [];
  st.guessHistory.push(guessGroups);
  const bestGroup = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  const bestCount = counts[bestGroup];

  if (bestCount === 4) {
    const g = parseInt(bestGroup, 10);
    st.solvedGroups.push(g);
    st.solveHistory.push(g);
    st.selected = [];
    st.message = "מעולה! קטגוריה נפתרה 🎯";
  } else {
    st.triesLeft -= 1;
    if (bestCount === 3) {
      st.message = "כמעט! 3/4 באותה קטגוריה 👀";
    } else {
      st.message = "לא בדיוק... נסו שוב";
    }
    // keep the selection as-is on a wrong guess — the user deselects/clears manually
  }
  saveState();
  renderBoardView();
}

function buildConnectionsShareText(board, st) {
  const lines = [];
  lines.push(`${SITE_DATA.shareTitlePrefix} - מה הקשר לוח ${currentBoardIndex + 1} 🧩`);
  const emoji = { g1: "🟩", g2: "🟨", g3: "🟧", g4: "🟥" };
  const guesses = st.guessHistory && st.guessHistory.length ? st.guessHistory : st.solveHistory.map((g) => [g, g, g, g]);
  guesses.forEach((groups) => {
    lines.push(groups.map((g) => emoji[COLOR_KEYS[g]]).join(""));
  });
  const won = st.solvedGroups.length === 4;
  if (won) {
    const mistakes = SITE_DATA.connectionsTries - st.triesLeft;
    const mistakesText = mistakes === 0 ? "אפס טעויות" : mistakes === 1 ? "טעות אחת" : `${mistakes} טעויות`;
    const clueText = st.clueUsed ? "עם רמז" : "בלי רמז";
    lines.push(`נפתר עם ${mistakesText} ו${clueText} ✅`);
  } else {
    lines.push("לא נפתר הפעם 😅");
  }
  return lines.join("\n");
}

/* =========================================================
   WORDLE (חמש אותיות)
   ========================================================= */

let currentWordleIndex = null;
let wordleRuntime = null; // { guesses: [...strings], done, won }
const WORD_LEN = 5;

function getWordleTries() {
  return SITE_DATA.wordleTries || 6;
}

function renderWordleList() {
  const container = document.getElementById("wordle-list");
  if (!container) return; // site has no Wordle section (e.g. Savta — connections only)
  const words = SITE_DATA.wordleWords || [];
  if (words.length === 0) {
    container.innerHTML = '<div class="empty-note">חידות "חמש אותיות" עוד בדרך... 🔤<br>בקרוב יעלו כאן חידות חדשות.</div>';
    return;
  }
  container.innerHTML = "";
  words.forEach((word, idx) => {
    const st = STATE.wordle[idx];
    let pillClass = "status-pill";
    let pillText = "טרם שוחק";
    if (st && st.done) {
      if (st.won) {
        pillClass += " solved";
        pillText = "נפתר! 🎉";
      } else {
        pillClass += " failed";
        pillText = "נגמרו הנסיונות";
      }
    } else if (st && st.guesses.length > 0) {
      pillText = `${st.guesses.length}/${getWordleTries()}`;
    }
    const div = document.createElement("div");
    div.className = "card card-list-item";
    div.innerHTML = `
      <div><div class="title">חמש אותיות ${idx + 1}</div></div>
      <div class="${pillClass}">${pillText}</div>
    `;
    div.addEventListener("click", () => openWordle(idx));
    container.appendChild(div);
  });
}

function getOrInitWordleState(idx) {
  if (!STATE.wordle[idx]) {
    STATE.wordle[idx] = { guesses: [], done: false, won: false };
    saveState();
  }
  return STATE.wordle[idx];
}

function openWordle(idx) {
  currentWordleIndex = idx;
  wordleRuntime = getOrInitWordleState(idx);
  wordleRuntime.current = "";
  renderWordleView();
  document.getElementById("wordle-list-view").style.display = "none";
  document.getElementById("wordle-board-view").style.display = "block";
}

function closeWordle() {
  document.getElementById("wordle-board-view").style.display = "none";
  document.getElementById("wordle-list-view").style.display = "block";
  renderWordleList();
}

function evaluateGuess(guess, answer) {
  const a = answer.split("").map(normalizeLetter);
  const g = guess.split("").map(normalizeLetter);
  const result = new Array(WORD_LEN).fill("absent");
  const used = new Array(WORD_LEN).fill(false);

  for (let i = 0; i < WORD_LEN; i++) {
    if (g[i] === a[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }
  for (let i = 0; i < WORD_LEN; i++) {
    if (result[i] === "correct") continue;
    const j = a.findIndex((ch, idx) => ch === g[i] && !used[idx]);
    if (j >= 0) {
      result[i] = "present";
      used[j] = true;
    }
  }
  return result;
}

function keyStateFromGuesses(guesses, answer) {
  const map = {};
  guesses.forEach((guess) => {
    const res = evaluateGuess(guess, answer);
    guess.split("").forEach((ch, i) => {
      const rank = { absent: 0, present: 1, correct: 2 };
      const status = res[i];
      const letter = normalizeLetter(ch);
      if (!map[letter] || rank[status] > rank[map[letter]]) map[letter] = status;
    });
  });
  return map;
}

function renderWordleView() {
  const st = wordleRuntime;
  const answer = SITE_DATA.wordleWords[currentWordleIndex];
  const tries = getWordleTries();
  const view = document.getElementById("wordle-board-view");

  let rowsHtml = "";
  for (let r = 0; r < tries; r++) {
    let rowWord, rowResult;
    if (r < st.guesses.length) {
      rowWord = st.guesses[r];
      rowResult = evaluateGuess(rowWord, answer);
    } else if (r === st.guesses.length && !st.done) {
      rowWord = st.current || "";
      rowResult = null;
    } else {
      rowWord = "";
      rowResult = null;
    }
    let tiles = "";
    for (let c = 0; c < WORD_LEN; c++) {
      const ch = rowWord[c] || "";
      let cls = "wordle-tile";
      if (ch) cls += " filled";
      if (rowResult) cls += " " + rowResult[c];
      tiles += `<div class="${cls}">${ch}</div>`;
    }
    rowsHtml += `<div class="wordle-row">${tiles}</div>`;
  }

  const keyState = keyStateFromGuesses(st.guesses, answer);
  let kbHtml = "";
  KEYBOARD_ROWS.forEach((row, ri) => {
    let rowHtml = "";
    if (ri === 2) rowHtml += `<button class="key wide" data-action="enter">אישור</button>`;
    row.forEach((letter) => {
      const status = keyState[normalizeLetter(letter)];
      rowHtml += `<button class="key ${status || ""}" data-letter="${letter}">${letter}</button>`;
    });
    if (ri === 2) rowHtml += `<button class="key wide" data-action="del">מחק</button>`;
    kbHtml += `<div class="kb-row">${rowHtml}</div>`;
  });

  let endHtml = "";
  if (st.done) {
    endHtml = `
      <div class="msg-banner">${st.won ? "כל הכבוד! ניחשתם נכון! 🎉" : `לא נורא... המילה הייתה: ${answer}`}</div>
      <div class="btn-row">
        <button class="action primary" id="share-btn">שתפו תוצאה בוואטסאפ 💬</button>
      </div>
    `;
  }

  view.innerHTML = `
    <div class="board-head">
      <button class="back" id="back-btn">→ חזרה לחידות</button>
      <div class="credit">נכתב על ידי: ${SITE_DATA.createdBy}</div>
      <div class="level">חמש אותיות ${currentWordleIndex + 1}</div>
    </div>
    <div class="msg-banner" id="msg-banner">${st.message || ""}</div>
    <div class="wordle-grid">${rowsHtml}</div>
    ${!st.done ? `<div class="keyboard">${kbHtml}</div>` : ""}
    ${endHtml}
  `;

  view.querySelector("#back-btn").addEventListener("click", closeWordle);

  if (!st.done) {
    view.querySelectorAll("[data-letter]").forEach((el) => {
      el.addEventListener("click", () => onWordleLetter(el.dataset.letter));
    });
    view.querySelector('[data-action="enter"]').addEventListener("click", onWordleEnter);
    view.querySelector('[data-action="del"]').addEventListener("click", onWordleDel);
  } else {
    view.querySelector("#share-btn").addEventListener("click", () => shareOrCopy(buildWordleShareText(st, answer)));
  }
}

function onWordleLetter(letter) {
  const st = wordleRuntime;
  if (st.done) return;
  if ((st.current || "").length >= WORD_LEN) return;
  st.current = (st.current || "") + letter;
  renderWordleView();
}

function onWordleDel() {
  const st = wordleRuntime;
  if (st.done) return;
  st.current = (st.current || "").slice(0, -1);
  renderWordleView();
}

function onWordleEnter() {
  const st = wordleRuntime;
  if (st.done) return;
  const cur = st.current || "";
  if (cur.length !== WORD_LEN) {
    st.message = "צריך מילה בת 5 אותיות";
    renderWordleView();
    return;
  }
  const answer = SITE_DATA.wordleWords[currentWordleIndex];
  st.guesses.push(cur);
  st.current = "";
  st.message = "";
  const result = evaluateGuess(cur, answer);
  if (result.every((r) => r === "correct")) {
    st.done = true;
    st.won = true;
  } else if (st.guesses.length >= getWordleTries()) {
    st.done = true;
    st.won = false;
  }
  saveState();
  renderWordleView();
}

document.addEventListener("keydown", (e) => {
  const view = document.getElementById("wordle-board-view");
  if (!view || view.style.display === "none") return;
  if (!wordleRuntime || wordleRuntime.done) return;
  if (e.key === "Enter") onWordleEnter();
  else if (e.key === "Backspace") onWordleDel();
});

function buildWordleShareText(st, answer) {
  const lines = [];
  lines.push(`${SITE_DATA.shareTitlePrefix} - חמש אותיות ${currentWordleIndex + 1} 🔤`);
  st.guesses.forEach((guess) => {
    const res = evaluateGuess(guess, answer);
    const emoji = { correct: "🟩", present: "🟨", absent: "⬜" };
    lines.push(res.map((r) => emoji[r]).join(""));
  });
  lines.push(st.won ? `${st.guesses.length}/${getWordleTries()} ✅` : `X/${getWordleTries()} 😅`);
  return lines.join("\n");
}

document.addEventListener("DOMContentLoaded", initApp);
