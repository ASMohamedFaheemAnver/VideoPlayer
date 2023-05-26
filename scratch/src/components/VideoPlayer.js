import "./styles.css";
import video from "../assets/vd.mp4";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useCallback, useEffect, useRef, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import Slider from "@mui/material/Slider";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const VideoPlayer = ({ left, size }) => {
  const videoPlayerContainerRef = useRef();
  const videoPlayerRef = useRef();
  const timelineHoverRef = useRef();
  const timelineClipRef = useRef();
  const timelineProgressRef = useRef();
  const timelineContainerRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState("high");
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const maxTime = ((left + size) / 100) * videoDuration;

  useEffect(() => {
    // if (left) videoPlayerRef.current.currentTime = (left / 100) * videoDuration;
    if (left && size && timelineClipRef.current) {
      timelineClipRef.current.style.left = left + "%";
      timelineClipRef.current.style.width = size + "%";
    }
  }, [left, size, videoDuration]);

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
      const tagName = document.activeElement.tagName.toLowerCase();
      if (tagName === "input") return;
      const key = e.key.toLowerCase();
      switch (key) {
        case " ":
          if (tagName === "button") return;
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
    const currentTime = videoPlayerRef?.current?.currentTime;
    if (maxTime && currentTime > maxTime) {
      togglePlayPauseVideo();
    }
    setCurrentTime(currentTime);
    if (timelineProgressRef.current) {
      timelineProgressRef.current.style.width =
        (currentTime / videoDuration) * 100 + "%";
    }
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

  function toggleFullScreenMode() {
    if (document.fullscreenElement == null) {
      setIsFullScreen(true);
      videoPlayerContainerRef?.current.requestFullscreen();
    } else {
      setIsFullScreen(false);
      document.exitFullscreen();
    }
  }

  return (
    <div
      ref={videoPlayerContainerRef}
      className={`main-container ${isFullScreen ? "full-screen" : ""}`}
    >
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
        <div ref={timelineContainerRef} className="timeline-container">
          <div
            onMouseMove={(e) => {
              if (timelineHoverRef.current)
                timelineHoverRef.current.style.width = e.clientX + "px";
            }}
            onMouseDown={(e) => {
              const timelineContainerState =
                timelineContainerRef.current?.getBoundingClientRect();
              const width = timelineContainerState.width;
              const currentPosition = e.clientX;
              const percent = currentPosition / width;
              videoPlayerRef.current.currentTime = percent * videoDuration;
            }}
            onMouseLeave={(e) => {
              timelineHoverRef.current.style.width = 0;
            }}
            className="timeline"
          >
            <div ref={timelineHoverRef} className="timeline-hover"></div>
            <div ref={timelineClipRef} className="timeline-clip"></div>
            <div ref={timelineProgressRef} className="timeline-progress"></div>
            <img className="preview-img" />
            <div className="thumb-indicator"></div>
          </div>
        </div>
        <div className="left">
          <div className="play-pause-container">
            {isPlaying ? (
              // To make it interact with tab, we need to make it as button
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
        <div className="left">
          <div className="full-screen-container">
            {isFullScreen ? (
              <FullscreenExitIcon
                onClick={toggleFullScreenMode}
                className="video-control-icon"
              />
            ) : (
              <FullscreenIcon
                onClick={toggleFullScreenMode}
                className="video-control-icon"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
