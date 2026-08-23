import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  FiBriefcase,
  FiMusic,
  FiBookOpen,
  FiMonitor,
  FiHome,
  FiMessageCircle,
  FiPhone,
  FiBell,
  FiMapPin,
  FiUser,
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiMap
} from "react-icons/fi";
import {
  FaYoutube,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaTwitter
} from "react-icons/fa";

import "./App.css";
import audioData from "./data/audio.json";



/* =========================================================
   TOP NAVIGATION
========================================================= */

const topButtons = [
  {
    id: "gmail",
    label: "Gmail",
    href: "https://mail.google.com/"
  },
  {
    id: "developer",
    label: "Developer",
    href: "https://mocosn.in"
  }
];


/* =========================================================
   IMAGE GRID
========================================================= */

const gridButtons = [
  {
    id: 1,
    title: "Vadodara, Gujarat",
    image: "/images/grid.jpg",
    href: "#images"
  },
  {
    id: 2,
    title: "Airport, Kolkata",
    image: "/images/grid1.jpg",
    href: "#developer"
  },
  {
    id: 3,
    title: "Bhagalpur, Bihar",
    image: "/images/grid2.jpg",
    href: "#projects"
  },
  {
    id: 4,
    title: "Station, Haridwar",
    image: "/images/grid3.jpg",
    href: "#design"
  },
  {
    id: 5,
    title: "Bhagalpur, Bihar",
    image: "/images/grid4.jpg",
    href: "#tools"
  },
  {
    id: 6,
    title: "Chapra, Bihar",
    image: "/images/grid5.jpg",
    href: "#more"
  }
];


/* =========================================================
   BOTTOM NAVIGATION
========================================================= */

const bottomButtons = [
  {
    id: "Portfolio",
    href: "https://mocosn.in",
    image: "/images/bg.avif"
  },
  {
    id: "Music",
    href: "https://music.mocosn.in",
    image: "/images/bg.avif"
  },
  {
    id: "IRSO-LMS",
    href: "https://iirslms.mocosn.in/",
    image: "/images/bg.avif"
  },
  {
    id: "Software",
    href: "https://software.mocosn.in/",
    image: "/images/bg.avif"
  },
  {
    id: "school",
    href: "https://sbcm.mocosn.in/",
    image: "/images/bg.avif"
  },
  {
    id: "chatting",
    href: "https://chat.mocosn.in/",
    image: "/images/bg.avif"
  },
  {
    id: "info-phone",
    href: "https://phoneinfo.mocosn.in/",
    image: "/images/bg.avif"
  },
  {
    id: "notification",
    href: "https://edvyra.com/",
    image: "/images/bg.avif"
  },
  {
    id: "app",
    href: "https://mocoplayer.mocosn.in/",
    image: "/images/bg.avif"
  },
  {
    id: "know-about-bihar",
    href: "https://biharbhraman.in/",
    image: "/images/bg.avif"
  },
  {
    id: "teacher",
    href: "https://teacher.mocosn.in/",
    image: "/images/bg.avif"
  }
];


/* =========================================================
    TIME FORMAT
========================================================= */

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}


/* =========================================================
   APP
========================================================= */

function App() {

  /* =======================================================
     TRACKS
  ======================================================= */

  const tracks = Array.isArray(audioData?.tracks)
    ? audioData.tracks
    : [];


  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] = useState("");


  /* =======================================================
     ACTIVE NAV
  ======================================================= */

  const [activeNav, setActiveNav] = useState("home");


  /* =======================================================
     CURRENT TRACK
  ======================================================= */

  const [currentTrackId, setCurrentTrackId] = useState(
    tracks[0]?.id || null
  );


  /* =======================================================
     PLAYING
  ======================================================= */

  const [isPlaying, setIsPlaying] = useState(false);


  /* =======================================================
     CURRENT TIME
  ======================================================= */

  const [currentTime, setCurrentTime] = useState(0);


  /* =======================================================
     DURATION
  ======================================================= */

  const [duration, setDuration] = useState(0);


  /* =======================================================
     VOLUME
  ======================================================= */

  const [volume, setVolume] = useState(1);


  /* =======================================================
     AUDIO REF
  ======================================================= */

  const audioRef = useRef(null);


  /* =======================================================
     FIND CURRENT TRACK
  ======================================================= */

  const currentTrackIndex = tracks.findIndex(
    (item) => item.id === currentTrackId
  );


  const track =
    currentTrackIndex >= 0
      ? tracks[currentTrackIndex]
      : tracks[0] || null;


  /* =======================================================
     SEARCH
  ======================================================= */

  const submitSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(value)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };


  /* =======================================================
     LOAD TRACK
  ======================================================= */

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio || !track?.url) {
      return;
    }

    /*
      Important:
      We use the normal HTML audio element directly.

      Do NOT use:
      createMediaElementSource()

      This allows your R2 audio URL to play normally.
    */

    audio.src = track.url;

    audio.load();

    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {

      const playPromise = audio.play();

      if (playPromise) {
        playPromise.catch((error) => {
          console.error(
            "Unable to play track:",
            error
          );

          setIsPlaying(false);
        });
      }
    }

  }, [currentTrackId]);


  /* =======================================================
     VOLUME
  ======================================================= */

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;

  }, [volume]);


  /* =======================================================
     AUDIO EVENTS
  ======================================================= */

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio) {
      return;
    }


    const handleLoadedMetadata = () => {

      if (
        Number.isFinite(audio.duration)
      ) {
        setDuration(audio.duration);
      }

    };


    const handleTimeUpdate = () => {

      setCurrentTime(
        audio.currentTime
      );

    };


    const handlePlay = () => {

      setIsPlaying(true);

    };


    const handlePause = () => {

      setIsPlaying(false);

    };


    const handleEnded = () => {

      if (!tracks.length) {
        return;
      }

      const nextIndex =
        currentTrackIndex >= tracks.length - 1
          ? 0
          : currentTrackIndex + 1;

      setCurrentTrackId(
        tracks[nextIndex].id
      );

      setIsPlaying(true);

    };


    const handleError = () => {

      console.error(
        "Audio error:",
        audio.error
      );

      setIsPlaying(false);

    };


    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "play",
      handlePlay
    );

    audio.addEventListener(
      "pause",
      handlePause
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    audio.addEventListener(
      "error",
      handleError
    );


    return () => {

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "play",
        handlePlay
      );

      audio.removeEventListener(
        "pause",
        handlePause
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );

      audio.removeEventListener(
        "error",
        handleError
      );

    };

  }, [
    currentTrackIndex,
    tracks
  ]);


  /* =======================================================
     PLAY / PAUSE
  ======================================================= */

  const togglePlay = async () => {

    const audio = audioRef.current;

    if (!audio || !track?.url) {
      console.warn(
        "No audio URL available."
      );

      return;
    }


    try {

      if (audio.paused) {

        /*
          This is triggered directly by
          the button click, so browser
          autoplay restrictions are satisfied.
        */

        await audio.play();

        setIsPlaying(true);

      } else {

        audio.pause();

        setIsPlaying(false);

      }

    } catch (error) {

      console.error(
        "Audio playback failed:",
        error
      );

      setIsPlaying(false);

    }

  };


  /* =======================================================
     SELECT TRACK
  ======================================================= */

  const selectTrack = (id) => {

    const index = tracks.findIndex(
      (item) => item.id === id
    );

    if (index === -1) {
      return;
    }

    const audio = audioRef.current;

    setCurrentTrackId(id);

    setCurrentTime(0);

    if (audio) {
      audio.pause();
    }

    setIsPlaying(true);

  };


  /* =======================================================
     PREVIOUS
  ======================================================= */

  const previousTrack = () => {

    if (!tracks.length) {
      return;
    }

    const index =
      currentTrackIndex <= 0
        ? tracks.length - 1
        : currentTrackIndex - 1;

    selectTrack(
      tracks[index].id
    );

  };


  /* =======================================================
     NEXT
  ======================================================= */

  const nextTrack = () => {

    if (!tracks.length) {
      return;
    }

    const index =
      currentTrackIndex >= tracks.length - 1
        ? 0
        : currentTrackIndex + 1;

    selectTrack(
      tracks[index].id
    );

  };


  /* =======================================================
     PROGRESS
  ======================================================= */

  const changeProgress = (event) => {

    const value =
      Number(event.target.value);

    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = value;

    setCurrentTime(value);

  };


  /* =======================================================
     NAV CLICK
  ======================================================= */

  const handleNavClick = (id) => {

    setActiveNav(id);

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="home">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="background" />


      {/* =================================================
          TOP NAVIGATION
      ================================================= */}

      <header className="top-navigation">

        {topButtons.map((button) => (

          <a
            key={button.id}
            href={button.href}
            target="_blank"
            rel="noreferrer"
            className="top-pill"
          >
            {button.label}
          </a>

        ))}


        <a
          href="#profile"
          className="profile"
        >

          <img
            src="/images/profile.jpg"
            alt="Profile"
          />

        </a>

      </header>


      {/* =================================================
          SEARCH
      ================================================= */}

      <form
        className="search-container"
        onSubmit={submitSearch}
      >

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search Here"
          aria-label="Search"
        />


        <button
          className="search-submit"
          type="submit"
          aria-label="Search"
        >
          →
        </button>

      </form>


      {/* =================================================
          IMAGE GRID
      ================================================= */}

      <section
        id="home"
        className="shortcut-grid"
      >

        {gridButtons.map((button) => (

          <a
            key={button.id}
            // href={button.href}
            className="shortcut-card"
          >

            <img
              src={button.image}
              alt={button.title}
              className="shortcut-image"
            />


            <div className="shortcut-overlay">

              <span>
                {button.title}
              </span>

            </div>

          </a>

        ))}

      </section>


      {/* =================================================
          AUDIO PLAYER
          RIGHT SIDE OF GRID
      ================================================= */}

      <section className="audio-player">

        {/* =================================================
            REAL AUDIO ELEMENT
        ================================================= */}

        <audio
          ref={audioRef}
          preload="metadata"
        />


        {/* =================================================
            DISC
        ================================================= */}

        <div
          className={`audio-disc ${
            isPlaying
              ? "audio-disc-playing"
              : ""
          }`}
        >

          <div className="disc-ring">

            <div className="disc-inner">

              <span className="disc-center" />

            </div>

          </div>

        </div>


        {/* =================================================
            SONG INFORMATION
        ================================================= */}

        <div className="track-information">

          <div className="track-title">

            {track?.title ||
              "No Track"}

          </div>


          <div className="track-artist">

            {track?.artist ||
              "Unknown Artist"}

          </div>

        </div>


        {/* =================================================
            ACTIVE VISUALIZER

            CSS visualizer is used instead of
            Web Audio API, so external R2
            audio can play normally.
        ================================================= */}

        <div
          className={`audio-visualizer ${
            isPlaying
              ? "visualizer-playing"
              : ""
          }`}
          aria-hidden="true"
        >

          {Array.from({
            length: 24
          }).map((_, index) => (

            <span
              key={index}
              style={{
                "--bar-index": index
              }}
            />

          ))}

        </div>


        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="progress-container">

          <span>
            {formatTime(currentTime)}
          </span>


          <input
            className="progress"
            type="range"
            min="0"
            max={duration || 0}
            value={
              Math.min(
                currentTime,
                duration || 0
              )
            }
            step="0.1"
            onChange={changeProgress}
          />


          <span>
            {formatTime(duration)}
          </span>

        </div>


        {/* =================================================
            CONTROLS
        ================================================= */}

        <div className="player-controls">

          {/* PREVIOUS */}

          <button
            type="button"
            className="player-control"
            onClick={previousTrack}
            aria-label="Previous"
          >

            <FiSkipBack size={17} />

          </button>


          {/* PLAY / PAUSE */}

          <button
            type="button"
            className="play-button"
            onClick={togglePlay}
            aria-label={
              isPlaying
                ? "Pause"
                : "Play"
            }
          >

            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}

          </button>


          {/* NEXT */}

          <button
            type="button"
            className="player-control"
            onClick={nextTrack}
            aria-label="Next"
          >

            <FiSkipForward size={17} />

          </button>


          {/* VOLUME */}

          <div className="volume-control">

            <FiVolume2 size={17} />


            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) =>
                setVolume(
                  Number(event.target.value)
                )
              }
              aria-label="Volume"
            />

          </div>

        </div>

      </section>


      {/* =================================================
          RIGHT SIDEBAR
      ================================================= */}

<aside className="right-sidebar">

  <div className="side-buttons">

    <a href="https://github.com/MOCO-SN/">
      <FaGithub size={20} className="side-icon" />
    </a>

    <a href="#x">
      <FaTwitter size={20} className="side-icon" />
    </a>

    <a href="https://www.linkedin.com/in/sachin-patel-b5106a295/">
      <FaLinkedin size={20} className="side-icon" />
    </a>

    <a href="#facebook">
      <FaFacebook size={20} className="side-icon" />
    </a>

    <a href="https://www.instagram.com/_sachin_2006_01/">
      <FaInstagram size={20} className="side-icon" />
    </a>

    <a href="htts://mocosn.in/">
      <FiUser size={20} className="side-icon" />
    </a>

  </div>

</aside>


      {/* =================================================
          BOTTOM NAVIGATION
          KEPT AS NAVIGATION
      ================================================= */}

      <div className="bottom-bar">

        <nav className="bottom-navigation">

          {bottomButtons.map((button) => {

              const iconMap = {
                "Portfolio": <FiBriefcase size={20} key="portfolio" />,
                "Music": <FiMusic size={20} key="music" />,
                "IRSO-LMS": <FiBookOpen size={20} key="irso" />,
                "Software": <FiMonitor size={20} key="software" />,
                "school": <FiHome size={20} key="school" />,
                "chatting": <FiMessageCircle size={20} key="chatting" />,
                "info-phone": <FiPhone size={20} key="phone" />,
                "notification": <FiBell size={20} key="notification" />,
                "app": <FiPlay size={20} key="app" />,
                "manage-school": <FiHome size={20} key="manage" />,
                "know-about-bihar": <FiMapPin size={20} key="bihar" />,
                "teacher": <FiUser size={20} key="teacher" />
              };

              const icon = iconMap[button.id];

              return (

                <a
                  key={button.id}
                  href={button.href}
                  className={`bottom-link ${
                    activeNav === button.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleNavClick(button.id)
                  }
                >

                  {icon}

                </a>

              );

            })}

        </nav>

      </div>

    </div>

  );
}


export default App;