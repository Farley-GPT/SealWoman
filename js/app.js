let persona = null;
let isNSFW = false;

async function loadPersona() {
  try {
    const res = await fetch('personas/seal-woman.json');
    if (!res.ok) throw new Error('Failed to load persona');
    persona = await res.json();
    renderPersona();
  } catch (err) {
    console.error(err);
    document.getElementById('promptText').innerText = 'Error loading persona data.';
  }
}

function renderPersona() {
  if (!persona) return;

  document.title = persona.title;
  document.getElementById('version').textContent = persona.version;
  document.getElementById('name').textContent = persona.name;
  document.getElementById('location').textContent = persona.location;
  document.getElementById('description').textContent = persona.description;
  document.getElementById('bridge').textContent = persona.bridge;
  document.getElementById('charImage').src = persona.image;
  document.getElementById('charImage').alt = persona.name + ' of the Portland Docks';

  // Apply theme colors if provided
  if (persona.theme) {
    const root = document.documentElement;
    if (persona.theme.accent) root.style.setProperty('--accent', persona.theme.accent);
    if (persona.theme.accentHover) root.style.setProperty('--accent-hover', persona.theme.accentHover);
    if (persona.theme.nsfw) root.style.setProperty('--nsfw', persona.theme.nsfw);
    if (persona.theme.nsfwHover) root.style.setProperty('--nsfw-hover', persona.theme.nsfwHover);
  }

  setPrompt();
}

function setPrompt() {
  if (!persona) return;

  const box = document.getElementById('promptText');
  const btn = document.getElementById('copyBtn');

  if (isNSFW) {
    box.innerText = persona.prompts.nsfw;
    box.classList.add('nsfw-mode');
    btn.classList.add('nsfw');
  } else {
    box.innerText = persona.prompts.normal;
    box.classList.remove('nsfw-mode');
    btn.classList.remove('nsfw');
  }
}

function toggleMode() {
  isNSFW = !isNSFW;
  document.getElementById('modeToggle').classList.toggle('active', isNSFW);
  setPrompt();
}

function copyPrompt() {
  const text = document.getElementById('promptText').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    const btnText = document.getElementById('btnText');
    btn.classList.add('copied');
    btnText.innerText = 'Copied';
    setTimeout(() => {
      btn.classList.remove('copied');
      btnText.innerText = 'Copy System Instructions';
    }, 2000);
  });
}

// Initialize
loadPersona();
