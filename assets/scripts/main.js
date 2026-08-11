document.addEventListener("DOMContentLoaded", async () => {
  /*
   * =========================================================
   * PORTFOLIO APPLICATION
   * =========================================================
   *
   * Local:
   *   content.js is used as the fallback source.
   *
   * Online:
   *   content.json is loaded and replaces the fallback data.
   *
   * This allows the HTML to remain usable when index.html
   * is opened directly using file:// while keeping JSON as
   * the online content source.
   */

  let content = window.portfolioContent || null;

  /*
   * =========================================================
   * LOAD CONTENT
   * =========================================================
   */

  if (window.location.protocol !== "file:") {
    try {
      const response = await fetch("./assets/json/content.json", {
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      content = await response.json();

      window.portfolioContent = content;

      console.info("content.json loaded successfully.");
    } catch (error) {
      console.warn(
        "Unable to load content.json. Using content.js fallback.",
        error,
      );
    }
  } else {
    console.info("Local file mode detected. Using content.js.");
  }

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  function setText(id, value) {
    const element = document.getElementById(id);

    if (!element || value === undefined || value === null) {
      return;
    }

    element.textContent = value;
  }

  function setHtml(id, value) {
    const element = document.getElementById(id);

    if (!element || value === undefined || value === null) {
      return;
    }

    element.innerHTML = value;
  }

  /*
   * =========================================================
   * CONTENT RENDERING
   * =========================================================
   */

  function renderContent() {
    if (!content) {
      return;
    }

    /*
     * -------------------------------------------------------
     * Navbar
     * -------------------------------------------------------
     */

    const brand = document.querySelector(".navbar-brand");

    if (brand) {
      brand.innerHTML = `
        ${content.navbar.brandPrefix}
        <span class="brand-gradient">
          ${content.navbar.brandSuffix}
        </span>
      `;
    }

    const navLinks = document.getElementById("navLinks");

    if (navLinks) {
      navLinks.innerHTML = content.navbar.links
        .map(
          (link) => `
            <li class="nav-item">
              <a class="nav-link" href="${link.href}">
                ${link.text}
              </a>
            </li>
          `,
        )
        .join("");
    }

    /*
     * -------------------------------------------------------
     * Hero
     * -------------------------------------------------------
     */

    setText("heroBadge", content.hero.badge);

    setHtml(
      "heroTitle",
      `
        ${content.hero.title}
        <span class="gradient-accent">
          ${content.hero.titleHighlight}
        </span>
      `,
    );

    setText("heroSubtitle", content.hero.subtitle);

    setHtml(
      "heroDescription",
      `
        ${content.hero.descriptionPrefix}
        <span class="typing" id="typing"></span>
      `,
    );

    const heroButtons = document.getElementById("heroButtons");

    if (heroButtons) {
      heroButtons.innerHTML = content.hero.buttons
        .map(
          (button) => `
            <a
              href="${button.href}"
              class="btn ${button.class}"
            >
              ${button.text}
            </a>
          `,
        )
        .join("");
    }

    const metricsContainer = document.getElementById("heroMetrics");

    if (metricsContainer) {
      metricsContainer.innerHTML = content.hero.metrics
        .map(
          (metric) => `
            <div class="col-6">
              <div class="metric">
                <h3 class="gradient-accent">
                  ${metric.title}
                </h3>

                <p class="mb-0 text-secondary">
                  ${metric.subtitle}
                </p>
              </div>
            </div>
          `,
        )
        .join("");
    }

    setText("doctrineTitle", content.hero.doctrineTitle);
    setText("doctrineText", content.hero.doctrineText);

    const heroTechBadges = document.getElementById("heroTechBadges");

    if (heroTechBadges) {
      heroTechBadges.innerHTML = content.hero.techBadges
        .map(
          (badge) => `
            <span class="tech-badge">
              ${badge}
            </span>
          `,
        )
        .join("");
    }

    /*
     * -------------------------------------------------------
     * About
     * -------------------------------------------------------
     */

    setText("aboutTitle", content.about.title);
    setText("aboutDesc", content.about.description);
    setText("aboutQuote", content.about.quote);

    const aboutBadges = document.getElementById("aboutBadges");

    if (aboutBadges) {
      aboutBadges.innerHTML = content.about.quoteBadges
        .map(
          (badge) => `
            <span class="tech-badge">
              ${badge}
            </span>
          `,
        )
        .join("");
    }

    /*
     * -------------------------------------------------------
     * Principles
     * -------------------------------------------------------
     */

    setText("principlesTitle", content.principlesSection.title);
    setText("principlesSubtitle", content.principlesSection.subtitle);

    const principlesContainer = document.getElementById("principlesContainer");

    if (principlesContainer) {
      principlesContainer.innerHTML = content.principlesSection.principles
        .map(
          (principle) => `
              <div class="col-md-6 col-xl-3 fade-up">

                <article class="glass-card principle-card h-100">

                  <div class="principle-icon">
                    ${principle.icon}
                  </div>

                  <h3 class="principle-title">
                    ${principle.title}
                  </h3>

                  <p class="principle-description">
                    ${principle.description}
                  </p>

                </article>

              </div>
            `,
        )
        .join("");
    }

    /*
     * -------------------------------------------------------
     * Skills
     * -------------------------------------------------------
     */

    setText("skillsTitle", content.skillsSection.title);
    setText("skillsSubtitle", content.skillsSection.subtitle);

    const skillsContainer = document.getElementById("skillsContainer");

    if (skillsContainer) {
      skillsContainer.innerHTML = content.skillsSection.skills
        .map(
          (skill) => `
            <div class="col-md-6 col-xl-3 fade-up">

              <article class="glass-card skill-card h-100">

                <div class="skill-icon">
                  ${skill.icon}
                </div>

                <h3 class="h4 fw-bold mb-3">
                  ${skill.title}
                </h3>

                <p class="text-secondary">
                  ${skill.description}
                </p>

              </article>

            </div>
          `,
        )
        .join("");
    }

    /*
     * -------------------------------------------------------
     * Process
     * -------------------------------------------------------
     */

    setText("processTitle", content.processSection.title);
    setText("processSubtitle", content.processSection.subtitle);

    const processContainer = document.getElementById("processContainer");

    if (processContainer) {
      processContainer.innerHTML = content.processSection.steps
        .map(
          (step) => `
            <div class="process-item fade-up">

              <div class="process-number">
                ${step.number}
              </div>

              <div class="glass-card process-card">

                <h3 class="process-title">
                  ${step.title}
                </h3>

                <p class="process-description">
                  ${step.description}
                </p>

              </div>

            </div>
          `,
        )
        .join("");
    }

    /*
     * -------------------------------------------------------
     * Projects section headers
     * -------------------------------------------------------
     */

    setText("projectsTitle", content.projectsSection.title);
    setText("projectsSubtitle", content.projectsSection.subtitle);

    const filterContainer = document.getElementById("filterButtonsContainer");

    if (filterContainer) {
      filterContainer.innerHTML = content.projectsSection.filterButtons
        .map(
          (button) => `
              <button
                type="button"
                class="filter-btn"
                data-filter="${button.filter}"
              >
                ${button.text}
              </button>
            `,
        )
        .join("");

      const firstButton = filterContainer.querySelector(".filter-btn");

      if (firstButton) {
        firstButton.classList.add("active");
      }
    }

    /*
     * -------------------------------------------------------
     * Contact
     * -------------------------------------------------------
     */

    setText("contactLabel", content.contact.label);
    setText("contactHeadline", content.contact.headline);
    setText("contactText", content.contact.text);
    setText("contactAvailability", content.contact.availability);

    const contactActions = document.getElementById("contactActions");

    if (contactActions) {
      contactActions.innerHTML = content.contact.actions
        .map(
          (action) => `
            <a
              href="${action.href}"
              ${action.target ? `target="${action.target}"` : ""}
              ${action.target ? 'rel="noopener noreferrer"' : ""}
              class="contact-action"
            >

              <div>

                <span class="contact-action-label">
                  ${action.label}
                </span>

                <h3>
                  ${action.title}
                </h3>

              </div>

              <span class="contact-arrow">
                ↗
              </span>

            </a>
          `,
        )
        .join("");
    }

    /*
     * -------------------------------------------------------
     * Footer
     * -------------------------------------------------------
     */

    setText("footerText", content.footer.text);

    const footerBadges = document.getElementById("footerBadges");

    if (footerBadges) {
      footerBadges.innerHTML = content.footer.badges
        .map(
          (badge) => `
            <span>${badge}</span>
          `,
        )
        .join("");
    }
  }

  /*
   * =========================================================
   * PROJECTS
   * =========================================================
   */

  function getProjects() {
    if (!content?.projectsSection?.projects) {
      return [];
    }

    return content.projectsSection.projects;
  }

  function renderProjects(filter = "all") {
    const container = document.getElementById("projectsContainer");

    if (!container) {
      return;
    }

    const projects = getProjects();

    const filteredProjects =
      filter === "all"
        ? projects
        : projects.filter((project) => project.category === filter);

    /*
     * No projects for selected filter.
     */

    if (filteredProjects.length === 0) {
      container.innerHTML = `
        <div class="col-12">

          <div class="glass-card p-5 text-center">

            <p class="text-secondary mb-0">
              No projects found in this category.
            </p>

          </div>

        </div>
      `;

      return;
    }

    container.innerHTML = filteredProjects
      .map(
        (project) => `
          <div
            class="col-lg-6 fade-up project-item"
            data-category="${project.category}"
          >

            <article class="glass-card project-card h-100">

              <!-- Website Preview -->
              <div class="website-preview-wrapper mb-4">

                <div
                  class="browser-frame"
                  tabindex="0"
                  role="img"
                  aria-label="Preview of ${project.browserUrl || project.title}"
                >

                  <div class="browser-topbar">

                    <div class="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div class="browser-url">
                      ${project.browserUrl || project.title}
                    </div>

                  </div>

                  <div class="website-preview-container">

                    <img
                      src="${project.image}"
                      alt="${project.title} preview"
                      class="website-preview-image"
                      loading="lazy"
                    />

                  </div>

                </div>

              </div>

              <!-- Project Content -->
              <div class="project-content">

                <div
                  class="
                    d-flex
                    align-items-center
                    justify-content-between
                    flex-wrap
                    gap-3
                    mb-3
                  "
                >

                  <h3 class="project-title mb-0">
                    ${project.title}
                  </h3>

                  <span class="tech-badge">
                    ${project.categoryLabel}
                  </span>

                </div>

                <p class="project-description">
                  ${project.shortDescription}
                </p>

                <!-- Project Metadata -->
                <!-- ${
                  project.developer || project.productType
                    ? `
                      <div class="project-meta mb-4">

                        ${
                          project.developer
                            ? `
                              <div class="project-meta-item">

                                <span class="project-meta-label">
                                  Developed by
                                </span>

                                <strong class="project-meta-value">
                                  ${project.developer}
                                </strong>

                              </div>
                            `
                            : ""
                        }

                        ${
                          project.productType
                            ? `
                              <div class="project-meta-item">

                                <span class="project-meta-label">
                                  Product Type
                                </span>

                                <strong class="project-meta-value">
                                  ${project.productType}
                                </strong>

                              </div>
                            `
                            : ""
                        }

                      </div>
                    `
                    : ""
                } -->

                <!-- Current Deployment -->
                ${
                  project.currentDeployment
                    ? `
                      <div class="project-deployment mb-4">

                        <span class="project-meta-label">
                          Current Deployment
                        </span>

                        <div class="project-deployment-name">
                          ${project.currentDeployment.name}
                        </div>

                        <div class="project-deployment-type">
                          ${project.currentDeployment.type}
                        </div>

                      </div>
                    `
                    : ""
                }

                <!-- Technologies -->
                <div class="mb-4">

                  ${project.tech
                    .map(
                      (technology) => `
                        <span class="tech-badge">
                          ${technology}
                        </span>
                      `,
                    )
                    .join("")}

                </div>

                <!-- Links -->
                <div class="project-links">

                  ${
                    project.liveUrl
                      ? `
                        <a
                          href="${project.liveUrl}"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="btn btn-primary-custom"
                        >
                          Visit Live Website
                        </a>
                      `
                      : ""
                  }

                  ${
                    project.currentDeployment?.url
                      ? `
                        <a
                          href="${project.currentDeployment.url}"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="btn btn-primary-custom"
                        >
                          View Deployment
                        </a>
                      `
                      : ""
                  }

                  <button
                    type="button"
                    class="btn btn-secondary-custom"
                    data-project-id="${project.id}"
                  >
                    View Case Study
                  </button>

                </div>

              </div>

            </article>

          </div>
        `,
      )
      .join("");

    /*
     * Reinitialize functionality for newly rendered cards.
     */

    initWebsitePreviews();
    initFadeUpAnimation();
  }

  /*
   * =========================================================
   * PROJECT FILTER
   * =========================================================
   */

  function initProjectFilter() {
    const filterContainer = document.getElementById("filterButtonsContainer");

    if (!filterContainer) {
      return;
    }

    /*
     * Event delegation keeps filtering working after
     * projects are dynamically re-rendered.
     */

    filterContainer.addEventListener("click", (event) => {
      const button = event.target.closest(".filter-btn");

      if (!button) {
        return;
      }

      filterContainer.querySelectorAll(".filter-btn").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      renderProjects(button.dataset.filter || "all");
    });
  }

  /*
   * =========================================================
   * PROJECT MODAL
   * =========================================================
   */

  let projectModal = null;

  function initProjectModal() {
    const modalElement = document.getElementById("projectModal");

    if (!modalElement || !window.bootstrap) {
      return;
    }

    projectModal = new bootstrap.Modal(modalElement);

    /*
     * Event delegation for project buttons.
     */

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-project-id]");

      if (!button) {
        return;
      }

      const projectId = button.dataset.projectId;

      openProjectModal(projectId);
    });
  }

  function openProjectModal(projectId) {
    const project = getProjects().find((item) => item.id === projectId);

    if (!project) {
      showToast("Project details are unavailable.");

      return;
    }

    const modalImage = document.getElementById("modalImage");

    const modalTechStack = document.getElementById("modalTechStack");

    const modalFeatures = document.getElementById("modalFeatures");

    const modalPages = document.getElementById("modalPages");

    const modalProjectMeta = document.getElementById("modalProjectMeta");

    const liveLink = document.getElementById("modalLiveLink");

    const githubLink = document.getElementById("modalGithubLink");

    /*
     * -------------------------------------------------------
     * Image
     * -------------------------------------------------------
     */

    if (modalImage) {
      modalImage.src = project.image;
      modalImage.alt = project.title;
    }

    /*
     * -------------------------------------------------------
     * Main information
     * -------------------------------------------------------
     */

    setText("projectModalLabel", project.title);

    setText("modalCategory", project.categoryLabel);

    setText("modalShortDescription", project.shortDescription);

    setText("modalDescription", project.description);

    /*
     * -------------------------------------------------------
     * Project Metadata
     * -------------------------------------------------------
     */

    // if (modalProjectMeta) {
    //   const hasMetadata =
    //     project.developer || project.productType || project.currentDeployment;

    //   if (!hasMetadata) {
    //     modalProjectMeta.innerHTML = "";
    //     modalProjectMeta.classList.add("d-none");
    //   } else {
    //     modalProjectMeta.classList.remove("d-none");

    //     modalProjectMeta.innerHTML = `
    //       <div class="row g-3">

    //         ${
    //           project.developer
    //             ? `
    //               <div class="col-md-6">

    //                 <div class="project-meta-card">

    //                   <span class="project-meta-label">
    //                     Developed by
    //                   </span>

    //                   <strong class="project-meta-value">
    //                     ${project.developer}
    //                   </strong>

    //                 </div>

    //               </div>
    //             `
    //             : ""
    //         }

    //         ${
    //           project.productType
    //             ? `
    //               <div class="col-md-6">

    //                 <div class="project-meta-card">

    //                   <span class="project-meta-label">
    //                     Product Type
    //                   </span>

    //                   <strong class="project-meta-value">
    //                     ${project.productType}
    //                   </strong>

    //                 </div>

    //               </div>
    //             `
    //             : ""
    //         }

    //         ${
    //           project.currentDeployment
    //             ? `
    //               <div class="col-12">

    //                 <div class="project-meta-card">

    //                   <span class="project-meta-label">
    //                     Current Deployment
    //                   </span>

    //                   <strong class="project-meta-value">
    //                     ${project.currentDeployment.name}
    //                   </strong>

    //                   <span class="project-meta-secondary">
    //                     ${project.currentDeployment.type}
    //                   </span>

    //                 </div>

    //               </div>
    //             `
    //             : ""
    //         }

    //       </div>
    //     `;
    //   }
    // }

    /*
     * -------------------------------------------------------
     * Technologies
     * -------------------------------------------------------
     */

    if (modalTechStack) {
      modalTechStack.innerHTML = (project.tech || [])
        .map(
          (technology) => `
              <span class="tech-badge">
                ${technology}
              </span>
            `,
        )
        .join("");
    }

    /*
     * -------------------------------------------------------
     * Features
     * -------------------------------------------------------
     */

    if (modalFeatures) {
      modalFeatures.innerHTML = (project.features || [])
        .map(
          (feature) => `
              <div class="col-md-6">

                <div class="project-feature-card">

                  <h4>
                    ${feature.title}
                  </h4>

                  <p>
                    ${feature.description}
                  </p>

                </div>

              </div>
            `,
        )
        .join("");
    }

    /*
     * -------------------------------------------------------
     * Pages
     * -------------------------------------------------------
     */

    if (modalPages) {
      modalPages.innerHTML = (project.pages || [])
        .map(
          (page) => `
              <li>

                <strong>
                  ${page.title}:
                </strong>

                ${page.description}

              </li>
            `,
        )
        .join("");
    }

    /*
     * -------------------------------------------------------
     * Live Website
     * -------------------------------------------------------
     */

    if (liveLink) {
      if (project.liveUrl) {
        liveLink.href = project.liveUrl;
        liveLink.textContent = "Visit Live Website";
        liveLink.classList.remove("d-none");
      } else {
        liveLink.href = "#";
        liveLink.classList.add("d-none");
      }
    }

    /*
     * -------------------------------------------------------
     * Current Deployment
     * -------------------------------------------------------
     */

    /*
     * We use the existing live-link button for a real
     * deployment when the project itself has no separate
     * live URL.
     */

    if (liveLink && !project.liveUrl && project.currentDeployment?.url) {
      liveLink.href = project.currentDeployment.url;

      liveLink.textContent = "View Deployment";

      liveLink.classList.remove("d-none");
    }

    /*
     * -------------------------------------------------------
     * GitHub
     * -------------------------------------------------------
     */

    if (githubLink) {
      if (project.githubUrl) {
        githubLink.href = project.githubUrl;

        githubLink.classList.remove("d-none");
      } else {
        githubLink.href = "#";

        githubLink.classList.add("d-none");
      }
    }

    /*
     * -------------------------------------------------------
     * Show modal
     * -------------------------------------------------------
     */

    if (projectModal) {
      projectModal.show();
    }
  }

  /*
   * Keep globally available.
   */

  window.openProjectModal = openProjectModal;

  /*
   * =========================================================
   * TYPING EFFECT
   * =========================================================
   */

  function initTypingEffect() {
    const typingElement = document.getElementById("typing");

    if (!typingElement) {
      return;
    }

    const phrases = content?.typingPhrases?.length
      ? content.typingPhrases
      : [
          " I craft scalable systems.",
          " I engineer with precision.",
          " I build performance-first platforms.",
          " I create digital infrastructure.",
        ];

    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeEffect() {
      const phrase = phrases[phraseIndex];

      if (!phrase) {
        return;
      }

      if (!deleting) {
        typingElement.textContent = phrase.substring(0, characterIndex + 1);

        characterIndex++;

        if (characterIndex === phrase.length) {
          deleting = true;

          setTimeout(typeEffect, 1500);

          return;
        }
      } else {
        typingElement.textContent = phrase.substring(0, characterIndex - 1);

        characterIndex--;

        if (characterIndex === 0) {
          deleting = false;

          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      setTimeout(typeEffect, deleting ? 40 : 70);
    }

    typeEffect();
  }

  /*
   * =========================================================
   * FADE-UP ANIMATION
   * =========================================================
   */

  function initFadeUpAnimation() {
    const elements = document.querySelectorAll(".fade-up");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("show");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  }

  /*
   * =========================================================
   * BACK TO TOP
   * =========================================================
   */

  function initBackToTop() {
    const button = document.getElementById("backToTop");

    if (!button) {
      return;
    }

    window.addEventListener(
      "scroll",
      () => {
        button.classList.toggle("show", window.scrollY > 400);
      },
      {
        passive: true,
      },
    );

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /*
   * =========================================================
   * COPY BUTTONS
   * =========================================================
   */

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

  /*
   * =========================================================
   * SMOOTH SCROLLING
   * =========================================================
   */

  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        let target = null;

        try {
          target = document.querySelector(targetId);
        } catch (error) {
          return;
        }

        if (!target) {
          return;
        }

        event.preventDefault();

        const navbar = document.querySelector(".navbar");

        const navbarOffset = navbar ? navbar.offsetHeight + 16 : 0;

        const targetTop = target.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: Math.max(targetTop - navbarOffset, 0),
          behavior: "smooth",
        });
      });
    });
  }

  /*
   * =========================================================
   * WEBSITE PREVIEWS
   * =========================================================
   */

  function initWebsitePreviews() {
    const frames = document.querySelectorAll(".browser-frame");

    if (!frames.length) {
      return;
    }

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

    frames.forEach((frame) => {
      const image = frame.querySelector(".website-preview-image");

      if (!image) {
        return;
      }

      if (image.complete) {
        updatePreviewTravel(frame);
      } else {
        image.addEventListener("load", () => updatePreviewTravel(frame), {
          once: true,
        });
      }

      frame.addEventListener("pointerup", () => {
        if (!isTouchDevice.matches) {
          return;
        }

        frame.classList.add("is-previewing");
      });
    });

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => {
        frames.forEach(updatePreviewTravel);
      });

      frames.forEach((frame) => {
        observer.observe(frame);
      });
    }

    window.addEventListener(
      "resize",
      () => {
        frames.forEach(updatePreviewTravel);
      },
      {
        passive: true,
      },
    );
  }

  /*
   * =========================================================
   * TOAST
   * =========================================================
   */

  function showToast(message) {
    const container = document.getElementById("toastContainer");

    if (!container) {
      return;
    }

    const toast = document.createElement("div");

    toast.className = "custom-toast";

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  /*
   * =========================================================
   * INITIALIZATION
   * =========================================================
   */

  /*
   * Load content into the page when JSON/content.js
   * data is available.
   */

  renderContent();

  /*
   * Render projects only when content is available.
   *
   * This is the single project rendering system.
   * It is also what keeps the filters working correctly.
   */

  if (content) {
    renderProjects();
  }

  initProjectFilter();
  initProjectModal();
  initTypingEffect();
  initFadeUpAnimation();
  initBackToTop();
  initCopyButtons();
  initSmoothScrolling();
  initWebsitePreviews();
});
