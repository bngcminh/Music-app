// ===== ELEMENT =====
const audio = document.getElementById('audioPlayer');

const playBtn = document.getElementById('play-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

const title = document.getElementById('player-title');
const artist = document.getElementById('player-artist');
const cover = document.getElementById('player-cover');

const queueTitle = document.getElementById('queue-title');
const queueArtist = document.getElementById('queue-artist');
const queueCover = document.getElementById('queue-cover');

const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const progressFill = document.getElementById('progress-fill');
const progressBar = document.getElementById('progress-bar');

const queueList = document.getElementById('queueList');
const queueCount = document.getElementById('queue-count');

// modal
const openQueueBtn = document.getElementById('open-queue');
const closeQueueBtn = document.getElementById('closeQueueBtn');
const queueModal = document.getElementById('playlistQueueModal');
const overlay = document.querySelector('.queue-overlay');

// ===== DATA =====
let queue = [];
let currentIndex = -1;

// ===== CLICK SONG =====
document.querySelectorAll('.song-item').forEach(song => {
  song.addEventListener('click', () => {
    const songData = {
      src: song.dataset.src,
      title: song.dataset.title,
      artist: song.dataset.artist,
      cover: song.dataset.cover
    };
    console.log(song.dataset.src);
    queue.push(songData);
    currentIndex = queue.length - 1;
    playSong(songData);
  });
});

// ===== PLAY SONG =====
function playSong(song){
  audio.src = song.src;
  audio.load();

  title.innerText = song.title;
  artist.innerText = song.artist;
  cover.src = song.cover;

  queueTitle.innerText = song.title;
  queueArtist.innerText = song.artist;
  queueCover.src = song.cover;

  // LƯU VÀO LOCAL
  localStorage.setItem('currentSong', JSON.stringify(song));

  audio.play();
}

// ===== PLAY / PAUSE =====
// click
playBtn.addEventListener('click', () => {
  if(audio.paused){
    audio.play();
  } else {
    audio.pause();
  }
});

// sync icon
audio.addEventListener('play', () => {
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

audio.addEventListener('pause', () => {
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
});

// ===== NEXT =====
nextBtn.addEventListener('click', () => {
  if(currentIndex < queue.length - 1){
    currentIndex++;
    playSong(queue[currentIndex]);
  }
});

// ===== PREV =====
prevBtn.addEventListener('click', () => {
  if(currentIndex > 0){
    currentIndex--;
    playSong(queue[currentIndex]);
  }
});

// ===== AUTO NEXT =====
audio.addEventListener('ended', () => {
  if(currentIndex < queue.length - 1){
    currentIndex++;
    playSong(queue[currentIndex]);
  }
});

// ===== FORMAT TIME =====
function formatTime(t){
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s < 10 ? '0'+s : s}`;
}

// ===== LOAD DURATION =====
audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.innerText = formatTime(audio.duration);
});

// ===== UPDATE TIME =====
audio.addEventListener('timeupdate', () => {

  if(currentTimeEl){
    currentTimeEl.innerText = formatTime(audio.currentTime);
  }

  if(totalTimeEl){
    totalTimeEl.innerText = formatTime(audio.duration);
  }

  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = percent + '%';

  localStorage.setItem('currentTime', audio.currentTime);
});

// ===== CLICK SEEK =====
progressBar.addEventListener('click', (e) => {
  const percent = e.offsetX / progressBar.offsetWidth;
  audio.currentTime = percent * audio.duration;
});

// ===== RENDER QUEUE =====
function renderQueue(){
  queueList.innerHTML = '';
  queueCount.innerText = queue.length + ' bài hát';

  if(queue.length === 0){
    queueList.innerHTML = '<p>Danh sách phát trống</p>';
    return;
  }

  queue.forEach((song, index) => {
    const div = document.createElement('div');
    div.className = 'queue-item';

    div.innerHTML = `
      <p>${song.title}</p>
      <p>${song.artist}</p>
    `;

    div.onclick = () => {
      currentIndex = index;
      playSong(song);
    };

    queueList.appendChild(div);
  });
}

// ===== OPEN MODAL =====
openQueueBtn.addEventListener('click', () => {
  queueModal.classList.add('active');
});

// ===== CLOSE MODAL =====
closeQueueBtn.addEventListener('click', () => {
  queueModal.classList.remove('active');
});

overlay.addEventListener('click', () => {
  queueModal.classList.remove('active');
});

window.addEventListener('load', () => {
  const savedSong = JSON.parse(localStorage.getItem('currentSong'));
  const savedTime = localStorage.getItem('currentTime');

  if(savedSong){
    playSong(savedSong);

    audio.addEventListener('loadedmetadata', () => {
      if(savedTime){
        audio.currentTime = savedTime;
      }
    });
  }
});