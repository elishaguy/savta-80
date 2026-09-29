/* Data for Ima's 60th birthday site.
   Boards transcribed from Categories_mom.md. A few words were left "open" by design
   (e.g. "islands in Thailand, just fill that in") — those are filled in below with a
   best-effort guess. Connections-only (no Wordle tab), same as Savta's site. */

const SITE_DATA = {
  siteId: "ima",
  pageTitle: "מזל טוב לאמא! 🎉",
  shareTitlePrefix: "מזל טוב לאמא",
  createdBy: "גיא אלישע",

  personName: "אמא", // change to her real name if you'd like it to appear instead
  age: 60,
  message:
    "שישים שנה מלאות אהבה, נתינה וחיוך שמאיר לנו את הדרך. עשיתי לך משחק מלא בגאוגרפיה, תחום עניין שאנחנו חולקות ואוהבות, מקווה שתיהני ממנו. מאחלים לך שנה מדהימה, בריאות, שמחה והמון הפתעות טובות! 🎂💐",

  connectionsTries: 5,
  wordleTries: 6,

  connectionsBoards: [
    {
      // Board 1 (hard) — words given explicitly
      level: "hard",
      categories: [
        { title: "מקומות גרה בארץ", words: ["תל אביב", "רמת גן", "באר שבע", "אילת השחר"] },
        { title: "מרתונים גדולים", words: ["טוקיו", "שיקגו", "ברלין", "בוסטון"] },
        { title: "גנים ובתי ספר", words: ["ראשונים", "סביון", "שקמה", "יהוד"] },
        { title: "ערים דוברות צרפתית", words: ["לוזאן", "מונטריאול", "בריסל", "ליון"] },
      ],
      clueWords: ["לוזאן", "מונטריאול"],
    },
    {
      // Board 2 (easy) — no words or difficulty order given ("islands in Thailand, just fill that in").
      // Words and 1-4 difficulty order below are my best guess — swap freely in this file.
      level: "easy",
      categories: [
        { title: "איים בתאילנד", words: ["פוקט", "קו סאמוי", "קו פיפי", "קו טאו"] },
        { title: "איים בים התיכון", words: ["מלטה", "קפריסין", "קורסיקה", "סרדיניה"] },
        { title: "איים קנריים", words: ["טנריף", "גראן קנריה", "לנסרוטה", "פואנטוונטורה"] },
        { title: "איים ביפן", words: ["הונשו", "הוקאידו", "קיושו", "שיקוקו"] },
      ],
      clueWords: ["הונשו", "הוקאידו"],
    },
    {
      // Board 3 (intermediate) — category titles given, words left open. My picks below.
      level: "intermediate",
      categories: [
        { title: "ערים דוברות ספרדית", words: ["מדריד", "בואנוס איירס", "מקסיקו סיטי", "בוגוטה"] },
        { title: "ערי בירה של מדינות בארה\"ב", words: ["אוסטין", "סקרמנטו", "טאלהאסי", "קולומבוס"] },
        { title: "פרובינציות בקנדה", words: ["אונטריו", "קוויבק", "אלברטה", "מניטובה"] },
        { title: "ערים הכי גדולות במדינה שהן לא ערי בירה", words: ["סידני", "טורונטו", "ניו יורק", "סאו פאולו"] },
      ],
      clueWords: ["סידני", "טורונטו"],
    },
    {
      // Board 4 (intermediate)
      level: "intermediate",
      categories: [
        { title: "מאכלים מסורתיים", words: ["פונדו", "קארי", "חמין", "פאייה"] },
        { title: "תנוחות יוגה", words: ["כלב מביט מטה", "עץ", "לוחם", "ילד"] },
        { title: "מילים מהשיר בעקבות השמש", words: ["חמים", "קסמים", "תמים", "השמש"] },
        { title: "ספרים של מאיר שלו (מילה ראשונה)", words: ["רומן", "עשו", "דבש", "שני"] },
      ],
      clueWords: ["רומן", "עשו"],
    },
    {
      // Board 5 — level wasn't specified in the notes; defaulted to "hard". Change freely.
      level: "hard",
      categories: [
        { title: "מדינות שגובלות עם תאילנד", words: ["מיאנמר", "לאוס", "קמבודיה", "מלזיה"] },
        { title: "עיירות מטיול מונט בלאן", words: ["קורמאייר", "שאמוני", "מרטיני", "קומבלו"] },
        { title: "עיירות באלזס", words: ["קולמר", "ריקוויר", "אגישהיים", "אוברנא"] },
        { title: "אגמים באסיה", words: ["בייקל", "טונלה סאפ", "אינלה", "האגם המערבי"] },
      ],
      clueWords: ["בייקל", "טונלה סאפ"],
    },
  ],

  // Kept but unused: Ima's site has no Wordle tab (see README fix log).
  wordleWords: [],
};
