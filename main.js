gsap.registerPlugin(ScrollTrigger);

/* ── CURSOR ── */
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursorRing");
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
(function loop() { rx += (mx - rx) * .12; ry += (my - ry) * .12; cursor.style.cssText = `left:${mx}px;top:${my}px`; ring.style.cssText = `left:${rx}px;top:${ry}px`; requestAnimationFrame(loop); })();

/* ── SMOOTH SCROLL (LENIS) ── */
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ── PROGRESS BAR ── */
lenis.on('scroll', (e) => {
    const pct = e.progress * 100;
    document.getElementById("prog").style.width = pct + "%";
});

/* ── SMOOTH SCROLL (LENIS NAVIGATION) ── */
document.querySelectorAll("[data-target]").forEach(link => {
    link.addEventListener("click", () => {
        const target = link.dataset.target;
        const el = document.getElementById(target);
        if (el) {
            lenis.scrollTo(el, {
                offset: -80,
                duration: 2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});


/* ── NAVBAR + LOGO ── */
const logo = document.getElementById("mainLogo");
const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");

function setupAnimation() {
    ScrollTrigger.getAll().forEach(s => s.kill());
    gsap.set(logo, { opacity: 1 });
    gsap.set(".logo-text", { opacity: 1 });
    gsap.set(".logo-img", { opacity: 0 });
    gsap.set(navbar, { autoAlpha: 0 });
    gsap.set(".hero", { autoAlpha: 0 });

    const lw = navLinks.offsetWidth, px = 28, tw = lw + px * 2, nt = 30;
    const nh = navbar.offsetHeight || 50, tl = (window.innerWidth - tw) / 2;
    gsap.set(navbar, { left: tl, width: tw, top: nt });
    gsap.set(logo, { position: "fixed", left: 0, top: 0, x: 0, y: 0, scale: 1, fontSize: "16px" });

    const lW = logo.offsetWidth, lH = logo.offsetHeight;
    const ew = px + lW + 24 + lw + px, fr = tl + tw, el = fr - ew;
    const rx2 = el + px, ry2 = nt + (nh - lH) / 2;
    const hs = Math.min((window.innerWidth * .45) / lW, (window.innerHeight * .20) / lH);
    const hx = window.innerWidth / 2 - rx2 - (lW * hs) / 2, hy = window.innerHeight / 2 - ry2 - lH / 2;

    gsap.set(logo, { position: "fixed", left: rx2, top: ry2, x: hx, y: hy, scale: hs, transformOrigin: "left center", opacity: 1 });

    const tl2 = gsap.timeline({ scrollTrigger: { trigger: "#hero", start: "top top", end: "+=800", scrub: 2, pin: true, pinSpacing: true, anticipatePin: 1 } });
    tl2.to(logo, { x: 0, y: 0, scale: 1, ease: "expo.inOut", duration: 0.5 }, 0);
    tl2.to(".logo-text", { opacity: 0, duration: 0.25, ease: "power2.inOut" }, 0);
    tl2.to(".logo-img", { opacity: 1, duration: 0.25, ease: "power2.inOut" }, 0.25);
    tl2.to(navbar, { autoAlpha: 1, left: el, width: ew, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(25px)", ease: "expo.inOut", duration: 0.5 }, 0);
    const r = 0.45;
    tl2.to(".hero", { autoAlpha: 1, duration: 0.1 }, r);
    tl2.to(".hero-sub", { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 }, r + 0.08);
    tl2.to(".hero-title span", { y: "0%", stagger: .04, ease: "expo.out", duration: 0.18 }, r + 0.15);
    tl2.to(".hero-desc", { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 }, r + 0.35);
    tl2.to(".hero-btns", { autoAlpha: 1, y: 0, duration: 0.1, onComplete: () => document.querySelector(".hero-btns").classList.add("vis") }, r + 0.40);
    tl2.to(".hero-scroll-hint", { opacity: 1, ease: "power2.out", duration: 0.1 }, r + 0.45);

    setupProjectScroll();
    setupParallax();
}

function setupProjectScroll() {
    const w = document.querySelector("#projectsWrapper");
    if (!w) return;
    const dist = () => w.scrollWidth - window.innerWidth;
    gsap.to(w, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: "#projectsShowcase", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1.2, invalidateOnRefresh: true } });
    setTimeout(() => ScrollTrigger.refresh(), 500);
}

/* ── PARALLAX ── */
function setupParallax() {
    gsap.to("#heroOrb1", { y: -120, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 } });
    gsap.to("#heroOrb2", { y: -80, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 2 } });

    gsap.to(".card-main", { y: -50, ease: "none", scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: 1.8 } });
    gsap.to(".card-mini", { y: 35, ease: "none", scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: 2.5 } });

    // BACKGROUND TEXT PARALLAX
    gsap.to(".svc-bg-text", { x: -100, ease: "none", scrollTrigger: { trigger: "#service", start: "top bottom", end: "bottom top", scrub: 1 } });
    gsap.to(".contact-bg-text", { x: 100, ease: "none", scrollTrigger: { trigger: "#contact", start: "top bottom", end: "bottom top", scrub: 1 } });

    // ORBS PARALLAX
    gsap.to("#svcOrb1", { y: 150, ease: "none", scrollTrigger: { trigger: "#service", start: "top bottom", end: "bottom top", scrub: 1.5 } });
    gsap.to("#svcOrb2", { y: -150, ease: "none", scrollTrigger: { trigger: "#service", start: "top bottom", end: "bottom top", scrub: 2 } });

    gsap.to(".contact-orb-1", { y: -200, scale: 1.2, ease: "none", scrollTrigger: { trigger: "#contact", start: "top bottom", end: "bottom top", scrub: 1.5 } });
    gsap.to(".contact-orb-2", { y: 200, scale: 0.8, ease: "none", scrollTrigger: { trigger: "#contact", start: "top bottom", end: "bottom top", scrub: 2 } });
}

/* ── ABOUT ANIMATIONS ── */
function setupAbout() {
    const st = { trigger: "#about", start: "top 72%" };
    gsap.to(".about-tag", { opacity: 1, y: 0, duration: .7, ease: "power3.out", scrollTrigger: st });
    gsap.to(".about-heading .line", { y: "0%", duration: 1, stagger: .11, ease: "expo.out", scrollTrigger: { ...st, start: "top 68%" } });
    gsap.to(".about-body", { opacity: 1, y: 0, duration: .8, ease: "power3.out", scrollTrigger: { ...st, start: "top 62%" } });
    gsap.to(".about-skills", { opacity: 1, y: 0, duration: .6, ease: "power3.out", scrollTrigger: { ...st, start: "top 58%" } });
    gsap.from(".skill-pill", { scale: .75, opacity: 0, duration: .45, stagger: .07, ease: "back.out(1.6)", scrollTrigger: { ...st, start: "top 58%" } });
    gsap.to(".about-stats", { opacity: 1, y: 0, duration: .8, ease: "power3.out", scrollTrigger: { ...st, start: "top 54%" } });
    gsap.to(".card-main", { opacity: 1, y: 0, rotate: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { ...st, start: "top 75%" } });
    gsap.to(".card-mini", { opacity: 1, y: 0, rotate: 0, duration: 1.1, delay: .18, ease: "expo.out", scrollTrigger: { ...st, start: "top 75%" } });

    /* ── ODOMETER COUNT-UP – every visit (about stats) ── */
    document.querySelectorAll(".stat-num[data-val], .card-mini-num[data-val]").forEach(el => {
        const target = parseInt(el.dataset.val);
        const suffix = el.dataset.suffix || "";
        el.textContent = "0" + suffix;
        let tween = null;

        const playCount = () => {
            if (tween) tween.kill();
            const obj = { val: 0 };
            el.textContent = "0" + suffix;
            tween = gsap.to(obj, {
                val: target, duration: 2.2, ease: "power2.out",
                onUpdate() { el.textContent = Math.floor(obj.val) + suffix; }
            });
        };

        ScrollTrigger.create({
            trigger: "#about", start: "top 60%", end: "bottom top",
            onEnter: playCount,
            onEnterBack: playCount,
            onLeave: () => { if (tween) tween.kill(); el.textContent = "0" + suffix; },
            onLeaveBack: () => { if (tween) tween.kill(); el.textContent = "0" + suffix; }
        });
    });
}

/* ── SERVICE SECTION (Static) ── */
function setupService() {
    // Scroll entrance animations removed as per request

    /* Instant Accordion (No motion) */
    document.querySelectorAll(".svc-row").forEach(row => {
        const desc = row.querySelector(".svc-desc");
        row.addEventListener("click", () => {
            const isOpen = row.classList.contains("open");

            // Close others instantly
            document.querySelectorAll(".svc-row").forEach(r => {
                r.classList.remove("open");
                r.querySelector(".svc-desc").style.height = "0px";
            });

            if (!isOpen) {
                row.classList.add("open");
                desc.style.height = "auto";
            }
        });
    });
}


/* ── WORK ANIMATIONS ── */
function setupWork() {
    gsap.from(".work-tag", { opacity: 0, y: 20, duration: .8, scrollTrigger: { trigger: "#work", start: "top 75%" } });
    gsap.from(".work-heading", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: "#work", start: "top 72%" } });
    gsap.to(".work-item", { opacity: 1, y: 0, duration: 1, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".work-grid", start: "top 80%" } });
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            gsap.from(".work-item", { opacity: .3, scale: .97, duration: .4, stagger: .05, ease: "power2.out" });
        });
    });
}

/* ── PRICING ── */
function setupPricing() {
    const st = { trigger: "#pricing", start: "top 75%" };
    gsap.from(".pricing-title", { opacity: 0, y: 30, duration: 1, ease: "power3.out", scrollTrigger: st });
    gsap.to(".pricing-card", { opacity: 1, y: 0, duration: 1.2, stagger: .15, ease: "expo.out", scrollTrigger: { ...st, start: "top 65%" } });

    /* ── ODOMETER COUNT-UP – every visit (pricing) ── */
    document.querySelectorAll(".tier-price[data-price]").forEach(el => {
        const target = parseInt(el.dataset.price);
        el.innerHTML = `<span class="price-symbol">$</span><span class="price-num">0</span><span class="price-period">/project</span>`;
        let tween = null;

        const playCount = () => {
            if (tween) tween.kill();
            const obj = { val: 0 };
            el.innerHTML = `<span class="price-symbol">$</span><span class="price-num">0</span><span class="price-period">/project</span>`;
            tween = gsap.to(obj, {
                val: target, duration: 2.2, ease: "power2.out",
                onUpdate() {
                    const v = Math.floor(obj.val).toLocaleString();
                    el.innerHTML = `<span class="price-symbol">$</span><span class="price-num">${v}</span><span class="price-period">/project</span>`;
                }
            });
        };

        ScrollTrigger.create({
            trigger: "#pricing", start: "top 65%", end: "bottom top",
            onEnter: playCount,
            onEnterBack: playCount,
            onLeave: () => { if (tween) tween.kill(); el.innerHTML = `<span class="price-symbol">$</span><span class="price-num">0</span><span class="price-period">/project</span>`; },
            onLeaveBack: () => { if (tween) tween.kill(); el.innerHTML = `<span class="price-symbol">$</span><span class="price-num">0</span><span class="price-period">/project</span>`; }
        });
    });
}

/* ── REVIEW MARQUEE & POPUP ── */
function setupReviews() {
    const reviews = [
        {
            name: "Sarah Chen",
            role: "Founder @ TechFlow",
            text: "Working with this team was a game-changer. Their attention to detail and ability to bring complex animations to life exceeded our highest expectations.",
            avatar: "https://i.pravatar.cc/150?u=sarah"
        },
        {
            name: "Marcus Sterling",
            role: "Creative Director @ Vortex",
            text: "The premium aesthetic and smooth performance they delivered gave our brand the elite digital presence we were looking for. Unparalleled craftsmanship.",
            avatar: "https://i.pravatar.cc/150?u=marcus"
        },
        {
            name: "Elena Rodriguez",
            role: "Product Lead @ Lumina",
            text: "From initial concept to final GSAP-powered reveals, every step was professional. Their technical expertise lives at the intersection of design and code.",
            avatar: "https://i.pravatar.cc/150?u=elena"
        },
        {
            name: "David Park",
            role: "CTO @ Nexus",
            text: "Efficiency meets artistry. They didn't just build a platform; they built an experience that our users absolutely love. Solid engineering throughout.",
            avatar: "https://i.pravatar.cc/150?u=david"
        },
        {
            name: "Rachel Thorne",
            role: "Head of Design @ Aether",
            text: "A rare find in the industry. They understand the nuances of motion and the importance of performance. Our SaaS dashboard has never looked better.",
            avatar: "https://i.pravatar.cc/150?u=rachel"
        }
    ];

    const modal = document.getElementById('reviewPopup');
    const overlay = document.getElementById('rpOverlay');
    const closeBtn = document.getElementById('rpClose');

    const rpText = document.getElementById('rpText');
    const rpAvatar = document.getElementById('rpAvatar');
    const rpName = document.getElementById('rpName');
    const rpRole = document.getElementById('rpRole');

    document.querySelectorAll('.review-circle-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            const data = reviews[index];

            rpText.textContent = data.text;
            rpAvatar.src = data.avatar;
            rpName.textContent = data.name;
            rpRole.textContent = data.role;

            modal.classList.add('active');
        });
    });

    [overlay, closeBtn].forEach(el => {
        el.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });
}


/* ── FAQ ── */
function setupFAQ() {
    document.querySelectorAll(".faq-item").forEach(item => {
        const q = item.querySelector(".faq-question"), a = item.querySelector(".faq-answer"), inner = item.querySelector(".faq-answer-inner");
        q.addEventListener("click", () => {
            const open = item.classList.contains("active");
            document.querySelectorAll(".faq-item").forEach(o => { o.classList.remove("active"); gsap.to(o.querySelector(".faq-answer"), { height: 0, duration: .4, ease: "power2.inOut" }); });
            if (!open) { item.classList.add("active"); gsap.to(a, { height: inner.offsetHeight, duration: .4, ease: "power2.inOut" }); }
        });
    });
    gsap.from("#faq .faq-header", { opacity: 0, y: 30, duration: 1, scrollTrigger: { trigger: "#faq", start: "top 75%" } });
    gsap.from(".faq-item", { opacity: 0, y: 20, duration: .8, stagger: .1, scrollTrigger: { trigger: "#faq", start: "top 65%" } });
}

/* ── CONTACT & FOOTER ── */
function setupContactFooter() {
    gsap.from(".contact-tag", { opacity: 0, y: 20, duration: .8, scrollTrigger: { trigger: "#contact", start: "top 75%" } });
    gsap.from(".contact-heading", { opacity: 0, y: 80, scale: .95, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: "#contact", start: "top 72%" } });
    gsap.from(".contact-sub", { opacity: 0, y: 30, duration: 1, delay: .2, scrollTrigger: { trigger: "#contact", start: "top 68%" } });
    gsap.from(".contact-info-item", { opacity: 0, x: -30, duration: .8, stagger: .15, scrollTrigger: { trigger: "#contact", start: "top 62%" } });
    gsap.from(".contact-links .contact-link", { opacity: 0, y: 20, duration: .7, stagger: .1, scrollTrigger: { trigger: "#contact", start: "top 58%" } });
    gsap.from(".contact-card", { opacity: 0, x: 60, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: "#contact", start: "top 70%" } });
    gsap.from(".footer-grid > div", { opacity: 0, y: 30, duration: 1, stagger: .1, scrollTrigger: { trigger: "footer", start: "top 85%" } });
}

/* ── MAGIC RINGS (hero bg) ── */
function initMagicRings() {
    const mount = document.getElementById('heroMagicRings');
    if (!mount || typeof THREE === 'undefined') return;

    const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

    const fragmentShader = `
precision highp float;
uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform float uMouseInfluence, uHoverAmount, uHoverScale, uParallax, uBurst;
uniform vec2 uResolution, uMouse;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;
const float HP = 1.5707963;
const float CYCLE = 3.45;
float fade(float t) {
  return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}
float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}
void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;
  p -= uMouse * uMouseInfluence;
  float sc = mix(1.0, uHoverScale, uHoverAmount) + uBurst * 0.3;
  p /= sc;
  vec3 c = vec3(0.0);
  float rcf = max(float(uRingCount) - 1.0, 1.0);
  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec2 pr = p - fi * uParallax * uMouse;
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    c = mix(c, rc, vec3(ring(pr, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), i == 0 ? 0.0 : 2.95 * fi, px)));
  }
  c *= 1.0 + uBurst * 2.0;
  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) * uNoiseAmount;
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)) * uOpacity);
}`;

    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch (e) { return; }

    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;

    const uniforms = {
        uTime: { value: 0 },
        uAttenuation: { value: 8 },
        uResolution: { value: new THREE.Vector2() },
        uColor: { value: new THREE.Color('#3a86ff') },
        uColorTwo: { value: new THREE.Color('#42fcff') },
        uLineThickness: { value: 2.5 },
        uBaseRadius: { value: 0.32 },
        uRadiusStep: { value: 0.09 },
        uScaleRate: { value: 0.12 },
        uRingCount: { value: 7 },
        uOpacity: { value: 0.85 },
        uNoiseAmount: { value: 0.06 },
        uRotation: { value: 0 },
        uRingGap: { value: 1.5 },
        uFadeIn: { value: 0.7 },
        uFadeOut: { value: 0.5 },
        uMouse: { value: new THREE.Vector2() },
        uMouseInfluence: { value: 0.18 },
        uHoverAmount: { value: 0 },
        uHoverScale: { value: 1.15 },
        uParallax: { value: 0.04 },
        uBurst: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
        vertexShader, fragmentShader, uniforms, transparent: true
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    scene.add(quad);

    const resize = () => {
        const w = mount.clientWidth || window.innerWidth;
        const h = mount.clientHeight || window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio, 2);
        renderer.setSize(w, h);
        renderer.setPixelRatio(dpr);
        uniforms.uResolution.value.set(w * dpr, h * dpr);
    };
    resize();
    window.addEventListener('resize', resize);
    const ro = new ResizeObserver(resize); ro.observe(mount);

    const mouse = [0, 0], smooth = [0, 0];
    let hovered = false, burst = 0;

    mount.parentElement.addEventListener('mousemove', e => {
        const r = mount.getBoundingClientRect();
        mouse[0] = (e.clientX - r.left) / r.width - 0.5;
        mouse[1] = -((e.clientY - r.top) / r.height - 0.5);
    });
    mount.parentElement.addEventListener('mouseenter', () => { hovered = true; });
    mount.parentElement.addEventListener('mouseleave', () => { hovered = false; mouse[0] = 0; mouse[1] = 0; });
    mount.parentElement.addEventListener('click', () => { burst = 1; });

    let rafId;
    const animate = t => {
        rafId = requestAnimationFrame(animate);
        smooth[0] += (mouse[0] - smooth[0]) * 0.08;
        smooth[1] += (mouse[1] - smooth[1]) * 0.08;
        uniforms.uHoverAmount.value += ((hovered ? 1 : 0) - uniforms.uHoverAmount.value) * 0.08;
        burst *= 0.95; if (burst < 0.001) burst = 0;
        uniforms.uTime.value = t * 0.001 * 0.9;
        uniforms.uMouse.value.set(smooth[0], smooth[1]);
        uniforms.uBurst.value = burst;
        renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    /* clean up when page unloads */
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        ro.disconnect();
        renderer.dispose();
        material.dispose();
    });
}

/* ── INIT ── */
window.addEventListener('load', () => {
    setupAnimation();
    setupAbout();
    setupService();
    setupWork();
    setupPricing();
    setupReviews();
    setupFAQ();
    setupContactFooter();
    initMagicRings();
    setupBookingSystem();
});

/* ── BOOKING SYSTEM ── */
function setupBookingSystem() {
    const modal = document.getElementById('bookingModal');
    const triggers = document.querySelectorAll('.main-book-trigger');
    const closeBtn = document.getElementById('bmClose');
    const finalClose = document.getElementById('bmFinalClose');
    const overlay = document.getElementById('bmOverlay');

    let selectedDate = null;
    let selectedTime = null;

    // Open Modal
    triggers.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('active');
            resetBookingSteps();
        });
    });

    // Close Modal
    [closeBtn, finalClose, overlay].forEach(el => {
        el.addEventListener('click', () => modal.classList.remove('active'));
    });

    function resetBookingSteps() {
        document.querySelectorAll('.bm-step').forEach(s => s.classList.remove('active'));
        document.getElementById('bmStepCalendar').classList.add('active');
        selectedDate = null;
        selectedTime = null;
        updateNextBtnState();
        renderCalendar();
    }

    // CALENDAR LOGIC
    const daysGrid = document.getElementById('calendarDays');
    const monthYearLabel = document.getElementById('currentMonthYear');
    let currentViewDate = new Date();

    function renderCalendar() {
        daysGrid.innerHTML = '';
        const year = currentViewDate.getFullYear();
        const month = currentViewDate.getMonth();

        monthYearLabel.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentViewDate);

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        // Empty spaces before first day
        for (let i = 0; i < firstDay; i++) {
            const div = document.createElement('div');
            div.className = 'calendar-day empty';
            daysGrid.appendChild(div);
        }

        // Days of month
        for (let d = 1; d <= lastDate; d++) {
            const div = document.createElement('div');
            div.className = 'calendar-day';
            div.textContent = d;

            const dayDate = new Date(year, month, d);
            if (dayDate < new Date().setHours(0, 0, 0, 0)) div.classList.add('disabled');

            if (selectedDate && dayDate.toDateString() === selectedDate.toDateString()) {
                div.classList.add('selected');
            }

            div.addEventListener('click', () => {
                if (div.classList.contains('disabled')) return;
                document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                selectedDate = dayDate;
                updateNextBtnState();
            });

            daysGrid.appendChild(div);
        }
    }

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentViewDate.setMonth(currentViewDate.getMonth() - 1);
        renderCalendar();
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentViewDate.setMonth(currentViewDate.getMonth() + 1);
        renderCalendar();
    });

    // TIME SLOTS
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedTime = slot.dataset.time;
            updateNextBtnState();
        });
    });

    function updateNextBtnState() {
        document.getElementById('toFormBtn').disabled = !(selectedDate && selectedTime);
    }

    // FLOW: Step 1 -> Step 2
    document.getElementById('toFormBtn').addEventListener('click', () => {
        document.getElementById('bmStepCalendar').classList.remove('active');
        document.getElementById('bmStepForm').classList.add('active');

        const dateStr = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        document.getElementById('summaryDateTime').textContent = `${dateStr} at ${selectedTime}`;
    });

    // FORM SUBMISSION
    document.getElementById('bookingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real app, you'd send data to a server here.
        document.getElementById('bmStepForm').classList.remove('active');
        document.getElementById('bmStepSuccess').classList.add('active');
    });
}
window.addEventListener('resize', () => {
    setTimeout(() => { setupAnimation(); }, 200);
});
