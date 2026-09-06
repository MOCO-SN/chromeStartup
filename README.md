# MooCSN Startup Page

A Chrome-style new tab/startup page built with React and Vite.

## Features

- **Audio Player** — Fetches tracks dynamically from `https://music.mocosn.in/data/tracks.json`. Includes play/pause, skip, volume, progress bar, and CSS visualizer.
- **Web Viewer** — Clicking side or bottom navigation links opens the target page in a fullscreen iframe within the same tab. Navigation and sidebar remain visible. A loading spinner overlay is shown while the iframe loads; clicking another button clears the previous page and loads the new one.
- **Bottom Navigation** — Grid of icon buttons for quick access to MooCSN services (Portfolio, Music, IRSO-LMS, Software, School, Chatting, Info Phone, Notification, MocoPlayer, Know About Bihar, Teacher, Home).
- **Side Navigation** — Right sidebar with social/profile links (GitHub, Twitter, LinkedIn, Facebook, Instagram, Profile).
- **Image Grid** — Shortcut cards with overlay titles.
- **Search** — Google search redirect.

## Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start development server (Vite) |
| `npm run build` | Build for production            |
| `npm run lint`  | Run Oxlint                      |
| `npm run preview` | Preview production build       |

## Icons

Navigation icons are provided by [react-icons](https://react-icons.github.io/react-icons/) using the Feather (`fi`) and Font Awesome (`fa`) icon sets.