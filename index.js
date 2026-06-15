// index.js — Portfolio interactions

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. WEB AUDIO API SYNTHESIZER ---
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Play synthesized click sound
    function playClickSound() {
        if (soundMode === 'mute') return;
        initAudio();
        try {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
            
            gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.08);
        } catch (e) {
            console.warn("Audio Context error:", e);
        }
    }

    // Play synthesized flip/sweep sound on loading complete
    function playLoadSound() {
        if (soundMode === 'mute') return;
        initAudio();
        try {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } catch (e) {
            console.warn("Audio Context error:", e);
        }
    }

    // --- 1.2 SOUND MODE CYCLING CONTROLLER ---
    let soundMode = localStorage.getItem('portfolio-sound-mode') || 'click';
    const audioToggle = document.getElementById('audio-toggle');

    function updateAudioButtonUI() {
        const icons = { 'click': '🔊', 'chiptune': '👾', 'mute': '🔇' };
        const titles = { 'click': 'Sound Mode: Clicks', 'chiptune': 'Sound Mode: Chiptune', 'mute': 'Sound Mode: Muted' };
        if (audioToggle) {
            audioToggle.textContent = icons[soundMode];
            audioToggle.title = titles[soundMode];
        }
    }
    updateAudioButtonUI();

    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            if (soundMode === 'click') {
                soundMode = 'chiptune';
            } else if (soundMode === 'chiptune') {
                soundMode = 'mute';
            } else {
                soundMode = 'click';
            }
            localStorage.setItem('portfolio-sound-mode', soundMode);
            updateAudioButtonUI();
            
            if (soundMode !== 'mute') {
                initAudio();
                playFeedbackSound();
            }
        });
    }

    function playFeedbackSound() {
        if (soundMode === 'click') {
            playClickSound();
        } else if (soundMode === 'chiptune') {
            playChiptuneSound();
        }
    }

    // Play retro 8-bit game pickup sound (two square waves)
    function playChiptuneSound() {
        if (soundMode === 'mute') return;
        initAudio();
        try {
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc1.type = 'square';
            osc2.type = 'square';
            
            const now = audioCtx.currentTime;
            
            // Retro C5 -> G5 double chime
            osc1.frequency.setValueAtTime(523.25, now);
            osc2.frequency.setValueAtTime(783.99, now + 0.06);
            
            gainNode.gain.setValueAtTime(0.015, now);
            gainNode.gain.setValueAtTime(0.015, now + 0.06);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
            
            osc1.start(now);
            osc1.stop(now + 0.06);
            
            osc2.start(now + 0.06);
            osc2.stop(now + 0.16);
        } catch (e) {
            console.warn("Chiptune audio error:", e);
        }
    }

    // Add audio triggers to links and buttons
    const clickables = document.querySelectorAll('a, button:not(#audio-toggle):not(#theme-toggle)');
    clickables.forEach(elem => {
        elem.addEventListener('click', () => {
            playFeedbackSound();
        });
    });


    // --- 2. SPLIT PANEL ENTRY LOADER ---
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderPercent = document.getElementById('loader-percent');
    const loaderLogo = document.getElementById('loader-logo');
    
    // Animate logo entrance
    setTimeout(() => {
        if (loaderLogo) {
            loaderLogo.style.opacity = '1';
            loaderLogo.style.transform = 'translateY(0)';
        }
    }, 200);

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Trigger exit transition
            setTimeout(() => {
                if (loader) loader.classList.add('loaded');
                playLoadSound();
                setTimeout(() => {
                    if (loader) loader.style.display = 'none';
                }, 800);
            }, 300);
        }
        if (loaderBar) loaderBar.style.width = `${progress}%`;
        if (loaderPercent) loaderPercent.textContent = `${progress}%`;
    }, 80);


    // --- 3. TACTILE CARD 3D TILT ON HOVER ---
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Set CSS custom property to store initial rotation for reference in keyframe animation
        const baseRotation = (Math.random() * 2) - 1; // -1 to 1 deg
        card.style.setProperty('--initial-rot', `${baseRotation}deg`);
        card.style.transform = `rotate(${baseRotation}deg)`;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg
            const rotateY = ((x - centerX) / centerX) * 5;  // max 5 deg

            card.style.transform = `rotate(${baseRotation}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
            card.style.transition = 'transform 0.1s ease-out';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotate(${baseRotation}deg)`;
            card.style.transition = 'transform 0.3s ease-out';
        });
    });


    // --- 4. INTERSECTION OBSERVER — Scroll Fade-In Animations ---
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });


    // --- 5. ACTIVE NAV LINK HIGHLIGHTING ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('font-bold');
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--accent-teal)';
                        link.classList.add('font-bold');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();


    // --- 6. DARK MODE THEME CONTROLLER ---
    const themeToggle = document.getElementById('theme-toggle');
    
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            if (themeToggle) {
                themeToggle.textContent = '☀️';
                themeToggle.title = 'Switch to Light Mode';
            }
        } else {
            document.documentElement.classList.remove('dark');
            if (themeToggle) {
                themeToggle.textContent = '🌙';
                themeToggle.title = 'Switch to Dark Mode';
            }
        }
    }

    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('portfolio-theme', currentTheme);
            applyTheme(currentTheme);
            playFeedbackSound();
        });
    }


    // --- 7. INTERACTIVE RETRO TERMINAL WIDGET ---
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (terminalInput && terminalOutput) {
        const commandHistory = [];
        let historyIndex = -1;

        // Focus input when the terminal body is clicked
        terminalInput.closest('.card').addEventListener('click', () => {
            terminalInput.focus();
        });

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const commandText = terminalInput.value.trim();
                terminalInput.value = '';
                
                if (commandText) {
                    commandHistory.push(commandText);
                    historyIndex = commandHistory.length;
                    
                    // Print command prompt line
                    const promptLine = document.createElement('div');
                    promptLine.innerHTML = `<span class="text-teal-400">bvj@portfolio:~$</span> <span class="text-[#ffb68d]">${escapeHtml(commandText)}</span>`;
                    terminalOutput.appendChild(promptLine);
                    
                    executeCommand(commandText.toLowerCase());
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            }
        });

        function escapeHtml(text) {
            return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }

        function executeCommand(cmd) {
            const out = document.createElement('div');
            out.className = 'mt-1 mb-2 text-stone-300';
            
            const parts = cmd.split(' ');
            const baseCmd = parts[0];
            const args = parts.slice(1);

            switch (baseCmd) {
                case 'help':
                    out.innerHTML = `
                        <div class="text-[#ffb68d] font-bold mb-1">Available Commands:</div>
                        <div class="grid grid-cols-[100px_1fr] gap-x-4 gap-y-1 text-stone-400 font-mono text-xs">
                            <span class="text-teal-300">help</span><span>Display list of commands</span>
                            <span class="text-teal-300">about</span><span>About Bondada Veera Jyothish</span>
                            <span class="text-teal-300">skills</span><span>Show technical skills</span>
                            <span class="text-teal-300">projects</span><span>List highlight projects</span>
                            <span class="text-teal-300">resume</span><span>Print education & certifications (cat resume.txt)</span>
                            <span class="text-teal-300">sound [mode]</span><span>Set sound (click, chiptune, mute) or query status</span>
                            <span class="text-teal-300">theme [mode]</span><span>Set theme (light, dark) or query status</span>
                            <span class="text-teal-300">antigravity</span><span>Toggle zero-gravity on site cards</span>
                            <span class="text-teal-300">clear</span><span>Clear the terminal screen</span>
                        </div>
                    `;
                    break;
                case 'about':
                    out.innerHTML = `
                        <div class="text-teal-300 font-bold mb-1">About Me:</div>
                        <div>I am a Java & Python developer specializing in Agentic AI orchestration, graph algorithms, and full-stack software development. Currently a 2nd year B.Tech CSE student at GITAM University with a CGPA of 7.5. Passionate about engineering high-integrity, zero-vulnerability software systems that solve real-world problems.</div>
                    `;
                    break;
                case 'skills':
                    out.innerHTML = `
                        <div class="text-teal-300 font-bold mb-1">Technical Skill Stack:</div>
                        <div class="space-y-1 text-stone-400">
                            <div>Languages: Java [████████░░] 80% | Python [█████████░] 90% | JS/HTML/CSS [████████░░] 80%</div>
                            <div>Tools/Frameworks: Flask, SQLite, Devicon, Antigravity SDK, Vercel, Netlify</div>
                            <div>Concepts: Data Structures, Graph Pathfinding, AI Agents, Secure Auth</div>
                        </div>
                    `;
                    break;
                case 'projects':
                    out.innerHTML = `
                        <div class="text-teal-300 font-bold mb-1">Highlight Projects:</div>
                        <div class="space-y-2 text-stone-400">
                            <div>1. <span class="text-[#ffb68d] font-bold">Dijkstra Campus Navigator</span> - Web application finding optimal paths across 42 campus nodes. Built from scratch with JS/HTML5 Canvas and pure CSS.</div>
                            <div>2. <span class="text-[#ffb68d] font-bold">EduTracker (Hackathon)</span> - College management platform powered by Gemini AI. Orchestrates agents with Firebase database sync.</div>
                            <div>3. <span class="text-[#ffb68d] font-bold">OIBSIP Secure Auth</span> - Flask user authentication implementation with bcrypt hashing and session validation.</div>
                        </div>
                    `;
                    break;
                case 'cat':
                    if (args[0] === 'resume.txt' || args[0] === 'resume') {
                        printResume(out);
                    } else {
                        out.innerHTML = `<div>cat: ${args[0] ? escapeHtml(args[0]) : 'missing file name'}: No such file or directory. Try: <span class="text-teal-300 font-bold">cat resume.txt</span></div>`;
                    }
                    break;
                case 'resume':
                    printResume(out);
                    break;
                case 'sound':
                    if (args[0]) {
                        if (['click', 'chiptune', 'mute'].includes(args[0])) {
                            soundMode = args[0];
                            localStorage.setItem('portfolio-sound-mode', soundMode);
                            updateAudioButtonUI();
                            playFeedbackSound();
                            out.innerHTML = `<div>Sound mode set to <span class="text-teal-300 font-bold">${soundMode}</span>.</div>`;
                        } else {
                            out.innerHTML = `<div class="text-red-400">Invalid sound mode. Choose from: click, chiptune, mute.</div>`;
                        }
                    } else {
                        out.innerHTML = `<div>Current sound mode: <span class="text-teal-300 font-bold">${soundMode}</span>. Try: <span class="text-[#ffb68d]">sound chiptune</span></div>`;
                    }
                    break;
                case 'theme':
                    if (args[0]) {
                        if (['light', 'dark'].includes(args[0])) {
                            currentTheme = args[0];
                            localStorage.setItem('portfolio-theme', currentTheme);
                            applyTheme(currentTheme);
                            playFeedbackSound();
                            out.innerHTML = `<div>Theme set to <span class="text-teal-300 font-bold">${currentTheme}</span>.</div>`;
                        } else {
                            out.innerHTML = `<div class="text-red-400">Invalid theme. Choose from: light, dark.</div>`;
                        }
                    } else {
                        out.innerHTML = `<div>Current theme: <span class="text-teal-300 font-bold">${currentTheme}</span>. Try: <span class="text-[#ffb68d]">theme dark</span></div>`;
                    }
                    break;
                case 'antigravity':
                    const isFlipped = document.body.classList.toggle('antigravity-active');
                    playFeedbackSound();
                    if (isFlipped) {
                        out.innerHTML = `<div class="text-green-400 font-bold">WARNING: ZERO GRAVITY ENFORCED! Page components are floating.</div>`;
                    } else {
                        out.innerHTML = `<div class="text-teal-300">Gravity fields restored. Cards stabilized.</div>`;
                    }
                    break;
                case 'sudo':
                    out.innerHTML = `<div class="text-red-400 font-bold">Permission Denied: User is not in the sudoers file. This incident has been logged.</div>`;
                    break;
                case 'clear':
                    terminalOutput.innerHTML = '';
                    return;
                default:
                    out.innerHTML = `<div class="text-red-400">Command not found: '${escapeHtml(baseCmd)}'. Type <span class="text-teal-300 font-bold">help</span> to list commands.</div>`;
                    break;
            }
            terminalOutput.appendChild(out);
        }

        function printResume(outElement) {
            outElement.innerHTML = `
                <div class="text-teal-300 font-bold mb-1">RESUME DATA (resume.txt):</div>
                <div class="space-y-2 text-stone-400">
                    <div><strong class="text-stone-200">Education:</strong></div>
                    <div>• B.Tech in CSE | GITAM University, Visakhapatnam (Aug 2024 - Apr 2028) - CGPA: 7.5</div>
                    <div>• Class XII / Junior College | Sri Chaitanya Junior College (Jun 2022 - Apr 2024) - Grade: A</div>
                    
                    <div><strong class="text-stone-200">Certifications:</strong></div>
                    <div>• Google Cloud AI Agents Credentials (Jun 2026)</div>
                    <div>• Data Visualisation: Empowering Business | Tata Group (Aug 2024)</div>
                    <div>• Programming for Everybody (Python) | UMich / Coursera</div>
                </div>
            `;
        }
    }

    // --- 8. CONTACT FORM AJAX SUBMISSION ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    submitBtn.textContent = 'Message Sent! ✓';
                    submitBtn.style.backgroundColor = 'var(--accent-teal)';
                    contactForm.reset();
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                        submitBtn.style.backgroundColor = '';
                    }, 4000);
                } else {
                    const data = await response.json();
                    if (data && data.errors) {
                        alert(data.errors.map(error => error.message).join(", "));
                    } else {
                        alert("Oops! There was a problem submitting your form.");
                    }
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            } catch (error) {
                alert("Oops! There was a problem submitting your form.");
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // --- 9. INTERACTIVE CANVAS GRID REPULSION ---
    const canvas = document.getElementById('grid-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        let mouseX = -1000;
        let mouseY = -1000;
        let targetMouseX = -1000;
        let targetMouseY = -1000;

        // Track cursor coordinates
        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            targetMouseX = -1000;
            targetMouseY = -1000;
        });

        // Resize handler
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        function drawGrid() {
            ctx.clearRect(0, 0, width, height);
            
            // Check if dark mode is active
            const isDarkMode = document.documentElement.classList.contains('dark');
            
            // Lerp mouse coordinates for smooth lag-free movement follow
            if (mouseX === -1000 && targetMouseX !== -1000) {
                mouseX = targetMouseX;
                mouseY = targetMouseY;
            } else if (targetMouseX === -1000) {
                // Return to default resting point out of bounds slowly
                mouseX += (-1000 - mouseX) * 0.1;
                mouseY += (-1000 - mouseY) * 0.1;
            } else {
                mouseX += (targetMouseX - mouseX) * 0.15;
                mouseY += (targetMouseY - mouseY) * 0.15;
            }

            const step = 40;
            const radius = 150;
            const maxMove = 15;
            
            const cols = Math.ceil(width / step) + 1;
            const rows = Math.ceil(height / step) + 1;
            
            // Calculate grid intersections
            const points = [];
            for (let r = 0; r <= rows; r++) {
                points[r] = [];
                for (let c = 0; c <= cols; c++) {
                    let px = c * step;
                    let py = r * step;
                    
                    const dx = px - mouseX;
                    const dy = py - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < radius && dist > 0) {
                        // Elastic repulsion curve
                        const power = Math.pow((radius - dist) / radius, 1.8);
                        const force = -maxMove * power;
                        px += (dx / dist) * force;
                        py += (dy / dist) * force;
                    }
                    
                    points[r][c] = { x: px, y: py };
                }
            }
            
            // 1. Draw Subtle Highlight Glow under cursor
            if (mouseX > -500) {
                const glowRadius = 240;
                const glowGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);
                if (isDarkMode) {
                    glowGradient.addColorStop(0, 'rgba(13, 148, 136, 0.04)'); // Refined teal glow
                    glowGradient.addColorStop(1, 'transparent');
                } else {
                    glowGradient.addColorStop(0, 'rgba(255, 182, 141, 0.12)'); // Warm orange glow
                    glowGradient.addColorStop(1, 'transparent');
                }
                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            // 2. Draw Grid Lines
            ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.035)' : 'rgba(0, 0, 0, 0.04)';
            ctx.lineWidth = 1;
            
            // Draw horizontal lines
            for (let r = 0; r <= rows; r++) {
                ctx.beginPath();
                ctx.moveTo(points[r][0].x, points[r][0].y);
                for (let c = 1; c <= cols; c++) {
                    ctx.lineTo(points[r][c].x, points[r][c].y);
                }
                ctx.stroke();
            }
            
            // Draw vertical lines
            for (let c = 0; c <= cols; c++) {
                ctx.beginPath();
                ctx.moveTo(points[0][c].x, points[0][c].y);
                for (let r = 1; r <= rows; r++) {
                    ctx.lineTo(points[r][c].x, points[r][c].y);
                }
                ctx.stroke();
            }
        }

        // Draw Loop
        function tick() {
            drawGrid();
            requestAnimationFrame(tick);
        }
        tick();
    }
});
