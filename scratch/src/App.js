import { useState } from "react";
import "./App.css";
import TimeLine from "./components/Timeline";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  const [size, setSize] = useState(0);
  const [left, setLeft] = useState(0);
  return (
    <div>
      <VideoPlayer size={size} left={left} />
      <TimeLine setSize={setSize} setLeft={setLeft} />
    </div>
  );
}

export default App;
