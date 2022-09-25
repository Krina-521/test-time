import React, { useState } from "react";
import "./App.css";
import Start from "./components/Start/Start";
import Quiz from "./components/Quiz/Quiz";

function App() {
  const [start, setStart] = useState(false);
  return (
    <div className="quiz">{start ? <Quiz /> : <Start props={setStart} />}</div>
  );
}

export default App;
