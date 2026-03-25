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
    gsap.set(".hero", { autoAlpha: 0 });

    const lw = navLinks.offsetWidth, px = 28, tw = lw + px * 2, nt = 30;
    const nh = navbar.offsetHeight || 50, tl = (window.innerWidth - tw) / 2;
    gsap.set(navbar, { autoAlpha: 1, left: tl, width: tw, top: nt, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(25px)" });
    gsap.set(logo, { position: "fixed", left: 0, top: 0, x: 0, y: 0, scale: 1, fontSize: "16px" });

    const lW = logo.offsetWidth, lH = logo.offsetHeight;
    const imgNode = document.querySelector(".logo-img");
    const flW = (imgNode && imgNode.offsetWidth > 0) ? imgNode.offsetWidth : 45;
    const ew = px + flW + 24 + lw + px, fr = tl + tw, el = fr - ew;
    const rx2 = el + px - (lW - flW) / 2, ry2 = nt + (nh - lH) / 2;
    const hs = Math.min((window.innerWidth * .45) / lW, (window.innerHeight * .20) / lH);
    const hx = window.innerWidth / 2 - rx2 - (lW * hs) / 2, hy = window.innerHeight / 2 - ry2 - lH / 2;

    gsap.set(logo, { position: "fixed", left: rx2, top: ry2, x: hx, y: hy, scale: hs, transformOrigin: "left center", opacity: 1 });

    const tl2 = gsap.timeline({ scrollTrigger: { trigger: "#hero", start: "top top", end: "+=800", scrub: 2, pin: true, pinSpacing: true, anticipatePin: 1 } });
    tl2.to(logo, { x: 0, y: 0, scale: 1, ease: "expo.inOut", duration: 0.5 }, 0);
    tl2.to(".logo-text", { opacity: 0, duration: 0.25, ease: "power2.inOut" }, 0);
    tl2.to(".logo-img", { opacity: 1, duration: 0.25, ease: "power2.inOut" }, 0.25);
    tl2.to(navbar, { left: el, width: ew, ease: "expo.inOut", duration: 0.5 }, 0);
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

    /* ── ODOMETER COUNT-UP – every visit (about stats) ── */
    document.querySelectorAll(".stat-num[data-val]").forEach(el => {
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

    setupBookingSystem();
    setupCaseStudyOverlay();
});

/* ── CASE STUDY OVERLAY ── */
function setupCaseStudyOverlay() {
    const workLinks = document.querySelectorAll('.wi-link');
    const projectBtns = document.querySelectorAll('.view-cs-btn');
    const overlay = document.getElementById('caseStudyOverlay');
    const backBtn = document.getElementById('csBackBtn');
    
    const csCat = document.getElementById('csCat');
    const csTitle = document.getElementById('csTitle');
    const csDesc = document.getElementById('csDesc');
    const csChallenge = document.getElementById('csChallenge');
    const csWorkList = document.getElementById('csWorkList');
    const csResult = document.getElementById('csResult');
    const csHeroImg = document.getElementById('csHeroImg');
    
    const csGrowth = document.getElementById('csGrowthSection');
    const csStandard = document.getElementById('csStandardSection');

    function openOverlay() {
        if (typeof lenis !== 'undefined') lenis.stop();
        document.body.style.overflow = 'hidden'; // Fallback
        
        // Reset and prepare
        gsap.set(overlay, { 
            display: 'block', 
            opacity: 1, // Start opaque but clipped
            clipPath: 'circle(0% at 50% 50%)',
            pointerEvents: 'all' // Enable immediately for responsiveness
        });
        overlay.scrollTop = 0;
        
        const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });
        
        // Circular wipe reveal - faster and larger
        tl.to(overlay, { 
            clipPath: 'circle(150% at 50% 50%)', 
            duration: 1.1
        });
        
        // Content reveal - more aggressive
        tl.fromTo('#csContent > *',
            { opacity: 0, y: 60, scale: 0.95, filter: 'blur(10px)' },
            { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.08, ease: "expo.out" },
            "-=0.7"
        );
        
        // Image reveal
        tl.fromTo(csHeroImg, 
            { scale: 1.2, filter: 'brightness(0)' },
            { scale: 1, filter: 'brightness(1)', duration: 1.2, ease: "power3.out" },
            "-=0.8"
        );

        // Staggered list items
        if (csGrowth.style.display === 'block') {
            const listItems = csWorkList.querySelectorAll('li');
            if (listItems.length > 0) {
                tl.fromTo(listItems,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, stagger: 0.05, duration: 0.8, ease: "power2.out" },
                    "-=0.4"
                );
            }
        }
    }

    function closeOverlay() {
        const tl = gsap.timeline({
            onComplete: () => {
                overlay.style.display = 'none';
                document.body.style.overflow = ''; // Restore
                if (typeof lenis !== 'undefined') lenis.start();
            }
        });
        
        tl.to('#csContent > *', { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" });
        tl.to(overlay, { 
            clipPath: 'circle(0% at 50% 50%)', 
            opacity: 0, 
            duration: 0.7, 
            ease: "power4.inOut" 
        }, "-=0.1");
    }

    // Standard work items
    workLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const workItem = link.closest('.work-item');
            if (workItem) {
                csCat.innerText = workItem.querySelector('.wi-cat').innerText;
                csTitle.innerText = workItem.querySelector('.wi-title').innerText;
                csDesc.innerText = workItem.querySelector('.wi-desc').innerText;
                
                csGrowth.style.display = 'none';
                csStandard.style.display = 'block';
            }
            openOverlay();
        });
    });

    // Brand case studies (horizontal scroll)
    projectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.project-card');
            if (card) {
                const brand = card.dataset.brand;
                const accent = card.dataset.accent;
                const challenge = card.dataset.challenge;
                const workLines = card.dataset.work.split('|');
                const result = card.dataset.result;
                const img = card.dataset.img;

                csCat.innerText = "Growth System Case Study";
                csTitle.innerHTML = `${brand} <span class="accent">${accent}</span>`;
                csHeroImg.src = img;

                csChallenge.innerText = challenge;
                csWorkList.innerHTML = workLines.map(line => `<li>${line}</li>`).join('');
                csResult.innerText = result;

                csGrowth.style.display = 'block';
                csStandard.style.display = 'none';
            }
            openOverlay();
        });
    });

    if (backBtn) {
        backBtn.addEventListener('click', closeOverlay);
        
        // Magnetic effect for back button
        backBtn.addEventListener('mousemove', (e) => {
            const rect = backBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(backBtn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        backBtn.addEventListener('mouseleave', () => {
            gsap.to(backBtn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        });
    }
}

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
