import React from "react";
import Quotation from "./quotation/Quotation";
import Jokes from "./jokes/jokes";
import "./rightpane.css";
import PublishedStories from "./published-stories/PublishedStories";
import RiddleCard from "./riddle/riddle";

const RightPane = () => {
  return (
  <div className="right-pane">
      {/* <Quotation title="Daily Quote" content="quotes" /> */}
      <Jokes title="Joke" content="jokes" />
      <RiddleCard/>
      <PublishedStories title="Published Stories" content="stories" />
      {/* <RiddleCard/> */}

  </div>  
  );
};

const styles = {
  pane: {
    width: "250px",
    height: "calc(100vh - 60px)",
    position: "fixed",
    right: 0,
    top: "60px",
    background: "#f3f4f6",
    borderLeft: "1px solid #ddd",
    padding: "15px",
  },
};

export default RightPane;