import VideoPlayer from "react-video-player-extended";
import "./App.css";
import { useEffect, useMemo, useRef, useState } from "react";
import config from "./config";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClip, setSelectedClip] = useState();
  const [volume, setVolume] = useState(0.7);
  const [clips, setClips] = useState([]);
  const [addClip, setAddClip] = useState(false);
  const [markers, setMarkers] = useState([]);

  const [addClipStartMarker, setAddClipStartMarker] = useState();
  const [addClipEndMarker, setAddClipEndMarker] = useState();

  const initialControllers = useMemo(
    () => ["Play", "Progress", "Time", "Volume", "LastFrame", "NextFrame"],
    []
  );

  const [controls, setControls] = useState(initialControllers);

  useEffect(() => {
    if (addClip) {
      setControls([...initialControllers, "AddMarker"]);
    } else {
      setControls(initialControllers);
    }
  }, [addClip, initialControllers]);

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
  };

  useEffect(() => {
    if (addClipStartMarker && !addClipEndMarker) {
      setMarkers([addClipStartMarker]);
    }
    if (addClipStartMarker && addClipEndMarker) {
      setMarkers([addClipStartMarker, addClipEndMarker]);
    }
  }, [addClipStartMarker, addClipEndMarker]);

  const onClearAddOrEditClip = () => {
    if (markers.length) {
      setAddClipStartMarker(null);
      setAddClipEndMarker(null);
      setMarkers([]);
    }
  };

  const onToggleAddClip = () => {
    setAddClip((preState) => {
      onClearAddOrEditClip();
      return !preState;
    });
  };

  const onSaveClip = () => {
    if (addClipStartMarker && addClipEndMarker) {
      setClips([
        ...clips,
        { start: addClipStartMarker, end: addClipEndMarker },
      ]);

      onToggleAddClip();
    } else {
      alert("Clip is not valid");
    }
  };

  const onPlayClip = (clip) => {
    setSelectedClip({
      ...clip,
      start: {
        ...clip?.start,
        time: clip?.start?.time + Math.random() / 1000000,
      },
    });
    setIsPlaying(true);
    setMarkers([clip?.start, clip?.end]);
  };

  const onClearSelectedClip = () => {
    setSelectedClip(null);
    setMarkers([]);
  };

  const selectedClipRef = useRef(null);
  selectedClipRef.current = selectedClip;
  const onProgress = (_, props) => {
    if (
      selectedClipRef.current &&
      !!(props?.currentTime >= selectedClipRef.current?.end?.time)
    ) {
      setIsPlaying(false);
    }
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
        onProgress={onProgress}
        controls={controls}
        markers={markers}
        onMarkerAdded={onMarkerAdded}
        timeStart={selectedClip?.start?.time}
      />
      {addClip ? (
        <button onClick={onToggleAddClip}>Cancel</button>
      ) : (
        <button onClick={onToggleAddClip}>Add Clip</button>
      )}
      {selectedClip && (
        <button onClick={onClearSelectedClip}>Clear clip markers</button>
      )}
      {addClip && (
        <>
          <br />
          <select name="type" id="type">
            <option value="start">Start</option>
            <option value="main">Main</option>
            <option value="end">End</option>
          </select>
          <label>{"Start Time"}</label>
          <input
            onChange={() => {}}
            type="number"
            value={addClipStartMarker?.time || 0}
          />
          <label> to </label>
          <label>{"End Time"}</label>
          <input
            onChange={() => {}}
            type="number"
            value={addClipEndMarker?.time || 0}
          />
          <button onClick={onSaveClip}>Save</button>
          <button onClick={onClearAddOrEditClip}>Clear</button>
        </>
      )}
      {clips.map((clip) => {
        return (
          <div key={clip?.start?.id}>
            <label>{clip?.start?.time + " to " + clip?.end?.time}</label>
            <button onClick={() => onPlayClip(clip)}>Play clip</button>
          </div>
        );
      })}
      <div>{JSON.stringify(clips)}</div>
    </div>
  );
}

export default App;
