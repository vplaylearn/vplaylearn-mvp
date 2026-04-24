export const ANAGRAM_MODES = {
  EASY: {
    words: [
      { base: "cat", answers: ["act", "tac"] },
      { base: "dog", answers: ["god"] },
      { base: "bat", answers: ["tab"] },
      { base: "rat", answers: ["tar", "art"] },
      { base: "arc", answers: ["car"] },
      { base: "tap", answers: ["pat", "apt"] },
      { base: "bow", answers: ["wob"] },
      { base: "ear", answers: ["are", "era"] },
      { base: "ate", answers: ["eat", "tea"] },
      { base: "owl", answers: ["low"] }
    ],
  },

  MEDIUM: {
    words: [
      { base: "listen", answers: ["silent", "enlist", "tinsel", "inlets"] },
      { base: "evil", answers: ["vile", "veil", "live"] },
      { base: "dusty", answers: ["study"] },
      { base: "night", answers: ["thing"] },
      { base: "inch", answers: ["chin"] },
      { base: "brag", answers: ["grab"] },
      { base: "save", answers: ["vase"] },
      { base: "cider", answers: ["cried"] },
      { base: "bored", answers: ["robed"] },
      { base: "heart", answers: ["earth", "hater"] },
      { base: "fired", answers: ["fried"] },
      { base: "angel", answers: ["glean", "angle"] }
    ],
  },

  HARD: {
    words: [
      { base: "react", answers: ["trace", "crate", "cater", "caret"] },
      { base: "angle", answers: ["angel", "glean"] },
      { base: "rescue", answers: ["secure", "recuse"] },
      { base: "finder", answers: ["friend", "redfin"] },
      { base: "admirer", answers: ["married"] },
      { base: "players", answers: ["parsley", "replays", "sparely"] },
      { base: "cinema", answers: ["iceman", "anemic"] },
      { base: "teacher", answers: ["cheater", "hectare"] },
      { base: "triangle", answers: ["integral", "altering", "relating"] },
      { base: "conversation", answers: ["voicesranton"] }, // fun complex one
      { base: "dictionary", answers: ["indicatory"] },
      { base: "elbow", answers: ["below"] }
    ],
  },
};