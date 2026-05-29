document.addEventListener("DOMContentLoaded", () => {
  let projects = window.projectCaseStudies || {};
  window.projects = projects;

  const toastContainer = document.getElementById("toastContainer");
  const projectModalElement = document.getElementById("projectModal");
  const projectModal = new bootstrap.Modal(projectModalElement, {
    focus: true,
  });

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  function loadProjects() {
    if (window.location.protocol === "file:") {
      return;
    }

    fetch("./assets/json/projects.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load projects.json");
        }

        return response.json();
      })
      .then((loadedProjects) => {
        projects = loadedProjects;
        window.projects = projects;
      })
      .catch((error) => {
        console.warn("Using embedded project case studies.", error);
      });
  }

  function initTypingEffect() {
    const typingElement = document.getElementById("typing");
    const phrases = [
      " I craft scalable systems.",
      " I engineer with precision.",
      " I build performance-first platforms.",
      " I create digital infrastructure.",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (!deleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
          deleting = true;
          setTimeout(typeEffect, 1500);
          return;
        }
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      setTimeout(typeEffect, deleting ? 40 : 70);
    }

    typeEffect();
  }

  function initFadeUpAnimation() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    document.querySelectorAll(".fade-up").forEach((element) => {
      observer.observe(element);
    });
  }

  function initBackToTop() {
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  function initCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(button.dataset.copy);
          showToast("Email copied successfully");
        } catch (error) {
          showToast("Unable to copy email");
        }
      });
    });
  }

  function initProjectFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectItems = document.querySelectorAll(".project-item");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        projectItems.forEach((item) => {
          const match = filter === "all" || item.dataset.category === filter;

          if (match) {
            item.style.display = "block";

            requestAnimationFrame(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            });
          } else {
            item.style.opacity = "0";
            item.style.transform = "scale(.95)";

            setTimeout(() => {
              item.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        let target;

        try {
          target = document.querySelector(targetId);
        } catch (error) {
          return;
        }

        if (target) {
          event.preventDefault();

          const navbar = document.querySelector(".navbar");
          const navbarOffset = navbar ? navbar.offsetHeight + 16 : 0;
          const targetTop = target.getBoundingClientRect().top + window.scrollY;

          window.scrollTo({
            top: Math.max(targetTop - navbarOffset, 0),
            behavior: "smooth",
          });
        }
      });
    });
  }

  function initWebsitePreviews() {
    const frames = document.querySelectorAll(".browser-frame");
    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)");

    function updatePreviewTravel(frame) {
      const container = frame.querySelector(".website-preview-container");
      const image = frame.querySelector(".website-preview-image");

      if (!container || !image) {
        return;
      }

      const travel = Math.max(0, image.scrollHeight - container.clientHeight);
      frame.style.setProperty("--preview-travel", `${travel}px`);
      frame.style.setProperty(
        "--preview-duration",
        `${Math.min(Math.max(travel / 90, 4), 10)}s`,
      );
    }

    function updateAllPreviewTravel() {
      frames.forEach(updatePreviewTravel);
    }

    frames.forEach((frame) => {
      frame.tabIndex = 0;
      frame.setAttribute("role", "img");
      frame.setAttribute(
        "aria-label",
        `Scrollable preview of ${
          frame.querySelector(".browser-url")?.textContent?.trim() ||
          "project website"
        }`,
      );

      frame.querySelectorAll(".website-preview-image").forEach((image) => {
        if (image.complete) {
          updatePreviewTravel(frame);
        } else {
          image.addEventListener("load", () => updatePreviewTravel(frame), {
            once: true,
          });
        }
      });

      frame.addEventListener("pointerup", () => {
        if (!isTouchDevice.matches) {
          return;
        }

        frame.classList.add("is-previewing");
      });
    });

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(updateAllPreviewTravel);
      frames.forEach((frame) => observer.observe(frame));
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!isTouchDevice.matches) {
              return;
            }

            entry.target.classList.toggle(
              "is-previewing",
              entry.isIntersecting,
            );
          });
        },
        {
          threshold: 0.55,
        },
      );

      frames.forEach((frame) => observer.observe(frame));
    }

    window.addEventListener("resize", updateAllPreviewTravel, {
      passive: true,
    });
    updateAllPreviewTravel();
  }

  function renderProjectTech(project) {
    const techContainer = document.getElementById("modalTechStack");
    techContainer.innerHTML = "";

    project.tech.forEach((tech) => {
      const badge = document.createElement("span");
      badge.className = "tech-badge";
      badge.textContent = tech;
      techContainer.appendChild(badge);
    });
  }

  function renderProjectFeatures(project) {
    const featuresContainer = document.getElementById("modalFeatures");
    featuresContainer.innerHTML = "";

    project.features.forEach((feature) => {
      const col = document.createElement("div");
      col.className = "col-md-6";
      col.innerHTML = `
        <div class="project-feature-card">
          <h4>${feature.title}</h4>
          <p>${feature.description}</p>
        </div>
      `;

      featuresContainer.appendChild(col);
    });
  }

  function renderProjectPages(project) {
    const pagesContainer = document.getElementById("modalPages");
    pagesContainer.innerHTML = "";

    project.pages.forEach((page) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${page.title}:</strong>
        ${page.description}
      `;

      pagesContainer.appendChild(li);
    });
  }

  function updateProjectLinks(project) {
    const liveLink = document.getElementById("modalLiveLink");
    const githubLink = document.getElementById("modalGithubLink");

    liveLink.href = project.liveUrl || "#";
    liveLink.toggleAttribute("aria-disabled", !project.liveUrl);

    if (project.githubUrl) {
      githubLink.href = project.githubUrl;
      githubLink.removeAttribute("aria-disabled");
      githubLink.classList.remove("d-none");
    } else {
      githubLink.href = "#";
      githubLink.setAttribute("aria-disabled", "true");
      githubLink.classList.add("d-none");
    }
  }

  function initProjectModalLinks() {
    projectModalElement.addEventListener("click", (event) => {
      const link = event.target.closest("a[target='_blank']");

      if (!link || !projectModalElement.contains(link)) {
        return;
      }

      const href = link.getAttribute("href");

      if (
        !href ||
        href === "#" ||
        link.getAttribute("aria-disabled") === "true"
      ) {
        event.preventDefault();
        showToast("Project link is unavailable");
        return;
      }

      event.stopPropagation();
    });
  }

  function openProjectModal(project) {
    if (!project) {
      showToast("Project details are still loading");
      return;
    }

    document.getElementById("modalImage").src = project.image;
    document.getElementById("modalImage").alt = project.title;
    document.getElementById("projectModalLabel").textContent = project.title;
    document.getElementById("modalCategory").textContent = project.category;
    document.getElementById("modalShortDescription").textContent =
      project.shortDescription;
    document.getElementById("modalDescription").textContent =
      project.description;

    renderProjectTech(project);
    renderProjectFeatures(project);
    renderProjectPages(project);
    updateProjectLinks(project);

    projectModal.show();
  }

  loadProjects();
  initTypingEffect();
  initFadeUpAnimation();
  initBackToTop();
  initCopyButtons();
  initProjectFilter();
  initSmoothScrolling();
  initWebsitePreviews();
  initProjectModalLinks();

  window.openProjectModal = openProjectModal;
  window.projects = projects;
});

// assets/scripts/main.js
document.addEventListener("DOMContentLoaded", async () => {
  // ---------- LOAD CONTENT JSON ----------
  let content = null;
  try {
    const res = await fetch("./assets/json/content.json");
    content = await res.json();
  } catch (e) {
    console.error("Failed to load content.json", e);
    return;
  }

  // Store projects globally for modal access
  window.projectsData = content.projectsSection.projects.reduce((map, p) => {
    map[p.id] = p;
    return map;
  }, {});

  // ---------- TEXT INJECTION HELPERS ----------
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  // Navbar
  const brandPrefix = document.querySelector(".navbar-brand");
  if (brandPrefix) {
    brandPrefix.innerHTML = `${content.navbar.brandPrefix}<span class="brand-gradient">${content.navbar.brandSuffix}</span>`;
  }
  const navLinks = document.getElementById("navLinks");
  if (navLinks) {
    navLinks.innerHTML = content.navbar.links
      .map(
        (link) => `
      <li class="nav-item"><a class="nav-link" href="${link.href}">${link.text}</a></li>
    `,
      )
      .join("");
  }

  // Hero
  setText("heroBadge", content.hero.badge);
  setHtml(
    "heroTitle",
    `${content.hero.title} <span class="gradient-accent">${content.hero.titleHighlight}</span>`,
  );
  setText("heroSubtitle", content.hero.subtitle);
  setHtml(
    "heroDescription",
    `${content.hero.descriptionPrefix} <span class="typing" id="typing"></span>`,
  );
  const heroButtons = document.getElementById("heroButtons");
  if (heroButtons) {
    heroButtons.innerHTML = content.hero.buttons
      .map(
        (btn) =>
          `<a href="${btn.href}" class="btn ${btn.class}">${btn.text}</a>`,
      )
      .join("");
  }
  const metricsContainer = document.getElementById("heroMetrics");
  if (metricsContainer) {
    metricsContainer.innerHTML = content.hero.metrics
      .map(
        (m) => `
      <div class="col-6"><div class="metric"><h3 class="gradient-accent">${m.title}</h3><p class="mb-0 text-secondary">${m.subtitle}</p></div></div>
    `,
      )
      .join("");
  }
  setText("doctrineTitle", content.hero.doctrineTitle);
  setText("doctrineText", content.hero.doctrineText);
  const techBadgesContainer = document.getElementById("heroTechBadges");
  if (techBadgesContainer) {
    techBadgesContainer.innerHTML = content.hero.techBadges
      .map((b) => `<span class="tech-badge">${b}</span>`)
      .join("");
  }

  // About
  setText("aboutTitle", content.about.title);
  setText("aboutDesc", content.about.description);
  setText("aboutQuote", content.about.quote);
  const aboutBadges = document.getElementById("aboutBadges");
  if (aboutBadges) {
    aboutBadges.innerHTML = content.about.quoteBadges
      .map((b) => `<span class="tech-badge">${b}</span>`)
      .join("");
  }

  // Principles Section Titles
  setText("principlesTitle", content.principlesSection.title);
  setText("principlesSubtitle", content.principlesSection.subtitle);
  const principlesContainer = document.getElementById("principlesContainer");
  if (principlesContainer) {
    principlesContainer.innerHTML = content.principlesSection.principles
      .map(
        (p) => `
      <div class="col-md-6 col-xl-3 fade-up"><article class="glass-card principle-card h-100"><div class="principle-icon">${p.icon}</div><h3 class="principle-title">${p.title}</h3><p class="principle-description">${p.description}</p></article></div>
    `,
      )
      .join("");
  }

  // Skills Section
  setText("skillsTitle", content.skillsSection.title);
  setText("skillsSubtitle", content.skillsSection.subtitle);
  const skillsContainer = document.getElementById("skillsContainer");
  if (skillsContainer) {
    skillsContainer.innerHTML = content.skillsSection.skills
      .map(
        (s) => `
      <div class="col-md-6 col-xl-3 fade-up"><article class="glass-card skill-card h-100"><div class="skill-icon">${s.icon}</div><h3 class="h4 fw-bold mb-3">${s.title}</h3><p class="text-secondary">${s.description}</p></article></div>
    `,
      )
      .join("");
  }

  // Process Section
  setText("processTitle", content.processSection.title);
  setText("processSubtitle", content.processSection.subtitle);
  const processContainer = document.getElementById("processContainer");
  if (processContainer) {
    processContainer.innerHTML = content.processSection.steps
      .map(
        (step) => `
      <div class="process-item fade-up"><div class="process-number">${step.number}</div><div class="glass-card process-card"><h3 class="process-title">${step.title}</h3><p class="process-description">${step.description}</p></div></div>
    `,
      )
      .join("");
  }

  // Projects Section Headers
  setText("projectsTitle", content.projectsSection.title);
  setText("projectsSubtitle", content.projectsSection.subtitle);
  const filterContainer = document.getElementById("filterButtonsContainer");
  if (filterContainer) {
    filterContainer.innerHTML = content.projectsSection.filterButtons
      .map(
        (btn) => `
      <button type="button" class="filter-btn" data-filter="${btn.filter}">${btn.text}</button>
    `,
      )
      .join("");
    // Set active class on first button
    const firstBtn = filterContainer.querySelector(".filter-btn");
    if (firstBtn) firstBtn.classList.add("active");
  }

  // Render Project Cards
  const projectsContainer = document.getElementById("projectsContainer");
  function renderProjects(filter = "all") {
    if (!projectsContainer) return;
    const filtered = content.projectsSection.projects.filter(
      (p) => filter === "all" || p.category === filter,
    );
    projectsContainer.innerHTML = filtered
      .map(
        (project) => `
      <div class="col-lg-6 fade-up project-item" data-category="${project.category}">
        <article class="glass-card project-card h-100">
          <div class="website-preview-wrapper mb-4">
            <div class="browser-frame">
              <div class="browser-topbar"><div class="browser-dots"><span></span><span></span><span></span></div><div class="browser-url">${project.browserUrl}</div></div>
              <div class="website-preview-container"><img src="${project.image}" alt="${project.title} preview" class="website-preview-image" loading="lazy" /></div>
            </div>
          </div>
          <div class="project-content">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3"><h3 class="project-title mb-0">${project.title}</h3><span class="tech-badge">${project.categoryLabel}</span></div>
            <p class="project-description">${project.shortDescription}</p>
            <div class="mb-4">${project.tech.map((t) => `<span class="tech-badge">${t}</span>`).join("")}</div>
            <div class="project-links">
              <a href="${project.liveUrl}" target="_blank" class="btn btn-primary-custom">Visit Live Website</a>
              <button type="button" class="btn btn-secondary-custom" onclick="openProjectModal('${project.id}')">View Case Study</button>
            </div>
          </div>
        </article>
      </div>
    `,
      )
      .join("");
    // Re-init preview scroll after render
    if (typeof initWebsitePreviews === "function") initWebsitePreviews();
  }

  renderProjects();

  // Filter logic
  function initProjectFilter() {
    const filterContainerElem = document.getElementById(
      "filterButtonsContainer",
    );
    if (!filterContainerElem) return;
    filterContainerElem.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      renderProjects(filter);
    });
  }
  initProjectFilter();

  // Contact Section
  setText("contactLabel", content.contact.label);
  setText("contactHeadline", content.contact.headline);
  setText("contactText", content.contact.text);
  setText("contactAvailability", content.contact.availability);
  const contactActions = document.getElementById("contactActions");
  if (contactActions) {
    contactActions.innerHTML = content.contact.actions
      .map(
        (a) => `
      <a href="${a.href}" ${a.target ? 'target="_blank"' : ""} rel="noopener noreferrer" class="contact-action">
        <div><span class="contact-action-label">${a.label}</span><h3>${a.title}</h3></div><span class="contact-arrow">↗</span>
      </a>
    `,
      )
      .join("");
  }

  // Footer
  setText("footerText", content.footer.text);
  const footerBadges = document.getElementById("footerBadges");
  if (footerBadges) {
    footerBadges.innerHTML = content.footer.badges
      .map((b) => `<span>${b}</span>`)
      .join("");
  }

  // Typing effect
  function initTypingEffect() {
    const typingElement = document.getElementById("typing");
    if (!typingElement) return;
    const phrases = content.typingPhrases;
    let phraseIndex = 0,
      charIndex = 0,
      deleting = false;
    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];
      if (!deleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentPhrase.length) {
          deleting = true;
          setTimeout(typeEffect, 1500);
          return;
        }
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(typeEffect, deleting ? 40 : 70);
    }
    typeEffect();
  }
  initTypingEffect();

  // Modal functions
  window.openProjectModal = function (projectId) {
    const project = window.projectsData[projectId];
    if (!project) return;
    const modal = new bootstrap.Modal(document.getElementById("projectModal"));
    document.getElementById("modalImage").src = project.image;
    document.getElementById("projectModalLabel").textContent = project.title;
    document.getElementById("modalCategory").textContent =
      project.categoryLabel;
    document.getElementById("modalShortDescription").textContent =
      project.shortDescription;
    document.getElementById("modalDescription").textContent =
      project.description;
    const techContainer = document.getElementById("modalTechStack");
    techContainer.innerHTML = project.tech
      .map((t) => `<span class="tech-badge">${t}</span>`)
      .join("");
    const featuresContainer = document.getElementById("modalFeatures");
    featuresContainer.innerHTML = project.features
      .map(
        (f) =>
          `<div class="col-md-6"><div class="project-feature-card"><h4>${f.title}</h4><p>${f.description}</p></div></div>`,
      )
      .join("");
    const pagesContainer = document.getElementById("modalPages");
    pagesContainer.innerHTML = project.pages
      .map((p) => `<li><strong>${p.title}:</strong> ${p.description}</li>`)
      .join("");
    const liveLink = document.getElementById("modalLiveLink");
    liveLink.href = project.liveUrl;
    const githubLink = document.getElementById("modalGithubLink");
    if (project.githubUrl) {
      githubLink.href = project.githubUrl;
      githubLink.classList.remove("d-none");
    } else {
      githubLink.classList.add("d-none");
    }
    modal.show();
  };

  // Utility functions from original
  function initFadeUpAnimation() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("show");
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
  }
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 400);
    });
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navbarOffset =
            document.querySelector(".navbar")?.offsetHeight + 16 || 0;
          window.scrollTo({
            top:
              target.getBoundingClientRect().top +
              window.scrollY -
              navbarOffset,
            behavior: "smooth",
          });
        }
      });
    });
  }
  function initWebsitePreviews() {
    const frames = document.querySelectorAll(".browser-frame");
    function updatePreviewTravel(frame) {
      const container = frame.querySelector(".website-preview-container");
      const image = frame.querySelector(".website-preview-image");
      if (!container || !image) return;
      const travel = Math.max(0, image.scrollHeight - container.clientHeight);
      frame.style.setProperty("--preview-travel", `${travel}px`);
      frame.style.setProperty(
        "--preview-duration",
        `${Math.min(Math.max(travel / 90, 4), 10)}s`,
      );
    }
    frames.forEach((frame) => {
      const img = frame.querySelector(".website-preview-image");
      if (img?.complete) updatePreviewTravel(frame);
      else
        img?.addEventListener("load", () => updatePreviewTravel(frame), {
          once: true,
        });
    });
    if ("ResizeObserver" in window)
      new ResizeObserver(() => frames.forEach(updatePreviewTravel)).observe(
        document.body,
      );
    window.addEventListener("resize", () =>
      frames.forEach(updatePreviewTravel),
    );
  }

  initFadeUpAnimation();
  initBackToTop();
  initSmoothScrolling();
  initWebsitePreviews();
});
