import "./styles.css";
import video from "../assets/vd.mp4";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useCallback, useEffect, useRef, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import Slider from "@mui/material/Slider";

const VideoPlayer = () => {
  const videoPlayerRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState("high");
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

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
          return;
        default:
          return;
      }
    },
    [togglePlayPauseVideo]
  );

  const onSliderValueChange = (value) => {
    setVolume(value);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.volume = value / 100;
    }
  };

  useEffect(() => {
    const videoPlayer = videoPlayerRef.current;
    document.addEventListener("keydown", onKeyDown);
    videoPlayer.addEventListener("volumechange", () => {
      if (videoPlayer.muted || videoPlayer.volume === 0) {
        setVolumeLevel("muted");
      } else if (videoPlayer.volume >= 0.5) {
        setVolumeLevel("high");
      } else {
        setVolumeLevel("low");
      }
    });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      videoPlayer.removeEventListener("volumechange", onKeyDown);
    };
  }, [onKeyDown]);

  const onTimeUpdate = () => {
    setCurrentTime(videoPlayerRef?.current?.currentTime);
  };

  const onLoadedData = () => {
    setVideoDuration(videoPlayerRef?.current?.duration);
  };

  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });

  function formatDuration(time) {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / (60 * 60));
    if (hours === 0) {
      return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
    }
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  }

  return (
    <div className="main-container">
      <video
        onClick={togglePlayPauseVideo}
        onPlay={onPlayState}
        onPause={onPauseState}
        ref={videoPlayerRef}
        className="video"
        src={video}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
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
        <div className="volume-container">
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
          <Slider
            value={volume}
            onChange={(_, value) => {
              onSliderValueChange(value);
            }}
            className="volume-slider"
          />
        </div>
        <div className="duration-info">
          <span>{formatDuration(currentTime)}</span>
          <span>/</span>
          <span>{formatDuration(videoDuration)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
