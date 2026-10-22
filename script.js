/* ===== Harshil Sureja Portfolio — JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {
  // ===== LOADING SCREEN =====
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1500);
  });
  // Fallback if load event already fired
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // ===== PARTICLES BACKGROUND =====
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.baseOpacity = this.opacity;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          this.opacity = this.baseOpacity + 0.3;
          this.size = Math.min(this.size + 0.02, 4);
        } else {
          this.opacity = this.baseOpacity;
        }
      }
    }
    draw() {
      ctx.fillStyle = `rgba(200, 149, 108, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 130) {
          const opacity = (1 - distance / 130) * 0.12;
          ctx.strokeStyle = `rgba(200, 149, 108, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // ===== CUSTOM CURSOR =====
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', e => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorDot.style.left = cursorX + 'px';
      cursorDot.style.top = cursorY + 'px';
    });

    function animateCursor() {
      outlineX += (cursorX - outlineX) * 0.12;
      outlineY += (cursorY - outlineY) * 0.12;
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top = outlineY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .portfolio-card, .tool-item, .service-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.borderColor = 'var(--color-gold)';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.borderColor = 'var(--color-accent)';
      });
    });
  }

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menu-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
  });

  navOverlay.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinksContainer.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close mobile menu on link click
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== TYPING ANIMATION =====
  const typedTextEl = document.getElementById('typed-text');
  const phrases = [
    'Social Media Executive',
    'Digital Marketing & Content Specialist',
    'Freelance Website & Creative Specialist'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // Pause before next phrase
    }

    setTimeout(typeEffect, typeSpeed);
  }
  setTimeout(typeEffect, 1500);

  // ===== SCROLL REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== ANIMATED COUNTERS =====
  const statNumbers = document.querySelectorAll('.hero-stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const count = parseFloat(target.getAttribute('data-count'));
        if (!isNaN(count)) animateCounter(target, count);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;
    const suffix = element.textContent.includes('+') ? '+' : '';
    const isDecimal = target % 1 !== 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (isDecimal) {
        element.textContent = current.toFixed(2) + suffix;
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, stepTime);
  }

  // ===== SKILL BAR ANIMATION =====
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ===== PORTFOLIO LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  const portfolioData = [
    {
      title: 'Doctor na Gola',
      desc: 'Premium food brand social media creative — Product showcase design with elegant typography',
      img: 'image/WhatsApp Image 2026-05-29 at 7.17.16 PM.jpeg'
    },
    {
      title: 'Kalamay Design Studio',
      desc: 'Interior design studio — Sophisticated brand identity and logo design',
      img: 'image/WhatsApp Image 2026-05-29 at 7.19.26 PM.jpeg'
    },
    {
      title: 'Vizoary Innovation',
      desc: 'Technology company — Modern brand identity with gradient design elements',
      img: 'image/WhatsApp Image 2026-05-29 at 7.20.03 PM.jpeg'
    },
    {
      title: 'Grink',
      desc: 'Natural beverage brand — Vibrant logo design with organic aesthetics',
      img: 'image/WhatsApp Image 2026-05-29 at 7.20.27 PM.jpeg'
    },
    {
      title: 'Apna Indian Bajar Groceries',
      desc: 'Grocery store — Clean logo design with shopping cart icon and produce illustration',
      img: 'image/WhatsApp Image 2026-05-29 at 7.24.15 PM.jpeg'
    },
    {
      title: 'Om Consultancy',
      desc: 'Home loan services — Multi-language social media ad with professional layout',
      img: 'image/WhatsApp Image 2026-05-29 at 7.24.59 PM.jpeg'
    },
    {
      title: 'Hardik Roleshiya & Company',
      desc: 'Accountant & Tax Consultant — Professional promotional poster with service highlights',
      img: 'image/WhatsApp Image 2026-05-29 at 7.33.01 PM.jpeg'
    }
  ];

  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const index = parseInt(card.getAttribute('data-lightbox'));
      const data = portfolioData[index];
      lightboxImg.src = data.img;
      lightboxImg.alt = data.title;
      lightboxTitle.textContent = data.title;
      lightboxDesc.textContent = data.desc;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ===== BACK TO TOP BUTTON =====
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== CONTACT FORM HANDLER =====
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    // Redirect to WhatsApp with form data
    const whatsappMessage = encodeURIComponent(
      `Hi Harshil! My name is ${name} (${email}).\n\nSubject: ${subject}\n\nMessage: ${message}`
    );
    window.open(`https://wa.me/917284050706?text=${whatsappMessage}`, '_blank');

    contactForm.reset();
  });

  // ===== TILT EFFECT ON PORTFOLIO CARDS =====
  if (window.matchMedia('(hover: hover)').matches) {
    portfolioCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ===== PARALLAX ON HERO SHAPES =====
  const heroShapes = document.querySelectorAll('.hero-shape');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroShapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.15;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });

  // ===== MAGNETIC EFFECT ON BUTTONS =====
  if (window.matchMedia('(hover: hover)').matches) {
    const magneticButtons = document.querySelectorAll('.btn, .social-link');

    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ===== RIPPLE EFFECT ON BUTTONS =====
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
      `;

      // Add keyframes if not already added
      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
          @keyframes rippleEffect {
            to { transform: scale(4); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ===== TEXT REVEAL ANIMATION FOR SECTION TITLES =====
  const sectionTitles = document.querySelectorAll('.section-title');

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'titleReveal 0.8s ease-out forwards';
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  sectionTitles.forEach(title => {
    titleObserver.observe(title);
  });

  // Add title reveal keyframes
  const titleStyle = document.createElement('style');
  titleStyle.textContent = `
    @keyframes titleReveal {
      from {
        clip-path: inset(0 100% 0 0);
      }
      to {
        clip-path: inset(0 0% 0 0);
      }
    }
  `;
  document.head.appendChild(titleStyle);

  // ===== SCROLL PROGRESS INDICATOR =====
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-accent), var(--color-gold));
    z-index: 10001;
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });

  // ===== LOGO SLIDESHOW (auto-rotates every 2s, slide from left) =====
  const logoSlideshow = document.getElementById('logo-slideshow');
  if (logoSlideshow) {
    const slides = logoSlideshow.querySelectorAll('.pf-logo-slide');
    const dots = logoSlideshow.querySelectorAll('.pf-logo-dot');
    let currentSlide = 0;
    let slideshowInterval = null;

    function goToSlide(nextIndex) {
      // Remove active from current → CSS animates it back to translateX(-60px) = slide out left
      slides[currentSlide].classList.remove('active');

      // Add active to next → CSS animates it from translateX(-60px) to 0 = slide in from left
      slides[nextIndex].classList.add('active');

      // Update dots
      dots[currentSlide].classList.remove('active');
      dots[nextIndex].classList.add('active');

      currentSlide = nextIndex;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      goToSlide(next);
    }

    let hovered = false;
    let visible = false;

    // Always clear first so a second start() can never stack a duplicate timer
    function startSlideshow() {
      clearInterval(slideshowInterval);
      if (hovered || !visible || document.hidden) return;
      slideshowInterval = setInterval(nextSlide, 2000);
    }

    function stopSlideshow() {
      clearInterval(slideshowInterval);
    }

    // Dot click navigation
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-dot'));
        if (targetIndex !== currentSlide) {
          stopSlideshow();
          goToSlide(targetIndex);
          startSlideshow();
        }
      });
    });

    // Pause on hover
    logoSlideshow.addEventListener('mouseenter', () => { hovered = true; stopSlideshow(); });
    logoSlideshow.addEventListener('mouseleave', () => { hovered = false; startSlideshow(); });
    document.addEventListener('visibilitychange', startSlideshow);

    // Start when section is visible
    const slideshowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        visible = entry.isIntersecting;
        startSlideshow();
      });
    }, { threshold: 0.3 });

    slideshowObserver.observe(logoSlideshow);
  }

  // ===== POSTER SLIDESHOW (auto-rotates every 2s, slide from left) =====
  const posterSlideshow = document.getElementById('poster-slideshow');
  if (posterSlideshow) {
    const pSlides = posterSlideshow.querySelectorAll('.pf-poster-slide');
    const pDots = posterSlideshow.querySelectorAll('.pf-poster-dot');
    let pCurrentSlide = 0;
    let pSlideshowInterval = null;

    function goToPosterSlide(nextIndex) {
      pSlides[pCurrentSlide].classList.remove('active');
      pSlides[nextIndex].classList.add('active');

      pDots[pCurrentSlide].classList.remove('active');
      pDots[nextIndex].classList.add('active');

      pCurrentSlide = nextIndex;
    }

    function nextPosterSlide() {
      const next = (pCurrentSlide + 1) % pSlides.length;
      goToPosterSlide(next);
    }

    let hovered = false;
    let visible = false;

    // Always clear first so a second start() can never stack a duplicate timer
    function startPosterSlideshow() {
      clearInterval(pSlideshowInterval);
      if (hovered || !visible || document.hidden) return;
      pSlideshowInterval = setInterval(nextPosterSlide, 2000);
    }

    function stopPosterSlideshow() {
      clearInterval(pSlideshowInterval);
    }

    pDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-dot'));
        if (targetIndex !== pCurrentSlide) {
          stopPosterSlideshow();
          goToPosterSlide(targetIndex);
          startPosterSlideshow();
        }
      });
    });

    posterSlideshow.addEventListener('mouseenter', () => { hovered = true; stopPosterSlideshow(); });
    posterSlideshow.addEventListener('mouseleave', () => { hovered = false; startPosterSlideshow(); });
    document.addEventListener('visibilitychange', startPosterSlideshow);

    const pSlideshowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        visible = entry.isIntersecting;
        startPosterSlideshow();
      });
    }, { threshold: 0.3 });

    pSlideshowObserver.observe(posterSlideshow);
  }

});


// ===== TOOLS FILTER =====
(function () {
  const chips = document.querySelectorAll('.tools-chip');
  const tiles = document.querySelectorAll('.tool-tile');
  if (!chips.length) return;
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach(c => {
        const on = c === chip;
        c.classList.toggle('active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      tiles.forEach(t => {
        const show = f === 'all' || t.dataset.cat === f;
        t.classList.toggle('is-hidden', !show);
        if (show) { t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; }
      });
    });
  });
})();

// ===== HIDE HEADER ON SCROLL DOWN, SHOW ON SCROLL UP =====
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let lastY = window.scrollY;
  let ticking = false;
  function update() {
    const y = window.scrollY;
    const menuOpen = document.body.classList.contains('menu-open') || document.getElementById('nav-links')?.classList.contains('active');
    if (menuOpen || y < 80) {
      navbar.classList.remove('nav-hidden');
    } else if (y > lastY + 6) {
      navbar.classList.add('nav-hidden');
    } else if (y < lastY - 6) {
      navbar.classList.remove('nav-hidden');
    }
    if (Math.abs(y - lastY) > 6) lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  // keyboard focus inside the header always reveals it
  navbar.addEventListener('focusin', () => navbar.classList.remove('nav-hidden'));
})();
