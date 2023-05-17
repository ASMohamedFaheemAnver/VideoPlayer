import VideoPlayer from "react-video-player-extended";
import "./App.css";
import { useState } from "react";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const onPlay = () => {
    setIsPlaying(true);
  };

  const onPause = () => {
    setIsPlaying(false);
  };

  const onVolume = (value) => {
    setVolume(value);
  };

  return (
    <div>
      <VideoPlayer
        url="https://media.w3.org/2010/05/bunny/trailer.mp4"
        isPlaying={isPlaying}
        volume={volume}
        onPlay={onPlay}
        onPause={onPause}
        onVolume={onVolume}
      />
    </div>
  );
}

export default App;
