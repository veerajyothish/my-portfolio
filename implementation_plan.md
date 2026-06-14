# Revised Implementation Plan: Structured & Accessible Portfolio (No Flips)

We are revising the portfolio website layout to be clean, readable, and highly accessible, removing the draggable cards, Zero Bullshit Mode, and the click-flip interaction. All content will be directly visible.

## Layout Changes

### 1. Remove Zero Bullshit Mode & Click Flip
- Remove Zero Bullshit Mode toggle button, hacker stylesheets, and alternative text views.
- Remove card flip buttons, click-flip animation classes, and rotation styling.
- All information (project descriptions, analytics, certifications) will be directly laid out on the page, visible and readable.

### 2. Structured Layout
- **Hero & About**: A clean intro section displaying your profile status, professional summary, and visual initials.
- **Skills & Certifications**: An interactive SVG node graph side-by-side with a detailed list of Google Cloud and Tata Group certifications.
- **Projects**: A clean responsive grid of cards for:
  - GITAM Campus Navigator (displaying graph stats and time complexity directly).
  - EduTracker (displaying Gemini Agent orchestration and Firebase sync details).
  - OIBSIP Authenticator (displaying Flask security details).
  - Each card will feature a clean border, drop shadow, and warm Stone-50 tones to maintain the tactile "quiet luxury" stationery look.
- **Contact**: A clean contact container with email, location, GitHub, and LinkedIn details.

---

## Proposed File Changes

### 1. [index.html](file:///C:/Users/Jyoth/.gemini/antigravity/scratch/agyport/PORTFOLIO/index.html)
- Lay out all content directly in semantic containers (no front/back divisions).
- Arrange sections vertically: Header/Intro ➔ About ➔ Skills & Certs ➔ Projects ➔ Contact/Footer.

### 2. [index.css](file:///C:/Users/Jyoth/.gemini/antigravity/scratch/agyport/PORTFOLIO/index.css)
- Clean up flip animation classes (`card-inner`, `card-front`, `card-back`, `flipped`).
- Add clean styles for structured section grids, lists, and hover effects.

### 3. [index.js](file:///C:/Users/Jyoth/.gemini/antigravity/scratch/agyport/PORTFOLIO/index.js)
- Remove all flipping logic and related flip sounds.
- Keep the split entry loader.
- Keep 3D card tilt hover effects.
- Keep the interactive SVG Skills Graph physics loop.
- Keep click sounds for standard buttons and link interactions.

---

## Verification Plan

- Preview the updated layout locally at `http://localhost:8080`.
- Verify readability and accessibility across mobile and desktop.
- Ensure skills graph physics and split loader work perfectly.
