/* =========================================================
   Triumph Property Management — interactions & motion
   GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.13 (vendored)
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var MOTION = root.classList.contains("motion");
  var HAS_GSAP = !!(window.gsap && window.ScrollTrigger);
  var ANIM = MOTION && HAS_GSAP;

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);

  /* =======================================================
     DATA
     ======================================================= */

  // Services shown in the carousel and modal, in the same order as the hero
  // tabs (Buyers, Sellers, Owners, Tenants). `cta` labels the carousel button,
  // `form` is the matching option in the contact form. A room's `stat` counts
  // up when it contains a number ("8%", "$0", "650+"); otherwise it is shown as is.
  var RESIDENCES = [
    {
      name: "Investing in Real Estate",
      cta: "Buy a Home",
      form: "Buy a Home",
      specs: "Buyers · Investors · Luxury homes & high-rise condos",
      desc: "Triumph Property Management is an investment company specializing in Property Investments – a brand you can trust when it comes to securing your assets. Investing can be risky or rewarding, depending on where you choose to place your investment.",
      price: "Licensed Nevada brokerage",
      rooms: [
        { label: "Las Vegas", img: "assets/img/res-shore-main.jpg", stat: "Since 2008", fixed: true, text: "an easy, reliable and professional transaction" },
        { label: "Market access", img: "assets/img/room-shore-bedroom.jpg", stat: "MLS", text: "REALTORS® Multiple Listing Service members" },
        { label: "Investors", img: "assets/img/room-shore-bath.jpg", stat: "7%", text: "management fee once you own three or more properties" },
        { label: "Certified", img: "assets/img/room-shore-kitchen.jpg", stat: "CRS", text: "Certified Residential Specialist" }
      ]
    },
    {
      name: "Selling Your Property",
      cta: "Sell your Home",
      form: "Sell Your Home",
      specs: "Marketing · First-class service · Exposure",
      desc: "Marketing plays a vital role in property sales by leveraging multimedia strategies to enhance visibility, drive sales, and attract tenants. As a management company, we help you Market Your Property to potential buyers, maximizing its reach and appeal.",
      price: "Sell your home in just 3 steps",
      rooms: [
        { label: "Step 1 · Marketing", img: "assets/img/res-ridge-main.jpg", stat: "1", text: "representing your home in all its glory" },
        { label: "Step 2 · First-class service", img: "assets/img/res-ridge-lofts.jpg", stat: "2", text: "a smooth and stress-free process" },
        { label: "Step 3 · Exposure", img: "assets/img/room-ridge-bedroom.jpg", stat: "3", text: "significant exposure for fewer days on the market" },
        { label: "Certified", img: "assets/img/about-living-fireplace.jpg", stat: "SRS", text: "Seller Representative Specialist" }
      ]
    },
    {
      name: "Full-Service Property Management",
      cta: "Property Management",
      form: "Property Management",
      specs: "Single-family · Condos · Multi-family · Commercial",
      desc: "A Local Property Management Service is essential for streamlining your business. With our team of professionals leading the way, you’ll seize every lucrative opportunity by partnering with one of the Top Property Management services in the United States.",
      price: "7–8% management fee",
      rooms: [
        { label: "Management fee", img: "assets/img/res-lantern-penthouse.jpg", stat: "8%", text: "of monthly rent, 7% for three or more properties" },
        { label: "Hidden fees", img: "assets/img/room-lantern-bedroom.jpg", stat: "0%", text: "no setup fees and transparent vendor invoices" },
        { label: "Inspections", img: "assets/img/home-modern-dusk.jpg", stat: "$0", text: "for move-in and move-out inspections" },
        { label: "Owner statements", img: "assets/img/room-lantern-suite.jpg", stat: "12", text: "monthly statements a year, plus annual reports and tax forms" }
      ]
    },
    {
      name: "Las Vegas Homes for Rent",
      cta: "Find A Rental",
      form: "Find a Rental",
      specs: "Las Vegas · Henderson · North Las Vegas · Summerlin",
      desc: "Looking for Rental Homes in Las Vegas? We have rental properties in Clark County to find the home and area you’re looking for. Find well maintained properties which are handled with care.",
      price: "Apply online",
      rooms: [
        { label: "Applications", img: "assets/img/vegas-skyline-night.jpg", stat: "1–3 days", text: "typical processing time for a complete application" },
        { label: "Credit score", img: "assets/img/room-shore-bedroom.jpg", stat: "650+", text: "with a clean rental history and no prior evictions" },
        { label: "Income", img: "assets/img/pool-night.jpg", stat: "3x", text: "the monthly rent, verified" },
        { label: "Tenant portal", img: "assets/img/strip-night-vertical.jpg", stat: "24/7", text: "pay rent, request repairs and review lease documents" }
      ]
    }
  ];

  /* =======================================================
     SMOOTH SCROLL (Lenis)
     ======================================================= */

  var lenis = null;
  if (ANIM && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function lockScroll(lock) {
    document.body.classList.toggle("is-locked", lock);
    if (lenis) { if (lock) lenis.stop(); else lenis.start(); }
  }

  function scrollToTarget(target) {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
    else target.scrollIntoView({ behavior: MOTION ? "smooth" : "auto" });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href");
    if (id.length < 2) return;
    var target = document.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    if (!menu.hidden) setMenu(false);
    scrollToTarget(target);
  });

  /* =======================================================
     SPLIT TEXT (words in masks)
     ======================================================= */

  function splitWords(el) {
    if (el.dataset.splitDone) return $$(".sw > span", el);
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            var outer = document.createElement("span");
            outer.className = "sw";
            var inner = document.createElement("span");
            inner.textContent = p;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          walk(child);
        }
      });
    };
    walk(el);
    el.dataset.splitDone = "1";
    return $$(".sw > span", el);
  }

  /* =======================================================
     HEADER + MENU
     ======================================================= */

  var header = $("#header");
  var burger = $(".burger");
  var menu = $("#menu");
  var headerHidden = false;
  var inAmenities = false;
  var lastY = window.scrollY;

  function setHeaderHidden(hide) {
    hide = hide || inAmenities;
    if (hide === headerHidden) return;
    headerHidden = hide;
    if (HAS_GSAP) gsap.to(header, { yPercent: hide ? -100 : 0, duration: 0.6, ease: "power3.out" });
    else header.style.transform = hide ? "translateY(-100%)" : "";
  }

  function onScroll() {
    var y = window.scrollY;
    var delta = y - lastY;
    header.classList.toggle("is-scrolled", y > 10);
    // Ignore tiny deltas (smooth-scroll easing) so the header doesn't flicker
    if (Math.abs(delta) < 6) return;
    if (y <= window.innerHeight * 0.8 || !menu.hidden) setHeaderHidden(false);
    else setHeaderHidden(delta > 0);
    lastY = y;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    lockScroll(open);
    if (open && ANIM) {
      gsap.fromTo(menu, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.out" });
      gsap.from($$(".menu-nav a", menu), { yPercent: 60, opacity: 0, duration: 0.8, stagger: 0.05, ease: "power3.out", delay: 0.15 });
    }
  }

  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) setMenu(false); });

  /* =======================================================
     HERO: slideshow + intro + scroll
     ======================================================= */

  var heroSlides = $$(".hero-slide");
  var heroSwap = $$(".hero-swap-words > span");
  var heroBars = $$(".hero-bars i");
  var heroCurrent = $("#hero-current");
  var heroIndex = 0;
  var heroTimer = null;
  var HERO_DELAY = 6.5;

  function kenBurns(slide, i) {
    if (!ANIM) return;
    var img = slide.querySelector("img");
    var dir = i % 2 === 0 ? 1 : -1;
    gsap.fromTo(img, { scale: 1.14, xPercent: -2 * dir }, { scale: 1, xPercent: 2 * dir, duration: HERO_DELAY + 2.5, ease: "none", overwrite: true });
  }

  function heroBarsTo(i) {
    heroBars.forEach(function (bar, b) {
      if (HAS_GSAP) gsap.killTweensOf(bar);
      bar.style.setProperty("--p", b < i ? 1 : 0);
    });
    if (ANIM) gsap.fromTo(heroBars[i], { "--p": 0 }, { "--p": 1, duration: HERO_DELAY, ease: "none" });
    else heroBars[i].style.setProperty("--p", 1);
  }

  function showHero(next) {
    var prev = heroSlides[heroIndex];
    var nextSlide = heroSlides[next];
    if (next === heroIndex) return;
    heroIndex = next;
    heroCurrent.textContent = pad(next + 1);
    // Rotating phrase ("Buy a Home", "Sell Your Home"...) follows the slide
    heroSwap.forEach(function (s, k) {
      s.classList.toggle("is-prev", s.classList.contains("is-active") && k !== next);
      s.classList.toggle("is-active", k === next);
    });
    nextSlide.style.zIndex = 2;
    prev.style.zIndex = 1;
    if (ANIM) {
      gsap.fromTo(nextSlide, { opacity: 0 }, {
        opacity: 1, duration: 1.8, ease: "power2.inOut",
        onComplete: function () { prev.classList.remove("is-active"); gsap.set(prev, { opacity: 0 }); }
      });
    } else {
      prev.classList.remove("is-active");
    }
    nextSlide.classList.add("is-active");
    kenBurns(nextSlide, next);
    heroBarsTo(next);
  }

  function startHero() {
    if (!ANIM || heroTimer) return;
    heroTimer = setInterval(function () { showHero((heroIndex + 1) % heroSlides.length); }, HERO_DELAY * 1000);
  }

  function stopHero() { clearInterval(heroTimer); heroTimer = null; }

  heroBarsTo(0);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopHero(); else if (window.scrollY < window.innerHeight) startHero();
  });

  function heroIntro() {
    var chars = $$(".hero-chars > span > span");
    var words = splitWords($('[data-hero="words"]'));
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".hero-slide", { scale: 1.22 }, { scale: 1, duration: 2.6, ease: "power2.out" }, 0)
      .to(chars, { yPercent: 0, duration: 1.6, stagger: 0.08, ease: "power4.out" }, 0.2)
      .to(words, { opacity: 1, y: 0, rotationX: 0, duration: 1, stagger: 0.04 }, 1.0)
      .to('[data-hero="swap"]', { opacity: 1, y: 0, duration: 1.2 }, 1.2)
      .to('[data-hero="tabs"] > *', { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 }, 1.4)
      .to('[data-hero="scroll"]', { opacity: 1, y: 0, duration: 0.8 }, 1.7)
      .to(header, { opacity: 1, yPercent: 0, duration: 0.9 }, 1.5)
      .to(".header-line", { scaleX: 1, duration: 1.4, ease: "expo.out" }, 1.8)
      .to(".hero-index", { opacity: 1, y: 0, duration: 0.8 }, 1.9);

    kenBurns(heroSlides[0], 0);
    startHero();
  }

  function heroInitialState() {
    gsap.set(".hero-chars > span > span", { yPercent: 115 });
    gsap.set(splitWords($('[data-hero="words"]')), { opacity: 0, y: 30, rotationX: -45, transformOrigin: "50% 100%" });
    gsap.set(['[data-hero="swap"]', '[data-hero="tabs"] > *', '[data-hero="scroll"]'], { opacity: 0, y: 30 });
    gsap.set(header, { opacity: 0, yPercent: -100 });
    gsap.set(".header-line", { scaleX: 0 });
    gsap.set(".hero-index", { opacity: 0, y: -10 });
  }

  if (ANIM) {
    // Scroll: hero image zooms and darkens, content drifts up and fades
    gsap.to(".hero-media", {
      scale: 1.15, yPercent: 10, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".hero-wrap", {
      yPercent: -18, opacity: 0, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "80% top", scrub: true }
    });
    ScrollTrigger.create({
      trigger: ".hero", start: "top top", end: "bottom top",
      onLeave: stopHero, onEnterBack: startHero
    });
  }

  /* =======================================================
     LOADER
     ======================================================= */

  var loader = $(".loader");

  function runLoader() {
    heroInitialState();
    var num = $("#loader-num");
    var line = $(".loader-line span");
    var counter = { v: 0 };
    var firstImg = heroSlides[0].querySelector("img");

    var imgReady = new Promise(function (resolve) {
      if (firstImg.complete) resolve();
      else { firstImg.addEventListener("load", resolve); firstImg.addEventListener("error", resolve); }
      setTimeout(resolve, 3500);
    });
    var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

    var count = gsap.to(counter, {
      v: 86, duration: 1.4, ease: "power2.out",
      onUpdate: function () { num.textContent = Math.round(counter.v); line.style.transform = "scaleX(" + counter.v / 100 + ")"; }
    });

    Promise.all([imgReady, fontsReady, new Promise(function (r) { setTimeout(r, 1300); })]).then(function () {
      count.kill();
      gsap.timeline()
        .to(counter, {
          v: 100, duration: 0.5, ease: "power1.out",
          onUpdate: function () { num.textContent = Math.round(counter.v); line.style.transform = "scaleX(" + counter.v / 100 + ")"; }
        })
        .to(".loader-inner, .loader-line", { opacity: 0, duration: 0.4 }, "+=0.1")
        .to(loader, { yPercent: -100, duration: 1.1, ease: "expo.inOut" })
        .add(function () { loader.remove(); }, ">")
        .add(heroIntro, "-=0.75");
    });
  }

  if (ANIM && loader) runLoader();
  else if (loader) loader.remove();

  /* =======================================================
     SCROLL REVEALS
     ======================================================= */

  if (ANIM) {
    $$("[data-split]").forEach(function (el) {
      var words = splitWords(el);
      gsap.set(words, { yPercent: 115 });
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: function () { gsap.to(words, { yPercent: 0, duration: 1.3, stagger: 0.05, ease: "power4.out" }); }
      });
    });

    gsap.set("[data-fade]", { opacity: 0, y: 40 });
    ScrollTrigger.batch("[data-fade]", {
      start: "top 92%", once: true,
      onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power3.out" }); }
    });

    $$("[data-reveal]").forEach(function (fig) {
      var img = fig.querySelector("img");
      gsap.set(fig, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(img, { scale: 1.3 });
      ScrollTrigger.create({
        trigger: fig, start: "top 85%", once: true,
        onEnter: function () {
          gsap.to(fig, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.out" });
          gsap.to(img, { scale: 1, duration: 2.2, ease: "expo.out" });
        }
      });
    });

    $$("[data-parallax]").forEach(function (el) {
      gsap.fromTo(el, { yPercent: -6 }, {
        yPercent: 6, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    $$("[data-stagger]").forEach(function (list) {
      gsap.set(list.children, { opacity: 0, y: 50 });
      ScrollTrigger.create({
        trigger: list, start: "top 85%", once: true,
        onEnter: function () { gsap.to(list.children, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: "power3.out" }); }
      });
    });

    gsap.fromTo(".footer-line", { scaleX: 0 }, {
      scaleX: 1, duration: 1.6, ease: "expo.out",
      scrollTrigger: { trigger: ".footer-line", start: "top 95%", once: true }
    });
  }

  /* Count-up numbers */
  function countUp(el, to, duration) {
    if (!ANIM) { el.textContent = to; return; }
    var o = { v: 0 };
    gsap.to(o, { v: to, duration: duration || 2, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v); } });
  }

  $$("[data-count]").forEach(function (el) {
    var to = parseInt(el.dataset.count, 10);
    if (!ANIM) return;
    el.textContent = "0";
    ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: function () { countUp(el, to); } });
  });

  /* =======================================================
     RESIDENCES SLIDER
     ======================================================= */

  var stage = $("#res-stage");
  var slides = $$(".res-slide", stage);
  var resActive = 0;
  var resBusy = false;
  var resTitle = $("#res-title");
  var resSpecs = $("#res-specs");
  var resDesc = $("#res-desc");
  var resCurrent = $("#res-current");

  slides.forEach(function (s) {
    var dim = document.createElement("span");
    dim.className = "res-dim";
    dim.style.cssText = "position:absolute;inset:0;background:#121717;pointer-events:none;";
    s.querySelector(".res-img").appendChild(dim);
  });

  function step() {
    var w = slides[0].offsetWidth;
    var gap = parseFloat(getComputedStyle(stage).getPropertyValue("--slide-gap")) * window.innerWidth / 100;
    return w + gap;
  }

  function offsetOf(i, active) {
    var n = slides.length;
    var o = ((i - active) % n + n) % n;
    return o > n / 2 ? o - n : o;
  }

  function slideProps(offset) {
    return {
      x: offset * step(),
      scale: offset === 0 ? 1 : 0.84,
      dim: offset === 0 ? 0 : 0.55
    };
  }

  function placeSlides(instant) {
    slides.forEach(function (s, i) {
      var p = slideProps(offsetOf(i, resActive));
      var dim = s.querySelector(".res-dim");
      s.setAttribute("aria-hidden", p.dim ? "true" : "false");
      if (HAS_GSAP) {
        gsap.set(s, { x: p.x, scale: p.scale, zIndex: p.dim ? 1 : 2 });
        gsap.set(dim, { opacity: p.dim });
      } else {
        s.style.transform = "translateX(" + p.x + "px) scale(" + p.scale + ")";
        dim.style.opacity = p.dim;
      }
    });
  }

  function updateResText(i, dir) {
    var r = RESIDENCES[i];
    resCurrent.textContent = pad(i + 1);
    $("#res-explore").textContent = r.cta;
    if (!ANIM) {
      resTitle.textContent = r.name; resSpecs.textContent = r.specs; resDesc.textContent = r.desc;
      return;
    }
    var outWords = $$(".sw > span", resTitle);
    var tl = gsap.timeline();
    tl.to(outWords.length ? outWords : resTitle, { yPercent: -115 * dir, duration: 0.45, stagger: 0.03, ease: "power2.in" }, 0)
      .to([resSpecs, resDesc], { opacity: 0, y: -12 * dir, duration: 0.35, ease: "power2.in" }, 0)
      .add(function () {
        resTitle.textContent = r.name;
        resTitle.dataset.splitDone = "";
        var words = splitWords(resTitle);
        gsap.set(words, { yPercent: 115 * dir });
        gsap.to(words, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: "power4.out" });
        resSpecs.textContent = r.specs;
        resDesc.textContent = r.desc;
        gsap.fromTo([resSpecs, resDesc], { opacity: 0, y: 14 * dir }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" });
      });
  }

  function goRes(next, dir) {
    if (resBusy || next === resActive) return;
    var n = slides.length;
    next = (next + n) % n;
    dir = dir || 1;
    var prevActive = resActive;
    resActive = next;
    updateResText(next, dir);

    if (!ANIM) { placeSlides(true); return; }
    resBusy = true;
    var st = step();
    slides.forEach(function (s, i) {
      var from = offsetOf(i, prevActive);
      var to = offsetOf(i, next);
      var p = slideProps(to);
      var dim = s.querySelector(".res-dim");
      gsap.set(s, { zIndex: to === 0 ? 2 : 1 });
      if (Math.abs(to - from) > 1) {
        // Wrap-around: exit off one edge, re-enter from the other
        gsap.timeline()
          .to(s, { x: (from - dir) * st, duration: 0.55, ease: "power2.in" })
          .set(s, { x: (to + dir) * st })
          .to(s, { x: p.x, scale: p.scale, duration: 0.8, ease: "power3.out" });
      } else {
        gsap.to(s, { x: p.x, scale: p.scale, duration: 1.2, ease: "power3.inOut" });
        gsap.fromTo(s.querySelector("img"), { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "power3.out" });
      }
      gsap.to(dim, { opacity: p.dim, duration: 1, ease: "power2.out" });
      s.setAttribute("aria-hidden", p.dim ? "true" : "false");
    });
    setTimeout(function () { resBusy = false; }, 900);
  }

  $("#res-next").addEventListener("click", function () { goRes(resActive + 1, 1); });
  $("#res-prev").addEventListener("click", function () { goRes(resActive - 1, -1); });

  slides.forEach(function (s, i) {
    s.addEventListener("click", function () {
      if (dragMoved) return;
      var o = offsetOf(i, resActive);
      if (o === 0) openModal(resActive, s);
      else goRes(i, o > 0 ? 1 : -1);
    });
  });

  // Drag / swipe
  var dragX = null, dragMoved = false;
  stage.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragX = e.clientX; dragMoved = false;
    stage.classList.add("is-dragging");
  });
  window.addEventListener("pointermove", function (e) {
    if (dragX === null) return;
    var dx = e.clientX - dragX;
    if (Math.abs(dx) > 6) dragMoved = true;
    if (ANIM && !resBusy) {
      slides.forEach(function (s, i) {
        gsap.to(s, { x: slideProps(offsetOf(i, resActive)).x + dx * 0.35, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      });
    }
  });
  window.addEventListener("pointerup", function (e) {
    if (dragX === null) return;
    var dx = e.clientX - dragX;
    dragX = null;
    stage.classList.remove("is-dragging");
    if (Math.abs(dx) > 60) goRes(resActive + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    else if (ANIM) slides.forEach(function (s, i) { gsap.to(s, { x: slideProps(offsetOf(i, resActive)).x, duration: 0.6, ease: "power3.out" }); });
    setTimeout(function () { dragMoved = false; }, 0);
  });

  document.addEventListener("keydown", function (e) {
    if (!modal.hidden || !menu.hidden) return;
    var r = stage.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    if (e.key === "ArrowRight") goRes(resActive + 1, 1);
    if (e.key === "ArrowLeft") goRes(resActive - 1, -1);
  });

  var resizeT;
  window.addEventListener("resize", function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { placeSlides(true); }, 120);
  });

  placeSlides(true);
  splitWords(resTitle);

  $("#res-explore").addEventListener("click", function () { openModal(resActive, this); });

  /* =======================================================
     RESIDENCE MODAL
     ======================================================= */

  var modal = $("#modal");
  var modalMain = $("#modal-main");
  var modalThumbs = $("#modal-thumbs");
  var modalLabel = $("#modal-label");
  var modalArea = $("#modal-area");
  var modalAreaText = $("#modal-area-text");
  var modalPre = $("#modal-pre");
  var modalUnit = $("#modal-unit");
  var modalRes = 0;
  var modalRoom = 0;
  var modalOpener = null;

  function showRoom(i, instant) {
    var room = RESIDENCES[modalRes].rooms[i];
    modalRoom = i;
    $$(".modal-thumb", modalThumbs).forEach(function (t, k) { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; });

    var img = new Image();
    img.src = room.img;
    img.alt = room.label;
    var old = $$("img", modalMain);
    modalMain.appendChild(img);

    if (ANIM && !instant) {
      gsap.fromTo(img, { opacity: 0, scale: 1.1 }, {
        opacity: 1, scale: 1, duration: 1.2, ease: "power3.out",
        onComplete: function () { old.forEach(function (o) { o.remove(); }); }
      });
      gsap.fromTo([modalLabel, modalAreaText], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
    } else {
      old.forEach(function (o) { o.remove(); });
    }
    modalLabel.textContent = room.label;
    modalAreaText.textContent = room.text;
    var m = !room.fixed && /^(\D*)(\d+)(.*)$/.exec(room.stat);
    if (m) {
      modalPre.textContent = m[1];
      modalUnit.textContent = m[3];
      countUp(modalArea, parseInt(m[2], 10), 1.2);
    } else {
      modalPre.textContent = modalUnit.textContent = "";
      modalArea.textContent = room.stat;
    }
  }

  function openModal(index, opener) {
    var r = RESIDENCES[index];
    modalRes = index;
    modalOpener = opener || document.activeElement;
    $("#modal-title").textContent = r.name;
    $("#modal-specs").textContent = r.specs;
    $("#modal-desc").textContent = r.desc;
    $("#modal-price").textContent = r.price;

    modalThumbs.innerHTML = "";
    r.rooms.forEach(function (room, k) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "modal-thumb";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", room.label);
      b.innerHTML = '<img src="' + room.img + '" alt=""><span>' + room.label + "</span>";
      b.addEventListener("click", function () { if (k !== modalRoom) showRoom(k); });
      modalThumbs.appendChild(b);
    });

    modal.hidden = false;
    modal.scrollTop = 0;
    lockScroll(true);
    showRoom(0, true);

    if (ANIM) {
      gsap.fromTo(modal, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" });
      gsap.fromTo(modalMain, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out", delay: 0.2 });
      gsap.fromTo($$(".modal-content > *", modal), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: "power3.out", delay: 0.45 });
    }
    setTimeout(function () { $("#modal-close").focus(); }, ANIM ? 500 : 0);
  }

  function closeModal(cb) {
    var done = function () {
      modal.hidden = true;
      lockScroll(false);
      if (typeof cb === "function") cb();
      else if (modalOpener && modalOpener.focus) modalOpener.focus();
    };
    if (ANIM) gsap.to(modal, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "expo.inOut", onComplete: done });
    else done();
  }

  $("#modal-close").addEventListener("click", closeModal);

  $("#modal-book").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    var service = RESIDENCES[modalRes].form;
    closeModal(function () {
      $("#f-res").value = service;
      scrollToTarget($("#contact"));
      setTimeout(function () { $("#f-name").focus({ preventScroll: true }); }, 1400);
    });
  });

  $$("[data-open-residence]").forEach(function (b) {
    b.addEventListener("click", function () { openModal(parseInt(b.dataset.openResidence, 10), b); });
  });

  modal.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      if (!e.target.classList.contains("modal-thumb")) return;
      var n = RESIDENCES[modalRes].rooms.length;
      var k = (modalRoom + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
      showRoom(k);
      $$(".modal-thumb", modalThumbs)[k].focus();
      return;
    }
    if (e.key !== "Tab") return;
    var f = $$('button, a[href], [tabindex]:not([tabindex="-1"])', modal).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* =======================================================
     PHILOSOPHY VALUES (expanding panels)
     ======================================================= */

  var values = $$(".value");
  var desktopValues = window.matchMedia("(min-width: 992px)");

  function openValue(v) {
    if (!desktopValues.matches) return;
    values.forEach(function (o) { o.classList.toggle("is-open", o === v); o.setAttribute("aria-expanded", String(o === v)); });
  }

  values.forEach(function (v) {
    v.addEventListener("mouseenter", function () { openValue(v); });
    v.addEventListener("focus", function () { openValue(v); });
    v.addEventListener("click", function () { openValue(v); });
  });

  /* =======================================================
     AMENITIES (pinned slice transitions)
     ======================================================= */

  var amenTrack = $("#amen-track");
  var layers = $$(".amen-layer");
  var smallImgs = $$(".amen-small img");
  var amenTexts = $$(".amen-text");
  var amenLine = $("#amen-progress-line");
  var SLICES = 12;
  var amenIndex = 0;

  // Turn layers 2 and 3 into vertical slices for the reveal
  layers.forEach(function (layer, li) {
    if (li === 0) return;
    var src = layer.querySelector("img").getAttribute("src");
    layer.innerHTML = "";
    for (var i = 0; i < SLICES; i++) {
      var s = document.createElement("div");
      s.className = "amen-slice";
      s.style.left = (i * 100) / SLICES + "%";
      s.style.width = "calc(" + 100 / SLICES + "% + 1px)";
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      img.style.width = SLICES * 100 + "%";
      img.style.left = -i * 100 + "%";
      s.appendChild(img);
      layer.appendChild(s);
    }
  });

  function setAmenActive(i) {
    if (i === amenIndex) return;
    amenIndex = i;
    smallImgs.forEach(function (img, k) { img.classList.toggle("is-active", k === i); });
    amenTexts.forEach(function (t, k) { t.classList.toggle("is-active", k === i); });
  }

  function amenSlices(li) { return $$(".amen-slice", layers[li]); }

  if (HAS_GSAP) {
    var mm = gsap.matchMedia();

    // Desktop: scroll-scrubbed slice reveals while the scene is pinned
    mm.add("(min-width: 992px)", function () {
      gsap.set(layers, { opacity: 1 });
      gsap.set(amenSlices(1).concat(amenSlices(2)), { clipPath: "inset(100% 0% 0% 0%)" });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: amenTrack, start: "top top", end: "bottom bottom", scrub: MOTION ? 1 : true,
          onUpdate: function (self) {
            var p = self.progress;
            amenLine.style.transform = "scaleX(" + p + ")";
            setAmenActive(p < 0.36 ? 0 : p < 0.7 ? 1 : 2);
          },
          onToggle: function (self) { inAmenities = self.isActive; setHeaderHidden(self.isActive); }
        }
      });

      tl.to({}, { duration: 0.6 })
        .to(amenSlices(1), { clipPath: "inset(0% 0% 0% 0%)", duration: 1, stagger: { each: 0.06, from: "start" }, ease: "power2.inOut" })
        .fromTo($$("img", layers[1]), { scale: 1.15 }, { scale: 1, duration: 1.6, ease: "none" }, "<")
        .to({}, { duration: 0.6 })
        .to(amenSlices(2), { clipPath: "inset(0% 0% 0% 0%)", duration: 1, stagger: { each: 0.06, from: "end" }, ease: "power2.inOut" })
        .fromTo($$("img", layers[2]), { scale: 1.15 }, { scale: 1, duration: 1.6, ease: "none" }, "<")
        .to({}, { duration: 0.6 });

      return function () { inAmenities = false; setHeaderHidden(false); };
    });

    // Mobile / tablet: autoplaying crossfade, tap to advance
    mm.add("(max-width: 991px)", function () {
      gsap.set(amenSlices(1).concat(amenSlices(2)), { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(layers, { opacity: function (k) { return k === amenIndex ? 1 : 0; } });
      var timer = null;
      var DUR = 5;

      function show(i) {
        layers.forEach(function (l, k) { gsap.to(l, { opacity: k === i ? 1 : 0, duration: MOTION ? 1.2 : 0, ease: "power2.inOut" }); });
        setAmenActive(i);
        if (MOTION) gsap.fromTo(amenLine, { scaleX: 0 }, { scaleX: 1, duration: DUR, ease: "none" });
        else amenLine.style.transform = "scaleX(1)";
      }

      function next() { show((amenIndex + 1) % layers.length); }

      var big = $(".amen-big");
      var onTap = function () { next(); restart(); };
      function restart() { clearInterval(timer); if (MOTION) timer = setInterval(next, DUR * 1000); }

      big.addEventListener("click", onTap);
      var st = ScrollTrigger.create({
        trigger: ".amenities", start: "top 80%", end: "bottom top",
        onToggle: function (self) { if (self.isActive) { show(amenIndex); restart(); } else clearInterval(timer); }
      });

      return function () { clearInterval(timer); big.removeEventListener("click", onTap); st.kill(); };
    });
  }

  /* =======================================================
     CLIENT LOGOS (infinite marquee)
     ======================================================= */

  // Duplicate the logos once so the CSS loop (translate -50%) is seamless.
  // Always runs: the client row is meant to keep scrolling in one line.
  $$(".marquee-track").forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      c.querySelector("img").alt = "";
      track.appendChild(c);
    });
    track.parentElement.classList.add("is-looping");
  });

  /* =======================================================
     FAQ
     ======================================================= */

  var faqButtons = $$(".faq-q");
  faqButtons.forEach(function (btn, i) {
    var panel = btn.nextElementSibling;
    var id = "faq-a-" + i;
    panel.id = id;
    btn.setAttribute("aria-controls", id);
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      faqButtons.forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      btn.setAttribute("aria-expanded", String(open));
      setTimeout(function () { if (HAS_GSAP) ScrollTrigger.refresh(); }, 650);
    });
  });
  if (faqButtons[0]) faqButtons[0].setAttribute("aria-expanded", "true");

  /* =======================================================
     VIEWING FORM (Netlify Forms when hosted)
     ======================================================= */

  var form = $("#viewing-form");
  var msg = $("#form-msg");
  var success = $("#form-success");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    ["name", "email"].forEach(function (n) {
      var input = form.elements[n];
      var valid = input.value.trim() !== "" && input.checkValidity();
      input.closest(".field").classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    var consent = form.elements.consent;
    consent.closest(".consent").classList.toggle("invalid", !consent.checked);
    if (!consent.checked) ok = false;

    if (!ok) {
      msg.className = "form-msg err";
      msg.textContent = "Please add your name, a valid email and your consent.";
      return;
    }

    if (!/^https?:$/.test(location.protocol)) {
      msg.className = "form-msg";
      msg.textContent = "Preview mode: requests are delivered once the site is published on Netlify.";
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    msg.className = "form-msg";
    msg.textContent = "Sending…";

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      form.hidden = true;
      success.hidden = false;
      success.focus();
      if (ANIM) gsap.from(success.children, { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, ease: "power3.out" });
    }).catch(function () {
      btn.disabled = false;
      msg.className = "form-msg err";
      msg.textContent = "Sorry, that did not send. Please email contact@triumphpm.com or call 702.367.2323.";
    });
  });

  form.addEventListener("input", function (e) {
    var f = e.target.closest(".field, .consent");
    if (f) f.classList.remove("invalid");
  });

  /* =======================================================
     MISC
     ======================================================= */

  $("#year").textContent = new Date().getFullYear();

  if (HAS_GSAP) {
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    if (document.fonts) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
