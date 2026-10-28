# Interactive Presentation Storyboard: The Ghost Map (London 1854)

An interactive, character-driven presentation player set in Victorian London during the Industrial Revolution and the 1854 Broad Street cholera outbreak.

## 📖 Current Storyline: "The Ghost Map: Broad Street Outbreak"

Follow the harrowing dilemma of poor textile mill workers in Soho, London across 7 connected scenes:
1. **Scene 1: The Morning Shadow** (`images/slide_1.png`)
   - **Speaker**: Eliza (Mill Worker)
   - **Story**: Mary lies ill in bed; Eliza watches over her with growing concern as the morning begins.
2. **Scene 2: The Cost of a Shift** (`images/slide_2.png`)
   - **Speaker**: Martha (Coworker & Friend)
   - **Story**: Martha arrives at the bedside and discusses the agonizing choice: miss work and lose their wages, or leave Mary alone.
3. **Scene 3: The Soho Road** (`images/slide_3.png`)
   - **Speaker**: Eliza
   - **Story**: Eliza journeys down the dusty road towards Broad Street to fetch fresh water.
4. **Scene 4: At the Broad Street Pump** (`images/slide_4.png`)
   - **Speaker**: Eliza
   - **Story**: Eliza arrives at the Broad Street pump, preparing to draw a pail of water for her sister.
5. **Scene 5: Running Footsteps** (`images/slide_5.png`)
   - **Speaker**: Martha
   - **Story**: Martha runs breathless down Broad Street to intercept Eliza before she touches the pump handle.
6. **Scene 6: The Blue Death** (`images/slide_6.png`)
   - **Speaker**: Martha
   - **Story**: Martha reveals the terrifying truth: the illness spreading across Soho is cholera!
7. **Scene 7: The Dark Truth** (`images/slide_7.png`)
   - **Speaker**: Eliza
   - **Story**: Eliza realizes in horror that Mary drank from this very water source the night before.

---

## 💡 Architecture

The application adopts the **3-Tier Interactive Storyboard** pattern:

1. **Scene Viewport (`<div class="scene-card">`)**:
   - 16:9 cinema viewport displaying pixel art and historical scenes.
   - Smooth cross-fade transitions and chapter tags.

2. **Dialogue & Character Box (`<section class="dialogue-card">`)**:
   - Character avatar badges with distinct colors (`#2563eb` for Eliza, `#e11d48` for Martha).
   - Speaker name, role title, and historical dialogue.

3. **Navigation & Controls Bar (`<nav class="controls-bar">`)**:
   - "Next Scene" and "Back" buttons with loop-around restart.
   - Dynamic progress bar and scene counter badge (`Scene 1 of 7`).
   - Keyboard shortcuts (`←`, `→`, `Space`, `M` for scenes drawer, `F` for fullscreen, `H` to toggle dialogue).
   - Expandable Presenter Notes with historical citations and footnotes.
   - Deep linking with hash routing (`#scene-1` to `#scene-7`).

---

## 🚀 How to Run Locally

### Option 1: Direct File Open
Double-click `index.html` to open directly in Google Chrome, Microsoft Edge, or Firefox.

### Option 2: Local Server
```bash
python -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

---

## 🎨 Image Generator (`generate_images.py`)

A dedicated script using Google Gemini (`gemini-2.5-flash-image`) to generate high-resolution scene artwork.

```bash
# Run using the local virtual environment
.\.venv\Scripts\python.exe generate_images.py [--debug]
```

---

## ⌨️ Controls & Shortcuts

- **Toggle Dialogue Visibility**: Click `👁` in the header or press `H` to toggle dialogue on/off at will.
- **Per-Scene Hide**: Add `hideDialogue: true` to any scene object in `js/story-data.js` to automatically hide the dialogue box for that scene (ideal for title cards or visual-only moments).
- **Next Scene**: Click `Next Scene →`, press `Right Arrow`, `Space`, or `PageDown`.
- **Previous Scene**: Click `← Back`, press `Left Arrow`, or `PageUp`.
- **Table of Scenes**: Click `☰` in the header or press `M`.
- **Fullscreen**: Click `⛶` in the header or press `F`.

