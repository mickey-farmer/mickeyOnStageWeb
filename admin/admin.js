/**
 * Mickey On Stage admin portal
 * Password-protected; live preview via postMessage; save to GitHub.
 */
(function () {
  "use strict";

  var PASSWORD_HASH = "072cc9c0d4c346ae4c76c3458ecfbbf5726ba1b1a31f51727a1cf2951fa07631";
  var CONTENT_URL = "../data/content.json";
  var PREVIEW_DEBOUNCE_MS = 400;

  var loginScreen = document.getElementById("login-screen");
  var adminScreen = document.getElementById("admin-screen");
  var loginForm = document.getElementById("login-form");
  var loginPassword = document.getElementById("login-password");
  var loginError = document.getElementById("login-error");
  var previewFrame = document.getElementById("preview-frame");
  var saveGitHubBtn = document.getElementById("save-github");
  var refreshPreviewBtn = document.getElementById("refresh-preview");
  var settingsBtn = document.getElementById("settings-btn");
  var settingsModal = document.getElementById("settings-modal");
  var settingsSave = document.getElementById("settings-save");
  var settingsClose = document.getElementById("settings-close");
  var toastEl = document.getElementById("toast");

  var previewDebounceTimer = null;
  var currentContent = null;

  function isAuthenticated() {
    return sessionStorage.getItem("mickey_admin") === "1";
  }

  function setAuthenticated(value) {
    if (value) sessionStorage.setItem("mickey_admin", "1");
    else sessionStorage.removeItem("mickey_admin");
  }

  function hashPassword(str) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  function checkPassword(input) {
    return hashPassword(input).then(function (hash) {
      return hash === PASSWORD_HASH;
    });
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    loginError.textContent = "";
    var pwd = loginPassword.value;
    if (!pwd) return;
    checkPassword(pwd).then(function (ok) {
      if (ok) {
        setAuthenticated(true);
        loginScreen.classList.add("hidden");
        adminScreen.classList.remove("hidden");
        loadContent();
        initPreview();
      } else {
        loginError.textContent = "Incorrect password.";
      }
    });
  });

  if (isAuthenticated()) {
    loginScreen.classList.add("hidden");
    adminScreen.classList.remove("hidden");
    loadContent();
    initPreview();
  }

  settingsModal.style.display = "none";

  function loadContent() {
    fetch(CONTENT_URL)
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        if (data) {
          currentContent = data;
          bindContentToForm(data);
        }
      })
      .catch(function () {
        showToast("Could not load content.json", "error");
      });
  }

  function setVal(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val == null ? "" : val;
  }

  function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function bindContentToForm(data) {
    if (data.hero) setVal("hero-image", data.hero.heroImageUrl);
    if (data.about) {
      setVal("about-headline", data.about.headline);
      setVal("about-bio1", data.about.bioParagraphs && data.about.bioParagraphs[0]);
      setVal("about-bio2", data.about.bioParagraphs && data.about.bioParagraphs[1]);
      setVal("about-production-note", data.about.productionNote);
      setVal("about-image", data.about.aboutImageUrl);
    }
    if (data.reel) {
      setVal("reel-headline", data.reel.headline);
      setVal("reel-video", data.reel.videoUrl);
      setVal("reel-poster", data.reel.posterUrl);
      setVal("reel-placeholder", data.reel.placeholderLabel);
    }
    if (data.credits) {
      setVal("credits-headline", data.credits.headline);
      setVal("credits-intro", data.credits.intro);
    }
    if (data.gallery) {
      setVal("gallery-instagram", data.gallery.instagramHandle ? data.gallery.instagramHandle.replace(/^@/, "") : "");
      setVal("gallery-images", data.gallery.imageUrls && data.gallery.imageUrls.join("\n"));
    }
    if (data.contact) {
      setVal("contact-headline", data.contact.headline);
      setVal("contact-intro", data.contact.intro);
      setVal("contact-email", data.contact.email);
      setVal("contact-instagram", data.contact.instagramHandle ? data.contact.instagramHandle.replace(/^@/, "") : "");
      setVal("contact-imdb", data.contact.imdbUrl);
      setVal("contact-rep-name", data.contact.repName);
      setVal("contact-rep-agency", data.contact.repAgency);
      setVal("contact-rep-email", data.contact.repEmail);
      setVal("contact-agency-website", data.contact.agencyWebsiteUrl);
      setVal("contact-agency-logo", data.contact.agencyLogoUrl);
    }
    if (data.resume) {
      setVal("resume-name", data.resume.name);
      setVal("resume-union", data.resume.unionStatus);
      setVal("resume-representation", data.resume.representation);
      setVal("resume-phone", data.resume.phone);
      setVal("resume-email", data.resume.email);
      setVal("resume-stats", data.resume.stats);
      setVal("resume-instagram", data.resume.instagramHandle ? data.resume.instagramHandle.replace(/^@/, "") : "");
      setVal("resume-imdb", data.resume.imdbUrl);
      setVal("resume-updated", data.resume.updatedDate);
      setVal("resume-film", data.resume.film && data.resume.film.map(function (r) { return [r.project, r.role, r.director].join("\t"); }).join("\n"));
      setVal("resume-voice", data.resume.voice && data.resume.voice.map(function (r) { return [r.project, r.role, r.director].join("\t"); }).join("\n"));
      setVal("resume-theatre", data.resume.theatre && data.resume.theatre.map(function (r) { return [r.project, r.role, r.director].join("\t"); }).join("\n"));
      setVal("resume-training-oncamera", data.resume.trainingOnCamera && data.resume.trainingOnCamera.map(function (r) { return [r.project, r.role, r.director].join("\t"); }).join("\n"));
      setVal("resume-training-workshops", data.resume.trainingWorkshops && data.resume.trainingWorkshops.map(function (r) { return [r.project, r.role, r.director].join("\t"); }).join("\n"));
      setVal("resume-training-voice", data.resume.trainingVoice && data.resume.trainingVoice.map(function (r) { return [r.project, r.role, r.director].join("\t"); }).join("\n"));
      setVal("resume-skills", data.resume.skills && data.resume.skills.map(function (s) { return [s.category, s.items].join("\t"); }).join("\n"));
    }
  }

  function parseTableTextarea(text) {
    if (!text) return [];
    return text.split("\n").filter(function (line) { return line.trim(); }).map(function (line) {
      var parts = line.split(/\t|\|/).map(function (p) { return p.trim(); });
      return { project: parts[0] || "", role: parts[1] || "", director: parts[2] || "" };
    });
  }

  function parseSkillsTextarea(text) {
    if (!text) return [];
    return text.split("\n").filter(function (line) { return line.trim(); }).map(function (line) {
      var idx = line.indexOf("\t");
      if (idx === -1) idx = line.indexOf("|");
      if (idx === -1) return { category: line.trim(), items: "" };
      return { category: line.slice(0, idx).trim(), items: line.slice(idx + 1).trim() };
    });
  }

  function getContentFromForm() {
    var galleryUrls = getVal("gallery-images").split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    while (galleryUrls.length < 6) galleryUrls.push("");
    var film = parseTableTextarea(getVal("resume-film"));
    var voice = parseTableTextarea(getVal("resume-voice"));
    var theatre = parseTableTextarea(getVal("resume-theatre"));
    var to = parseTableTextarea(getVal("resume-training-oncamera"));
    var tw = parseTableTextarea(getVal("resume-training-workshops"));
    var tv = parseTableTextarea(getVal("resume-training-voice"));
    var skills = parseSkillsTextarea(getVal("resume-skills"));
    return {
      hero: { heroImageUrl: getVal("hero-image") || "assets/acting/hero.jpg" },
      about: {
        headline: getVal("about-headline") || "Bringing characters to life.",
        bioParagraphs: [getVal("about-bio1"), getVal("about-bio2")].filter(Boolean),
        productionNote: getVal("about-production-note"),
        aboutImageUrl: getVal("about-image") || "assets/acting/about.jpg"
      },
      reel: {
        headline: getVal("reel-headline") || "Selected work",
        videoUrl: getVal("reel-video") || "assets/acting/reel.mp4",
        posterUrl: getVal("reel-poster") || "assets/acting/poster.jpg",
        placeholderLabel: getVal("reel-placeholder") || "Mickey Farmer — Demo Reel"
      },
      credits: {
        headline: getVal("credits-headline") || "Resume",
        intro: getVal("credits-intro") || "Full film, television, and voice credits — view the full resume or download as PDF."
      },
      gallery: {
        instagramHandle: getVal("gallery-instagram") || "mickeyonstage",
        imageUrls: galleryUrls.slice(0, 6)
      },
      contact: {
        headline: getVal("contact-headline") || "Let's work together.",
        intro: getVal("contact-intro") || "For bookings, representation inquiries, or press, reach out below.",
        email: getVal("contact-email"),
        instagramHandle: getVal("contact-instagram") || "mickeyonstage",
        imdbUrl: getVal("contact-imdb"),
        repName: getVal("contact-rep-name"),
        repAgency: getVal("contact-rep-agency"),
        repEmail: getVal("contact-rep-email"),
        agencyWebsiteUrl: getVal("contact-agency-website"),
        agencyLogoUrl: getVal("contact-agency-logo")
      },
      resume: {
        name: getVal("resume-name") || "Mickey Farmer",
        unionStatus: getVal("resume-union"),
        representation: getVal("resume-representation"),
        phone: getVal("resume-phone"),
        email: getVal("resume-email"),
        stats: getVal("resume-stats"),
        instagramHandle: getVal("resume-instagram") || "mickeyonstage",
        imdbUrl: getVal("resume-imdb"),
        updatedDate: getVal("resume-updated") || "February 2026",
        film: film.length ? film : [{ project: "", role: "", director: "" }],
        voice: voice.length ? voice : [{ project: "", role: "", director: "" }],
        theatre: theatre.length ? theatre : [{ project: "", role: "", director: "" }],
        trainingOnCamera: to.length ? to : [{ project: "", role: "", director: "" }],
        trainingWorkshops: tw.length ? tw : [{ project: "", role: "", director: "" }],
        trainingVoice: tv.length ? tv : [{ project: "", role: "", director: "" }],
        skills: skills.length ? skills : [{ category: "Skills", items: "" }]
      }
    };
  }

  function sendPreview(content) {
    if (!previewFrame || !previewFrame.contentWindow) return;
    try {
      previewFrame.contentWindow.postMessage({ type: "nate-admin-content", content: content }, "*");
    } catch (e) {}
  }

  function updatePreview() {
    sendPreview(getContentFromForm());
  }

  function initPreview() {
    document.querySelectorAll(".admin-main input, .admin-main textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        clearTimeout(previewDebounceTimer);
        previewDebounceTimer = setTimeout(updatePreview, PREVIEW_DEBOUNCE_MS);
      });
      el.addEventListener("change", updatePreview);
    });
    updatePreview();
  }

  refreshPreviewBtn.addEventListener("click", function () {
    previewFrame.src = previewFrame.src;
    setTimeout(updatePreview, 800);
  });

  document.querySelectorAll(".preview-link").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".preview-link").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      previewFrame.src = btn.getAttribute("data-preview") === "resume" ? "../resume.html" : "../index.html";
      setTimeout(updatePreview, 500);
    });
  });

  document.querySelectorAll(".nav-item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".nav-item").forEach(function (b) { b.classList.remove("is-active"); });
      document.querySelectorAll(".form-panel").forEach(function (p) { p.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var panel = document.getElementById("panel-" + btn.getAttribute("data-section"));
      if (panel) panel.classList.add("is-active");
    });
  });

  function getSettings() {
    return {
      token: localStorage.getItem("mickey_gh_token") || "",
      owner: localStorage.getItem("mickey_gh_owner") || "",
      repo: localStorage.getItem("mickey_gh_repo") || "",
      branch: localStorage.getItem("mickey_gh_branch") || "main"
    };
  }

  function setSettings(s) {
    if (s.token) localStorage.setItem("mickey_gh_token", s.token);
    if (s.owner) localStorage.setItem("mickey_gh_owner", s.owner);
    if (s.repo) localStorage.setItem("mickey_gh_repo", s.repo);
    if (s.branch) localStorage.setItem("mickey_gh_branch", s.branch || "main");
  }

  function openSettingsModal() {
    settingsModal.classList.remove("hidden");
    settingsModal.style.display = "flex";
  }

  function closeSettingsModal() {
    settingsModal.classList.add("hidden");
    settingsModal.style.display = "none";
  }

  settingsBtn.addEventListener("click", function () {
    var s = getSettings();
    document.getElementById("settings-token").value = s.token;
    document.getElementById("settings-owner").value = s.owner;
    document.getElementById("settings-repo").value = s.repo;
    document.getElementById("settings-branch").value = s.branch;
    openSettingsModal();
  });

  settingsClose.addEventListener("click", closeSettingsModal);
  settingsModal.querySelector(".modal-backdrop").addEventListener("click", closeSettingsModal);

  settingsSave.addEventListener("click", function () {
    setSettings({
      token: document.getElementById("settings-token").value.trim(),
      owner: document.getElementById("settings-owner").value.trim(),
      repo: document.getElementById("settings-repo").value.trim(),
      branch: document.getElementById("settings-branch").value.trim() || "main"
    });
    closeSettingsModal();
    showToast("Settings saved. You can now use Save to GitHub.", "success");
  });

  function saveToGitHub() {
    var s = getSettings();
    if (!s.token || !s.owner || !s.repo) {
      showToast("Set GitHub token, owner, and repo in Settings first.", "error");
      openSettingsModal();
      return;
    }
    var content = getContentFromForm();
    var json = JSON.stringify(content, null, 2);
    var path = "data/content.json";
    saveGitHubBtn.disabled = true;
    showToast("Saving…", "success");
    fetch("https://api.github.com/repos/" + s.owner + "/" + s.repo + "/contents/" + path + "?ref=" + encodeURIComponent(s.branch), {
      method: "GET",
      headers: { "Accept": "application/vnd.github.v3+json", "Authorization": "Bearer " + s.token }
    })
      .then(function (res) { return res.json(); })
      .then(function (file) {
        var opts = {
          message: "Update content from admin",
          content: btoa(unescape(encodeURIComponent(json))),
          branch: s.branch
        };
        if (file.sha) opts.sha = file.sha;
        return fetch("https://api.github.com/repos/" + s.owner + "/" + s.repo + "/contents/" + path, {
          method: "PUT",
          headers: {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": "Bearer " + s.token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(opts)
        });
      })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (body) { throw new Error(body.message || res.statusText); });
        showToast("Saved to GitHub.", "success");
        currentContent = getContentFromForm();
      })
      .catch(function (err) {
        showToast(err.message || "Save failed.", "error");
      })
      .finally(function () {
        saveGitHubBtn.disabled = false;
      });
  }

  saveGitHubBtn.addEventListener("click", saveToGitHub);

  function showToast(message, type) {
    toastEl.textContent = message;
    toastEl.className = "toast " + (type || "success");
    toastEl.classList.remove("hidden");
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(function () { toastEl.classList.add("hidden"); }, 3500);
  }
})();
