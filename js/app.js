(function () {
  const scenes = STORY_DATA.scenes;
  let currentIndex = 0;
  let isDialogueHiddenByUser = false;

  const els = {
    title: document.getElementById("story-title"),
    subtitle: document.getElementById("story-subtitle"),
    sceneBadge: document.getElementById("scene-badge"),
    progressBar: document.getElementById("progress-bar"),
    sceneTag: document.getElementById("scene-tag"),
    sceneImage: document.getElementById("scene-image"),
    dialogueCard: document.getElementById("dialogue-card"),
    speakerAvatar: document.getElementById("speaker-avatar"),
    speakerName: document.getElementById("speaker-name"),
    speakerRole: document.getElementById("speaker-role"),
    dialogueText: document.getElementById("dialogue-text"),
    btnPrev: document.getElementById("btn-prev"),
    btnNext: document.getElementById("btn-next"),
    btnToggleDialogue: document.getElementById("btn-toggle-dialogue"),
    notesToggle: document.getElementById("notes-toggle"),
    notesContent: document.getElementById("notes-content"),
    notesChevron: document.getElementById("notes-chevron"),
    btnJump: document.getElementById("btn-jump"),
    modalOverlay: document.getElementById("modal-overlay"),
    btnCloseModal: document.getElementById("btn-close-modal"),
    sceneGrid: document.getElementById("scene-grid"),
    btnFullscreen: document.getElementById("btn-fullscreen"),
  };

  function init() {
    els.title.textContent = STORY_DATA.title;
    els.subtitle.textContent = STORY_DATA.subtitle;

    const match = window.location.hash.match(/#scene-(\d+)/);
    if (match) {
      const parsed = parseInt(match[1], 10) - 1;
      if (parsed >= 0 && parsed < scenes.length) currentIndex = parsed;
    }

    buildSceneMenu();
    bindEvents();
    renderScene(currentIndex, false);
  }

  function updateDialogueVisibility() {
    const scene = scenes[currentIndex];
    const shouldHide = isDialogueHiddenByUser || scene.hideDialogue === true || !scene.dialogue;
    if (els.dialogueCard) {
      els.dialogueCard.classList.toggle("hidden", shouldHide);
    }
    if (els.btnToggleDialogue) {
      els.btnToggleDialogue.classList.toggle("active", shouldHide);
      els.btnToggleDialogue.title = shouldHide ? "Show Dialogue (H)" : "Hide Dialogue (H)";
      els.btnToggleDialogue.textContent = shouldHide ? "👁‍🗨" : "👁";
    }
  }

  function toggleDialogueVisibility() {
    isDialogueHiddenByUser = !isDialogueHiddenByUser;
    updateDialogueVisibility();
  }

  function renderScene(index, animate = true) {
    if (index < 0 || index >= scenes.length) return;
    currentIndex = index;
    const scene = scenes[index];
    const total = scenes.length;

    window.location.hash = `scene-${index + 1}`;
    els.sceneBadge.textContent = `Scene ${index + 1} of ${total}`;
    els.progressBar.style.width = `${((index + 1) / total) * 100}%`;
    els.sceneTag.textContent = scene.act;

    if (animate) {
      els.sceneImage.classList.add("fade-out");
      setTimeout(() => {
        els.sceneImage.src = scene.image;
        els.sceneImage.alt = scene.title;
        els.sceneImage.classList.remove("fade-out");
        els.sceneImage.classList.add("fade-in");
        setTimeout(() => els.sceneImage.classList.remove("fade-in"), 300);
      }, 120);
    } else {
      els.sceneImage.src = scene.image;
      els.sceneImage.alt = scene.title;
    }

    els.speakerAvatar.textContent = scene.speaker.avatar;
    els.speakerAvatar.style.background = scene.speaker.color;
    els.speakerName.textContent = scene.speaker.name;
    els.speakerRole.textContent = scene.speaker.role;
    els.dialogueText.textContent = scene.dialogue || "";
    els.notesContent.textContent = scene.notes || "No presenter notes for this slide.";

    updateDialogueVisibility();

    els.btnPrev.disabled = index === 0;
    els.btnNext.innerHTML = (index === total - 1) ? `Restart Story ↺` : `Next Scene →`;

    els.sceneGrid.querySelectorAll(".scene-item-card").forEach((card, idx) => {
      card.classList.toggle("current", idx === index);
    });
  }

  function nextScene() {
    renderScene(currentIndex < scenes.length - 1 ? currentIndex + 1 : 0, true);
  }

  function prevScene() {
    if (currentIndex > 0) renderScene(currentIndex - 1, true);
  }

  function buildSceneMenu() {
    els.sceneGrid.innerHTML = "";
    scenes.forEach((scene, idx) => {
      const item = document.createElement("div");
      item.className = "scene-item-card" + (idx === currentIndex ? " current" : "");
      item.innerHTML = `
        <div>
          <div style="font-size:0.75rem; color:#94a3b8; text-transform:uppercase;">${scene.act}</div>
          <strong style="color:#f8fafc; font-size:0.95rem;">${scene.title}</strong>
          <div style="font-size:0.8rem; color:#60a5fa; margin-top:0.2rem;">Speaker: ${scene.speaker.name}</div>
        </div>
        <div style="font-weight:700; color:#94a3b8; font-size:0.85rem;">#${idx + 1}</div>
      `;
      item.onclick = () => { renderScene(idx, true); closeModal(); };
      els.sceneGrid.appendChild(item);
    });
  }

  function openModal() { els.modalOverlay.classList.add("active"); }
  function closeModal() { els.modalOverlay.classList.remove("active"); }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  function bindEvents() {
    els.btnNext.onclick = nextScene;
    els.btnPrev.onclick = prevScene;

    if (els.btnToggleDialogue) {
      els.btnToggleDialogue.onclick = toggleDialogueVisibility;
    }

    els.notesToggle.onclick = () => {
      const isOpen = els.notesContent.classList.toggle("open");
      els.notesChevron.textContent = isOpen ? "▲" : "▼";
    };

    els.btnJump.onclick = openModal;
    els.btnCloseModal.onclick = closeModal;
    els.modalOverlay.onclick = (e) => {
      if (e.target === els.modalOverlay) closeModal();
    };

    els.btnFullscreen.onclick = toggleFullscreen;

    window.onkeydown = (e) => {
      if (els.modalOverlay.classList.contains("active")) {
        if (e.key === "Escape") closeModal();
        return;
      }
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        nextScene();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prevScene();
      } else if (e.key.toLowerCase() === "h") {
        toggleDialogueVisibility();
      } else if (e.key.toLowerCase() === "m") {
        openModal();
      } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };

    window.onhashchange = () => {
      const match = window.location.hash.match(/#scene-(\d+)/);
      if (match) {
        const parsed = parseInt(match[1], 10) - 1;
        if (parsed >= 0 && parsed < scenes.length && parsed !== currentIndex) {
          renderScene(parsed, true);
        }
      }
    };
  }

  document.addEventListener("DOMContentLoaded", init);
})();
