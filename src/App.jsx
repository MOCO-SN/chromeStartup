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
  FiList,
  FiChevronDown,
  FiCheck
} from "react-icons/fi";
import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaTwitter
} from "react-icons/fa";

import "./App.css";



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
  },
  {
    id: "home",
    href: "#home",
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
     TRACKS & PLAYLISTS
  ======================================================= */

  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("all");
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isTracksListOpen, setIsTracksListOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);


  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] = useState("");


  /* =======================================================
     ACTIVE NAV
  ======================================================= */

  const [activeNav, setActiveNav] = useState("home");

  const [activeUrl, setActiveUrl] = useState("");


  /* =======================================================
     CURRENT TRACK
  ======================================================= */

  const [currentTrackId, setCurrentTrackId] = useState(null);


  /* =======================================================
     PLAYING
  ======================================================= */

  const [isPlaying, setIsPlaying] = useState(false);


  /* =======================================================
     CURRENT TIME & DURATION & VOLUME
  ======================================================= */

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);


  /* =======================================================
     REFS
  ======================================================= */

  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const lastLoadedTrackIdRef = useRef(null);


  /* =======================================================
     FETCH REMOTE TRACKS
  ======================================================= */

  useEffect(() => {

    fetch("https://music.mocosn.in/data/tracks.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {

        if (Array.isArray(data?.tracks) && data.tracks.length > 0) {

          const normalized = data.tracks.map((item, index) => ({
            ...item,
            id:
              item.id ||
              `${item.playlist || "track"}-${index}-${encodeURIComponent(
                item.title || `song-${index}`
              )}`
          }));

          setTracks(normalized);

          setCurrentTrackId(
            (prev) => prev || normalized[0]?.id || null
          );

        }
      })
      .catch((error) => {

        console.error(
          "Failed to load tracks from remote:",
          error
        );

      });

  }, []);


  /* =======================================================
     PLAYLIST CALCULATION
  ======================================================= */

  const playlists = [
    { id: "all", name: "All Songs", count: tracks.length },
    ...Array.from(
      new Set(
        tracks
          .map((t) => (t.playlist ? t.playlist.trim() : ""))
          .filter(Boolean)
      )
    ).map((pl) => ({
      id: pl,
      name: pl.charAt(0).toUpperCase() + pl.slice(1),
      count: tracks.filter((t) => t.playlist === pl).length
    }))
  ];

  const playlistTracks =
    selectedPlaylist === "all"
      ? tracks
      : tracks.filter(
          (t) =>
            (t.playlist || "").toLowerCase() === selectedPlaylist.toLowerCase()
        );

  const currentTrackIndex = playlistTracks.findIndex(
    (item) => item.id === currentTrackId
  );

  const track =
    currentTrackIndex >= 0
      ? playlistTracks[currentTrackIndex]
      : playlistTracks[0] || tracks[0] || null;


  /* =======================================================
     CLOSE DROPDOWNS ON OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        playerRef.current &&
        !playerRef.current.contains(e.target)
      ) {
        setIsPlaylistOpen(false);
        setIsTracksListOpen(false);
      }
    };

    if (isPlaylistOpen || isTracksListOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isPlaylistOpen, isTracksListOpen]);


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

    if (lastLoadedTrackIdRef.current !== track.id) {
      lastLoadedTrackIdRef.current = track.id;

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
    }

  }, [track, isPlaying]);


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

      if (!playlistTracks.length) {
        return;
      }

      const nextIndex =
        currentTrackIndex >= playlistTracks.length - 1
          ? 0
          : currentTrackIndex + 1;

      setCurrentTrackId(
        playlistTracks[nextIndex].id
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
    playlistTracks
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
     PLAYLIST CHANGE
  ======================================================= */

  const handlePlaylistChange = (playlistId) => {
    setSelectedPlaylist(playlistId);
    setIsPlaylistOpen(false);

    const filtered =
      playlistId === "all"
        ? tracks
        : tracks.filter(
            (t) => (t.playlist || "").toLowerCase() === playlistId.toLowerCase()
          );

    if (filtered.length > 0) {
      const exists = filtered.some((t) => t.id === currentTrackId);
      if (!exists) {
        selectTrack(filtered[0].id, isPlaying);
      }
    }
  };


  /* =======================================================
     SELECT TRACK
  ======================================================= */

  const selectTrack = (id, shouldPlay = true) => {

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

    setIsPlaying(shouldPlay);

  };


  /* =======================================================
     PREVIOUS
  ======================================================= */

  const previousTrack = () => {

    if (!playlistTracks.length) {
      return;
    }

    const index =
      currentTrackIndex <= 0
        ? playlistTracks.length - 1
        : currentTrackIndex - 1;

    selectTrack(
      playlistTracks[index].id,
      true
    );

  };


  /* =======================================================
     NEXT
  ======================================================= */

  const nextTrack = () => {

    if (!playlistTracks.length) {
      return;
    }

    const index =
      currentTrackIndex >= playlistTracks.length - 1
        ? 0
        : currentTrackIndex + 1;

    selectTrack(
      playlistTracks[index].id,
      true
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


  const handleExternalNav = (url) => {

    setActiveUrl(url);

    setIsLoading(true);

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className={`home ${activeUrl ? "web-viewer-active" : ""}`}>

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
          DASHBOARD MAIN CONTAINER
      ================================================= */}

      <main className={`dashboard-container ${activeUrl ? "hidden" : ""}`}>

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
            DASHBOARD CONTENT: GRID + AUDIO PLAYER
        ================================================= */}

        <div className="dashboard-content">

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

      <section
        ref={playerRef}
        className={`audio-player ${activeUrl ? "hidden" : ""}`}
      >

        {/* =================================================
            REAL AUDIO ELEMENT
        ================================================= */}

        <audio
          ref={audioRef}
          preload="metadata"
        />


        {/* =================================================
            PLAYLIST SELECTOR BAR
        ================================================= */}

        <div className="playlist-bar">

          <div className="playlist-picker-wrapper">

            <button
              type="button"
              className={`playlist-picker-btn ${
                isPlaylistOpen ? "active" : ""
              }`}
              onClick={() => {
                setIsPlaylistOpen((prev) => !prev);
                setIsTracksListOpen(false);
              }}
              aria-label="Select Playlist"
              title="Choose Playlist"
            >
              <FiList size={13} className="playlist-btn-icon" />
              <span className="playlist-btn-text">
                {playlists.find((p) => p.id === selectedPlaylist)?.name || "Playlist"}
              </span>
              <FiChevronDown
                size={13}
                className={`playlist-chevron ${
                  isPlaylistOpen ? "rotated" : ""
                }`}
              />
            </button>

            {isPlaylistOpen && (
              <div className="playlist-dropdown-menu">
                <div className="playlist-dropdown-header">
                  <span>Playlists</span>
                  <span className="playlist-total-count">
                    {playlists.length - 1} categories
                  </span>
                </div>

                <div className="playlist-options-list">
                  {playlists.map((pl) => {
                    const isSelected = selectedPlaylist === pl.id;

                    return (
                      <button
                        key={pl.id}
                        type="button"
                        className={`playlist-option-btn ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => handlePlaylistChange(pl.id)}
                      >
                        <span className="playlist-option-name">
                          {pl.name}
                        </span>
                        <span className="playlist-option-badge">
                          {pl.count}
                        </span>
                        {isSelected && (
                          <FiCheck
                            size={13}
                            className="playlist-check-icon"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>


          {/* TRACKS LIST BUTTON & DROPDOWN */}

          <div className="tracks-picker-wrapper">

            <button
              type="button"
              className={`tracks-view-btn ${
                isTracksListOpen ? "active" : ""
              }`}
              onClick={() => {
                setIsTracksListOpen((prev) => !prev);
                setIsPlaylistOpen(false);
              }}
              aria-label="View Tracks"
              title="View tracks in this playlist"
            >
              <FiMusic size={12} />
              <span className="tracks-count-pill">
                {playlistTracks.length}
              </span>
            </button>

            {isTracksListOpen && (
              <div className="tracks-dropdown-menu">
                <div className="playlist-dropdown-header">
                  <span>
                    {playlists.find((p) => p.id === selectedPlaylist)?.name || "Tracks"}
                  </span>
                  <span className="playlist-total-count">
                    {playlistTracks.length} songs
                  </span>
                </div>

                <div className="tracks-options-list">
                  {playlistTracks.map((t, idx) => {
                    const isCurrent = t.id === currentTrackId;

                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`track-option-btn ${
                          isCurrent ? "selected" : ""
                        }`}
                        onClick={() => {
                          selectTrack(t.id, true);
                          setIsTracksListOpen(false);
                        }}
                      >
                        <span className="track-option-idx">
                          {idx + 1}
                        </span>
                        <div className="track-option-info">
                          <span className="track-option-title">
                            {t.title}
                          </span>
                          <span className="track-option-artist">
                            {t.artist}
                          </span>
                        </div>
                        {isCurrent && (
                          <span className="track-playing-indicator">
                            {isPlaying ? "▶" : "❚❚"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>


        {/* =================================================
            PLAYER BODY / PILL ROW
        ================================================= */}

        <div className="player-body">

          {/* =================================================
              DISC / FLOWER EMBLEM
          ================================================= */}

          <div
            className={`audio-disc ${
              isPlaying
                ? "audio-disc-playing"
                : ""
            }`}
          >

            <div className="disc-flower" aria-hidden="true">
              <svg viewBox="0 0 100 100" className="flower-svg">
                <circle cx="50" cy="27" r="16" fill="rgba(255,255,255,0.4)" />
                <circle cx="66" cy="34" r="16" fill="rgba(255,255,255,0.45)" />
                <circle cx="73" cy="50" r="16" fill="rgba(255,255,255,0.4)" />
                <circle cx="66" cy="66" r="16" fill="rgba(255,255,255,0.45)" />
                <circle cx="50" cy="73" r="16" fill="rgba(255,255,255,0.4)" />
                <circle cx="34" cy="66" r="16" fill="rgba(255,255,255,0.45)" />
                <circle cx="27" cy="50" r="16" fill="rgba(255,255,255,0.4)" />
                <circle cx="34" cy="34" r="16" fill="rgba(255,255,255,0.45)" />
                <circle cx="50" cy="50" r="13" fill="rgba(10,10,14,0.6)" />
                <circle cx="50" cy="50" r="6" fill="#fff" />
              </svg>
            </div>

            <div className="disc-ring">

              <div className="disc-inner">

                <span className="disc-center" />

              </div>

            </div>

          </div>


          {/* =================================================
              SONG INFORMATION & PROGRESS
          ================================================= */}

          <div className="track-information">

            <div className="track-title-row">
              <div className="track-title">
                {track?.title ||
                  "No Track"}
              </div>

              {/* PILL PLAYLIST / EQUALIZER TRIGGER */}
              <button
                type="button"
                className="pill-playlist-trigger"
                onClick={() => {
                  setIsPlaylistOpen((prev) => !prev);
                  setIsTracksListOpen(false);
                }}
                title="Choose Playlist"
                aria-label="Choose Playlist"
              >
                <span className={`pill-bar-dot ${isPlaying ? "dot-anim-1" : ""}`} />
                <span className={`pill-bar-dot ${isPlaying ? "dot-anim-2" : ""}`} />
                <span className={`pill-bar-dot ${isPlaying ? "dot-anim-3" : ""}`} />
                <span className={`pill-bar-dot ${isPlaying ? "dot-anim-4" : ""}`} />
              </button>
            </div>


            <div className="track-artist">
              {track?.artist ||
                "Unknown Artist"}
            </div>


            {/* PROGRESS */}
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
                aria-label="Seek track"
              />


              <span>
                {formatTime(duration)}
              </span>

            </div>

          </div>


          {/* =================================================
              ACTIVE VISUALIZER (DESKTOP)
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

        </div>

      </section>

        </div>


        {/* =================================================
            MOBILE SOCIAL BAR (VISIBLE ONLY ON MOBILE/TABLET)
        ================================================= */}

        <div className="mobile-social-bar">

          <a
            href="https://github.com/MOCO-SN/"
            onClick={(e) => {
              e.preventDefault();
              handleExternalNav("https://github.com/MOCO-SN/");
            }}
            aria-label="GitHub"
          >
            <FaGithub size={18} className="side-icon" />
          </a>

          <a
            href="#x"
            aria-label="Twitter"
          >
            <FaTwitter size={18} className="side-icon" />
          </a>

          <a
            href="https://www.linkedin.com/in/sachin-patel-b5106a295/"
            onClick={(e) => {
              e.preventDefault();
              handleExternalNav("https://www.linkedin.com/in/sachin-patel-b5106a295/");
            }}
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} className="side-icon" />
          </a>

          <a
            href="#facebook"
            aria-label="Facebook"
          >
            <FaFacebook size={18} className="side-icon" />
          </a>

          <a
            href="https://www.instagram.com/_sachin_2006_01/"
            onClick={(e) => {
              e.preventDefault();
              handleExternalNav("https://www.instagram.com/_sachin_2006_01/");
            }}
            aria-label="Instagram"
          >
            <FaInstagram size={18} className="side-icon" />
          </a>

          <a
            href="https://mocosn.in/"
            onClick={(e) => {
              e.preventDefault();
              handleExternalNav("https://mocosn.in/");
            }}
            aria-label="Profile"
          >
            <FiUser size={18} className="side-icon" />
          </a>

        </div>

      </main>


      {/* =================================================
          RIGHT SIDEBAR (DESKTOP)
      ================================================= */}

      <aside className={`right-sidebar ${activeUrl ? "hidden" : ""}`}>

  <div className="side-buttons">

    <a href="https://github.com/MOCO-SN/" onClick={(e) => { e.preventDefault(); handleExternalNav("https://github.com/MOCO-SN/"); }}>
      <FaGithub size={20} className="side-icon" />
    </a>

    <a href="#x">
      <FaTwitter size={20} className="side-icon" />
    </a>

    <a href="https://www.linkedin.com/in/sachin-patel-b5106a295/" onClick={(e) => { e.preventDefault(); handleExternalNav("https://www.linkedin.com/in/sachin-patel-b5106a295/"); }}>
      <FaLinkedin size={20} className="side-icon" />
    </a>

    <a href="#facebook">
      <FaFacebook size={20} className="side-icon" />
    </a>

    <a href="https://www.instagram.com/_sachin_2006_01/" onClick={(e) => { e.preventDefault(); handleExternalNav("https://www.instagram.com/_sachin_2006_01/"); }}>
      <FaInstagram size={20} className="side-icon" />
    </a>

    <a href="htts://mocosn.in/" onClick={(e) => { e.preventDefault(); handleExternalNav("https://mocosn.in/"); }}>
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
                "teacher": <FiUser size={20} key="teacher" />,
                "home": <FiHome size={20} key="home" />
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
                  onClick={(e) => {
                    e.preventDefault();

                    handleNavClick(button.id);

                    if (button.id === "home") {

                      setActiveUrl("");

                    } else {

                      handleExternalNav(button.href);

                    }

                  }}
                >

                  {icon}

                </a>

              );

            })}

        </nav>

      </div>

      {activeUrl && (

        <section className="web-viewer">

          {isLoading && (

            <div className="web-loading">

              <div className="web-loading-card">

                <div className="web-loading-spinner-box">
                  <div className="web-loading-spinner" />
                  <div className="web-loading-spinner-glow" />
                </div>

                <div className="web-loading-content">
                  <h3 className="web-loading-title">moco is preparing for you</h3>
                  <p className="web-loading-subtitle">
                    Please wait while your page is loading
                  </p>
                  <div className="web-loading-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <button
                  type="button"
                  className="web-loading-close-btn"
                  onClick={() => {
                    setActiveUrl("");
                    setIsLoading(false);
                  }}
                >
                  Return to Home
                </button>

              </div>

            </div>

          )}

          <iframe
            src={activeUrl}
            title="Web Viewer"
            frameBorder="0"
            onLoad={() => setIsLoading(false)}
          />

        </section>

      )}

    </div>

  );
}


export default App;