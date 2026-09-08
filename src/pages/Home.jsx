import { useState } from "react";
import DailyWords from "../features/DailyWords/DailyWords.jsx";
import WordSearch from "../features/WordSearch/WordSearch.jsx";

export default function Home() {
  const [wordSearchExpanded, setWordSearchExpanded] = useState(false);

  return (
    <>
      <h3>vPlayLearn welcomes you to the world of fun and learning.</h3>

      <DailyWords
        isCollapsed={wordSearchExpanded}
        onExpand={() => setWordSearchExpanded(false)}
      />

      <WordSearch
        isExpanded={wordSearchExpanded}
        onExpandedChange={setWordSearchExpanded}
      />

      <div>
        <span>Here we have </span>
        <ul>
          <li>Games to play</li>
          <li>Puzzles to solve</li>
          <li>Jokes to laugh</li>
          <li>Riddles to guess , think and answer</li>
          <li>Quotations to get inspired</li>
          <li>your own stories to publish and display</li>
          <li>Learn Idioms and proverbs in English , Kannada , Tamil , Telugu , Hindi</li> .....and more
        </ul>
      </div>
    </>
  );
}
