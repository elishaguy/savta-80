/* Data for Savta's 80th birthday site. Edit freely — the page rebuilds itself from this file. */

const SITE_DATA = {
  siteId: "savta",
  pageTitle: "מזל טוב לסבתא! 🎉",
  shareTitlePrefix: "מזל טוב לסבתא",
  createdBy: "גיא אלישע",

  personName: "סבתא", // change to her real name if you'd like it to appear instead
  age: 80,
  message:
    "שמונים שנה של חוכמה, אהבה וסיפורים שאין להם סוף. מאחלת לך שנה מתוקה, בריאות איתנה ועוד המון רגעים ביחד! 🎂💐",

  connectionsTries: 5,
  wordleTries: 6,

  connectionsBoards: [
    {
      level: "hard",
      categories: [
        { title: "ישובים בעוטף", words: ["בארי", "גבולות", "חולית", "מבטחים"] },
        { title: "ערים בצפון", words: ["בית השיטה", "נמרוד", "מטולה", "כפר ורדים"] },
        { title: "מקומות שסבתא גרה בהם", words: ["באר שבע", "הוד השרון", "איילת השחר", "שדה בוקר"] },
        { title: "ישובים בחבל לכיש", words: ["לכיש", "אליאב", "אחוזם", "קריית גת"] },
      ],
      clueWords: ["אליאב", "לכיש"],
    },
    {
      level: "hard",
      categories: [
        { title: "ציפורים ארץ-ישראליות נפוצות", words: ["דוכיפת", "שחרור", "עורב אפור", "צופית בוהקת"] },
        { title: "שמות של ציפורי שיר", words: ["דרור", "זמיר", "אדום חזה", "ירגזי"] },
        { title: "שמות בנים + ה = שמות בנות", words: ["יוספה", "מיכאלה", "אילנה", "זיוה"] },
        { title: "שמות פרטיים עם שתי אותיות", words: ["רן", "גד", "חן", "גל"] },
      ],
      clueWords: ["רן", "גד"],
    },
    {
      level: "intermediate",
      categories: [
        { title: "מילת היחס \"את\" בהטיה", words: ["איתי", "איתך", "איתנו", "איתם"] },
        { title: "עצים", words: ["אלה", "אלון", "חרוב", "ברוש"] },
        { title: "צמחי מדבר", words: ["זוגן", "רותם", "אשל", "צלף"] },
        { title: "עין ___", words: ["גדי", "כרם", "חרוד", "הוד"] },
      ],
      clueWords: ["גדי", "כרם"],
    },
    {
      level: "easy",
      categories: [
        { title: "שמות של חיות המחמד שלה", words: ["תשי", "שופי", "גורי", "אקאי"] },
        { title: "נכדות", words: ["יעל", "אילת", "גיא", "רז"] },
        { title: "ראש ___", words: ["השנה", "הניקרה", "העין", "פינה"] },
        { title: "שבטי ישראל", words: ["דן", "יהודה", "ראובן", "יוסף"] },
      ],
      clueWords: ["דן", "יהודה"],
    },
    {
      level: "hard",
      categories: [
        { title: "ראשי מפלגת העבודה", words: ["מיכאלי", "מאיר", "מצנע", "גבאי"] },
        { title: "זוכי פרס נובל ישראלים", words: ["פרס", "עגנון", "בגין", "מוקיר"] },
        { title: "ערים באירופה שדוברות גרמנית", words: ["ציריך", "ברלין", "וינה", "ואדוץ"] },
        { title: "ככרות מפורסמות בתל אביב", words: ["רבין", "הבימה", "דיזינגוף", "פריז"] },
      ],
      clueWords: ["רבין", "פריז"],
    },
  ],

  // Kept but unused: Savta's site no longer has a Wordle tab (see README fix log).
  wordleWords: ["אילנה", "עברית", "שניצל", "שוויץ", "אברסט"],
};
