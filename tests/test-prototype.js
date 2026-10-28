const fs = require('fs');
const path = require('path');

function runTests() {
  console.log('--- Running Storyboard Prototype Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Verify Story Data
  const storyDataPath = path.join(__dirname, '..', 'js', 'story-data.js');
  const storyData = require(storyDataPath);

  assert(typeof storyData.title === 'string' && storyData.title.length > 0, 'storyData.title is defined');
  assert(Array.isArray(storyData.scenes) && storyData.scenes.length >= 3, 'storyData.scenes contains multiple scenes');

  storyData.scenes.forEach((scene, i) => {
    assert(scene.id === i + 1, `Scene ${i + 1} has correct incremental id`);
    assert(Boolean(scene.act), `Scene ${i + 1} has act name`);
    assert(Boolean(scene.title), `Scene ${i + 1} has title`);
    assert(Boolean(scene.speaker && scene.speaker.name && scene.speaker.avatar), `Scene ${i + 1} has valid speaker info`);
    assert(typeof scene.dialogue === 'string' && scene.dialogue.length > 10, `Scene ${i + 1} has dialogue`);
    const imageExists = Boolean(scene.image) && (scene.image.startsWith('data:') || fs.existsSync(path.join(__dirname, '..', scene.image)));
    assert(imageExists, `Scene ${i + 1} has valid existing image: ${scene.image}`);
  });

  // 2. Verify HTML Elements
  const htmlPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  const requiredIds = [
    'story-title', 'story-subtitle', 'scene-badge', 'progress-bar',
    'scene-tag', 'scene-image', 'dialogue-card', 'speaker-avatar', 'speaker-name',
    'speaker-role', 'dialogue-text', 'btn-prev', 'btn-next', 'btn-toggle-dialogue',
    'notes-toggle', 'notes-content', 'notes-chevron', 'btn-jump',
    'modal-overlay', 'btn-close-modal', 'scene-grid', 'btn-fullscreen'
  ];

  requiredIds.forEach(id => {
    assert(html.includes(`id="${id}"`), `index.html contains element with id="${id}"`);
  });

  assert(html.includes('css/styles.css'), 'index.html links to css/styles.css');
  assert(html.includes('js/story-data.js'), 'index.html includes js/story-data.js');
  assert(html.includes('js/app.js'), 'index.html includes js/app.js');

  // 3. Verify CSS exists and has hidden support
  const cssPath = path.join(__dirname, '..', 'css', 'styles.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  assert(css.length > 500, 'css/styles.css exists and contains styles');
  assert(css.includes('.dialogue-card.hidden'), 'css/styles.css includes .dialogue-card.hidden rule');


  console.log(`\nTest Summary: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
