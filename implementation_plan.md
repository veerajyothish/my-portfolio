# Implementation Plan: Fullscreen Pagination with Eyelid Scroll Transitions

We will convert the portfolio website into a fullscreen page-by-page slides system. Each section will fill exactly one screen (`100dvh`), and transitioning between sections via mouse wheel scrolling, mobile swipe gestures, keyboard arrow keys, or navigation clicks will trigger the premium eyelid closing and opening animation.

---

## User Review Required

> [!IMPORTANT]
> **Page-by-Page Architectural Shift**:
> Setting sections to `100dvh` requires disabling default browser scrollbars. Transitions are fully controlled via our JavaScript listeners.
> To prevent content clipping on small devices (e.g. mobile or landscape viewports), sections with tall content (like Projects, Education, and Skills) will allow internal scrolling. Once the user reaches the very bottom or top of an overflowing section, the next scroll input will trigger the eyelid page transition.

> [!TIP]
> **Zero BS Graceful Fallback**:
> If the user clicks **NO BS**, the site disables the fullscreen locking, hides the pagination dots, and restores standard native browser scrolling. This ensures the site remains accessible and flat if desired.

---

## Proposed Changes

### Layout & Structural Changes

#### [MODIFY] [index.html](file:///c:/Users/Jyoth/.gemini/antigravity/scratch/my-portfolio/index.html)
*   **Split About & Education**: Separate `<section id="about">` and Education & Credentials into two distinct siblings. Education will reside in its own `<section id="education">`.
*   **Update Workspace Padding**: Modify the `<main id="workspace">` wrapper to remove vertical paddings (`pt-32 pb-24`), allowing sections to manage their own layout padding.
*   **Add Side Dot Navigator**: Insert `<div id="dot-navigator">` containing navigation dots corresponding to each section page (Hero, Bio, Education, Skills, Projects, Terminal, Contact).
*   **Add Navigation Links**: Add a link for "Education" to the header navigation.

---

### Styles & Design System

#### [MODIFY] [index.css](file:///c:/Users/Jyoth/.gemini/antigravity/scratch/my-portfolio/index.css)
*   **Section Viewport Locking**: Add `.section-page` class:
    *   Set `height: 100dvh` and `min-height: 100dvh`.
    *   Style as a flex column (`display: flex; flex-direction: column; justify-content: center;`).
    *   Add vertical padding (`padding-top: 100px; padding-bottom: 40px;`) to clear the navigation bar.
    *   Set `overflow-y: auto` with scrollbar hiding so overflow text is readable but doesn't show default browser track bars.
*   **Body Lock Class**: Configure `body:not(.zero-bs) { overflow: hidden; }` to lock viewport scrollbar when interactive mode is active.
*   **Side Dot Navigator Style**:
    *   Position as `fixed; right: 2rem; top: 50%; transform: translateY(-50%); z-index: 45;`.
    *   Style dots with transition scaling, highlighting the active page dot in teal (dark mode) or orange (light mode).
    *   Add hover tooltips using `::after` content to display page names cleanly.

---

### Logic & Interactivity

#### [MODIFY] [index.js](file:///c:/Users/Jyoth/.gemini/antigravity/scratch/my-portfolio/index.js)
*   **Define Page Controller**:
    *   Keep an array of section IDs: `['hero', 'about', 'education', 'skills', 'projects', 'terminal', 'contact']`.
    *   Track `currentSectionIndex`.
*   **Scroll Interception (`wheel`)**:
    *   Listen to the `wheel` event on the window (with `{ passive: false }` to prevent default scroll).
    *   If Zero BS Mode is active, bypass interception.
    *   Check for transition cooldown (~800ms throttle).
    *   Evaluate the active section's scroll state:
        *   If scrolling down, check: `section.scrollTop + section.clientHeight >= section.scrollHeight - 5`. If true, trigger transition down. Else, let the section scroll internally.
        *   If scrolling up, check: `section.scrollTop <= 5`. If true, trigger transition up. Else, let the section scroll internally.
*   **Mobile Touch Swipe Interception**:
    *   Detect swipe start (`touchstart`) and end (`touchend`).
    *   Determine swipe direction and trigger the corresponding page transition (taking internal section scroll into account).
*   **Keyboard Navigation Support**:
    *   Listen to ArrowUp, ArrowDown, PageUp, PageDown, Space (down), and Shift+Space (up).
    *   Trigger transitions based on keys.
*   **Eyelid Transition Integration**:
    *   Update both scroll events and nav-link clicks to execute the unified eyelid closure/scrolling transition.
*   **Dot Navigator Listeners**:
    *   Highlight the active dot based on `currentSectionIndex`.
    *   Clicking a dot closes the eyelid, jumps to the target index, and opens.
*   **Zero BS Toggle Integration**:
    *   When Zero BS is enabled: Add `.zero-bs` class to `html`, restore `overflow: auto` to `body`, hide the dot navigator, and bypass scroll event listeners.
    *   When Zero BS is disabled: Re-lock body scroll, show the dot navigator, and run transitions.

---

## Verification Plan

### Manual Verification
1.  **Loader Logs**: Verify the initial preloader finishes.
2.  **Theme and Layout**: Ensure each section is centered and takes exactly the screen height.
3.  **Scroll Transitions**: Test scrolling down/up triggers the eyelid transition.
4.  **Internal Section Scroll**: Resize browser to a short height, verify tall elements (Projects/Education) can be scrolled internally, and only transition pages when reaching the boundary.
5.  **Nav Clicks & Dot Clicks**: Verify clicking nav links or sidebar dots closes the eyelid and shifts the page.
6.  **Zero BS Mode**: Enable NO BS and verify that standard linear scrolling is fully restored with scrollbars.
