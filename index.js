// index.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. WEB AUDIO API SYNTHESIZER ---
    let audioCtx = null;
    let isMuted = false;

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
        if (isMuted) return;
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
        if (isMuted) return;
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

    // Mute/Unmute toggle
    const audioToggle = document.getElementById('audio-toggle');
    audioToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        audioToggle.textContent = isMuted ? '🔇' : '🔊';
        if (!isMuted) {
            initAudio();
            playClickSound();
        }
    });

    // Add audio triggers to links and buttons
    const clickables = document.querySelectorAll('a, button:not(#audio-toggle)');
    clickables.forEach(elem => {
        elem.addEventListener('click', () => {
            playClickSound();
        });
    });


    // --- 2. SPLIT PANEL ENTRY LOADER ---
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderPercent = document.getElementById('loader-percent');
    const loaderLogo = document.getElementById('loader-logo');
    
    // Animate logo entrance
    setTimeout(() => {
        loaderLogo.style.opacity = '1';
        loaderLogo.style.transform = 'translateY(0)';
    }, 200);

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Trigger exit transition
            setTimeout(() => {
                loader.classList.add('loaded');
                playLoadSound();
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }, 300);
        }
        loaderBar.style.width = `${progress}%`;
        loaderPercent.textContent = `${progress}%`;
    }, 80);


    // --- 3. TACTILE CARD 3D TILT ON HOVER ---
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Add random initial tilt rotation on cards for subtle tactile variation
        const baseRotation = (Math.random() * 2) - 1; // -1 to 1 deg
        card.style.transform = `rotate(${baseRotation}deg)`;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Subtle 3D rotation based on mouse coordinates relative to card center
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


    // --- 4. INTERACTIVE SVG SKILLS NODE GRAPH ---
    const svg = document.getElementById('skills-svg');
    const graphContainer = document.getElementById('graph-container');
    
    // Skills Node Data
    const nodes = [
        { id: 'Java', group: 1, x: 70, y: 60, vx: 0, vy: 0, r: 24, label: 'Java' },
        { id: 'Python', group: 1, x: 260, y: 70, vx: 0, vy: 0, r: 28, label: 'Python' },
        { id: 'Agentic AI', group: 2, x: 170, y: 120, vx: 0, vy: 0, r: 35, label: 'Agentic AI' },
        { id: 'Dijkstra', group: 3, x: 60, y: 180, vx: 0, vy: 0, r: 26, label: 'Dijkstra' },
        { id: 'MCP', group: 2, x: 280, y: 180, vx: 0, vy: 0, r: 24, label: 'MCP' },
        { id: 'Firebase', group: 4, x: 190, y: 200, vx: 0, vy: 0, r: 26, label: 'Firebase' }
    ];

    const links = [
        { source: 'Java', target: 'Dijkstra' },
        { source: 'Python', target: 'Agentic AI' },
        { source: 'Agentic AI', target: 'MCP' },
        { source: 'Agentic AI', target: 'Firebase' },
        { source: 'Java', target: 'Firebase' },
        { source: 'Dijkstra', target: 'Agentic AI' }
    ];

    // Build SVG Groups
    const linkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(linkGroup);
    svg.appendChild(nodeGroup);

    // Create Link Lines
    const linkElements = links.map(link => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke', '#e7e5e4');
        line.setAttribute('stroke-width', '1.5');
        linkGroup.appendChild(line);
        return { line, source: link.source, target: link.target };
    });

    // Create Node Circles & Labels
    let draggedNode = null;
    let mousePos = { x: 0, y: 0, active: false };

    const nodeElements = nodes.map(node => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'group select-none cursor-pointer');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', node.r);
        
        // Color presets matching the warm stone/stationery theme
        const colors = ['#f5f5f4', '#fef08a', '#fed7aa', '#e2e8f0'];
        circle.setAttribute('fill', colors[node.group - 1]);
        circle.setAttribute('stroke', '#1c1917');
        circle.setAttribute('stroke-width', '1.5');
        circle.setAttribute('class', 'transition-all duration-300 group-hover:scale-110 group-hover:stroke-orange-500');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.textContent = node.label;
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '4');
        text.setAttribute('font-size', '10px');
        text.setAttribute('font-weight', '500');
        text.setAttribute('fill', '#1c1917');
        text.setAttribute('pointer-events', 'none');

        g.appendChild(circle);
        g.appendChild(text);
        nodeGroup.appendChild(g);

        // Click drag events
        g.addEventListener('mousedown', (e) => {
            playClickSound();
            draggedNode = node;
        });

        g.addEventListener('touchstart', (e) => {
            playClickSound();
            draggedNode = node;
        }, { passive: true });

        return { g, node, circle, text };
    });

    // Tracking Cursor Position inside the Canvas
    graphContainer.addEventListener('mousemove', (e) => {
        const rect = svg.getBoundingClientRect();
        mousePos.x = e.clientX - rect.left;
        mousePos.y = e.clientY - rect.top;
        mousePos.active = true;
    });

    graphContainer.addEventListener('mouseleave', () => {
        mousePos.active = false;
        draggedNode = null;
    });

    document.addEventListener('mouseup', () => {
        draggedNode = null;
    });

    document.addEventListener('touchend', () => {
        draggedNode = null;
    });

    // Node Physics Simulation Loop
    function updatePhysics() {
        const width = svg.clientWidth || 300;
        const height = svg.clientHeight || 256;
        const targetX = width / 2;
        const targetY = height / 2;

        const gravity = 0.035;
        const linkForce = 0.06;
        const charge = 75; // Repulsion distance/strength

        if (draggedNode && mousePos.active) {
            draggedNode.x = mousePos.x;
            draggedNode.y = mousePos.y;
            draggedNode.vx = 0;
            draggedNode.vy = 0;
        }

        // Apply physics forces
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node === draggedNode) continue;

            // 1. Center gravity pull
            node.vx += (targetX - node.x) * gravity;
            node.vy += (targetY - node.y) * gravity;

            // 2. Node separation
            for (let j = 0; j < nodes.length; j++) {
                if (i === j) continue;
                const other = nodes[j];
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                
                if (dist < 110) {
                    const force = charge / (dist * dist);
                    node.vx += (dx / dist) * force;
                    node.vy += (dy / dist) * force;
                }
            }

            // 3. Cursor attraction
            if (mousePos.active) {
                const dx = mousePos.x - node.x;
                const dy = mousePos.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                if (dist < 100) {
                    const pull = (100 - dist) * 0.022;
                    node.vx += (dx / dist) * pull;
                    node.vy += (dy / dist) * pull;
                }
            }

            // Apply inertia/friction and update coordinates
            node.vx *= 0.84;
            node.vy *= 0.84;
            node.x += node.vx;
            node.y += node.vy;

            // Keep inside margins
            if (node.x < node.r) { node.x = node.r; node.vx *= -0.5; }
            if (node.x > width - node.r) { node.x = width - node.r; node.vx *= -0.5; }
            if (node.y < node.r) { node.y = node.r; node.vy *= -0.5; }
            if (node.y > height - node.r) { node.y = height - node.r; node.vy *= -0.5; }
        }

        // 4. Spring linkages
        linkElements.forEach(le => {
            const src = nodes.find(n => n.id === le.source);
            const tgt = nodes.find(n => n.id === le.target);
            if (!src || !tgt) return;

            const dx = tgt.x - src.x;
            const dy = tgt.y - src.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const desiredDist = 80;

            const force = (dist - desiredDist) * linkForce;
            
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (src !== draggedNode) {
                src.vx += fx;
                src.vy += fy;
            }
            if (tgt !== draggedNode) {
                tgt.vx -= fx;
                tgt.vy -= fy;
            }
        });

        // Reposition SVG graphics
        nodeElements.forEach(ne => {
            ne.g.setAttribute('transform', `translate(${ne.node.x}, ${ne.node.y})`);
        });

        linkElements.forEach(le => {
            const src = nodes.find(n => n.id === le.source);
            const tgt = nodes.find(n => n.id === le.target);
            if (!src || !tgt) return;

            le.line.setAttribute('x1', src.x);
            le.line.setAttribute('y1', src.y);
            le.line.setAttribute('x2', tgt.x);
            le.line.setAttribute('y2', tgt.y);
        });

        requestAnimationFrame(updatePhysics);
    }

    // Launch loop
    updatePhysics();
});
