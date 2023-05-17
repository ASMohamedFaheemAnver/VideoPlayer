import VideoPlayer from "react-video-player-extended";
import "./App.css";
import { useState } from "react";
import config from "./config";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState();
  const [volume, setVolume] = useState(0.7);
  const [clips, setClips] = useState([]);
  const [addClip, setAddClip] = useState(false);
  const [markers, setMarkers] = useState([]);

  const [addClipStartMarker, setAddClipStartMarker] = useState();
  const [addClipEndMarker, setAddClipEndMarker] = useState();

  const controls = [
    "Play",
    "Progress",
    "Time",
    "Volume",
    "LastFrame",
    "NextFrame",
    "AddMarker",
  ];

  const onPlay = () => {
    setIsPlaying(true);
  };

  const onPause = () => {
    setIsPlaying(false);
  };

  const onVolume = (value) => {
    setVolume(value);
  };

  const onMarkerAdded = (marker) => {
    if (!addClipStartMarker) {
      setAddClipStartMarker(marker);
    } else if (addClipStartMarker?.time > marker?.time) {
      setAddClipStartMarker(marker);
    } else {
      setAddClipEndMarker(marker);
    }
    if (addClipStartMarker && addClipEndMarker) {
      setMarkers([addClipStartMarker, addClipEndMarker]);
    }
  };

  const onMarkerClick = (marker) => {
    setSelectedMarker({
      ...marker,
      // To restart the timer on more than one click
      time: marker?.time + Math.random() / 1000000,
    });
  };

  const onToggleAddClip = () => {
    setAddClip((preState) => !preState);
  };

  return (
    <div>
      <VideoPlayer
        url={config.uri}
        isPlaying={isPlaying}
        volume={volume}
        onPlay={onPlay}
        onPause={onPause}
        onVolume={onVolume}
        onProgress={() => {}}
        controls={controls}
        markers={markers}
        onMarkerAdded={onMarkerAdded}
        selectedMarker={selectedMarker}
        onMarkerClick={onMarkerClick}
        timeStart={selectedMarker?.time}
      />
      {addClip ? (
        <button onClick={onToggleAddClip}>Cancel</button>
      ) : (
        <button onClick={onToggleAddClip}>Add Clip</button>
      )}
      {addClip && (
        <>
          <br />
          <select name="type" id="type">
            <option value="start">Start</option>
            <option value="main">Main</option>
            <option value="end">End</option>
          </select>
          <label>{addClipStartMarker?.time || "Start Time"}</label>
          <label>{addClipEndMarker?.time || "End Time"}</label>
          <button>Save</button>
        </>
      )}

      {clips.map((marker) => {
        return (
          <button
            onClick={() => {
              onMarkerClick(marker);
              setIsPlaying(true);
            }}
            key={marker.id}
          >
            {marker.id}
          </button>
        );
      })}
      <div>{JSON.stringify(clips)}</div>
    </div>
  );
}

export default App;
