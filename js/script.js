/* Angelina Lang — Portfolio scripts */
(function () {
  "use strict";

  /* ---------- Theme (dark / light) ---------- */
  const root = document.documentElement;
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    const icon = document.querySelector("#themeToggle i");
    if (icon) icon.className = t === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
  }
  let saved = "light";
  try { saved = localStorage.getItem("theme") || "light"; } catch (e) {}
  applyTheme(saved);

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(root.getAttribute("data-theme"));

    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem("theme", next); } catch (e) {}
      });
    }

    /* ---------- Back to top ---------- */
    const topBtn = document.getElementById("backToTop");
    if (topBtn) {
      window.addEventListener("scroll", () => {
        topBtn.classList.toggle("show", window.scrollY > 400);
      });
      topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    /* ---------- Time-based greeting (home page) ---------- */
    const greet = document.getElementById("greeting");
    if (greet) {
      const h = new Date().getHours();
      const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
      greet.textContent = part + " — welcome to my portfolio";
    }

    /* ---------- Footer year ---------- */
    const yr = document.getElementById("year");
    if (yr) yr.textContent = new Date().getFullYear();

    /* ---------- Projects page ---------- */
    if (document.getElementById("projectGrid")) loadProjects();
  });

  /* ---------- Projects: fetch JSON, render cards, filter, modal ---------- */
  let allProjects = [];

  async function loadProjects() {
    const grid = document.getElementById("projectGrid");
    try {
      const response = await fetch("data/projects.json");
      if (!response.ok) throw new Error("HTTP " + response.status);
      allProjects = await response.json();
      buildFilters(allProjects);
      renderProjects("All");
    } catch (err) {
      grid.innerHTML =
        '<div class="col-12"><div class="alert alert-warning">Could not load projects. ' +
        "Run this site through a local web server (e.g. VS Code Live Server) rather than opening the file directly.</div></div>";
      console.error(err);
    }
  }

  function buildFilters(projects) {
    const bar = document.getElementById("filterBar");
    const categories = ["All", ...new Set(projects.map((p) => p.category))];
    bar.innerHTML = "";
    categories.forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn" + (i === 0 ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        bar.querySelectorAll(".btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderProjects(cat);
      });
      bar.appendChild(btn);
    });
  }

  function renderProjects(category) {
    const grid = document.getElementById("projectGrid");
    grid.innerHTML = "";
    const list = category === "All" ? allProjects : allProjects.filter((p) => p.category === category);

    list.forEach((project) => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4 fade-in";

      const techBadges = project.technologies
        .map((t) => '<span class="badge badge-soft">' + t + "</span>")
        .join("");

      col.innerHTML =
        '<div class="card project-card lift h-100" role="button" tabindex="0">' +
        '<div class="card-body p-4">' +
        '<span class="badge badge-cat align-self-start mb-3">' + project.category + "</span>" +
        '<h3 class="card-title">' + project.title + "</h3>" +
        '<p class="text-muted">' + project.description + "</p>" +
        '<div class="tech">' + techBadges + "</div>" +
        '<span class="link-arrow small mt-2">View details <i class="bi bi-arrow-up-right"></i></span>' +
        "</div></div>";

      const card = col.querySelector(".card");
      const open = () => showModal(project);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
      grid.appendChild(col);
    });

    const count = document.getElementById("projectCount");
    if (count) count.textContent = list.length + (list.length === 1 ? " project" : " projects");
  }

  function showModal(project) {
    document.getElementById("modalTitle").textContent = project.title;
    document.getElementById("modalCategory").textContent = project.category;
    document.getElementById("modalDescription").textContent = project.description;
    document.getElementById("modalDetails").textContent = project.details || "";
    document.getElementById("modalTech").innerHTML = project.technologies
      .map((t) => '<span class="badge badge-soft">' + t + "</span>")
      .join("");
    bootstrap.Modal.getOrCreateInstance(document.getElementById("projectModal")).show();
  }
})();
