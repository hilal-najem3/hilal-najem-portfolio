document.addEventListener("DOMContentLoaded", () => {
  let projects = window.projectCaseStudies || {};
  window.projects = projects;

  const toastContainer = document.getElementById("toastContainer");
  const projectModal = new bootstrap.Modal(
    document.getElementById("projectModal"),
  );

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
        typingElement.textContent = currentPhrase.substring(
          0,
          charIndex + 1,
        );
        charIndex++;

        if (charIndex === currentPhrase.length) {
          deleting = true;
          setTimeout(typeEffect, 1500);
          return;
        }
      } else {
        typingElement.textContent = currentPhrase.substring(
          0,
          charIndex - 1,
        );
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
        event.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
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

    liveLink.href = project.liveUrl;

    if (project.githubUrl) {
      githubLink.href = project.githubUrl;
      githubLink.classList.remove("d-none");
    } else {
      githubLink.classList.add("d-none");
    }
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

  window.openProjectModal = openProjectModal;
  window.projects = projects;
});
