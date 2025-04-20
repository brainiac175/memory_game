import React, { useEffect, useState } from "react";

const imagesPool = [
  "https://picsum.photos/id/1011/100",
  "https://picsum.photos/id/1015/100",
  "https://picsum.photos/id/1025/100",
  "https://picsum.photos/id/1035/100",
  "https://picsum.photos/id/1045/100",
  "https://picsum.photos/id/1055/100",
  "https://picsum.photos/id/1065/100",
  "https://picsum.photos/id/1075/100",
  "https://picsum.photos/id/1085/100",
  "https://picsum.photos/id/1095/100",
  "https://picsum.photos/id/1105/100",
  "https://picsum.photos/id/1115/100",
  "https://picsum.photos/id/1125/100",
  "https://picsum.photos/id/1135/100",
  "https://picsum.photos/id/1145/100",
  "https://picsum.photos/id/1155/100",
  "https://picsum.photos/id/1165/100",
  "https://picsum.photos/id/1175/100"
];

const difficulties = {
  easy: 2,
  medium: 4,
  hard: 6,
};

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function generateBoard(size) {
  const pairsCount = (size * size) / 2;
  const chosenImages = shuffle(imagesPool).slice(0, pairsCount);
  const cards = shuffle([...chosenImages, ...chosenImages]).map((src, i) => ({ id: i, src, matched: false }));
  return cards;
}

export default function App() {
  const [difficulty, setDifficulty] = useState("easy");
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);

  useEffect(() => {
    setCards(generateBoard(difficulties[difficulty]));
  }, [difficulty]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].src === cards[second].src) {
        const newCards = [...cards];
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped]);

  function handleClick(index) {
    if (flipped.length < 2 && !cards[index].matched && !flipped.includes(index)) {
      setFlipped([...flipped, index]);
    }
  }

  const gridSize = difficulties[difficulty];
  const allMatched = cards.length > 0 && cards.every((card) => card.matched);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-2 text-center">Mylz's Memory Game</h1>
      <div className="flex gap-2 mb-4">
        {Object.keys(difficulties).map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`px-4 py-2 rounded ${difficulty === level ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`, width: "100%", maxWidth: 600 }}
      >
        {cards.map((card, i) => (
          <div
            key={card.id}
            onClick={() => handleClick(i)}
            className={`cursor-pointer aspect-square rounded shadow-md flex items-center justify-center border border-gray-300 ${
              flipped.includes(i) || card.matched ? "bg-white" : "bg-gray-300"
            }`}
          >
            {(flipped.includes(i) || card.matched) && (
              <img src={card.src} alt="card" className="w-full h-full object-cover rounded" />
            )}
          </div>
        ))}
      </div>

      {allMatched && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold">🎉 You matched all the cards!</p>
          <button className="mt-2 bg-green-500 px-4 py-2 text-white rounded" onClick={() => setCards(generateBoard(gridSize))}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
