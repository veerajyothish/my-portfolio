# Bondada Veera Jyothish — Portfolio Website

A premium, interactive, and highly accessible single-page portfolio website showcasing software development, graph algorithms, and AI engineering projects. Built with a tactile "quiet luxury" stationery design, this portfolio is designed to look clean, modern, and engaging.

Live Demo: [https://veerajyothish.github.io/my-portfolio](https://veerajyothish.github.io/my-portfolio) (or your deployment URL)

---

## 🎨 Key Features

*   **Tactile & Premium UI**: Stationery-style layout featuring clean borders, warm paper colors, and realistic masking-tape headings.
*   **Dual Theme Controller**: Full light and dark mode support using CSS custom properties (`--surface`, `--card-bg`, etc.) with seamless transitions.
*   **Split Panel Entrance Loader**: A sleek vertical panel entry animation with a percentage progress bar and a custom retro chime audio cue upon completion.
*   **3D Card Hover Tilt**: Subtle mouse-tracking perspective tilt effect on content cards that responds dynamically to cursor coordinates.
*   **Interactive Retro Terminal**: A built-in terminal widget that responds to CLI commands, mimicking an operating system environment.
*   **Zero-Gravity Mode (`antigravity`)**: Type `antigravity` in the terminal to activate a floating animation that makes all card components float organicially.
*   **Web Audio Synthesizer**: Interactive elements trigger retro-synthesized audio beeps built from scratch using the browser's Web Audio API (supporting chiptune, standard clicks, and mute modes).
*   **Mobile-First Responsive Layout**: Completely responsive grid system optimized for screens of all sizes (from 375px mobile viewports up to wide desktop monitors).
*   **AJAX Contact Form**: Modern contact form submitting messages securely and asynchronously via Formspree API.

---

## 🛠️ Technology Stack

*   **Structure**: HTML5
*   **Styling**: Custom Vanilla CSS & Tailwind CSS (via CDN)
*   **Interactions**: Vanilla ES6+ JavaScript
*   **Typography**: Google Fonts (*Playfair Display*, *Inter*, *JetBrains Mono*, *Caveat*, *Permanent Marker*)
*   **Icons**: Devicon CDN
*   **Form Submissions**: Formspree API

---

## 📂 File Architecture

*   [`index.html`](file:///C:/Users/Jyoth/.gemini/antigravity/scratch/my-portfolio/index.html) — Contains the structured semantic markup for the page, sections, terminal widget, and SVG dependencies.
*   [`index.css`](file:///C:/Users/Jyoth/.gemini/antigravity/scratch/my-portfolio/index.css) — Implements custom color variables, dark mode styling overrides, layouts, scrollbars, and keyframe animations (like `antigravity-float`).
*   [`index.js`](file:///C:/Users/Jyoth/.gemini/antigravity/scratch/my-portfolio/index.js) — Houses the terminal CLI interpreter, Web Audio synthesizer, split loader transitions, Intersection Observer scroll animations, 3D card tilt calculations, and AJAX handlers.

---

## 💻 CLI Terminal Commands

Open the terminal widget on the page and try typing the following commands:
*   `help` — Lists all available commands.
*   `about` — Prints a short bio.
*   `skills` — Renders an interactive text-based skill level indicator.
*   `projects` — Summarizes highlights of selected works.
*   `resume` / `cat resume.txt` — Shows education and credentials history.
*   `sound [click | chiptune | mute]` — Queries or overrides the synthesizer sound settings.
*   `theme [light | dark]` — Queries or changes the color theme.
*   `antigravity` — Activates or deactivates the Zero-Gravity floating animation.
*   `clear` — Empties the console output screen buffer.

---

## 🚀 Local Quickstart

To preview this website locally:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/veerajyothish/my-portfolio.git
    cd my-portfolio
    ```

2.  **Serve Locally**:
    You can use any local web server. For example, using Python:
    ```bash
    python -m http.server 8080
    ```

3.  **Open in Browser**:
    Visit `http://localhost:8080` in your web browser.
