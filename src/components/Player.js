import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
  audioRef,
  currentSong,
  isPlaying,
  setIsPlaying,
  setSongInfo,
  songInfo,
  songs,
  setCurrentSong,
  setSongs,
  activeLibraryHandler,
}) => {
  // Event Handlers
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };
  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };
  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    let currentIndexSong = 0;
    if (direction === "skip-forward") {
      currentIndexSong = (currentIndex + 1) % songs.length;
      // await setCurrentSong(songs[currentIndexSong]);
      // activeLibraryHandler(songs[currentIndexSong]);
    } else {
      if ((currentIndex - 1) % songs.length === -1) {
        currentIndexSong = songs.length - 1;
        // await setCurrentSong(songs[currentIndexSong]);
        // activeLibraryHandler(songs[currentIndexSong]);
        // if (isPlaying) audioRef.current.play();
        return;
      } else {
        currentIndexSong = (currentIndex - 1) % songs.length;
        // await setCurrentSong(songs[currentIndexSong]);
        // activeLibraryHandler(songs[currentIndexSong]);
      }
    }
    await setCurrentSong(songs[currentIndexSong]);
    activeLibraryHandler(songs[currentIndexSong]);
    if (isPlaying) audioRef.current.play();
  };
  const spacebarFunction = (event) => {
    if (event.keyCode === 32) {
      playSongHandler();
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", spacebarFunction, false);

    return () => {
      document.removeEventListener("keydown", spacebarFunction, false);
    };
  });
  // Add styles
  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };
  return (
    <div className="player">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div
          style={{
            background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
          }}
          className="track"
        >
          <input
            type="range"
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
          />
          <div className="animate-track" style={trackAnim}></div>
        </div>
        <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-back")}
          className="skip-back"
          size="2x"
          icon={faAngleLeft}
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-forward")}
          className="skip-forward"
          size="2x"
          icon={faAngleRight}
        />
      </div>
    </div>
  );
};

export default Player;
