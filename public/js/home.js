// ===== ELEMENTS =====
const audio = document.getElementById('audioPlayer');

const playBtn = document.getElementById('play-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');

const title = document.getElementById('player-title');
const artist = document.getElementById('player-artist');
const cover = document.getElementById('player-cover');

const queueTitle = document.getElementById('queue-title');
const queueArtist = document.getElementById('queue-artist');
const queueCover = document.getElementById('queue-cover');

const progressFill = document.getElementById('progress-fill');
const progressBar = document.getElementById('progress-bar');

const queueList = document.getElementById('queueList');
const queueCount = document.getElementById('queue-count');

const openQueueBtn = document.getElementById('open-queue');
const closeQueueBtn = document.getElementById('closeQueueBtn');
const queueModal = document.getElementById('playlistQueueModal');
const overlay = document.querySelector('.queue-overlay');

const volumeMuteBtn = document.getElementById('volume-mute-btn');
const volumeTrack = document.getElementById('volume-track');
const volumeFill = document.getElementById('volume-fill');

// ===== STATE =====
/** @type {{src:string,title:string,artist:string,cover:string}[]} */
let queue = [];
let currentIndex = -1;

/** Danh sách bài từ trang (các .song-item có data-src) */
let pagePlaylist = [];

/** @type {'off' | 'all' | 'one'} */
let repeatMode = 'off';
let shuffleOn = false;

let volumeBeforeMute = 1;

function isHomePage() {
    const p = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    return p === '/';
}

// ===== PAGE PLAYLIST =====
function readSongFromEl(el) {
    const src = el.dataset.src;
    if (!src) return null;
    return {
        src,
        title: el.dataset.title || 'Không tên',
        artist: el.dataset.artist || '',
        cover: el.dataset.cover || ''
    };
}

function initPagePlaylist() {
    pagePlaylist = [];
    if (isHomePage()) return;

    document.querySelectorAll('.song-item[data-src]').forEach((el) => {
        const s = readSongFromEl(el);
        if (s) pagePlaylist.push(s);
    });
}

function bindSongItemClicks() {
    document.querySelectorAll('.song-item[data-src]').forEach((songEl, idx) => {
        songEl.addEventListener('click', (e) => {
            if (e.target.closest('a[href]')) return;

            const songData = readSongFromEl(songEl);
            if (!songData) return;

            if (isHomePage()) {
                queue = [];
                currentIndex = -1;
                playSong(songData);
                return;
            }

            if (pagePlaylist.length > 0) {
                queue = pagePlaylist.slice();
                const i = pagePlaylist.findIndex((s) => s.src === songData.src);
                currentIndex = i >= 0 ? i : idx;
            } else {
                queue.push(songData);
                currentIndex = queue.length - 1;
            }
            playSong(queue[currentIndex]);
            renderQueue();
        });
    });
}

// ===== PLAY SONG =====
/** @param {{ autoplay?: boolean, resumeAt?: string | number }} [options] — mặc định autoplay: true */
function playSong(song, options = {}) {
    if (!song || !song.src) return;

    const autoplay = options.autoplay !== false;
    const resumeAt = options.resumeAt;

    audio.src = song.src;
    audio.load();
    audio.loop = repeatMode === 'one';

    title.innerText = song.title;
    artist.innerText = song.artist;
    cover.src = song.cover || '';

    if (queueTitle) queueTitle.innerText = song.title;
    if (queueArtist) queueArtist.innerText = song.artist;
    if (queueCover) queueCover.src = song.cover || '';

    localStorage.setItem('currentSong', JSON.stringify(song));

    const afterMetadata = () => {
        if (resumeAt != null && resumeAt !== '' && isFinite(Number(resumeAt)) && Number(resumeAt) > 0) {
            try {
                audio.currentTime = Number(resumeAt);
            } catch (_) { /* ignore */ }
        }
        if (!autoplay) {
            audio.pause();
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    audio.addEventListener('loadedmetadata', afterMetadata, { once: true });

    if (autoplay) {
        audio.play().catch(() => {});
    }

    renderQueue();
}

function applyRepeatToAudio() {
    audio.loop = repeatMode === 'one';
}

function updateRepeatButtonUI() {
    if (!repeatBtn) return;
    repeatBtn.classList.remove('is-active', 'repeat-one');
    if (repeatMode === 'all') {
        repeatBtn.classList.add('is-active');
        repeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
        repeatBtn.title = 'Lặp: tất cả bài (đang bật)';
    } else if (repeatMode === 'one') {
        repeatBtn.classList.add('repeat-one');
        repeatBtn.innerHTML = '<i class="fas fa-repeat"></i><span class="repeat-one-mark">1</span>';
        repeatBtn.title = 'Lặp: một bài (đang bật)';
    } else {
        repeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
        repeatBtn.title = 'Lặp lại: tắt / tất cả / một bài';
    }
}

function updateShuffleButtonUI() {
    if (!shuffleBtn) return;
    shuffleBtn.classList.toggle('is-active', shuffleOn);
    shuffleBtn.title = shuffleOn ? 'Phát ngẫu nhiên (đang bật)' : 'Phát ngẫu nhiên';
}

function playNext() {
    if (queue.length === 0) return;

    if (shuffleOn) {
        if (queue.length === 1) {
            if (repeatMode === 'all') {
                currentIndex = 0;
                playSong(queue[0]);
            }
            return;
        }
        let next;
        do {
            next = Math.floor(Math.random() * queue.length);
        } while (next === currentIndex);
        currentIndex = next;
    } else if (currentIndex < queue.length - 1) {
        currentIndex += 1;
    } else if (repeatMode === 'all') {
        currentIndex = 0;
    } else {
        return;
    }

    playSong(queue[currentIndex]);
}

function playPrev() {
    if (isHomePage() && queue.length === 0) {
        if (audio.src && audio.currentTime > 3) {
            audio.currentTime = 0;
        }
        return;
    }

    if (queue.length === 0) return;

    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    if (shuffleOn) {
        currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    } else if (currentIndex > 0) {
        currentIndex -= 1;
    } else if (repeatMode === 'all') {
        currentIndex = queue.length - 1;
    } else {
        return;
    }

    playSong(queue[currentIndex]);
}

// ===== PLAY / PAUSE =====
if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (!audio.src) return;
        if (audio.paused) {
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    });
}

audio.addEventListener('play', () => {
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

audio.addEventListener('pause', () => {
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
});

if (nextBtn) nextBtn.addEventListener('click', playNext);
if (prevBtn) prevBtn.addEventListener('click', playPrev);

if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
        shuffleOn = !shuffleOn;
        localStorage.setItem('musicShuffle', shuffleOn ? '1' : '0');
        updateShuffleButtonUI();
    });
}

if (repeatBtn) {
    repeatBtn.addEventListener('click', () => {
        if (repeatMode === 'off') repeatMode = 'all';
        else if (repeatMode === 'all') repeatMode = 'one';
        else repeatMode = 'off';

        localStorage.setItem('musicRepeat', repeatMode);
        applyRepeatToAudio();
        updateRepeatButtonUI();
    });
}

audio.addEventListener('ended', () => {
    if (repeatMode === 'one') return;

    if (isHomePage() && queue.length === 0) {
        return;
    }

    if (shuffleOn) {
        if (queue.length === 1 && repeatMode === 'all') {
            currentIndex = 0;
            playSong(queue[0]);
            return;
        }
        playNext();
        return;
    }

    if (currentIndex >= queue.length - 1) {
        if (repeatMode === 'all') {
            currentIndex = 0;
            playSong(queue[currentIndex]);
        }
        return;
    }

    playNext();
});

// ===== TIME / SEEK =====
audio.addEventListener('timeupdate', () => {
    const d = audio.duration;
    if (isFinite(d) && d > 0) {
        const percent = (audio.currentTime / d) * 100;
        if (progressFill) progressFill.style.width = `${percent}%`;
    }

    localStorage.setItem('currentTime', String(audio.currentTime));
});

if (progressBar) {
    progressBar.addEventListener('click', (e) => {
        const d = audio.duration;
        if (!isFinite(d) || d <= 0) return;
        const rect = progressBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = percent * d;
    });
}

// ===== VOLUME =====
function setVolumeLevel(v) {
    const vol = Math.max(0, Math.min(1, v));
    audio.volume = vol;
    localStorage.setItem('musicVolume', String(vol));
    updateVolumeUI(vol);
}

function updateVolumeUI(vol) {
    if (volumeFill) volumeFill.style.width = `${vol * 100}%`;
    if (!volumeMuteBtn) return;
    const icon = volumeMuteBtn.querySelector('i');
    if (!icon) return;
    if (vol === 0) {
        icon.className = 'fas fa-volume-xmark';
        volumeMuteBtn.title = 'Bật tiếng';
    } else if (vol < 0.45) {
        icon.className = 'fas fa-volume-off';
        volumeMuteBtn.title = 'Tắt tiếng';
    } else if (vol < 0.75) {
        icon.className = 'fas fa-volume-low';
        volumeMuteBtn.title = 'Tắt tiếng';
    } else {
        icon.className = 'fas fa-volume-high';
        volumeMuteBtn.title = 'Tắt tiếng';
    }
}

function volumeFromClientX(clientX) {
    if (!volumeTrack) return null;
    const rect = volumeTrack.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
}

if (volumeTrack) {
    volumeTrack.addEventListener('click', (e) => {
        const v = volumeFromClientX(e.clientX);
        if (v !== null) setVolumeLevel(v);
    });

    let draggingVol = false;
    volumeTrack.addEventListener('mousedown', (e) => {
        draggingVol = true;
        const v = volumeFromClientX(e.clientX);
        if (v !== null) setVolumeLevel(v);
    });
    document.addEventListener('mousemove', (e) => {
        if (!draggingVol) return;
        const v = volumeFromClientX(e.clientX);
        if (v !== null) setVolumeLevel(v);
    });
    document.addEventListener('mouseup', () => {
        draggingVol = false;
    });
}

if (volumeMuteBtn) {
    volumeMuteBtn.addEventListener('click', () => {
        if (audio.volume > 0) {
            volumeBeforeMute = audio.volume;
            setVolumeLevel(0);
        } else {
            setVolumeLevel(volumeBeforeMute > 0 ? volumeBeforeMute : 0.7);
        }
    });
}

// ===== QUEUE UI =====
function renderQueue() {
    if (!queueList || !queueCount) return;

    queueList.innerHTML = '';
    queueCount.innerText = `${queue.length} bài hát`;

    if (queue.length === 0) {
        queueList.innerHTML = '<p class="empty-queue">Danh sách phát trống</p>';
        return;
    }

    queue.forEach((song, index) => {
        const div = document.createElement('div');
        div.className = 'queue-item' + (index === currentIndex ? ' playing' : '');

        div.innerHTML = `
      <p class="queue-item-title">${song.title}</p>
      <p class="queue-item-artist">${song.artist}</p>
    `;

        div.onclick = () => {
            currentIndex = index;
            playSong(song);
        };

        queueList.appendChild(div);
    });
}

if (openQueueBtn) {
    openQueueBtn.addEventListener('click', () => {
        queueModal.classList.add('active');
        renderQueue();
    });
}

if (closeQueueBtn) {
    closeQueueBtn.addEventListener('click', () => {
        queueModal.classList.remove('active');
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        queueModal.classList.remove('active');
    });
}

// ===== INIT =====
function loadPersistedPlayerSettings() {
    const v = localStorage.getItem('musicVolume');
    if (v !== null && !Number.isNaN(Number(v))) {
        audio.volume = Math.max(0, Math.min(1, Number(v)));
        updateVolumeUI(audio.volume);
    } else {
        audio.volume = 0.7;
        updateVolumeUI(0.7);
    }

    if (localStorage.getItem('musicShuffle') === '1') {
        shuffleOn = true;
    }
    const r = localStorage.getItem('musicRepeat');
    if (r === 'all' || r === 'one' || r === 'off') {
        repeatMode = r;
    }
    applyRepeatToAudio();
    updateRepeatButtonUI();
    updateShuffleButtonUI();
}

window.addEventListener('load', () => {
    initPagePlaylist();
    bindSongItemClicks();
    loadPersistedPlayerSettings();

    const raw = localStorage.getItem('currentSong');
    const savedSong = raw ? JSON.parse(raw) : null;
    const savedTime = localStorage.getItem('currentTime');

    if (savedSong && savedSong.src) {
        const restoreOpts = { autoplay: false, resumeAt: savedTime };

        if (isHomePage()) {
            queue = [];
            currentIndex = -1;
            playSong(savedSong, restoreOpts);
        } else if (pagePlaylist.length > 0) {
            const idx = pagePlaylist.findIndex((s) => s.src === savedSong.src);
            if (idx !== -1) {
                queue = pagePlaylist.slice();
                currentIndex = idx;
            } else {
                queue = [savedSong];
                currentIndex = 0;
            }
            playSong(queue[currentIndex], restoreOpts);
        } else {
            queue = [savedSong];
            currentIndex = 0;
            playSong(queue[currentIndex], restoreOpts);
        }
    } else {
        renderQueue();
    }
});
