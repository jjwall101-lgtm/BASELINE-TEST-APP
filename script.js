document.addEventListener("DOMContentLoaded", () => {
  const DATA_KEY = "togetherStepsDataV1";
  const PIN_KEY = "togetherStepsParentPinV1";
  const THEME_KEY = "togetherStepsSelectedTheme";
  const NOTE_AUTHOR_KEY = "togetherStepsParentNoteAuthorV1";
  const LAST_NOTIFICATION_KEY = "togetherStepsLastNotificationV1";
  const CHILD_MODE_KEY = "togetherStepsChildModeV1";
  const TIMER_STATE_KEY = "togetherStepsVisualTimerV1";
  const PROFILE_PHOTO_KEY = "togetherStepsProfilePhotoV1";
  const DEFAULT_PIN = "1234";

  const DEFAULT_CATEGORIES = [
    "General",
    "School",
    "Home",
    "Bedtime",
    "Toileting",
    "Kindness",
    "Listening",
    "Meltdown",
    "Shutdown",
    "Sensory overload",
    "Physical outburst",
    "Good transition"
  ];

  const DEFAULT_REWARDS = [
    { id: "reward-100-story", icon: "story", name: "Choose bedtime story", cost: 100 },
    { id: "reward-250-treat", icon: "treat", name: "Small treat", cost: 250 },
    { id: "reward-500-park", icon: "park", name: "Park trip", cost: 500 },
    { id: "reward-1000-prize", icon: "gift", name: "Big prize", cost: 1000 }
  ];

  const DEFAULT_FAMILY_MEMBERS = [
    { id: "family-child", icon: "child", relationship: "Me", name: "Me", branch: "Child", description: "This is me." },
    { id: "family-parent-one", icon: "mum", relationship: "Parent", name: "Parent", branch: "Parents", description: "A parent who loves and helps me." },
    { id: "family-parent-two", icon: "dad", relationship: "Parent", name: "Parent", branch: "Parents", description: "A parent who loves and helps me." },
    { id: "family-sibling", icon: "sibling", relationship: "Sibling", name: "Sibling", branch: "Siblings", description: "My sibling." },
    { id: "family-grandparent", icon: "grandparent", relationship: "Grandparent", name: "Grandparent", branch: "Other family", description: "My grandparent." }
  ];

  const FEELINGS = [
    { id: "happy", label: "Happy", emoji: "😊", colour: "yellow" },
    { id: "sad", label: "Sad", emoji: "😢", colour: "blue" },
    { id: "angry", label: "Angry", emoji: "😠", colour: "red" },
    { id: "worried", label: "Worried", emoji: "😟", colour: "purple" },
    { id: "scared", label: "Scared", emoji: "😨", colour: "grey" },
    { id: "tired", label: "Tired", emoji: "😴", colour: "navy" },
    { id: "excited", label: "Excited", emoji: "🤩", colour: "orange" },
    { id: "calm", label: "Calm", emoji: "😌", colour: "green" },
    { id: "confused", label: "Confused", emoji: "😕", colour: "teal" },
    { id: "overwhelmed", label: "Overwhelmed", emoji: "🥴", colour: "pink" }
  ];

  const REWARD_ICON_OPTIONS = [
    ["story", "Story book"],
    ["treat", "Treat"],
    ["park", "Park"],
    ["gift", "Gift"],
    ["game", "Game"],
    ["toy", "Toy"],
    ["outing", "Outing"],
    ["star", "Star"]
  ];

  const FAMILY_ICON_OPTIONS = [
    ["parent", "Parent"],
    ["child", "Child"],
    ["mum", "Mum"],
    ["dad", "Dad"],
    ["sibling", "Sibling"],
    ["grandparent", "Grandparent"],
    ["family", "Family"],
    ["school", "School"],
    ["childcare", "Childcare"],
    ["heart", "Special person"],
    ["other", "Other"]
  ];

  const CALENDAR_ICON_OPTIONS = [
    ["home", "Home"],
    ["mum", "Mum"],
    ["dad", "Dad"],
    ["family", "Family"],
    ["school", "School"],
    ["childcare", "Nursery / childcare"],
    ["grandparent", "Nan / grandparent"],
    ["travel", "Travel"],
    ["special", "Special day"],
    ["other", "Other"]
  ];

  const ICON_ALIASES = {
    "📖": "story", story: "story", book: "story",
    "🍫": "treat", treat: "treat", chocolate: "treat", snack: "treat",
    "🛝": "park", park: "park", playground: "park",
    "🎁": "gift", gift: "gift", prize: "gift", present: "gift",
    "🎮": "game", game: "game", gaming: "game",
    "🧸": "toy", toy: "toy", teddy: "toy",
    "⭐": "star", star: "star",
    outing: "outing", trip: "outing",
    "👧": "child", "👦": "child", child: "child", me: "child",
    "👩": "mum", mum: "mum", mother: "mum",
    "👨": "dad", dad: "dad", father: "dad",
    parent: "parent",
    "🧒": "sibling", sibling: "sibling", brother: "sibling", sister: "sibling",
    "👵": "grandparent", grandparent: "grandparent", nan: "grandparent", grandad: "grandparent",
    family: "family", "👨‍👩‍👧": "family",
    school: "school", "🏫": "school",
    childcare: "childcare", nursery: "childcare",
    heart: "heart", special: "special", travel: "travel", "🚗": "travel",
    home: "home", "🏠": "home",
    other: "other", default: "other"
  };

  function normaliseIconValue(value, fallback = "other") {
    const key = String(value || "").trim().toLowerCase();
    return ICON_ALIASES[key] || fallback;
  }

  function optionsMarkup(options, selectedValue) {
    return options.map(([value, label]) => `<option value="${value}"${value === selectedValue ? " selected" : ""}>${label}</option>`).join("");
  }

  function getIconLabel(key) {
    const map = Object.fromEntries([...REWARD_ICON_OPTIONS, ...FAMILY_ICON_OPTIONS, ...CALENDAR_ICON_OPTIONS]);
    return map[key] || key;
  }

  function getFeelingGraphicSvg(feelingId) {
    const svgs = {
      happy: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#fde047" stroke="#1f1f1f" stroke-width="4"/><circle cx="24" cy="27" r="3" fill="#1f1f1f"/><circle cx="40" cy="27" r="3" fill="#1f1f1f"/><path d="M22 38c3 5 7 7 10 7s7-2 10-7" fill="none" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/></svg>`,
      sad: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#93c5fd" stroke="#1f1f1f" stroke-width="4"/><circle cx="24" cy="27" r="3" fill="#1f1f1f"/><circle cx="40" cy="27" r="3" fill="#1f1f1f"/><path d="M22 42c3-4 7-6 10-6s7 2 10 6" fill="none" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/><path d="M44 32c0 6 4 7 4 10" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/></svg>`,
      angry: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#f87171" stroke="#1f1f1f" stroke-width="4"/><path d="M20 26l8-3M44 26l-8-3" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="31" r="3" fill="#1f1f1f"/><circle cx="40" cy="31" r="3" fill="#1f1f1f"/><path d="M22 43c3-3 7-4 10-4s7 1 10 4" fill="none" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/></svg>`,
      worried: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#c4b5fd" stroke="#1f1f1f" stroke-width="4"/><circle cx="24" cy="28" r="3" fill="#1f1f1f"/><circle cx="40" cy="28" r="3" fill="#1f1f1f"/><path d="M24 42c2-2 5-3 8-3s6 1 8 3" fill="none" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/></svg>`,
      scared: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#d1d5db" stroke="#1f1f1f" stroke-width="4"/><circle cx="24" cy="27" r="3" fill="#1f1f1f"/><circle cx="40" cy="27" r="3" fill="#1f1f1f"/><ellipse cx="32" cy="41" rx="5" ry="7" fill="#fff" stroke="#1f1f1f" stroke-width="3"/></svg>`,
      tired: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#60a5fa" stroke="#1f1f1f" stroke-width="4"/><path d="M20 29h8M36 29h8" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/><path d="M24 41c2 1 5 2 8 2s6-1 8-2" fill="none" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/></svg>`,
      excited: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#fdba74" stroke="#1f1f1f" stroke-width="4"/><path d="M20 28l5 3 4-5M39 26l4 5 5-3" fill="none" stroke="#1f1f1f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 38c4 5 7 7 10 7s6-2 10-7" fill="none" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/></svg>`,
      calm: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#86efac" stroke="#1f1f1f" stroke-width="4"/><circle cx="24" cy="28" r="2.5" fill="#1f1f1f"/><circle cx="40" cy="28" r="2.5" fill="#1f1f1f"/><path d="M23 39c3 3 6 4 9 4s6-1 9-4" fill="none" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/></svg>`,
      confused: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#5eead4" stroke="#1f1f1f" stroke-width="4"/><circle cx="24" cy="29" r="3" fill="#1f1f1f"/><circle cx="40" cy="29" r="3" fill="#1f1f1f"/><path d="M23 42c2-1 4-2 7-2 4 0 6 1 11-1" fill="none" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/></svg>`,
      overwhelmed: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#f9a8d4" stroke="#1f1f1f" stroke-width="4"/><circle cx="24" cy="28" r="3" fill="#1f1f1f"/><circle cx="40" cy="28" r="3" fill="#1f1f1f"/><path d="M22 41c2 2 5 2 10 0 5-2 8-2 10 0" fill="none" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/></svg>`
    };
    return svgs[feelingId] || svgs.happy;
  }

  function getCustomGraphicSvg(group, rawKey) {
    const key = normaliseIconValue(rawKey, group === "reward" ? "gift" : group === "calendar" ? "home" : group === "family" ? "family" : "other");
    const common = {stroke: '#1f1f1f'};
    const svgs = {
      reward: {
        story: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="12" width="36" height="40" rx="5" fill="#60a5fa" stroke="#1f1f1f" stroke-width="4"/><path d="M24 18h16M24 26h16M24 34h12" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/></svg>`,
        treat: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M20 26c0-6 5-10 12-10s12 4 12 10-4 10-12 10-12-4-12-10Z" fill="#f59e0b" stroke="#1f1f1f" stroke-width="4"/><path d="M24 35h16l-3 12H27Z" fill="#f97316" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        park: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M18 18h10v10H18zM36 18h10v10H36z" fill="#22c55e" stroke="#1f1f1f" stroke-width="4"/><path d="M23 28v18M41 28v18" stroke="#1f1f1f" stroke-width="4"/><path d="M23 30c3 8 8 14 18 16" fill="none" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"/></svg>`,
        gift: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="24" width="36" height="26" rx="4" fill="#fb7185" stroke="#1f1f1f" stroke-width="4"/><rect x="12" y="20" width="40" height="10" rx="3" fill="#fda4af" stroke="#1f1f1f" stroke-width="4"/><path d="M32 20v30M14 34h36" stroke="#ffffff" stroke-width="4"/><path d="M32 18c-2-8-12-8-12-1 0 5 6 5 12 3Zm0 0c2-8 12-8 12-1 0 5-6 5-12 3Z" fill="#fde68a" stroke="#1f1f1f" stroke-width="3"/></svg>`,
        game: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="22" width="40" height="20" rx="10" fill="#a78bfa" stroke="#1f1f1f" stroke-width="4"/><path d="M24 28v8M20 32h8M40 30h0M46 34h0" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/></svg>`,
        toy: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="8" fill="#fbbf24" stroke="#1f1f1f" stroke-width="4"/><circle cx="42" cy="22" r="8" fill="#60a5fa" stroke="#1f1f1f" stroke-width="4"/><circle cx="22" cy="42" r="8" fill="#34d399" stroke="#1f1f1f" stroke-width="4"/><circle cx="42" cy="42" r="8" fill="#f472b6" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        outing: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M18 44 32 18 46 44Z" fill="#22c55e" stroke="#1f1f1f" stroke-width="4"/><path d="M14 46h36" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/><circle cx="46" cy="18" r="6" fill="#fde047" stroke="#1f1f1f" stroke-width="3"/></svg>`,
        star: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><polygon points="32,12 37,25 51,26 40,35 44,49 32,41 20,49 24,35 13,26 27,25" fill="#facc15" stroke="#1f1f1f" stroke-width="4" stroke-linejoin="round"/></svg>`
      },
      family: {
        child: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="22" r="10" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="4"/><path d="M20 50c2-10 8-16 12-16s10 6 12 16" fill="#60a5fa" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        parent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="20" r="11" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="4"/><path d="M18 50c2-12 8-18 14-18s12 6 14 18" fill="#a78bfa" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        mum: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="21" r="10" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="4"/><path d="M21 22c0-9 22-9 22 0" fill="#7c3aed" stroke="#1f1f1f" stroke-width="4"/><path d="M18 50c2-10 8-16 14-16s12 6 14 16" fill="#f472b6" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        dad: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="21" r="10" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="4"/><path d="M21 20c2-8 20-8 22 0" fill="#92400e" stroke="#1f1f1f" stroke-width="4"/><path d="M18 50c2-10 8-16 14-16s12 6 14 16" fill="#60a5fa" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        sibling: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="22" r="10" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="4"/><path d="M18 50c2-10 8-16 14-16s12 6 14 16" fill="#34d399" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        grandparent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="21" r="10" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="4"/><path d="M21 20c2-6 20-6 22 0" fill="#d1d5db" stroke="#1f1f1f" stroke-width="4"/><path d="M18 50c2-10 8-16 14-16s12 6 14 16" fill="#94a3b8" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        family: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="24" r="7" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="3"/><circle cx="42" cy="24" r="7" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="3"/><circle cx="32" cy="18" r="7" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="3"/><path d="M14 48c2-8 6-12 8-12 5 0 6 2 10 2s5-2 10-2c2 0 6 4 8 12" fill="#86efac" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        school: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M14 26 32 14l18 12v22H14Z" fill="#facc15" stroke="#1f1f1f" stroke-width="4" stroke-linejoin="round"/><path d="M28 46V34h8v12M22 28h5M37 28h5" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/></svg>`,
        childcare: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="7" fill="#fbbf24" stroke="#1f1f1f" stroke-width="4"/><circle cx="42" cy="22" r="7" fill="#60a5fa" stroke="#1f1f1f" stroke-width="4"/><path d="M20 42c2-6 6-10 12-10s10 4 12 10" fill="#f472b6" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        heart: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 52 14 34c-5-6-4-16 4-20 5-2 10 0 14 5 4-5 9-7 14-5 8 4 9 14 4 20Z" fill="#fb7185" stroke="#1f1f1f" stroke-width="4" stroke-linejoin="round"/></svg>`,
        other: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="22" r="10" fill="#e5e7eb" stroke="#1f1f1f" stroke-width="4"/><path d="M18 50c2-10 8-16 14-16s12 6 14 16" fill="#9ca3af" stroke="#1f1f1f" stroke-width="4"/></svg>`
      },
      calendar: {
        home: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M14 28 32 15l18 13v20H14Z" fill="#60a5fa" stroke="#1f1f1f" stroke-width="4" stroke-linejoin="round"/><path d="M28 48V35h8v13" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/></svg>`,
        mum: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="20" r="10" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="4"/><path d="M18 50c2-10 8-16 14-16s12 6 14 16" fill="#f472b6" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        dad: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="20" r="10" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="4"/><path d="M18 50c2-10 8-16 14-16s12 6 14 16" fill="#60a5fa" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        family: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="24" r="7" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="3"/><circle cx="42" cy="24" r="7" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="3"/><path d="M16 48c2-8 7-12 10-12 3 0 4 1 6 1s3-1 6-1 8 4 10 12" fill="#86efac" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        school: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M14 26 32 14l18 12v22H14Z" fill="#facc15" stroke="#1f1f1f" stroke-width="4"/><path d="M28 46V34h8v12" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        childcare: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="7" fill="#fbbf24" stroke="#1f1f1f" stroke-width="4"/><circle cx="42" cy="22" r="7" fill="#60a5fa" stroke="#1f1f1f" stroke-width="4"/><path d="M20 42c2-6 6-10 12-10s10 4 12 10" fill="#f472b6" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        grandparent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="20" r="10" fill="#fcd7b6" stroke="#1f1f1f" stroke-width="4"/><path d="M18 50c2-10 8-16 14-16s12 6 14 16" fill="#94a3b8" stroke="#1f1f1f" stroke-width="4"/></svg>`,
        travel: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M14 40h36l-4-10c-1-3-3-5-7-5H28c-4 0-6 2-8 5l-6 10Z" fill="#ef4444" stroke="#1f1f1f" stroke-width="4"/><circle cx="22" cy="49" r="5" fill="#1f2937"/><circle cx="44" cy="49" r="5" fill="#1f2937"/></svg>`,
        special: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 52 14 34c-5-6-4-16 4-20 5-2 10 0 14 5 4-5 9-7 14-5 8 4 9 14 4 20Z" fill="#fb7185" stroke="#1f1f1f" stroke-width="4"/><circle cx="32" cy="32" r="4" fill="#fde68a" stroke="#1f1f1f" stroke-width="2"/></svg>`,
        other: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="20" fill="#e5e7eb" stroke="#1f1f1f" stroke-width="4"/><path d="M32 21v14" stroke="#1f1f1f" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="46" r="2.8" fill="#1f1f1f"/></svg>`
      }
    };
    return (svgs[group] && svgs[group][key]) || (svgs[group] && svgs[group].other) || '';
  }

  function graphicMarkup(group, key, sizeClass = "graphic-md") {
    return `<span class="custom-graphic ${sizeClass}" aria-hidden="true">${getCustomGraphicSvg(group, key)}</span>`;
  }

  function feelingGraphicMarkup(feelingId, sizeClass = "graphic-md") {
    return `<span class="custom-graphic ${sizeClass}" aria-hidden="true">${getFeelingGraphicSvg(feelingId)}</span>`;
  }


  let parentUnlocked = false;
  let childMode = localStorage.getItem(CHILD_MODE_KEY) !== "false";
  let notificationsReady = false;
  let serviceWorkerRegistration = null;
  let editingNoteId = "";
  let editingFamilyMemberId = "";
  let currentData = getLocalData();
  let selectedCalendarDate = getDateISO();
  let timerState = getLocalTimerState();
  let timerInterval = null;
  let timerFinishedAlertShown = false;

  const $ = id => document.getElementById(id);

  const elements = {
    syncStatus: $("syncStatus"),
    headerUnlockButton: $("headerUnlockButton"),
    modeStatusPill: $("modeStatusPill"),
    profilePhotoPreview: $("profilePhotoPreview"),
    profilePhotoPlaceholder: $("profilePhotoPlaceholder"),
    profilePhotoInput: $("profilePhotoInput"),
    removeProfilePhotoButton: $("removeProfilePhotoButton"),
    pinPadBackdrop: $("pinPadBackdrop"),
    pinPadText: $("pinPadText"),
    pinBoxRow: $("pinBoxRow"),
    pinKeypad: $("pinKeypad"),
    pinPadCancelButton: $("pinPadCancelButton"),
    pinPadConfirmButton: $("pinPadConfirmButton"),
    childCoinTotal: $("childCoinTotal"),
    childNextReward: $("childNextReward"),
    childTodayLevel: $("childTodayLevel"),
    childStreakCount: $("childStreakCount"),
    feelingsGrid: $("feelingsGrid"),
    latestFeelingChild: $("latestFeelingChild"),
    parentDashboardGrid: $("parentDashboardGrid"),
    parentFeelingsList: $("parentFeelingsList"),
    rewardRequestList: $("rewardRequestList"),
    quickLogLevelSelect: $("quickLogLevelSelect"),
    quickLogCategorySelect: $("quickLogCategorySelect"),
    quickLogNoteText: $("quickLogNoteText"),
    saveQuickLogButton: $("saveQuickLogButton"),
    calendarGrid: $("calendarGrid"),
    calendarDayDetails: $("calendarDayDetails"),
    familyTodayCard: $("familyTodayCard"),
    calendarEditor: $("calendarEditor"),
    calendarDateInput: $("calendarDateInput"),
    calendarWhoInput: $("calendarWhoInput"),
    calendarIconSelect: $("calendarIconSelect"),
    calendarNoteInput: $("calendarNoteInput"),
    saveCalendarEntryButton: $("saveCalendarEntryButton"),
    deleteCalendarEntryButton: $("deleteCalendarEntryButton"),
    familyTreeDisplay: $("familyTreeDisplay"),
    familyTreeEditor: $("familyTreeEditor"),
    familyRelationshipInput: $("familyRelationshipInput"),
    familyNameInput: $("familyNameInput"),
    familyIconInput: $("familyIconInput"),
    familyBranchSelect: $("familyBranchSelect"),
    familyDescriptionInput: $("familyDescriptionInput"),
    addFamilyMemberButton: $("addFamilyMemberButton"),
    cancelFamilyEditButton: $("cancelFamilyEditButton"),
    familyMemberEditorList: $("familyMemberEditorList"),
    timerRing: $("timerRing"),
    timerCharacter: $("timerCharacter"),
    timerTime: $("timerTime"),
    timerStatus: $("timerStatus"),
    startBreathingButton: $("startBreathingButton"),
    stopBreathingButton: $("stopBreathingButton"),
    breathingOrb: $("breathingOrb"),
    breathingText: $("breathingText"),
    breathingHelper: $("breathingHelper"),
    toolMessage: $("toolMessage"),
    startTimerButton: $("startTimerButton"),
    pauseTimerButton: $("pauseTimerButton"),
    resetTimerButton: $("resetTimerButton"),
    customTimerMinutes: $("customTimerMinutes"),
    setCustomTimerButton: $("setCustomTimerButton"),
    parentPageUnlockButton: $("parentPageUnlockButton"),
    settingsUnlockButton: $("settingsUnlockButton"),
    lockStatus: $("lockStatus"),

    themeSelect: $("themeSelect"),

    coinTotalMain: $("coinTotalMain"),
    goalDisplay: $("goalDisplay"),
    finishGoal: $("finishGoal"),
    coinProgress: $("coinProgress"),
    progressCharacter: $("progressCharacter"),
    nextRewardText: $("nextRewardText"),

    deduct5Button: $("deduct5Button"),
    deduct10Button: $("deduct10Button"),
    deduct50Button: $("deduct50Button"),
    add5Button: $("add5Button"),
    add10Button: $("add10Button"),
    add50Button: $("add50Button"),
    resetCoinsButton: $("resetCoinsButton"),

    enableNotificationsButton: $("enableNotificationsButton"),
    settingsEnableNotificationsButton: $("settingsEnableNotificationsButton"),
    notificationStatus: $("notificationStatus"),
    settingsNotificationStatus: $("settingsNotificationStatus"),

    streakCount: $("streakCount"),
    bestStreak: $("bestStreak"),
    streakMessage: $("streakMessage"),

    todayLevelPill: $("todayLevelPill"),
    behaviourCategorySelect: $("behaviourCategorySelect"),
    behaviourReasonText: $("behaviourReasonText"),
    redLight: $("redLight"),
    amberLight: $("amberLight"),
    greenLight: $("greenLight"),
    redLabel: $("redLabel"),
    amberLabel: $("amberLabel"),
    greenLabel: $("greenLabel"),
    redCoinValue: $("redCoinValue"),
    greenCoinValue: $("greenCoinValue"),
    resetTodayButton: $("resetTodayButton"),

    treatCard: $("treatCard"),
    prizeDropIcon: $("prizeDropIcon"),
    prizeDropName: $("prizeDropName"),
    treatSubtitle: $("treatSubtitle"),
    treatResetNote: $("treatResetNote"),
    collectPrizeButton: $("collectPrizeButton"),

    rewardsList: $("rewardsList"),

    parentLockedPanel: $("parentLockedPanel"),
    parentUnlockedContent: $("parentUnlockedContent"),
    noteAuthor: $("noteAuthor"),
    noteCategorySelect: $("noteCategorySelect"),
    parentNoteText: $("parentNoteText"),
    addParentNoteButton: $("addParentNoteButton"),
    noteFilterSelect: $("noteFilterSelect"),
    parentNotesList: $("parentNotesList"),

    rewardIconInput: $("rewardIconInput"),
    rewardNameInput: $("rewardNameInput"),
    rewardCostInput: $("rewardCostInput"),
    addRewardButton: $("addRewardButton"),
    rewardEditorList: $("rewardEditorList"),

    newCategoryInput: $("newCategoryInput"),
    addCategoryButton: $("addCategoryButton"),
    categoryList: $("categoryList"),

    historyFilterSelect: $("historyFilterSelect"),
    historyList: $("historyList"),
    clearHistoryButton: $("clearHistoryButton"),

    reportSummary: $("reportSummary"),
    levelChart: $("levelChart"),
    coinChart: $("coinChart"),
    noteChart: $("noteChart"),
    copyWeeklyReportButton: $("copyWeeklyReportButton"),

    settingsLockedPanel: $("settingsLockedPanel"),
    settingsUnlockedContent: $("settingsUnlockedContent"),
    goalInput: $("goalInput"),
    greenCoinsInput: $("greenCoinsInput"),
    redCoinsInput: $("redCoinsInput"),
    saveCoinSettingsButton: $("saveCoinSettingsButton"),
    newPinInput: $("newPinInput"),
    changePinButton: $("changePinButton"),


    exportDataButton: $("exportDataButton"),
    clearAllDataButton: $("clearAllDataButton")
  };

  function getDateISO(date = new Date()) {
    // Use the phone's local date, not UTC.
    // toISOString() can shift the app back a day after midnight in the UK,
    // which made the calendar show one day while selecting another.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDateTime(date = new Date()) {
    return date.toLocaleString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function getDefaultData() {
    const today = getDateISO();

    return {
      coinTotal: 0,
      today: {
        date: today,
        level: "amber",
        category: "General",
        reason: ""
      },
      history: [],
      parentNotes: [],
      rewards: DEFAULT_REWARDS,
      rewardRequests: [],
      feelingLogs: [],
      familyCalendar: [],
      familyTree: DEFAULT_FAMILY_MEMBERS,
      categories: DEFAULT_CATEGORIES,
      streak: {
        current: 0,
        best: 0,
        lastGreenDate: ""
      },
      settings: {
        goal: 1000,
        greenCoins: 50,
        redCoins: 50,
        dailyResetLevel: "amber"
      },
      celebration: {
        active: false,
        id: "",
        theme: "plain"
      }
    };
  }

  function normalizeSettings(settings = {}) {
    return {
      goal: Math.max(50, Math.min(10000, Number(settings.goal) || 1000)),
      greenCoins: Math.max(0, Math.min(1000, Number(settings.greenCoins) || 50)),
      redCoins: Math.max(0, Math.min(1000, Number(settings.redCoins) || 50)),
      dailyResetLevel: ["red", "amber", "green"].includes(settings.dailyResetLevel) ? settings.dailyResetLevel : "amber"
    };
  }

  function normalizeRewards(rewards) {
    const source = Array.isArray(rewards) && rewards.length ? rewards : DEFAULT_REWARDS;

    return source
      .filter(reward => reward && typeof reward === "object")
      .map(reward => ({
        id: reward.id || `reward-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        icon: normaliseIconValue(reward.icon, "gift"),
        name: String(reward.name || "Reward").slice(0, 60),
        cost: Math.max(1, Math.min(10000, Number(reward.cost) || 100))
      }))
      .filter(reward => reward.name.trim())
      .slice(0, 50);
  }

  function normalizeRewardRequests(requests) {
    if (!Array.isArray(requests)) {
      return [];
    }

    return requests
      .filter(request => request && typeof request === "object")
      .map(request => ({
        id: request.id || `request-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        rewardId: request.rewardId || "",
        rewardName: String(request.rewardName || "Reward").slice(0, 80),
        rewardIcon: normaliseIconValue(request.rewardIcon, "gift"),
        rewardCost: Math.max(1, Number(request.rewardCost) || 1),
        status: ["pending", "approved", "rejected"].includes(request.status) ? request.status : "pending",
        requestedAt: request.requestedAt || "",
        requestedDateISO: request.requestedDateISO || "",
        resolvedAt: request.resolvedAt || "",
        resolvedBy: request.resolvedBy || ""
      }))
      .slice(0, 100);
  }

  function normalizeFeelingLogs(feelingLogs) {
    if (!Array.isArray(feelingLogs)) {
      return [];
    }

    return feelingLogs
      .filter(log => log && typeof log === "object")
      .map(log => ({
        id: log.id || `feeling-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        feelingId: log.feelingId || "",
        label: String(log.label || "Feeling").slice(0, 40),
        emoji: String(log.emoji || "🙂").slice(0, 4),
        colour: String(log.colour || "yellow").slice(0, 20),
        dateISO: log.dateISO || "",
        dateText: log.dateText || "",
        savedAt: log.savedAt || ""
      }))
      .filter(log => log.feelingId && log.label)
      .slice(0, 250);
  }

  function normalizeFamilyCalendar(calendarEntries) {
    if (!Array.isArray(calendarEntries)) {
      return [];
    }

    return calendarEntries
      .filter(entry => entry && typeof entry === "object")
      .map(entry => ({
        id: entry.id || `calendar-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        dateISO: entry.dateISO || "",
        who: String(entry.who || "").slice(0, 50),
        icon: normaliseIconValue(entry.icon, "home"),
        note: String(entry.note || "").slice(0, 300),
        updatedAt: entry.updatedAt || ""
      }))
      .filter(entry => entry.dateISO && entry.who.trim())
      .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
      .slice(0, 365);
  }

  function normalizeFamilyTree(familyTree) {
    const source = Array.isArray(familyTree) && familyTree.length ? familyTree : DEFAULT_FAMILY_MEMBERS;

    return source
      .filter(member => member && typeof member === "object")
      .map(member => ({
        id: member.id || `family-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        icon: normaliseIconValue(member.icon, "family"),
        relationship: String(member.relationship || "Family").slice(0, 40),
        name: String(member.name || "Family").slice(0, 60),
        branch: String(member.branch || "Other family").slice(0, 40),
        description: String(member.description || "").slice(0, 300)
      }))
      .filter(member => member.name.trim() && member.relationship.trim())
      .slice(0, 80);
  }

  function normalizeCategories(categories) {
    const list = Array.isArray(categories) && categories.length ? categories : DEFAULT_CATEGORIES;
    const clean = list
      .map(category => String(category || "").trim())
      .filter(Boolean)
      .slice(0, 60);

    return [...new Set(clean.length ? clean : DEFAULT_CATEGORIES)];
  }

  function normalizeNotes(notes) {
    if (!Array.isArray(notes)) {
      return [];
    }

    return notes
      .filter(note => note && typeof note === "object")
      .map(note => ({
        id: note.id || `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        author: String(note.author || "Parent").slice(0, 40),
        category: String(note.category || "General").slice(0, 40),
        text: String(note.text || "").slice(0, 1500),
        dateText: note.dateText || "",
        dateISO: note.dateISO || "",
        savedAt: note.savedAt || ""
      }))
      .filter(note => note.text.trim())
      .slice(0, 250);
  }

  function normalizeHistory(history) {
    if (!Array.isArray(history)) {
      return [];
    }

    return history
      .filter(item => item && typeof item === "object")
      .map(item => ({
        id: item.id || `history-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: item.type || "general",
        level: item.level || "",
        category: item.category || "",
        text: String(item.text || "").slice(0, 500),
        coinChange: Number(item.coinChange) || 0,
        coinsAfter: Math.max(0, Number(item.coinsAfter) || 0),
        dateISO: item.dateISO || getDateISO(),
        dateText: item.dateText || "",
        savedAt: item.savedAt || ""
      }))
      .slice(0, 500);
  }

  function normalizeData(data) {
    const defaults = getDefaultData();
    const settings = normalizeSettings(data?.settings || defaults.settings);
    const todayDate = data?.today?.date || getDateISO();

    return {
      coinTotal: Math.max(0, Number(data?.coinTotal) || 0),
      today: {
        date: todayDate,
        level: ["red", "amber", "green"].includes(data?.today?.level) ? data.today.level : "amber",
        category: data?.today?.category || "General",
        reason: data?.today?.reason || ""
      },
      history: normalizeHistory(data?.history),
      parentNotes: normalizeNotes(data?.parentNotes),
      rewards: normalizeRewards(data?.rewards),
      rewardRequests: normalizeRewardRequests(data?.rewardRequests),
      feelingLogs: normalizeFeelingLogs(data?.feelingLogs),
      familyCalendar: normalizeFamilyCalendar(data?.familyCalendar),
      familyTree: normalizeFamilyTree(data?.familyTree),
      categories: normalizeCategories(data?.categories),
      streak: {
        current: Math.max(0, Number(data?.streak?.current) || 0),
        best: Math.max(0, Number(data?.streak?.best) || 0),
        lastGreenDate: data?.streak?.lastGreenDate || ""
      },
      settings,
      celebration: {
        active: Boolean(data?.celebration?.active),
        id: data?.celebration?.id || "",
        theme: data?.celebration?.theme || getCurrentTheme()
      }
    };
  }

  function getLocalData() {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      return normalizeData(raw ? JSON.parse(raw) : getDefaultData());
    } catch (error) {
      console.error(error);
      return getDefaultData();
    }
  }

  function storeLocalData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(normalizeData(data)));
  }

  function getParentPin() {
    return localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
  }

  function askForParentPin(actionText = "continue") {
    return new Promise(resolve => {
      if (!elements.pinPadBackdrop || !elements.pinKeypad || !elements.pinBoxRow) {
        resolve(window.prompt(`Enter parent PIN to ${actionText}:`));
        return;
      }

      let enteredPin = "";
      const pinLength = Math.max(4, Math.min(8, getParentPin().length || 4));

      const renderBoxes = () => {
        elements.pinBoxRow.innerHTML = "";

        for (let index = 0; index < pinLength; index += 1) {
          const box = document.createElement("span");
          box.className = "pin-box";

          if (enteredPin.length > index) {
            box.classList.add("filled");
            box.textContent = "•";
          }

          if (enteredPin.length === index) {
            box.classList.add("active");
          }

          elements.pinBoxRow.appendChild(box);
        }

        if (enteredPin.length > pinLength) {
          const extra = document.createElement("span");
          extra.className = "pin-extra";
          extra.textContent = `+${enteredPin.length - pinLength}`;
          elements.pinBoxRow.appendChild(extra);
        }
      };

      const cleanup = () => {
        elements.pinPadBackdrop.hidden = true;
        elements.pinKeypad.removeEventListener("click", onKeypadClick);
        elements.pinPadCancelButton.removeEventListener("click", onCancel);
        elements.pinPadConfirmButton.removeEventListener("click", onConfirm);
      };

      const onConfirm = () => {
        const value = enteredPin;
        cleanup();
        resolve(value);
      };

      const onCancel = () => {
        cleanup();
        resolve(null);
      };

      const onKeypadClick = event => {
        const button = event.target.closest("button");

        if (!button) {
          return;
        }

        const digit = button.dataset.pinDigit;
        const action = button.dataset.pinAction;

        if (digit !== undefined && enteredPin.length < 12) {
          enteredPin += digit;
        }

        if (action === "delete") {
          enteredPin = enteredPin.slice(0, -1);
        }

        if (action === "clear") {
          enteredPin = "";
        }

        renderBoxes();
      };

      elements.pinPadText.textContent = `Enter parent PIN to ${actionText}`;
      elements.pinPadBackdrop.hidden = false;
      renderBoxes();

      elements.pinKeypad.addEventListener("click", onKeypadClick);
      elements.pinPadCancelButton.addEventListener("click", onCancel);
      elements.pinPadConfirmButton.addEventListener("click", onConfirm);
    });
  }

  async function verifyParentPin(actionText = "continue") {
    if (parentUnlocked) {
      return true;
    }

    const pin = await askForParentPin(actionText);

    if (pin === null) {
      return false;
    }

    if (pin === getParentPin()) {
      parentUnlocked = true;

      if (childMode) {
        childMode = false;
        localStorage.setItem(CHILD_MODE_KEY, "false");
      }

      updateParentLockDisplay();
      return true;
    }

    alert("Wrong PIN.");
    return false;
  }

  function getCurrentTheme() {
    return localStorage.getItem(THEME_KEY) || "plain";
  }

  function getThemeGraphicSvg(theme = getCurrentTheme()) {
    const svgs = {
      plain: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#2563eb" stroke="#1f1f1f" stroke-width="4"/><polygon points="32,15 36.8,26 49,27.2 39.8,35.2 42.8,47 32,40.4 21.2,47 24.2,35.2 15,27.2 27.2,26" fill="#f8fafc" stroke="#1f1f1f" stroke-width="2" stroke-linejoin="round"/></svg>`,
      mario: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M14 32c0-10 8-17 18-17s18 7 18 17H14Z" fill="#ef4444" stroke="#1f1f1f" stroke-width="4"/><path d="M20 31h24v8c0 7-5 12-12 12s-12-5-12-12v-8Z" fill="#fde68a" stroke="#1f1f1f" stroke-width="4"/><circle cx="26" cy="28" r="3" fill="#fff"/><circle cx="38" cy="24" r="3" fill="#fff"/></svg>`,
      space: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g transform="translate(32 32) rotate(25) translate(-32 -32)"><path d="M32 10c8 6 10 15 10 23 0 10-5 18-10 21-5-3-10-11-10-21 0-8 2-17 10-23Z" fill="#60a5fa" stroke="#1f1f1f" stroke-width="4"/><circle cx="32" cy="28" r="5" fill="#dbeafe" stroke="#1f1f1f" stroke-width="3"/><path d="M23 38 16 44 20 33Z" fill="#f97316" stroke="#1f1f1f" stroke-width="3"/><path d="M41 38 48 44 44 33Z" fill="#f97316" stroke="#1f1f1f" stroke-width="3"/><path d="M28 48h8l-4 8Z" fill="#facc15" stroke="#1f1f1f" stroke-width="3"/></g></svg>`,
      minecraft: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="16" width="44" height="32" rx="2" fill="#8b5a3c" stroke="#1f1f1f" stroke-width="4"/><rect x="10" y="16" width="44" height="12" rx="2" fill="#55bf4b" stroke="#1f1f1f" stroke-width="4"/><rect x="20" y="30" width="8" height="8" fill="#5cae40"/><rect x="28" y="26" width="8" height="8" fill="#6a4a32"/><rect x="36" y="32" width="8" height="8" fill="#5cae40"/></svg>`,
      bunny: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="6" width="10" height="24" rx="5" fill="#fff" stroke="#1f1f1f" stroke-width="3"/><rect x="36" y="6" width="10" height="24" rx="5" fill="#fff" stroke="#1f1f1f" stroke-width="3"/><rect x="21" y="10" width="4" height="16" rx="2" fill="#f9a8d4"/><rect x="39" y="10" width="4" height="16" rx="2" fill="#f9a8d4"/><circle cx="32" cy="38" r="16" fill="#fff" stroke="#1f1f1f" stroke-width="4"/><circle cx="26" cy="36" r="2.4" fill="#1f1f1f"/><circle cx="38" cy="36" r="2.4" fill="#1f1f1f"/><path d="M28 44c2 2 6 2 8 0" fill="none" stroke="#1f1f1f" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="40" r="2.5" fill="#fda4af"/></svg>`,
      princess: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M14 22 22 34 32 18 42 34 50 22l4 24H10l4-24Z" fill="#f472b6" stroke="#1f1f1f" stroke-width="4" stroke-linejoin="round"/><circle cx="22" cy="22" r="3" fill="#fde68a" stroke="#1f1f1f" stroke-width="2"/><circle cx="32" cy="16" r="3" fill="#93c5fd" stroke="#1f1f1f" stroke-width="2"/><circle cx="42" cy="22" r="3" fill="#c4b5fd" stroke="#1f1f1f" stroke-width="2"/><rect x="16" y="42" width="32" height="8" rx="3" fill="#fbcfe8" stroke="#1f1f1f" stroke-width="3"/></svg>`,
      football: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="22" fill="#fff" stroke="#1f1f1f" stroke-width="4"/><polygon points="32,21 38,25 36,32 28,32 26,25" fill="#1f1f1f"/><path d="M32 10 40 15 50 18 54 30 50 42 40 49 32 54 24 49 14 42 10 30 14 18 24 15Z" fill="none" stroke="#1f1f1f" stroke-width="2" opacity=".55"/></svg>`,
      car: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M14 38h36l-4-10c-1-3-3-5-7-5H28c-4 0-6 2-8 5l-6 10Z" fill="#ef4444" stroke="#1f1f1f" stroke-width="4" stroke-linejoin="round"/><rect x="16" y="38" width="34" height="10" rx="4" fill="#f87171" stroke="#1f1f1f" stroke-width="4"/><path d="M26 24h10c3 0 5 1 6 4l2 5H22l2-5c1-3 3-4 6-4Z" fill="#dbeafe" stroke="#1f1f1f" stroke-width="3"/><circle cx="22" cy="50" r="6" fill="#1f2937"/><circle cx="44" cy="50" r="6" fill="#1f2937"/><circle cx="22" cy="50" r="2.5" fill="#e5e7eb"/><circle cx="44" cy="50" r="2.5" fill="#e5e7eb"/></svg>`,
      blue: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 10 48 22v18L32 54 16 40V22l16-12Z" fill="#60a5fa" stroke="#1f1f1f" stroke-width="4" stroke-linejoin="round"/><path d="M32 17 42 24v12l-10 7-10-7V24l10-7Z" fill="#dbeafe" opacity=".85"/><path d="M21 25h22" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity=".8"/></svg>`,
      flower: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="7" fill="#facc15" stroke="#1f1f1f" stroke-width="3"/><circle cx="32" cy="18" r="8" fill="#fb7185" stroke="#1f1f1f" stroke-width="3"/><circle cx="46" cy="32" r="8" fill="#f9a8d4" stroke="#1f1f1f" stroke-width="3"/><circle cx="32" cy="46" r="8" fill="#fb7185" stroke="#1f1f1f" stroke-width="3"/><circle cx="18" cy="32" r="8" fill="#f9a8d4" stroke="#1f1f1f" stroke-width="3"/><path d="M32 39v14" stroke="#16a34a" stroke-width="4" stroke-linecap="round"/></svg>`
    };
    return svgs[theme] || svgs.plain;
  }

  function renderThemeGraphicElement(element, theme = getCurrentTheme(), className = "") {
    if (!element) return;
    element.innerHTML = `<span class="theme-svg-wrap ${className}">${getThemeGraphicSvg(theme)}</span>`;
  }

  function renderThemeDecorations() {
    renderThemeGraphicElement(document.querySelector('.princess-art'), 'princess');
    renderThemeGraphicElement(document.querySelector('.football-art'), 'football');
    renderThemeGraphicElement(document.querySelector('.car-theme-art'), 'car');
    renderThemeGraphicElement(document.querySelector('.blue-theme-art'), 'blue');
    renderThemeGraphicElement(document.querySelector('.flower-theme-art'), 'flower');
  }

  function setTheme(theme) {
    const allowed = ["plain", "mario", "space", "minecraft", "bunny", "princess", "football", "car", "blue", "flower"];
    const safeTheme = allowed.includes(theme) ? theme : "plain";
    document.documentElement.dataset.theme = safeTheme;
    localStorage.setItem(THEME_KEY, safeTheme);

    if (elements.themeSelect) {
      elements.themeSelect.value = safeTheme;
    }

    updateProgressCharacter();
    updatePrizeDetails();
    updateTimerDisplay();
    renderThemeDecorations();
  }

  function applyDailyReset(data) {
    const today = getDateISO();
    const next = normalizeData(data);

    if (next.today.date !== today) {
      next.today = {
        date: today,
        level: next.settings.dailyResetLevel,
        category: "General",
        reason: ""
      };
    }

    return next;
  }

  async function saveData(data) {
    const next = applyDailyReset(normalizeData(data));
    currentData = next;
    storeLocalData(next);
    updateDisplay();
    setSyncStatus("Saved on this device", "offline");
  }

  async function getLatestData() {
    return normalizeData(currentData);
  }

  function setSyncStatus(text, className = "") {
    if (!elements.syncStatus) {
      return;
    }

    elements.syncStatus.textContent = text;
    elements.syncStatus.className = `sync-pill ${className}`.trim();
  }

  function addHistoryEntry(data, entry) {
    const now = new Date();
    data.history = normalizeHistory(data.history);
    data.history.unshift({
      id: `history-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: entry.type || "general",
      level: entry.level || "",
      category: entry.category || "",
      text: entry.text || "",
      coinChange: Number(entry.coinChange) || 0,
      coinsAfter: Math.max(0, Number(entry.coinsAfter) || 0),
      dateISO: getDateISO(now),
      dateText: formatDateTime(now),
      savedAt: now.toISOString()
    });
    data.history = data.history.slice(0, 500);
  }

  function getPrizeDetails(theme = getCurrentTheme()) {
    if (theme === "space") return { icon: "🪐", name: "SPACE TROPHY", subtitle: "Mission complete!" };
    if (theme === "minecraft") return { icon: "💎", name: "DIAMOND PRIZE", subtitle: "Build complete!" };
    if (theme === "bunny") return { icon: "🐰", name: "BUNNY BADGE", subtitle: "Hop, hop, hooray!" };
    if (theme === "mario") return { icon: "🌟", name: "SUPER STAR PRIZE", subtitle: "Goal reached!" };
    if (theme === "princess") return { icon: "👑", name: "PRINCESS PRIZE", subtitle: "Royal job!" };
    if (theme === "football") return { icon: "⚽", name: "MATCH WIN", subtitle: "Top scorer!" };
    if (theme === "car") return { icon: "🏁", name: "RACE WINNER", subtitle: "Zoom to the goal!" };
    if (theme === "blue") return { icon: "💙", name: "BLUE RIBBON", subtitle: "Amazing work!" };
    if (theme === "flower") return { icon: "🌸", name: "FLOWER PRIZE", subtitle: "Blooming brilliant!" };
    return { icon: "🏆", name: "GOAL REACHED", subtitle: "Goal reached!" };
  }

  function startCelebrationIfNeeded(data) {
    const goal = data.settings.goal;

    if (data.coinTotal >= goal && !data.celebration.active) {
      data.celebration = {
        active: true,
        id: `celebration-${Date.now()}`,
        theme: getCurrentTheme()
      };

      addHistoryEntry(data, {
        type: "prize",
        level: "prize",
        text: `Prize reached at ${goal} coins`,
        coinChange: 0,
        coinsAfter: data.coinTotal
      });

      showPhoneNotification("Prize reached!", {
        body: `Your child reached ${goal} coins.`,
        tag: "child-prize"
      }).catch(console.error);
    }
  }

  async function adjustCoins(amount) {
    if (childMode) {
      alert("Enter Parent Mode to change coins.");
      return;
    }

    if (!await verifyParentPin("change coins")) {
      return;
    }

    const data = await getLatestData();
    const before = data.coinTotal;
    data.coinTotal = Math.max(0, before + amount);
    const actualChange = data.coinTotal - before;

    if (actualChange === 0) {
      return;
    }

    addHistoryEntry(data, {
      type: "coin",
      level: actualChange > 0 ? "gain" : "loss",
      text: actualChange > 0 ? `Manual coin gain: +${actualChange}` : `Manual coin loss: ${actualChange}`,
      coinChange: actualChange,
      coinsAfter: data.coinTotal
    });

    startCelebrationIfNeeded(data);
    await saveData(data);
  }

  async function setLevel(level) {
    if (childMode) {
      alert("Enter Parent Mode to change today's level.");
      return;
    }

    if (!await verifyParentPin("change today's level")) {
      return;
    }

    const data = await getLatestData();
    const today = getDateISO();

    if (data.today.date !== today) {
      data.today = {
        date: today,
        level: "amber",
        category: "General",
        reason: ""
      };
    }

    const previousLevel = data.today.level;

    if (previousLevel === level) {
      return;
    }

    if (level === "green" && previousLevel !== "amber") {
      alert("Go to amber before green.");
      return;
    }

    const category = elements.behaviourCategorySelect?.value || "General";
    const reason = elements.behaviourReasonText?.value.trim() || "";
    let coinChange = 0;
    let text = "";

    if (level === "green" && previousLevel === "amber") {
      coinChange = data.settings.greenCoins;
      text = `Moved to GREEN: +${coinChange} coins`;
    } else if (level === "red" && previousLevel !== "red") {
      coinChange = -data.settings.redCoins;
      text = `Moved to RED: -${data.settings.redCoins} coins`;
    } else if (level === "amber") {
      text = "Moved to AMBER";
    } else {
      text = `Moved to ${level.toUpperCase()}`;
    }

    const before = data.coinTotal;
    data.coinTotal = Math.max(0, before + coinChange);
    const actualChange = data.coinTotal - before;

    data.today = {
      date: today,
      level,
      category,
      reason
    };

    if (level === "green" && data.streak.lastGreenDate !== today) {
      data.streak.current += 1;
      data.streak.best = Math.max(data.streak.best, data.streak.current);
      data.streak.lastGreenDate = today;
    }

    if (level === "red") {
      data.streak.current = 0;
    }

    addHistoryEntry(data, {
      type: "level",
      level,
      category,
      text: reason ? `${text}. ${reason}` : text,
      coinChange: actualChange,
      coinsAfter: data.coinTotal
    });

    if (elements.behaviourReasonText) {
      elements.behaviourReasonText.value = "";
    }

    startCelebrationIfNeeded(data);
    await saveData(data);
  }

  async function resetToday() {
    if (!await verifyParentPin("reset today")) {
      return;
    }

    const data = await getLatestData();
    data.today = {
      date: getDateISO(),
      level: "amber",
      category: "General",
      reason: ""
    };

    addHistoryEntry(data, {
      type: "level",
      level: "amber",
      category: "General",
      text: "Today reset to amber",
      coinChange: 0,
      coinsAfter: data.coinTotal
    });

    await saveData(data);
  }

  async function resetCoins() {
    if (!await verifyParentPin("reset coins")) {
      return;
    }

    if (!confirm("Reset coins to 0?")) {
      return;
    }

    const data = await getLatestData();
    const before = data.coinTotal;
    data.coinTotal = 0;
    data.celebration = {
      active: false,
      id: "",
      theme: getCurrentTheme()
    };

    addHistoryEntry(data, {
      type: "coin",
      level: "reset",
      text: "Coins reset to 0",
      coinChange: -before,
      coinsAfter: 0
    });

    await saveData(data);
  }

  async function collectPrize() {
    if (!await verifyParentPin("collect the prize")) {
      return;
    }

    const data = await getLatestData();
    const before = data.coinTotal;
    data.coinTotal = 0;
    data.celebration = {
      active: false,
      id: "",
      theme: getCurrentTheme()
    };

    addHistoryEntry(data, {
      type: "reward",
      level: "prize",
      text: "Prize collected. Coins reset to 0",
      coinChange: -before,
      coinsAfter: 0
    });

    await saveData(data);
  }

  async function logFeeling(feelingId) {
    const feeling = FEELINGS.find(item => item.id === feelingId);

    if (!feeling) {
      return;
    }

    const data = await getLatestData();
    const now = new Date();

    data.feelingLogs = normalizeFeelingLogs(data.feelingLogs);

    data.feelingLogs.unshift({
      id: `feeling-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      feelingId: feeling.id,
      label: feeling.label,
      emoji: feeling.emoji,
      colour: feeling.colour,
      dateISO: getDateISO(now),
      dateText: formatDateTime(now),
      savedAt: now.toISOString()
    });

    addHistoryEntry(data, {
      type: "feeling",
      level: "feeling",
      category: "Feeling",
      text: `Feeling recorded: ${feeling.label}`,
      coinChange: 0,
      coinsAfter: data.coinTotal
    });

    await saveData(data);

    await showPhoneNotification("Feeling shared", {
      body: `Your child feels ${feeling.label}`,
      tag: `feeling-${feeling.id}-${getDateISO(now)}`
    });

    alert(`You chose: ${feeling.label}`);
  }

  function updateFeelingsPage() {
    const grid = elements.feelingsGrid;

    if (!grid) {
      return;
    }

    const latest = normalizeFeelingLogs(currentData.feelingLogs)[0];

    if (elements.latestFeelingChild) {
      if (latest && latest.dateISO === getDateISO()) {
        elements.latestFeelingChild.innerHTML = `Today: ${feelingGraphicMarkup(latest.feelingId, "graphic-inline-sm")} <span>${latest.label}</span>`;
      } else {
        elements.latestFeelingChild.textContent = "No feeling chosen yet today.";
      }
    }

    grid.innerHTML = "";

    FEELINGS.forEach(feeling => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `feeling-face feeling-${feeling.colour}`;
      button.setAttribute("aria-label", feeling.label);
      button.innerHTML = `
        <span class="feeling-emoji custom-face-icon">${getFeelingGraphicSvg(feeling.id)}</span>
        <strong>${feeling.label}</strong>
      `;
      button.addEventListener("click", () => logFeeling(feeling.id));
      grid.appendChild(button);
    });
  }

  function updateParentFeelings() {
    const list = elements.parentFeelingsList;

    if (!list) {
      return;
    }

    if (!parentUnlocked) {
      list.innerHTML = "<p class='empty-notes'>Unlock Parent Mode to view feelings.</p>";
      return;
    }

    const logs = normalizeFeelingLogs(currentData.feelingLogs).slice(0, 20);

    list.innerHTML = "";

    if (!logs.length) {
      list.innerHTML = "<p class='empty-notes'>No feelings logged yet.</p>";
      return;
    }

    logs.forEach(log => {
      const item = document.createElement("article");
      item.className = "parent-feeling-item";
      item.innerHTML = `
        <div class="parent-feeling-icon">${getFeelingGraphicSvg(log.feelingId)}</div>
        <div>
          <strong>${log.label}</strong>
          <span>${log.dateText || "No date"}</span>
        </div>
      `;
      list.appendChild(item);
    });
  }

  async function requestReward(rewardId) {
    const data = await getLatestData();
    data.rewardRequests = normalizeRewardRequests(data.rewardRequests);

    const reward = normalizeRewards(data.rewards).find(item => item.id === rewardId);

    if (!reward) {
      return;
    }

    if (data.coinTotal < reward.cost) {
      alert("Not enough coins for this reward yet.");
      return;
    }

    const existingPending = data.rewardRequests.some(request => request.status === "pending" && request.rewardId === rewardId);

    if (existingPending) {
      alert("This reward has already been requested.");
      return;
    }

    const now = new Date();

    data.rewardRequests.unshift({
      id: `request-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      rewardId: reward.id,
      rewardName: reward.name,
      rewardIcon: reward.icon,
      rewardCost: reward.cost,
      status: "pending",
      requestedAt: now.toISOString(),
      requestedDateISO: getDateISO(now),
      resolvedAt: "",
      resolvedBy: ""
    });

    addHistoryEntry(data, {
      type: "reward",
      level: "request",
      text: `Reward requested: ${reward.name}`,
      coinChange: 0,
      coinsAfter: data.coinTotal
    });

    await saveData(data);

    alert("Reward request sent to Parent Mode.");
  }

  async function approveRewardRequest(requestId) {
    if (!await verifyParentPin("approve this reward request")) {
      return;
    }

    const data = await getLatestData();
    data.rewardRequests = normalizeRewardRequests(data.rewardRequests);

    const request = data.rewardRequests.find(item => item.id === requestId && item.status === "pending");

    if (!request) {
      return;
    }

    if (data.coinTotal < request.rewardCost) {
      alert("There are not enough coins left to approve this reward.");
      return;
    }

    if (!confirm(`Approve "${request.rewardName}" for ${request.rewardCost} coins?`)) {
      return;
    }

    data.coinTotal = Math.max(0, data.coinTotal - request.rewardCost);

    data.rewardRequests = data.rewardRequests.map(item => {
      if (item.id !== requestId) {
        return item;
      }

      return {
        ...item,
        status: "approved",
        resolvedAt: new Date().toISOString(),
        resolvedBy: elements.noteAuthor?.value || "Parent"
      };
    });

    addHistoryEntry(data, {
      type: "reward",
      level: "approved",
      text: `Reward approved: ${request.rewardName}`,
      coinChange: -request.rewardCost,
      coinsAfter: data.coinTotal
    });

    await saveData(data);
  }

  async function rejectRewardRequest(requestId) {
    if (!await verifyParentPin("reject this reward request")) {
      return;
    }

    const data = await getLatestData();
    data.rewardRequests = normalizeRewardRequests(data.rewardRequests);

    const request = data.rewardRequests.find(item => item.id === requestId && item.status === "pending");

    if (!request) {
      return;
    }

    data.rewardRequests = data.rewardRequests.map(item => {
      if (item.id !== requestId) {
        return item;
      }

      return {
        ...item,
        status: "rejected",
        resolvedAt: new Date().toISOString(),
        resolvedBy: elements.noteAuthor?.value || "Parent"
      };
    });

    addHistoryEntry(data, {
      type: "reward",
      level: "rejected",
      text: `Reward rejected: ${request.rewardName}`,
      coinChange: 0,
      coinsAfter: data.coinTotal
    });

    await saveData(data);
  }

  async function saveQuickDailyLog() {
    if (!await verifyParentPin("save a daily log")) {
      return;
    }

    const level = elements.quickLogLevelSelect?.value || "amber";
    const category = elements.quickLogCategorySelect?.value || "General";
    const note = elements.quickLogNoteText?.value.trim() || "";

    const data = await getLatestData();
    const previousLevel = data.today.level;
    let coinChange = 0;

    if (level === "green" && previousLevel !== "green") {
      coinChange = data.settings.greenCoins;
    }

    if (level === "red" && previousLevel !== "red") {
      coinChange = -data.settings.redCoins;
    }

    const before = data.coinTotal;
    data.coinTotal = Math.max(0, before + coinChange);
    const actualChange = data.coinTotal - before;

    data.today = {
      date: getDateISO(),
      level,
      category,
      reason: note
    };

    if (level === "green" && data.streak.lastGreenDate !== getDateISO()) {
      data.streak.current += 1;
      data.streak.best = Math.max(data.streak.best, data.streak.current);
      data.streak.lastGreenDate = getDateISO();
    }

    if (level === "red") {
      data.streak.current = 0;
    }

    addHistoryEntry(data, {
      type: "level",
      level,
      category,
      text: note ? `Quick daily log: ${level.toUpperCase()} - ${note}` : `Quick daily log: ${level.toUpperCase()}`,
      coinChange: actualChange,
      coinsAfter: data.coinTotal
    });

    if (note) {
      const now = new Date();
      const author = elements.noteAuthor?.value.trim() || "Parent";
      data.parentNotes = normalizeNotes(data.parentNotes);
      data.parentNotes.unshift({
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        author,
        category,
        text: note,
        dateText: formatDateTime(now),
        dateISO: getDateISO(now),
        savedAt: now.toISOString()
      });
    }

    elements.quickLogNoteText.value = "";

    startCelebrationIfNeeded(data);
    await saveData(data);
  }

  function updateChildDashboard() {
    if (!elements.childCoinTotal || !elements.childNextReward || !elements.childTodayLevel || !elements.childStreakCount) {
      return;
    }

    const total = currentData.coinTotal;
    const rewards = normalizeRewards(currentData.rewards).sort((a, b) => a.cost - b.cost);
    const next = rewards.find(reward => reward.cost > total) || rewards.find(reward => total >= reward.cost);

    elements.childCoinTotal.textContent = total;
    elements.childTodayLevel.textContent = currentData.today.level.toUpperCase();
    elements.childStreakCount.textContent = currentData.streak.current;

    const latestFeeling = normalizeFeelingLogs(currentData.feelingLogs)[0];

    if (latestFeeling && latestFeeling.dateISO === getDateISO()) {
      elements.childNextReward.innerHTML = `
        <span class="child-feeling-text">Today I feel</span>
        <span class="child-feeling-face feeling-${latestFeeling.colour}" aria-label="${latestFeeling.label}">
          ${getFeelingGraphicSvg(latestFeeling.feelingId)}
        </span>
      `;
      return;
    }

    if (!next) {
      elements.childNextReward.textContent = "No rewards yet.";
      return;
    }

    if (total >= next.cost) {
      elements.childNextReward.innerHTML = `${graphicMarkup("reward", next.icon, "graphic-inline-sm")} <span>${next.name} is ready!</span>`;
    } else {
      elements.childNextReward.innerHTML = `${graphicMarkup("reward", next.icon, "graphic-inline-sm")} <span>${next.name}: ${next.cost - total} coins to go</span>`;
    }
  }

  function updateRewardRequests() {
    const list = elements.rewardRequestList;

    if (!list) {
      return;
    }

    if (!parentUnlocked) {
      list.innerHTML = "<p class='empty-notes'>Unlock Parent Mode to view reward requests.</p>";
      return;
    }

    const requests = normalizeRewardRequests(currentData.rewardRequests)
      .filter(request => request.status === "pending");

    list.innerHTML = "";

    if (!requests.length) {
      list.innerHTML = "<p class='empty-notes'>No reward requests yet.</p>";
      return;
    }

    requests.forEach(request => {
      const item = document.createElement("article");
      item.className = "reward-request-item";

      const info = document.createElement("div");
      info.className = "reward-request-info";
      info.innerHTML = `<strong>${graphicMarkup("reward", request.rewardIcon, "graphic-inline-sm")} ${request.rewardName}</strong><span>${request.rewardCost} coins</span>`;

      const actions = document.createElement("div");
      actions.className = "reward-request-actions";

      const approve = document.createElement("button");
      approve.type = "button";
      approve.textContent = "Approve";
      approve.addEventListener("click", () => approveRewardRequest(request.id));

      const reject = document.createElement("button");
      reject.type = "button";
      reject.textContent = "Reject";
      reject.className = "reject-request-button";
      reject.addEventListener("click", () => rejectRewardRequest(request.id));

      actions.appendChild(approve);
      actions.appendChild(reject);

      item.appendChild(info);
      item.appendChild(actions);
      list.appendChild(item);
    });
  }

  function branchSortValue(branch) {
    const order = ["Child", "Parents", "Siblings", "Parent side", "Special people", "Other family"];
    const index = order.indexOf(branch);
    return index === -1 ? order.length : index;
  }

  function updateFamilyTree() {
    const display = elements.familyTreeDisplay;

    if (!display) {
      return;
    }

    const members = normalizeFamilyTree(currentData.familyTree);
    const child = members.find(member => member.branch === "Child") || {
      icon: "child",
      relationship: "Me",
      name: "Me",
      description: "This is me."
    };

    const branches = {};
    members
      .filter(member => member.id !== child.id && member.branch !== "Child")
      .forEach(member => {
        const branch = member.branch || "Other family";
        branches[branch] = branches[branch] || [];
        branches[branch].push(member);
      });

    const branchNames = Object.keys(branches)
      .sort((a, b) => branchSortValue(a) - branchSortValue(b) || a.localeCompare(b));

    display.innerHTML = `
      <div class="family-tree-root">
        <div class="family-tree-person family-tree-main-person">
          <div class="family-person-icon">${getCustomGraphicSvg("family", child.icon)}</div>
          <div>
            <strong>${escapeAttr(child.name)}</strong>
            <span>${escapeAttr(child.relationship)}</span>
            <p>${escapeAttr(child.description || "This is me.")}</p>
          </div>
        </div>
      </div>
      <div class="family-tree-branches" id="familyTreeBranches"></div>
    `;

    const branchWrap = display.querySelector("#familyTreeBranches");

    if (!branchNames.length) {
      branchWrap.innerHTML = "<p class='empty-notes'>No family members added yet.</p>";
    } else {
      branchNames.forEach(branchName => {
        const section = document.createElement("section");
        section.className = "family-tree-branch";

        const title = document.createElement("div");
        title.className = "family-branch-title";
        title.textContent = branchName;
        section.appendChild(title);

        branches[branchName].forEach(member => {
          const card = document.createElement("article");
          card.className = "family-tree-person";
          card.innerHTML = `
            <div class="family-person-icon">${getCustomGraphicSvg("family", member.icon)}</div>
            <div>
              <strong>${escapeAttr(member.name)}</strong>
              <span>${escapeAttr(member.relationship)}</span>
              ${member.description ? `<p>${escapeAttr(member.description)}</p>` : ""}
            </div>
          `;
          section.appendChild(card);
        });

        branchWrap.appendChild(section);
      });
    }

    updateFamilyMemberEditor();
  }

  async function addOrUpdateFamilyMember() {
    if (!await verifyParentPin("edit the family tree")) {
      return;
    }

    const relationship = elements.familyRelationshipInput?.value.trim() || "";
    const name = elements.familyNameInput?.value.trim() || "";
    const icon = elements.familyIconInput?.value || "parent";
    const branch = elements.familyBranchSelect?.value || "Other family";
    const description = elements.familyDescriptionInput?.value.trim() || "";

    if (!relationship || !name) {
      alert("Add a relationship and name first.");
      return;
    }

    const data = await getLatestData();
    const members = normalizeFamilyTree(data.familyTree);

    if (editingFamilyMemberId) {
      data.familyTree = members.map(member => {
        if (member.id !== editingFamilyMemberId) {
          return member;
        }

        return { ...member, relationship, name, icon, branch, description };
      });
    } else {
      data.familyTree = [
        ...members,
        {
          id: `family-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          relationship,
          name,
          icon,
          branch,
          description
        }
      ];
    }

    addHistoryEntry(data, {
      type: "family",
      level: "family",
      category: "Family tree",
      text: editingFamilyMemberId ? `Family tree updated: ${relationship} ${name}` : `Family member added: ${relationship} ${name}`,
      coinChange: 0,
      coinsAfter: data.coinTotal
    });

    clearFamilyForm();
    await saveData(data);
  }

  function clearFamilyForm() {
    editingFamilyMemberId = "";

    if (elements.familyRelationshipInput) elements.familyRelationshipInput.value = "";
    if (elements.familyNameInput) elements.familyNameInput.value = "";
    if (elements.familyIconInput) elements.familyIconInput.value = "parent";
    if (elements.familyBranchSelect) elements.familyBranchSelect.value = "Parents";
    if (elements.familyDescriptionInput) elements.familyDescriptionInput.value = "";
    if (elements.addFamilyMemberButton) elements.addFamilyMemberButton.textContent = "Add Family Member";
    if (elements.cancelFamilyEditButton) elements.cancelFamilyEditButton.hidden = true;
  }

  async function editFamilyMember(memberId) {
    if (!await verifyParentPin("edit this family member")) {
      return;
    }

    const member = normalizeFamilyTree(currentData.familyTree).find(item => item.id === memberId);

    if (!member) {
      return;
    }

    editingFamilyMemberId = member.id;
    elements.familyRelationshipInput.value = member.relationship;
    elements.familyNameInput.value = member.name;
    elements.familyIconInput.value = member.icon;
    elements.familyBranchSelect.value = member.branch === "Child" ? "Parents" : member.branch;
    elements.familyDescriptionInput.value = member.description || "";
    elements.addFamilyMemberButton.textContent = "Save Family Member";
    elements.cancelFamilyEditButton.hidden = false;
    switchPage("family");
  }

  async function deleteFamilyMember(memberId) {
    if (!await verifyParentPin("delete this family member")) {
      return;
    }

    const member = normalizeFamilyTree(currentData.familyTree).find(item => item.id === memberId);

    if (!member) {
      return;
    }

    if (member.branch === "Child") {
      alert("Keep the child as the middle of the family tree.");
      return;
    }

    if (!confirm(`Delete ${member.name} from the family tree?`)) {
      return;
    }

    const data = await getLatestData();
    data.familyTree = normalizeFamilyTree(data.familyTree).filter(item => item.id !== memberId);

    addHistoryEntry(data, {
      type: "family",
      level: "family",
      category: "Family tree",
      text: `Family member removed: ${member.relationship} ${member.name}`,
      coinChange: 0,
      coinsAfter: data.coinTotal
    });

    await saveData(data);
  }

  function updateFamilyMemberEditor() {
    const list = elements.familyMemberEditorList;

    if (!list) {
      return;
    }

    if (!parentUnlocked) {
      list.innerHTML = "<p class='empty-notes'>Unlock Parent Mode to edit family members.</p>";
      return;
    }

    const members = normalizeFamilyTree(currentData.familyTree)
      .sort((a, b) => branchSortValue(a.branch) - branchSortValue(b.branch) || a.relationship.localeCompare(b.relationship));

    list.innerHTML = "";

    members.forEach(member => {
      const item = document.createElement("article");
      item.className = "family-member-editor-item";

      const info = document.createElement("div");
      info.className = "family-member-editor-info";
      info.innerHTML = `
        <span class="family-member-editor-icon">${getCustomGraphicSvg("family", member.icon)}</span>
        <div>
          <strong>${escapeAttr(member.relationship)} - ${escapeAttr(member.name)}</strong>
          <span>${escapeAttr(member.branch)}</span>
        </div>
      `;

      const actions = document.createElement("div");
      actions.className = "family-member-editor-actions";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "Edit";
      edit.addEventListener("click", () => editFamilyMember(member.id));

      const del = document.createElement("button");
      del.type = "button";
      del.textContent = member.branch === "Child" ? "Main" : "Delete";
      del.disabled = member.branch === "Child";
      del.className = "delete-family-member-button";
      del.addEventListener("click", () => deleteFamilyMember(member.id));

      actions.appendChild(edit);
      actions.appendChild(del);
      item.appendChild(info);
      item.appendChild(actions);
      list.appendChild(item);
    });
  }

  function updateParentDashboard() {
    const grid = elements.parentDashboardGrid;

    if (!grid) {
      return;
    }

    if (!parentUnlocked) {
      grid.innerHTML = "";
      return;
    }

    const pendingRequests = normalizeRewardRequests(currentData.rewardRequests)
      .filter(request => request.status === "pending").length;

    const todayHistory = normalizeHistory(currentData.history)
      .filter(item => item.dateISO === getDateISO());

    const greenLogs = todayHistory.filter(item => item.level === "green").length;
    const redLogs = todayHistory.filter(item => item.level === "red").length;
    const notesToday = normalizeNotes(currentData.parentNotes)
      .filter(note => note.dateISO === getDateISO()).length;

    const latestFeeling = normalizeFeelingLogs(currentData.feelingLogs)[0];
    const latestFeelingText = latestFeeling
      ? `${latestFeeling.label}`
      : "None";

    grid.innerHTML = "";

    [
      ["Coins", currentData.coinTotal],
      ["Today", currentData.today.level.toUpperCase()],
      ["Pending rewards", pendingRequests],
      ["Latest feeling", latestFeelingText],
      ["Notes today", notesToday],
      ["Green logs", greenLogs],
      ["Red logs", redLogs]
    ].forEach(([label, value]) => {
      const card = document.createElement("div");
      card.className = "dashboard-stat";
      card.innerHTML = `<strong>${value}</strong><span>${label}</span>`;
      grid.appendChild(card);
    });
  }

  function getCalendarEntry(dateISO) {
    return normalizeFamilyCalendar(currentData.familyCalendar).find(entry => entry.dateISO === dateISO) || null;
  }

  function formatCalendarDate(date) {
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "short"
    });
  }

  function buildCalendarDetailHtml(dateISO, entry) {
    const date = new Date(`${dateISO}T12:00:00`);
    const dateTitle = formatCalendarDate(date);

    if (entry) {
      const safeWho = escapeAttr(entry.who);
      const safeIcon = escapeAttr(entry.icon);
      const safeNote = entry.note ? escapeAttr(entry.note) : "No description added for this day.";

      return `
        <div class="calendar-detail-main selected-calendar-detail" data-selected-date="${dateISO}">
          <div class="calendar-detail-icon">${getCustomGraphicSvg("calendar", safeIcon)}</div>
          <div>
            <strong>${dateTitle}</strong>
            <span>Child is with ${safeWho}</span>
            <p class="calendar-selected-description"><b>Description:</b> ${safeNote}</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="calendar-detail-main selected-calendar-detail" data-selected-date="${dateISO}">
        <div class="calendar-detail-icon">${getCustomGraphicSvg("calendar", "other")}</div>
        <div>
          <strong>${dateTitle}</strong>
          <span>No plan has been added for this day yet.</span>
          <p class="calendar-selected-description"><b>Description:</b> ${parentUnlocked ? "Use the editor below to add who the child is with and what is happening." : "Nothing has been added yet."}</p>
        </div>
      </div>
    `;
  }

  function updateCalendarEditorFields(dateISO, entry) {
    if (elements.calendarDateInput) {
      elements.calendarDateInput.value = dateISO;
    }

    if (elements.calendarWhoInput) {
      elements.calendarWhoInput.value = entry?.who || "";
    }

    if (elements.calendarIconSelect) {
      elements.calendarIconSelect.value = normaliseIconValue(entry?.icon || "home", "home");
    }

    if (elements.calendarNoteInput) {
      elements.calendarNoteInput.value = entry?.note || "";
    }
  }

  function selectCalendarDay(dateISO) {
    if (!dateISO) {
      dateISO = getDateISO();
    }

    selectedCalendarDate = dateISO;

    const entry = getCalendarEntry(dateISO);
    const selectedHtml = buildCalendarDetailHtml(dateISO, entry);

    document.querySelectorAll(".family-calendar-day").forEach(dayButton => {
      const isSelected = dayButton.dataset.date === dateISO;
      dayButton.classList.toggle("selected", isSelected);
      dayButton.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });

    updateCalendarEditorFields(dateISO, entry);

    if (elements.familyTodayCard) {
      elements.familyTodayCard.innerHTML = selectedHtml;
      elements.familyTodayCard.dataset.selectedDate = dateISO;
    }

    if (elements.calendarDayDetails) {
      elements.calendarDayDetails.innerHTML = selectedHtml;
      elements.calendarDayDetails.dataset.selectedDate = dateISO;
    }
  }

  function updateCalendar() {
    const grid = elements.calendarGrid;

    if (!grid) {
      return;
    }

    const entries = normalizeFamilyCalendar(currentData.familyCalendar);
    const today = new Date();
    const todayISO = getDateISO(today);
    const datesToShow = [];

    if (childMode) {
      // Child view stays simple: only today plus the next 6 days.
      for (let offset = 0; offset < 7; offset += 1) {
        datesToShow.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, 12));
      }
    } else {
      // Parent view shows the whole current calendar month.
      const year = today.getFullYear();
      const month = today.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
        datesToShow.push(new Date(year, month, dayNumber, 12));
      }
    }

    grid.setAttribute("aria-label", childMode ? "Next seven days" : "Current month");
    grid.innerHTML = "";

    datesToShow.forEach(date => {
      const dateISO = getDateISO(date);
      const entry = entries.find(item => item.dateISO === dateISO);

      const button = document.createElement("button");
      button.type = "button";
      button.dataset.date = dateISO;
      button.className = "calendar-day family-calendar-day";
      button.classList.toggle("today", dateISO === todayISO);
      button.classList.toggle("selected", dateISO === selectedCalendarDate);
      button.classList.toggle("has-plan", Boolean(entry));
      button.setAttribute("aria-pressed", dateISO === selectedCalendarDate ? "true" : "false");

      const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
      const day = date.getDate();
      const month = date.toLocaleDateString("en-GB", { month: "short" });

      button.innerHTML = `
        <span class="calendar-weekday">${weekday}</span>
        <strong>${day}</strong>
        <span class="calendar-month">${month}</span>
        <div class="calendar-person">
          <span class="calendar-person-icon">${entry ? getCustomGraphicSvg("calendar", entry.icon) : getCustomGraphicSvg("calendar", "other")}</span>
          <span class="calendar-person-name">${entry?.who || "No plan"}</span>
        </div>
      `;

      const chooseCalendarDay = event => {
        event.preventDefault();
        selectedCalendarDate = dateISO;
        selectCalendarDay(dateISO);
      };

      button.addEventListener("click", chooseCalendarDay);
      grid.appendChild(button);
    });

    const visibleDates = [...grid.querySelectorAll(".family-calendar-day")]
      .map(button => button.dataset.date);

    if (!visibleDates.includes(selectedCalendarDate)) {
      selectedCalendarDate = todayISO;
    }

    if (elements.calendarDateInput && !elements.calendarDateInput.value) {
      elements.calendarDateInput.value = selectedCalendarDate;
    }

    selectCalendarDay(selectedCalendarDate || todayISO);
  }

  async function saveCalendarEntry() {
    if (!await verifyParentPin("edit the calendar")) {
      return;
    }

    const dateISO = elements.calendarDateInput?.value || "";
    const who = elements.calendarWhoInput?.value.trim() || "";
    const icon = elements.calendarIconSelect?.value || "other";
    const note = elements.calendarNoteInput?.value.trim() || "";

    if (!dateISO) {
      alert("Choose a day first.");
      return;
    }

    if (!who) {
      alert("Add who the child is with first.");
      return;
    }

    const data = await getLatestData();
    const calendar = normalizeFamilyCalendar(data.familyCalendar).filter(entry => entry.dateISO !== dateISO);

    calendar.push({
      id: `calendar-${dateISO}`,
      dateISO,
      who,
      icon,
      note,
      updatedAt: new Date().toISOString()
    });

    data.familyCalendar = calendar;

    addHistoryEntry(data, {
      type: "calendar",
      level: "calendar",
      category: "Calendar",
      text: `Calendar updated: ${dateISO} - child is with ${who}`,
      coinChange: 0,
      coinsAfter: data.coinTotal
    });

    selectedCalendarDate = dateISO;
    await saveData(data);
    selectCalendarDay(dateISO);
  }

  async function deleteCalendarEntry() {
    if (!await verifyParentPin("clear this calendar day")) {
      return;
    }

    const dateISO = elements.calendarDateInput?.value || "";

    if (!dateISO) {
      alert("Choose a day first.");
      return;
    }

    if (!confirm("Clear this calendar day?")) {
      return;
    }

    const data = await getLatestData();
    data.familyCalendar = normalizeFamilyCalendar(data.familyCalendar).filter(entry => entry.dateISO !== dateISO);

    addHistoryEntry(data, {
      type: "calendar",
      level: "calendar",
      category: "Calendar",
      text: `Calendar cleared: ${dateISO}`,
      coinChange: 0,
      coinsAfter: data.coinTotal
    });

    if (elements.calendarWhoInput) elements.calendarWhoInput.value = "";
    if (elements.calendarNoteInput) elements.calendarNoteInput.value = "";

    selectedCalendarDate = dateISO;
    await saveData(data);
    selectCalendarDay(dateISO);
  }

  async function claimReward(rewardId) {
    if (!await verifyParentPin("claim this reward")) {
      return;
    }

    const data = await getLatestData();
    const reward = normalizeRewards(data.rewards).find(item => item.id === rewardId);

    if (!reward) {
      return;
    }

    if (data.coinTotal < reward.cost) {
      alert("Not enough coins for this reward yet.");
      return;
    }

    if (!confirm(`Claim "${reward.name}" for ${reward.cost} coins?`)) {
      return;
    }

    data.coinTotal -= reward.cost;

    addHistoryEntry(data, {
      type: "reward",
      level: "claimed",
      text: `Reward claimed: ${reward.name}`,
      coinChange: -reward.cost,
      coinsAfter: data.coinTotal
    });

    await saveData(data);

    showPhoneNotification("Reward claimed", {
      body: `${reward.name} claimed for ${reward.cost} coins.`,
      tag: `reward-${rewardId}`
    }).catch(console.error);
  }

  async function addReward() {
    if (!await verifyParentPin("add a reward")) {
      return;
    }

    const icon = elements.rewardIconInput?.value || "gift";
    const name = elements.rewardNameInput?.value.trim() || "";
    const cost = Math.round(Number(elements.rewardCostInput?.value) || 0);

    if (!name) {
      alert("Add a reward name first.");
      return;
    }

    if (cost < 1) {
      alert("Add a valid coin cost.");
      return;
    }

    const data = await getLatestData();
    data.rewards = normalizeRewards(data.rewards);
    data.rewards.push({
      id: `reward-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      icon,
      name,
      cost: Math.max(1, Math.min(10000, cost))
    });

    elements.rewardIconInput.value = "gift";
    elements.rewardNameInput.value = "";
    elements.rewardCostInput.value = "";

    await saveData(data);
  }

  async function saveReward(rewardId) {
    if (!await verifyParentPin("edit this reward")) {
      return;
    }

    const row = document.querySelector(`[data-reward-editor-id="${rewardId}"]`);

    if (!row) {
      return;
    }

    const icon = row.querySelector(".reward-edit-icon").value || "gift";
    const name = row.querySelector(".reward-edit-name").value.trim();
    const cost = Math.round(Number(row.querySelector(".reward-edit-cost").value) || 0);

    if (!name || cost < 1) {
      alert("Reward needs a name and valid cost.");
      return;
    }

    const data = await getLatestData();
    data.rewards = normalizeRewards(data.rewards).map(reward => {
      if (reward.id !== rewardId) {
        return reward;
      }

      return {
        ...reward,
        icon,
        name,
        cost: Math.max(1, Math.min(10000, cost))
      };
    });

    await saveData(data);
  }

  async function deleteReward(rewardId) {
    if (!await verifyParentPin("delete this reward")) {
      return;
    }

    if (!confirm("Delete this reward?")) {
      return;
    }

    const data = await getLatestData();
    data.rewards = normalizeRewards(data.rewards).filter(reward => reward.id !== rewardId);
    await saveData(data);
  }

  async function addOrUpdateNote() {
    if (!await verifyParentPin("add a parent note")) {
      return;
    }

    const author = elements.noteAuthor?.value.trim() || "";
    const category = elements.noteCategorySelect?.value || "General";
    const text = elements.parentNoteText?.value.trim() || "";

    if (!author) {
      alert("Add who wrote the note first.");
      return;
    }

    if (!text) {
      alert("Write a note first.");
      return;
    }

    localStorage.setItem(NOTE_AUTHOR_KEY, author);

    const data = await getLatestData();
    data.parentNotes = normalizeNotes(data.parentNotes);

    if (editingNoteId) {
      data.parentNotes = data.parentNotes.map(note => {
        if (note.id !== editingNoteId) {
          return note;
        }

        return {
          ...note,
          author,
          category,
          text
        };
      });
      editingNoteId = "";
      elements.addParentNoteButton.textContent = "Add Note";
    } else {
      const now = new Date();
      data.parentNotes.unshift({
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        author,
        category,
        text,
        dateText: formatDateTime(now),
        dateISO: getDateISO(now),
        savedAt: now.toISOString()
      });

      addHistoryEntry(data, {
        type: "note",
        level: "note",
        category,
        text: `Parent note added by ${author}: ${text.slice(0, 120)}`,
        coinChange: 0,
        coinsAfter: data.coinTotal
      });
    }

    elements.parentNoteText.value = "";
    await saveData(data);
  }

  async function editNote(noteId) {
    if (!await verifyParentPin("edit this note")) {
      return;
    }

    const note = currentData.parentNotes.find(item => item.id === noteId);

    if (!note) {
      return;
    }

    editingNoteId = noteId;
    elements.noteAuthor.value = note.author;
    elements.noteCategorySelect.value = note.category || "General";
    elements.parentNoteText.value = note.text;
    elements.addParentNoteButton.textContent = "Save Note";
    switchPage("parent");
  }

  async function deleteNote(noteId) {
    if (!await verifyParentPin("delete this note")) {
      return;
    }

    if (!confirm("Delete this parent note?")) {
      return;
    }

    const data = await getLatestData();
    data.parentNotes = normalizeNotes(data.parentNotes).filter(note => note.id !== noteId);
    await saveData(data);
  }

  async function addCategory() {
    if (!await verifyParentPin("add a category")) {
      return;
    }

    const value = elements.newCategoryInput?.value.trim();

    if (!value) {
      return;
    }

    const data = await getLatestData();
    data.categories = normalizeCategories([...normalizeCategories(data.categories), value]);
    elements.newCategoryInput.value = "";
    await saveData(data);
  }

  async function deleteCategory(category) {
    if (!await verifyParentPin("delete this category")) {
      return;
    }

    if (DEFAULT_CATEGORIES.includes(category)) {
      alert("Default categories are kept so reports stay consistent.");
      return;
    }

    const data = await getLatestData();
    data.categories = normalizeCategories(data.categories).filter(item => item !== category);
    await saveData(data);
  }

  async function saveCoinSettings() {
    if (!await verifyParentPin("save settings")) {
      return;
    }

    const data = await getLatestData();
    data.settings = normalizeSettings({
      goal: Number(elements.goalInput.value),
      greenCoins: Number(elements.greenCoinsInput.value),
      redCoins: Number(elements.redCoinsInput.value),
      dailyResetLevel: "amber"
    });

    await saveData(data);
  }

  async function changePin() {
    if (!await verifyParentPin("change the PIN")) {
      return;
    }

    const newPin = elements.newPinInput?.value.trim() || "";

    if (newPin.length < 3) {
      alert("Use at least 3 numbers.");
      return;
    }

    localStorage.setItem(PIN_KEY, newPin);
    elements.newPinInput.value = "";
    alert("Parent PIN changed on this phone.");
  }

  async function clearHistory() {
    if (!await verifyParentPin("clear history")) {
      return;
    }

    if (!confirm("Clear all history?")) {
      return;
    }

    const data = await getLatestData();
    data.history = [];
    await saveData(data);
  }

  async function clearAllData() {
    if (!await verifyParentPin("clear all data")) {
      return;
    }

    if (!confirm("This clears coins, rewards, notes, history and settings. Are you sure?")) {
      return;
    }

    await saveData(getDefaultData());
  }

  async function exportData() {
    if (!await verifyParentPin("export data")) {
      return;
    }

    const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `together-steps-export-${getDateISO()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

 
  function getDefaultTimerState() {
    return {
      durationSeconds: 300,
      remainingSeconds: 300,
      running: false,
      endTime: 0
    };
  }

  function normalizeTimerState(state = {}) {
    const duration = Math.max(60, Math.min(7200, Math.round(Number(state.durationSeconds) || 300)));
    let remaining = Math.max(0, Math.min(duration, Math.round(Number(state.remainingSeconds) || duration)));
    const running = Boolean(state.running);
    const endTime = Math.max(0, Number(state.endTime) || 0);

    if (running && endTime) {
      remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    }

    return {
      durationSeconds: duration,
      remainingSeconds: Math.min(duration, remaining),
      running: running && remaining > 0,
      endTime: running && remaining > 0 ? endTime : 0
    };
  }

  function getLocalTimerState() {
    try {
      const raw = localStorage.getItem(TIMER_STATE_KEY);
      return normalizeTimerState(raw ? JSON.parse(raw) : getDefaultTimerState());
    } catch (error) {
      console.error(error);
      return getDefaultTimerState();
    }
  }

  function storeLocalTimerState() {
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(normalizeTimerState(timerState)));
  }

  function formatTimerTime(totalSeconds) {
    const safeSeconds = Math.max(0, Math.round(Number(totalSeconds) || 0));
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function getTimerCharacter() {
    const theme = getCurrentTheme();
    if (theme === "space") return "🚀";
    if (theme === "minecraft") return "⛏️";
    if (theme === "bunny") return "🐰";
    if (theme === "mario") return "🍄";
    if (theme === "princess") return "👑";
    if (theme === "football") return "⚽";
    if (theme === "car") return "🚗";
    if (theme === "blue") return "💙";
    if (theme === "flower") return "🌸";
    return "⏱️";
  }

  function updateTimerFromClock() {
    if (!timerState.running) {
      return false;
    }

    const remaining = Math.max(0, Math.ceil((timerState.endTime - Date.now()) / 1000));
    timerState.remainingSeconds = remaining;

    if (remaining <= 0) {
      timerState.running = false;
      timerState.endTime = 0;
      storeLocalTimerState();
      return true;
    }

    storeLocalTimerState();
    return false;
  }

  function updateTimerDisplay() {
    if (!elements.timerTime || !elements.timerRing) {
      return;
    }

    timerState = normalizeTimerState(timerState);

    if (timerState.running) {
      updateTimerFromClock();
    }

    const duration = Math.max(60, timerState.durationSeconds);
    const remaining = Math.max(0, timerState.remainingSeconds);
    const usedPercent = Math.max(0, Math.min(100, ((duration - remaining) / duration) * 100));
    const leftPercent = Math.max(0, 100 - usedPercent);

    elements.timerTime.textContent = formatTimerTime(remaining);
    elements.timerRing.style.background = `conic-gradient(var(--theme-accent) 0 ${leftPercent}%, rgba(255,255,255,0.72) ${leftPercent}% 100%)`;

    if (elements.timerCharacter) {
      renderThemeGraphicElement(elements.timerCharacter, getCurrentTheme(), "timer-svg");
    }

    if (elements.timerStatus) {
      if (timerState.running) {
        elements.timerStatus.textContent = "Timer running";
      } else if (remaining === 0) {
        elements.timerStatus.textContent = "Finished";
      } else if (remaining < duration) {
        elements.timerStatus.textContent = "Paused";
      } else {
        elements.timerStatus.textContent = "Ready";
      }
    }

    if (elements.startTimerButton) {
      elements.startTimerButton.disabled = timerState.running;
      elements.startTimerButton.textContent = remaining === 0 ? "Start Again" : "Start";
    }

    if (elements.pauseTimerButton) {
      elements.pauseTimerButton.disabled = !timerState.running;
    }

    document.querySelectorAll("[data-timer-minutes]").forEach(button => {
      const seconds = Math.round(Number(button.dataset.timerMinutes) * 60);
      button.classList.toggle("active", seconds === duration && !timerState.running);
    });
  }

  function startTimerTick() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    timerInterval = window.setInterval(() => {
      const finished = updateTimerFromClock();
      updateTimerDisplay();

      if (finished) {
        finishTimer();
      }
    }, 500);
  }

  function stopTimerTick() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function setTimerDuration(minutes) {
    const duration = Math.max(60, Math.min(7200, Math.round(Number(minutes) * 60 || 300)));
    timerState = {
      durationSeconds: duration,
      remainingSeconds: duration,
      running: false,
      endTime: 0
    };
    timerFinishedAlertShown = false;
    stopTimerTick();
    storeLocalTimerState();
    updateTimerDisplay();
  }

  function startVisualTimer() {
    timerState = normalizeTimerState(timerState);

    if (timerState.remainingSeconds <= 0) {
      timerState.remainingSeconds = timerState.durationSeconds;
    }

    timerState.running = true;
    timerState.endTime = Date.now() + (timerState.remainingSeconds * 1000);
    timerFinishedAlertShown = false;
    storeLocalTimerState();
    startTimerTick();
    updateTimerDisplay();
  }

  function pauseVisualTimer() {
    updateTimerFromClock();
    timerState.running = false;
    timerState.endTime = 0;
    storeLocalTimerState();
    stopTimerTick();
    updateTimerDisplay();
  }

  function resetVisualTimer() {
    timerState = normalizeTimerState(timerState);
    timerState.running = false;
    timerState.endTime = 0;
    timerState.remainingSeconds = timerState.durationSeconds;
    timerFinishedAlertShown = false;
    storeLocalTimerState();
    stopTimerTick();
    updateTimerDisplay();
  }

  function finishTimer() {
    stopTimerTick();
    timerState = normalizeTimerState({
      ...timerState,
      remainingSeconds: 0,
      running: false,
      endTime: 0
    });
    storeLocalTimerState();
    updateTimerDisplay();

    if (navigator.vibrate) {
      navigator.vibrate([250, 120, 250, 120, 450]);
    }

    showPhoneNotification("Timer finished", {
      body: "The timer has finished.",
      tag: "child-timer"
    }).catch(console.error);

    if (!timerFinishedAlertShown) {
      timerFinishedAlertShown = true;
      window.setTimeout(() => alert("Timer finished!"), 50);
    }
  }

  function setCustomTimerDuration() {
    const minutes = Math.round(Number(elements.customTimerMinutes?.value) || 0);

    if (minutes < 1 || minutes > 120) {
      alert("Choose between 1 and 120 minutes.");
      return;
    }

    setTimerDuration(minutes);

    if (elements.customTimerMinutes) {
      elements.customTimerMinutes.value = "";
    }
  }

  function switchPage(page) {
    if (childMode && !["home", "feelings", "rewards", "calendar", "timer", "family"].includes(page)) {
      page = "home";
    }

    document.querySelectorAll(".page").forEach(section => {
      section.classList.toggle("active", section.id === `page-${page}`);
    });

    document.body.dataset.activePage = page;

    document.querySelectorAll(".nav-button").forEach(button => {
      button.classList.toggle("active", button.dataset.page === page);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateParentLockDisplay() {
    const locked = !parentUnlocked;

    document.body.classList.toggle("child-mode", childMode);
    document.body.classList.toggle("parent-mode", !childMode);

    if (childMode) {
      parentUnlocked = false;
    }

    document.querySelectorAll(".nav-button").forEach(button => {
      const parentOnlyPage = !["home", "feelings", "rewards", "calendar", "timer", "family"].includes(button.dataset.page);
      button.hidden = childMode && parentOnlyPage;
    });

    if (elements.modeStatusPill) {
      elements.modeStatusPill.textContent = childMode ? "Child Mode" : "Parent Mode";
    }

    if (elements.lockStatus) {
      elements.lockStatus.textContent = childMode
        ? "Child Mode: parent controls hidden"
        : parentUnlocked
          ? "Parent controls unlocked"
          : "Parent controls locked";
    }

    if (elements.headerUnlockButton) {
      elements.headerUnlockButton.textContent = childMode ? "Parent Mode" : "Back to Child Mode";
    }

    if (elements.parentLockedPanel) {
      elements.parentLockedPanel.hidden = parentUnlocked;
    }

    if (elements.parentUnlockedContent) {
      elements.parentUnlockedContent.hidden = locked;
    }

    if (elements.settingsLockedPanel) {
      elements.settingsLockedPanel.hidden = parentUnlocked;
    }

    if (elements.settingsUnlockedContent) {
      elements.settingsUnlockedContent.hidden = locked;
    }

    updateParentOnlyButtons();
    updateParentNotes();
    updateRewardEditor();
    updateCategoryList();
    updateFamilyMemberEditor();
  }

  function updateParentOnlyButtons() {
    const parentButtons = [
      elements.deduct5Button,
      elements.deduct10Button,
      elements.deduct50Button,
      elements.add5Button,
      elements.add10Button,
      elements.add50Button,
      elements.resetTodayButton,
      elements.clearHistoryButton,
      elements.resetCoinsButton,
      elements.clearAllDataButton
    ];

    parentButtons.forEach(button => {
      if (button) {
        button.disabled = childMode || !parentUnlocked;
      }
    });
  }


  function getDefaultProfilePhotoSvg() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
        <rect width="300" height="300" rx="150" fill="#dbeafe"/>
        <circle cx="150" cy="120" r="42" fill="#6b7280"/>
        <path d="M84 236c12-44 43-70 66-70s54 26 66 70" fill="#6b7280"/>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function updateProfilePhotoDisplay() {
    const photo = localStorage.getItem(PROFILE_PHOTO_KEY) || "";

    if (elements.profilePhotoPreview) {
      elements.profilePhotoPreview.hidden = false;
      elements.profilePhotoPreview.src = photo || getDefaultProfilePhotoSvg();
      elements.profilePhotoPreview.classList.toggle("is-placeholder", !photo);
    }
  }

  function saveProfilePhotoFromFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      alert("Choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 420;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const scale = Math.max(size / img.width, size / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (size - width) / 2;
        const y = (size - height) / 2;
        ctx.drawImage(img, x, y, width, height);
        localStorage.setItem(PROFILE_PHOTO_KEY, canvas.toDataURL("image/jpeg", 0.86));
        updateProfilePhotoDisplay();
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  }

  function removeProfilePhoto() {
    localStorage.removeItem(PROFILE_PHOTO_KEY);
    if (elements.profilePhotoInput) {
      elements.profilePhotoInput.value = "";
    }
    updateProfilePhotoDisplay();
  }

  function updateDisplay() {
    const currentActivePage = document.querySelector(".page.active");
    if (currentActivePage) {
      document.body.dataset.activePage = currentActivePage.id.replace("page-", "");
    }

    if (childMode) {
      const activePage = document.querySelector(".page.active");
      if (activePage && !["page-home", "page-feelings", "page-rewards", "page-calendar", "page-timer", "page-tools", "page-family"].includes(activePage.id)) {
        switchPage("home");
      }
    }

    currentData = applyDailyReset(normalizeData(currentData));
    storeLocalData(currentData);

    updateThemeText();
    updateProfilePhotoDisplay();
    updateCoinDisplay();
    updateLevelDisplay();
    updateStreakDisplay();
    updateChildDashboard();
    updateFeelingsPage();
    updateParentFeelings();
    updateRewardsShop();
    updateRewardRequests();
    updateParentDashboard();
    updateCalendar();
    updateFamilyTree();
    updateTimerDisplay();
    updateParentNotes();
    updateRewardEditor();
    updateCategoryOptions();
    updateCategoryList();
    updateHistory();
    updateReports();
    updateSettingsInputs();
    updateCelebration();
    updateParentLockDisplay();
    updateNotificationStatus();
    maybeSendLatestNotification(currentData).catch(console.error);
  }

  function updateThemeText() {
    updateProgressCharacter();
    const themeColours = {
      plain: "#2563eb",
      mario: "#f97316",
      space: "#10103e",
      minecraft: "#3f7f32",
      bunny: "#ec4899",
      princess: "#f472b6",
      football: "#16a34a",
      car: "#ef4444",
      blue: "#2563eb",
      flower: "#fb7185"
    };
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColours[getCurrentTheme()] || themeColours.plain);
  }

  function updateProgressCharacter() {
    if (!elements.progressCharacter) {
      return;
    }

    const theme = getCurrentTheme();
    renderThemeGraphicElement(elements.progressCharacter, theme, "journey-svg");
  }

  function updateCoinDisplay() {
    const goal = currentData.settings.goal;
    const total = currentData.coinTotal;
    const percent = Math.max(0, Math.min(100, (total / goal) * 100));

    elements.coinTotalMain.textContent = total;
    elements.goalDisplay.textContent = goal;
    elements.finishGoal.textContent = goal;
    elements.coinProgress.style.width = `${percent}%`;
    elements.progressCharacter.style.left = `calc(${percent}% - 18px)`;
    elements.greenCoinValue.textContent = `+${currentData.settings.greenCoins} coins`;
    elements.redCoinValue.textContent = `-${currentData.settings.redCoins} coins`;

    const rewards = normalizeRewards(currentData.rewards).sort((a, b) => a.cost - b.cost);
    const nextReward = rewards.find(reward => reward.cost > total);

    if (nextReward) {
      elements.nextRewardText.textContent = `Next reward: ${nextReward.name} - ${nextReward.cost - total} coins to go`;
    } else if (rewards.length) {
      elements.nextRewardText.textContent = "All rewards are affordable!";
    } else {
      elements.nextRewardText.textContent = "Add rewards in the Parent Page.";
    }
  }

  function updateLevelDisplay() {
    const level = currentData.today.level;
    const label = level.toUpperCase();

    elements.todayLevelPill.textContent = label;
    elements.todayLevelPill.style.background = level === "red" ? "var(--red)" : level === "green" ? "var(--green)" : "var(--amber)";

    elements.redLight.classList.toggle("active", level === "red");
    elements.amberLight.classList.toggle("active", level === "amber");
    elements.greenLight.classList.toggle("active", level === "green");
  }

  function updateStreakDisplay() {
    elements.streakCount.textContent = currentData.streak.current;
    elements.bestStreak.textContent = currentData.streak.best;

    if (currentData.streak.current > 0) {
      elements.streakMessage.textContent = `Great work. Your child has reached green ${currentData.streak.current} day(s) in a row.`;
    } else {
      elements.streakMessage.textContent = "Reach green today to start a streak.";
    }
  }

  function updateCategoryOptions() {
    const categories = normalizeCategories(currentData.categories);
    const selects = [
      elements.behaviourCategorySelect,
      elements.quickLogCategorySelect,
      elements.noteCategorySelect,
      elements.noteFilterSelect
    ];

    selects.forEach(select => {
      if (!select) {
        return;
      }

      const current = select.value;
      select.innerHTML = "";

      if (select === elements.noteFilterSelect) {
        const all = document.createElement("option");
        all.value = "all";
        all.textContent = "All notes";
        select.appendChild(all);
      }

      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
      });

      if ([...select.options].some(option => option.value === current)) {
        select.value = current;
      }
    });
  }

  function updateRewardsShop() {
    const list = elements.rewardsList;

    if (!list) {
      return;
    }

    const rewards = normalizeRewards(currentData.rewards).sort((a, b) => a.cost - b.cost);
    const total = currentData.coinTotal;
    list.innerHTML = "";

    if (!rewards.length) {
      list.innerHTML = "<p class='empty-notes'>No rewards set yet.</p>";
      return;
    }

    rewards.forEach(reward => {
      const affordable = total >= reward.cost;
      const item = document.createElement("article");
      item.className = "reward-shop-item";
      item.classList.toggle("reward-affordable", affordable);

      const icon = document.createElement("div");
      icon.className = "reward-shop-icon";
      icon.innerHTML = getCustomGraphicSvg("reward", reward.icon);

      const info = document.createElement("div");
      info.className = "reward-shop-info";

      const name = document.createElement("strong");
      name.textContent = reward.name;

      const cost = document.createElement("span");
      cost.textContent = `${reward.cost} coins`;

      const status = document.createElement("small");
      status.textContent = affordable ? "Ready to claim" : `${reward.cost - total} coins to go`;

      info.appendChild(name);
      info.appendChild(cost);
      info.appendChild(status);

      const existingPending = normalizeRewardRequests(currentData.rewardRequests)
        .some(request => request.status === "pending" && request.rewardId === reward.id);

      const claim = document.createElement("button");
      claim.type = "button";
      claim.className = "claim-reward-button";

      if (childMode) {
        claim.textContent = existingPending ? "Asked" : "Ask";
        claim.disabled = !affordable || existingPending;
        claim.addEventListener("click", () => requestReward(reward.id));
      } else {
        claim.textContent = "Claim";
        claim.disabled = !affordable || !parentUnlocked;
        claim.addEventListener("click", () => claimReward(reward.id));
      }

      item.appendChild(icon);
      item.appendChild(info);
      item.appendChild(claim);
      list.appendChild(item);
    });
  }

  function updateRewardEditor() {
    const list = elements.rewardEditorList;

    if (!list) {
      return;
    }

    if (!parentUnlocked) {
      list.innerHTML = "<p class='empty-notes'>Unlock parent controls to edit rewards.</p>";
      return;
    }

    const rewards = normalizeRewards(currentData.rewards);
    list.innerHTML = "";

    rewards.forEach(reward => {
      const item = document.createElement("article");
      item.className = "reward-editor-item";
      item.dataset.rewardEditorId = reward.id;

      item.innerHTML = `
        <label>Graphic</label>
        <select class="reward-edit-icon">${optionsMarkup(REWARD_ICON_OPTIONS, normaliseIconValue(reward.icon, "gift"))}</select>
        <label>Reward</label>
        <input class="reward-edit-name" maxlength="60" value="${escapeAttr(reward.name)}" />
        <label>Cost</label>
        <input class="reward-edit-cost" type="number" min="1" max="10000" step="1" value="${reward.cost}" />
        <div class="reward-editor-buttons">
          <button type="button" class="save-reward-button">Save</button>
          <button type="button" class="delete-reward-button">Delete</button>
        </div>
      `;

      item.querySelector(".save-reward-button").addEventListener("click", () => saveReward(reward.id));
      item.querySelector(".delete-reward-button").addEventListener("click", () => deleteReward(reward.id));
      list.appendChild(item);
    });
  }

  function updateParentNotes() {
    const list = elements.parentNotesList;

    if (!list) {
      return;
    }

    if (!parentUnlocked) {
      list.innerHTML = "<p class='empty-notes'>Unlock parent controls to view notes.</p>";
      return;
    }

    const filter = elements.noteFilterSelect?.value || "all";
    let notes = normalizeNotes(currentData.parentNotes);

    if (filter !== "all") {
      notes = notes.filter(note => note.category === filter);
    }

    list.innerHTML = "";

    if (!notes.length) {
      list.innerHTML = "<p class='empty-notes'>No parent notes yet.</p>";
      return;
    }

    notes.forEach(note => {
      const item = document.createElement("article");
      item.className = "parent-note-item";

      const meta = document.createElement("div");
      meta.className = "parent-note-meta";
      meta.textContent = `${note.dateText || "No date"} - ${note.author} - ${note.category || "General"}`;

      const text = document.createElement("p");
      text.className = "parent-note-text";
      text.textContent = note.text;

      const actions = document.createElement("div");
      actions.className = "note-actions";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "edit-note-button";
      edit.textContent = "Edit";
      edit.addEventListener("click", () => editNote(note.id));

      const del = document.createElement("button");
      del.type = "button";
      del.className = "delete-note-button";
      del.textContent = "Delete";
      del.addEventListener("click", () => deleteNote(note.id));

      actions.appendChild(edit);
      actions.appendChild(del);

      item.appendChild(meta);
      item.appendChild(text);
      item.appendChild(actions);
      list.appendChild(item);
    });
  }

  function updateCategoryList() {
    const list = elements.categoryList;

    if (!list) {
      return;
    }

    if (!parentUnlocked) {
      list.innerHTML = "<p class='empty-notes'>Unlock parent controls to edit categories.</p>";
      return;
    }

    list.innerHTML = "";

    normalizeCategories(currentData.categories).forEach(category => {
      const item = document.createElement("div");
      item.className = "category-item";

      const text = document.createElement("strong");
      text.textContent = category;

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = DEFAULT_CATEGORIES.includes(category) ? "Default" : "Delete";
      button.disabled = DEFAULT_CATEGORIES.includes(category);
      button.addEventListener("click", () => deleteCategory(category));

      item.appendChild(text);
      item.appendChild(button);
      list.appendChild(item);
    });
  }

  function updateHistory() {
    const list = elements.historyList;

    if (!list) {
      return;
    }

    const filter = elements.historyFilterSelect?.value || "all";
    let history = normalizeHistory(currentData.history);

    if (filter !== "all") {
      history = history.filter(item => item.type === filter || (filter === "reward" && item.type === "prize"));
    }

    list.innerHTML = "";

    if (!history.length) {
      list.innerHTML = "<p class='empty-notes'>No history yet.</p>";
      return;
    }

    history.forEach(item => {
      const row = document.createElement("article");
      row.className = "history-item";

      const meta = document.createElement("div");
      meta.className = "history-meta";
      meta.textContent = `${item.dateText || "No date"}${item.category ? " - " + item.category : ""}`;

      const text = document.createElement("p");
      text.className = "history-text";
      text.textContent = item.text;

      const coins = document.createElement("strong");
      coins.textContent = `${item.coinChange > 0 ? "+" : ""}${item.coinChange} coins | Total: ${item.coinsAfter}`;

      row.appendChild(meta);
      row.appendChild(text);
      row.appendChild(coins);
      list.appendChild(row);
    });
  }

  function getRecentHistory(days = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days + 1);
    cutoff.setHours(0, 0, 0, 0);

    return normalizeHistory(currentData.history).filter(item => {
      const date = item.savedAt ? new Date(item.savedAt) : new Date(`${item.dateISO}T00:00:00`);
      return date >= cutoff;
    });
  }

  function updateReports() {
    const recent = getRecentHistory(7);
    const greenDays = new Set(recent.filter(i => i.level === "green").map(i => i.dateISO)).size;
    const redItems = recent.filter(i => i.level === "red").length;
    const amberItems = recent.filter(i => i.level === "amber").length;
    const coinsGained = recent.reduce((sum, item) => sum + Math.max(0, item.coinChange), 0);
    const coinsLost = Math.abs(recent.reduce((sum, item) => sum + Math.min(0, item.coinChange), 0));
    const rewardsClaimed = recent.filter(i => i.type === "reward").length;
    const notes = normalizeNotes(currentData.parentNotes).filter(note => {
      const date = note.savedAt ? new Date(note.savedAt) : new Date(`${note.dateISO}T00:00:00`);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 6);
      cutoff.setHours(0, 0, 0, 0);
      return date >= cutoff;
    });

    if (elements.reportSummary) {
      elements.reportSummary.innerHTML = "";
      [
        ["Green days", greenDays],
        ["Red logs", redItems],
        ["Amber logs", amberItems],
        ["Coins gained", coinsGained],
        ["Coins lost", coinsLost],
        ["Rewards claimed", rewardsClaimed],
        ["Parent notes", notes.length],
        ["Best streak", currentData.streak.best]
      ].forEach(([label, value]) => {
        const card = document.createElement("div");
        card.className = "report-stat";
        card.innerHTML = `<strong>${value}</strong><span>${label}</span>`;
        elements.reportSummary.appendChild(card);
      });
    }

    drawChart(elements.levelChart, {
      Green: recent.filter(i => i.level === "green").length,
      Amber: amberItems,
      Red: redItems
    });

    drawChart(elements.coinChart, {
      Gained: coinsGained,
      Lost: coinsLost
    });

    const notesByCategory = {};
    notes.forEach(note => {
      notesByCategory[note.category || "General"] = (notesByCategory[note.category || "General"] || 0) + 1;
    });
    drawChart(elements.noteChart, Object.keys(notesByCategory).length ? notesByCategory : { Notes: 0 });
  }

  function drawChart(container, data) {
    if (!container) {
      return;
    }

    const entries = Object.entries(data);
    const max = Math.max(1, ...entries.map(([, value]) => Number(value) || 0));
    container.innerHTML = "";

    entries.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "bar-row";

      const name = document.createElement("span");
      name.textContent = label;

      const track = document.createElement("div");
      track.className = "bar-track";

      const fill = document.createElement("div");
      fill.className = "bar-fill";
      fill.style.width = `${Math.max(2, (Number(value) / max) * 100)}%`;

      const count = document.createElement("strong");
      count.textContent = value;

      track.appendChild(fill);
      row.appendChild(name);
      row.appendChild(track);
      row.appendChild(count);
      container.appendChild(row);
    });
  }

  function buildWeeklyReportText() {
    const recent = getRecentHistory(7);
    const coinsGained = recent.reduce((sum, item) => sum + Math.max(0, item.coinChange), 0);
    const coinsLost = Math.abs(recent.reduce((sum, item) => sum + Math.min(0, item.coinChange), 0));

    return [
      "Together Steps weekly report",
      "",
      `Green logs: ${recent.filter(i => i.level === "green").length}`,
      `Amber logs: ${recent.filter(i => i.level === "amber").length}`,
      `Red logs: ${recent.filter(i => i.level === "red").length}`,
      `Coins gained: ${coinsGained}`,
      `Coins lost: ${coinsLost}`,
      `Rewards claimed: ${recent.filter(i => i.type === "reward").length}`,
      `Current streak: ${currentData.streak.current}`,
      `Best streak: ${currentData.streak.best}`,
      "",
      "Recent notes:",
      ...normalizeNotes(currentData.parentNotes).slice(0, 5).map(note => `- ${note.dateText} - ${note.author} - ${note.category}: ${note.text}`)
    ].join("\n");
  }

  async function copyWeeklyReport() {
    const report = buildWeeklyReportText();

    try {
      await navigator.clipboard.writeText(report);
      alert("Weekly report copied.");
    } catch {
      prompt("Copy this report:", report);
    }
  }

  function updateSettingsInputs() {
    if (!elements.goalInput) {
      return;
    }

    elements.goalInput.value = currentData.settings.goal;
    elements.greenCoinsInput.value = currentData.settings.greenCoins;
    elements.redCoinsInput.value = currentData.settings.redCoins;
  }

  function updateCelebration() {
    if (!elements.treatCard) {
      return;
    }

    elements.treatCard.classList.toggle("show", Boolean(currentData.celebration.active));
    updatePrizeDetails();
  }

  function updatePrizeDetails() {
    if (!elements.prizeDropIcon) {
      return;
    }

    const theme = currentData.celebration.theme || getCurrentTheme();
    const details = getPrizeDetails(theme);
    renderThemeGraphicElement(elements.prizeDropIcon, theme, "prize-svg");
    elements.prizeDropName.textContent = details.name;
    elements.treatSubtitle.textContent = details.subtitle;
  }

  function escapeAttr(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function notificationSupported() {
    return "Notification" in window && "serviceWorker" in navigator;
  }

  async function setupServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return null;
    }

    try {
      serviceWorkerRegistration = await navigator.serviceWorker.register("./sw.js?v=ts-layout-7");
      await navigator.serviceWorker.ready;
      return serviceWorkerRegistration;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function updateNotificationStatus() {
    const statusText = !notificationSupported()
      ? "Notifications are not supported on this phone/browser."
      : Notification.permission === "granted"
        ? "Notifications are on."
        : Notification.permission === "denied"
          ? "Notifications are blocked in browser settings."
          : "Notifications are off.";

    [elements.notificationStatus, elements.settingsNotificationStatus].forEach(el => {
      if (el) {
        el.textContent = statusText;
      }
    });

    [elements.enableNotificationsButton, elements.settingsEnableNotificationsButton].forEach(button => {
      if (button) {
        button.disabled = notificationSupported() && Notification.permission === "granted";
        button.textContent = Notification.permission === "granted" ? "Notifications On" : "Enable Notifications";
      }
    });
  }

  async function enableNotifications() {
    if (!notificationSupported()) {
      updateNotificationStatus();
      return;
    }

    const registration = await setupServiceWorker();

    if (!registration) {
      alert("Could not set up notifications. Refresh and try again.");
      return;
    }

    const permission = await Notification.requestPermission();
    updateNotificationStatus();

    if (permission === "granted") {
      await showPhoneNotification("Together Steps notifications enabled", {
        body: "You will be notified when coins, rewards, and important logs change.",
        tag: "notifications-enabled"
      });
    }
  }

  async function showPhoneNotification(title, options = {}) {
    if (!notificationSupported() || Notification.permission !== "granted") {
      return false;
    }

    try {
      const registration = serviceWorkerRegistration || await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: "icon.png",
        badge: "icon-192.png",
        vibrate: [120, 80, 120],
        data: { url: "./index.html" },
        ...options
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  function latestNotifyItem(data) {
    return normalizeHistory(data.history).find(item => {
      if (item.type === "coin" || item.type === "reward" || item.type === "prize") {
        return true;
      }

      return item.coinChange !== 0;
    });
  }

  async function maybeSendLatestNotification(data) {
    const item = latestNotifyItem(data);

    if (!item) {
      return;
    }

    const id = `${item.id}|${item.savedAt}|${item.coinChange}|${item.coinsAfter}`;
    const last = localStorage.getItem(LAST_NOTIFICATION_KEY);

    if (!notificationsReady) {
      localStorage.setItem(LAST_NOTIFICATION_KEY, id);
      notificationsReady = true;
      return;
    }

    if (id === last) {
      return;
    }

    localStorage.setItem(LAST_NOTIFICATION_KEY, id);

    if (item.coinChange !== 0) {
      const amount = Math.abs(item.coinChange);
      const title = item.coinChange > 0
        ? `Your child gained ${amount} coins`
        : `Your child lost ${amount} coins`;

      await showPhoneNotification(title, {
        body: `${item.text}. Total: ${item.coinsAfter}`,
        tag: `coin-${item.id}`
      });
    }
  }
  function initLocalOnlyMode() {
    setSyncStatus("Saved on this device", "offline");
  }


  let breathingInterval = null;
  let breathingStep = 0;

  function updateBreathingStep() {
    const steps = [
      { text: "Breathe in", helper: "Slowly breathe in through your nose." },
      { text: "Hold", helper: "Hold it gently." },
      { text: "Breathe out", helper: "Slowly breathe out." },
      { text: "Rest", helper: "Rest for a moment." }
    ];

    const step = steps[breathingStep % steps.length];

    if (elements.breathingText) {
      elements.breathingText.textContent = step.text;
    }

    if (elements.breathingHelper) {
      elements.breathingHelper.textContent = step.helper;
    }

    breathingStep += 1;
  }

  function startBreathingTool() {
    stopBreathingTool(false);
    breathingStep = 0;

    if (elements.breathingOrb) {
      elements.breathingOrb.classList.add("running");
    }

    updateBreathingStep();
    breathingInterval = window.setInterval(updateBreathingStep, 3000);
  }

  function stopBreathingTool(resetText = true) {
    if (breathingInterval) {
      window.clearInterval(breathingInterval);
      breathingInterval = null;
    }

    if (elements.breathingOrb) {
      elements.breathingOrb.classList.remove("running");
    }

    if (resetText && elements.breathingText) {
      elements.breathingText.textContent = "Breathe";
    }

    if (resetText && elements.breathingHelper) {
      elements.breathingHelper.textContent = "Tap start and follow the bubble.";
    }
  }

  function setupCalmTools() {
    if (elements.startBreathingButton) {
      elements.startBreathingButton.addEventListener("click", startBreathingTool);
    }

    if (elements.stopBreathingButton) {
      elements.stopBreathingButton.addEventListener("click", () => stopBreathingTool(true));
    }

    document.querySelectorAll(".tool-card[data-tool-message]").forEach(button => {
      button.addEventListener("click", () => {
        if (elements.toolMessage) {
          elements.toolMessage.textContent = button.dataset.toolMessage || "Choose a calm tool.";
        }
      });
    });
  }


  function connectEvents() {
    setupCalmTools();
    document.querySelectorAll(".nav-button").forEach(button => {
      button.addEventListener("click", () => switchPage(button.dataset.page));
    });

    elements.headerUnlockButton.addEventListener("click", async () => {
      if (childMode) {
        if (await verifyParentPin("enter Parent Mode")) {
          childMode = false;
          parentUnlocked = true;
          localStorage.setItem(CHILD_MODE_KEY, "false");
          switchPage("home");
        }
      } else {
        childMode = true;
        parentUnlocked = false;
        localStorage.setItem(CHILD_MODE_KEY, "true");
        switchPage("home");
      }

      updateParentLockDisplay();
      updateDisplay();
    });

    elements.parentPageUnlockButton.addEventListener("click", async () => { await verifyParentPin("unlock parent page"); });
    elements.settingsUnlockButton.addEventListener("click", async () => { await verifyParentPin("unlock settings"); });

    elements.themeSelect.addEventListener("change", event => setTheme(event.target.value));

    elements.deduct5Button.addEventListener("click", () => adjustCoins(-5));
    elements.deduct10Button.addEventListener("click", () => adjustCoins(-10));
    elements.deduct50Button.addEventListener("click", () => adjustCoins(-50));
    elements.add5Button.addEventListener("click", () => adjustCoins(5));
    elements.add10Button.addEventListener("click", () => adjustCoins(10));
    elements.add50Button.addEventListener("click", () => adjustCoins(50));

    elements.redLight.addEventListener("click", () => setLevel("red"));
    elements.amberLight.addEventListener("click", () => setLevel("amber"));
    elements.greenLight.addEventListener("click", () => setLevel("green"));
    elements.redLabel.addEventListener("click", () => setLevel("red"));
    elements.amberLabel.addEventListener("click", () => setLevel("amber"));
    elements.greenLabel.addEventListener("click", () => setLevel("green"));

    elements.resetTodayButton.addEventListener("click", resetToday);
    elements.collectPrizeButton.addEventListener("click", collectPrize);

    elements.enableNotificationsButton.addEventListener("click", enableNotifications);
    elements.settingsEnableNotificationsButton.addEventListener("click", enableNotifications);

    elements.saveQuickLogButton.addEventListener("click", saveQuickDailyLog);

    elements.addParentNoteButton.addEventListener("click", addOrUpdateNote);
    elements.noteAuthor.value = localStorage.getItem(NOTE_AUTHOR_KEY) || "";
    elements.noteAuthor.addEventListener("input", () => localStorage.setItem(NOTE_AUTHOR_KEY, elements.noteAuthor.value.trim()));
    elements.noteFilterSelect.addEventListener("change", updateParentNotes);

    elements.addRewardButton.addEventListener("click", addReward);

    elements.addCategoryButton.addEventListener("click", addCategory);

    elements.historyFilterSelect.addEventListener("change", updateHistory);
    elements.clearHistoryButton.addEventListener("click", clearHistory);

    elements.saveCalendarEntryButton.addEventListener("click", saveCalendarEntry);
    elements.deleteCalendarEntryButton.addEventListener("click", deleteCalendarEntry);
    elements.calendarDateInput.addEventListener("change", () => selectCalendarDay(elements.calendarDateInput.value));

    if (elements.addFamilyMemberButton) {
      elements.addFamilyMemberButton.addEventListener("click", addOrUpdateFamilyMember);
    }

    if (elements.cancelFamilyEditButton) {
      elements.cancelFamilyEditButton.addEventListener("click", clearFamilyForm);
    }

    document.querySelectorAll("[data-timer-minutes]").forEach(button => {
      button.addEventListener("click", () => setTimerDuration(button.dataset.timerMinutes));
    });

    if (elements.startTimerButton) {
      elements.startTimerButton.addEventListener("click", startVisualTimer);
    }

    if (elements.pauseTimerButton) {
      elements.pauseTimerButton.addEventListener("click", pauseVisualTimer);
    }

    if (elements.resetTimerButton) {
      elements.resetTimerButton.addEventListener("click", resetVisualTimer);
    }

    if (elements.setCustomTimerButton) {
      elements.setCustomTimerButton.addEventListener("click", setCustomTimerDuration);
    }

    elements.copyWeeklyReportButton.addEventListener("click", copyWeeklyReport);

    elements.saveCoinSettingsButton.addEventListener("click", saveCoinSettings);
    elements.changePinButton.addEventListener("click", changePin);

    if (elements.profilePhotoInput) {
      elements.profilePhotoInput.addEventListener("change", event => {
        const file = event.target.files && event.target.files[0];
        saveProfilePhotoFromFile(file);
      });
    }

    if (elements.removeProfilePhotoButton) {
      elements.removeProfilePhotoButton.addEventListener("click", removeProfilePhoto);
    }

    elements.exportDataButton.addEventListener("click", exportData);
    elements.resetCoinsButton.addEventListener("click", resetCoins);
    elements.clearAllDataButton.addEventListener("click", clearAllData);
    window.addEventListener("online", () => setSyncStatus("Saved on this device", "offline"));
    window.addEventListener("offline", () => setSyncStatus("Saved on this device", "offline"));
  }

  setTheme(getCurrentTheme());
  connectEvents();
  setupServiceWorker().finally(updateNotificationStatus);
  if (timerState.running) {
    startTimerTick();
  }
  updateDisplay();
  initLocalOnlyMode();
});
