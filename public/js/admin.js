const tabs = {
  users: 'Nguoi dung',
  artists: 'Nghe si',
  playlists: 'Playlist',
  songs: 'Bai hat'
};

const state = {
  users: [],
  artists: [],
  playlists: [],
  songs: []
};

const notice = document.getElementById('notice');
const title = document.getElementById('tab-title');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showNotice(message, type = 'ok') {
  notice.textContent = message;
  notice.className = `notice ${type}`;
  setTimeout(() => {
    if (notice.textContent === message) {
      notice.textContent = '';
      notice.className = 'notice';
    }
  }, 2600);
}

async function callApi(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';
  let payload;

  if (contentType.includes('application/json')) {
    payload = await response.json();
  } else {
    payload = await response.text();
  }

  if (!response.ok) {
    const errorMessage = typeof payload === 'string' ? payload : payload.message || 'Yeu cau that bai';
    throw new Error(errorMessage);
  }

  return payload;
}

function initTabs() {
  const menuButtons = document.querySelectorAll('.menu-item');
  const panels = document.querySelectorAll('.panel');

  menuButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab;
      menuButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');

      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === tab);
      });

      title.textContent = tabs[tab] || 'Dashboard';
    });
  });
}

function renderUsers() {
  const body = document.getElementById('users-body');

  if (!state.users.length) {
    body.innerHTML = '<tr><td colspan="4">Chua co nguoi dung nao.</td></tr>';
    return;
  }

  body.innerHTML = state.users
    .map((user) => {
      const role = user.role || 'user';
      return `
        <tr>
          <td>${escapeHtml(user.username || '')}</td>
          <td>${escapeHtml(user.email || '')}</td>
          <td>${role}</td>
          <td class="actions">
            <form class="inline-form" data-user-update="${user._id}">
              <input name="username" value="${escapeHtml(user.username || '')}" placeholder="Username" required />
              <input name="email" value="${escapeHtml(user.email || '')}" placeholder="Email" required />
              <select name="role">
                <option value="user" ${role === 'user' ? 'selected' : ''}>user</option>
                <option value="admin" ${role === 'admin' ? 'selected' : ''}>admin</option>
              </select>
              <button class="btn" type="submit">Luu</button>
            </form>
            <button class="btn btn-danger" data-user-delete="${user._id}" type="button">Xoa</button>
          </td>
        </tr>
      `;
    })
    .join('');

  body.querySelectorAll('[data-user-update]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const userId = form.dataset.userUpdate;
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      try {
        await callApi(`/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        showNotice('Cap nhat nguoi dung thanh cong.');
        await loadUsers();
      } catch (error) {
        showNotice(error.message, 'error');
      }
    });
  });

  body.querySelectorAll('[data-user-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const userId = button.dataset.userDelete;
      if (!window.confirm('Ban chac chan muon xoa nguoi dung nay?')) {
        return;
      }

      try {
        await callApi(`/users/${userId}`, { method: 'DELETE' });
        showNotice('Da xoa nguoi dung.');
        await loadUsers();
      } catch (error) {
        showNotice(error.message, 'error');
      }
    });
  });
}

function renderArtists() {
  const body = document.getElementById('artists-body');

  if (!state.artists.length) {
    body.innerHTML = '<tr><td colspan="4">Chua co nghe si nao.</td></tr>';
    return;
  }

  body.innerHTML = state.artists
    .map((artist) => {
      const avatarCell = artist.avatar
        ? `<img src="${artist.avatar}" alt="avatar" class="thumb" />`
        : '<span>Khong co</span>';

      return `
        <tr>
          <td>${escapeHtml(artist.name || '')}</td>
          <td>${escapeHtml(artist.bio || '')}</td>
          <td>${avatarCell}</td>
          <td class="actions">
            <form class="inline-form" data-artist-update="${artist._id}">
              <input name="name" value="${escapeHtml(artist.name || '')}" placeholder="Ten" required />
              <input name="bio" value="${escapeHtml(artist.bio || '')}" placeholder="Tieu su" />
              <input name="avatar" value="${escapeHtml(artist.avatar || '')}" placeholder="URL avatar" />
              <button class="btn" type="submit">Luu</button>
            </form>
            <button class="btn btn-danger" data-artist-delete="${artist._id}" type="button">Xoa</button>
          </td>
        </tr>
      `;
    })
    .join('');

  body.querySelectorAll('[data-artist-update]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const artistId = form.dataset.artistUpdate;
      const payload = Object.fromEntries(new FormData(form).entries());

      try {
        await callApi(`/artists/${artistId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        showNotice('Cap nhat nghe si thanh cong.');
        await loadArtists();
      } catch (error) {
        showNotice(error.message, 'error');
      }
    });
  });

  body.querySelectorAll('[data-artist-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const artistId = button.dataset.artistDelete;
      if (!window.confirm('Ban chac chan muon xoa nghe si nay?')) {
        return;
      }

      try {
        await callApi(`/artists/${artistId}`, { method: 'DELETE' });
        showNotice('Da xoa nghe si.');
        await loadArtists();
      } catch (error) {
        showNotice(error.message, 'error');
      }
    });
  });
}

function renderPlaylists() {
  const body = document.getElementById('playlists-body');

  if (!state.playlists.length) {
    body.innerHTML = '<tr><td colspan="4">Chua co playlist nao.</td></tr>';
    return;
  }

  body.innerHTML = state.playlists
    .map((playlist) => {
      const songsRaw = Array.isArray(playlist.songs) ? playlist.songs.join(',') : '';
      const songsCount = Array.isArray(playlist.songs)
        ? playlist.songs.length
        : Number(playlist.totalSongs || 0);
      const isPublic = playlist.isPublic === true;

      return `
        <tr>
          <td>${escapeHtml(playlist.playlistName || '')}</td>
          <td>${songsCount}</td>
          <td>${isPublic ? 'true' : 'false'}</td>
          <td class="actions">
            <form class="inline-form" data-playlist-update="${playlist._id}">
              <input name="playlistName" value="${escapeHtml(playlist.playlistName || '')}" placeholder="Ten playlist" required />
              <input name="songs" value="${escapeHtml(songsRaw)}" placeholder="id1,id2" />
              <input name="coverUrl" value="${escapeHtml(playlist.coverUrl || '')}" placeholder="Cover URL" />
              <select name="isPublic">
                <option value="true" ${isPublic ? 'selected' : ''}>true</option>
                <option value="false" ${!isPublic ? 'selected' : ''}>false</option>
              </select>
              <button class="btn" type="submit">Luu</button>
            </form>
            <button class="btn btn-danger" data-playlist-delete="${playlist._id}" type="button">Xoa</button>
          </td>
        </tr>
      `;
    })
    .join('');

  body.querySelectorAll('[data-playlist-update]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const playlistId = form.dataset.playlistUpdate;
      const payload = Object.fromEntries(new FormData(form).entries());

      try {
        await callApi(`/playlists/${playlistId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        showNotice('Cap nhat playlist thanh cong.');
        await loadPlaylists();
      } catch (error) {
        showNotice(error.message, 'error');
      }
    });
  });

  body.querySelectorAll('[data-playlist-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const playlistId = button.dataset.playlistDelete;
      if (!window.confirm('Ban chac chan muon xoa playlist nay?')) {
        return;
      }

      try {
        await callApi(`/playlists/${playlistId}`, { method: 'DELETE' });
        showNotice('Da xoa playlist.');
        await loadPlaylists();
      } catch (error) {
        showNotice(error.message, 'error');
      }
    });
  });
}

function renderSongs() {
  const body = document.getElementById('songs-body');

  if (!state.songs.length) {
    body.innerHTML = '<tr><td colspan="3">Chua co bai hat nao.</td></tr>';
    return;
  }

  body.innerHTML = state.songs
    .map((song) => {
      return `
        <tr>
          <td>${escapeHtml(song.songName || '')}</td>
          <td>${escapeHtml(song.artist || '')}</td>
          <td class="actions">
            <form class="inline-form" data-song-update="${song._id}">
              <input name="songName" value="${escapeHtml(song.songName || '')}" placeholder="Ten bai hat" required />
              <input name="artist" value="${escapeHtml(song.artist || '')}" placeholder="Nghe si" required />
              <button class="btn" type="submit">Luu</button>
            </form>
            <button class="btn btn-danger" data-song-delete="${song._id}" type="button">Xoa</button>
          </td>
        </tr>
      `;
    })
    .join('');

  body.querySelectorAll('[data-song-update]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const songId = form.dataset.songUpdate;
      const payload = Object.fromEntries(new FormData(form).entries());

      try {
        await callApi(`/songs/${songId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        showNotice('Cap nhat bai hat thanh cong.');
        await loadSongs();
      } catch (error) {
        showNotice(error.message, 'error');
      }
    });
  });

  body.querySelectorAll('[data-song-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const songId = button.dataset.songDelete;
      if (!window.confirm('Ban chac chan muon xoa bai hat nay?')) {
        return;
      }

      try {
        await callApi(`/songs/${songId}`, { method: 'DELETE' });
        showNotice('Da xoa bai hat.');
        await loadSongs();
      } catch (error) {
        showNotice(error.message, 'error');
      }
    });
  });
}

async function loadUsers() {
  try {
    const data = await callApi('/users');
    state.users = Array.isArray(data) ? data : [];
    renderUsers();
  } catch (error) {
    showNotice(`Tai users that bai: ${error.message}`, 'error');
  }
}

async function loadArtists() {
  try {
    const data = await callApi('/artists');
    state.artists = Array.isArray(data) ? data : [];
    renderArtists();
  } catch (error) {
    showNotice(`Tai artists that bai: ${error.message}`, 'error');
  }
}

async function loadPlaylists() {
  try {
    const data = await callApi('/playlists');
    state.playlists = Array.isArray(data) ? data : [];
    renderPlaylists();
  } catch (error) {
    showNotice(`Tai playlists that bai: ${error.message}`, 'error');
  }
}

async function loadSongs() {
  try {
    const data = await callApi('/songs');
    state.songs = Array.isArray(data) ? data : [];
    renderSongs();
  } catch (error) {
    showNotice(`Tai songs that bai: ${error.message}`, 'error');
  }
}

function bindCreateForms() {
  const artistCreateForm = document.getElementById('artist-create-form');
  artistCreateForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      await callApi('/artists', {
        method: 'POST',
        body: new FormData(artistCreateForm)
      });
      artistCreateForm.reset();
      showNotice('Tao nghe si thanh cong.');
      await loadArtists();
    } catch (error) {
      showNotice(error.message, 'error');
    }
  });

  const playlistCreateForm = document.getElementById('playlist-create-form');
  playlistCreateForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const payload = Object.fromEntries(new FormData(playlistCreateForm).entries());
      await callApi('/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      playlistCreateForm.reset();
      showNotice('Tao playlist thanh cong.');
      await loadPlaylists();
    } catch (error) {
      showNotice(error.message, 'error');
    }
  });

  const songCreateForm = document.getElementById('song-create-form');
  songCreateForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      await callApi('/songs', {
        method: 'POST',
        body: new FormData(songCreateForm)
      });
      songCreateForm.reset();
      showNotice('Tao bai hat thanh cong.');
      await loadSongs();
    } catch (error) {
      showNotice(error.message, 'error');
    }
  });
}

function bindRefreshButtons() {
  document.getElementById('refresh-users').addEventListener('click', loadUsers);
  document.getElementById('refresh-artists').addEventListener('click', loadArtists);
  document.getElementById('refresh-playlists').addEventListener('click', loadPlaylists);
  document.getElementById('refresh-songs').addEventListener('click', loadSongs);
}

async function bootstrap() {
  initTabs();
  bindCreateForms();
  bindRefreshButtons();

  await Promise.all([loadUsers(), loadArtists(), loadPlaylists(), loadSongs()]);
}

bootstrap();
