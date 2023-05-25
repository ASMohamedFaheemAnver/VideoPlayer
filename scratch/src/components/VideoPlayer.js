import "./styles.css";
import video from "../assets/vd.mp4";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useCallback, useEffect, useRef, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
const VideoPlayer = () => {
  const videoPlayerRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState("high");

  const togglePlayPauseVideo = useCallback(() => {
    if (isPlaying) {
      videoPlayerRef?.current?.pause();
    } else {
      videoPlayerRef?.current?.play();
    }
  }, [isPlaying]);

  const toggleMuteUnMuteVideo = () => {
    if (videoPlayerRef?.current) {
      videoPlayerRef.current.muted = !videoPlayerRef.current.muted;
    }
  };

  const onPlayState = () => {
    setIsPlaying(true);
  };

  const onPauseState = () => {
    setIsPlaying(false);
  };

  const onKeyDown = useCallback(
    (e) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case " ":
          togglePlayPauseVideo();
          return;
        case "m":
          toggleMuteUnMuteVideo();
        default:
          return;
      }
    },
    [togglePlayPauseVideo]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    videoPlayerRef.current.addEventListener("volumechange", () => {
      if (videoPlayerRef.current.muted || videoPlayerRef.current.volume === 0) {
        setVolumeLevel("muted");
      } else if (videoPlayerRef.current.volume >= 0.5) {
        setVolumeLevel("high");
      } else {
        setVolumeLevel("low");
      }
    });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div className="main-container">
      <video
        onClick={togglePlayPauseVideo}
        onPlay={onPlayState}
        onPause={onPauseState}
        ref={videoPlayerRef}
        className="video"
        src={video}
      />
      <div className="video-controls-container">
        <div className="play-pause-container">
          {isPlaying ? (
            <PauseIcon
              onClick={togglePlayPauseVideo}
              className="video-control-icon"
            />
          ) : (
            <PlayArrowIcon
              onClick={togglePlayPauseVideo}
              className="video-control-icon"
            />
          )}
        </div>
        <div>
          {volumeLevel === "high" ? (
            <VolumeUpIcon
              onClick={toggleMuteUnMuteVideo}
              className="video-control-icon"
            />
          ) : volumeLevel === "low" ? (
            <VolumeDownIcon
              onClick={toggleMuteUnMuteVideo}
              className="video-control-icon"
            />
          ) : (
            <VolumeOffIcon
              onClick={toggleMuteUnMuteVideo}
              className="video-control-icon"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
