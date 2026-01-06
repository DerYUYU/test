function getId() {
  const p = new URLSearchParams(location.search);
  return (p.get('id') || '').trim();
}

function setDisabled(a, disabled) {
  a.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  if (disabled) a.removeAttribute('href');
}

async function main() {
  const id = getId();

  const titleEl = document.getElementById('title');
  const errEl = document.getElementById('error');
  const spotifyBtn = document.getElementById('spotifyBtn');
  const youtubeBtn = document.getElementById('youtubeBtn');
  const amazonBtn = document.getElementById('amazonBtn'); // NEU

  if (!id) {
    titleEl.textContent = 'Fehlende ID';
    errEl.hidden = false;
    errEl.textContent = 'Diese Seite braucht eine ID, z. B. ?id=001';
    setDisabled(spotifyBtn, true);
    setDisabled(youtubeBtn, true);
    setDisabled(amazonBtn, true); // NEU
    return;
  }

  const res = await fetch('./songs.json', { cache: 'no-store' });
  const data = await res.json();

  const item = data[id];
  if (!item) {
    titleEl.textContent = `Unbekannte ID: ${id}`;
    errEl.hidden = false;
    errEl.textContent = 'Für diese ID ist kein Eintrag hinterlegt.';
    setDisabled(spotifyBtn, true);
    setDisabled(youtubeBtn, true);
    setDisabled(amazonBtn, true); // NEU
    return;
  }

  titleEl.textContent = item.title || `Song ${id}`;

  if (item.spotify) spotifyBtn.href = item.spotify; else setDisabled(spotifyBtn, true);
  if (item.youtube) youtubeBtn.href = item.youtube; else setDisabled(youtubeBtn, true);

  // Amazon Music: nutzt item.amazon, falls vorhanden, sonst deaktivieren (songs.json bleibt unverändert, d. h. ggf. überall deaktiviert)
  if (item.amazon) amazonBtn.href = item.amazon; else setDisabled(amazonBtn, true); // NEU
}

main();
