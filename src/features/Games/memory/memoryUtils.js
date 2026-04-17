const gameConfig = {
  rows: 4,
  cols: 4,
  previewTime: 5000, // ms
  content: ["🍎", "🚀", "🐱", "🎮", "⚽", "🎧", "🌈", "🔥"], // auto paired
};

function generateCards(config) {
  const totalCards = config.rows * config.cols;

  // take only needed items
  const needed = config.content.slice(0, totalCards / 2);

  const paired = [...needed, ...needed].map((item, i) => ({
    id: i,
    value: item,
  }));

  return paired.sort(() => Math.random() - 0.5);
}