// Music Player Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Player controls
    const playButton = document.querySelector('.btn-play-main');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeFill = document.querySelector('.volume-fill');

    // Queue Modal Elements
    const queueModal = document.getElementById('playlistQueueModal');
    const queueBtn = document.querySelector('.btn-control[title="Playlist"]');
    const closeQueueBtn = document.getElementById('closeQueueBtn');
    const queueOverlay = document.querySelector('.queue-overlay');
    const queueList = document.getElementById('queueList');

    // Mock queue data (replace with real data later)
    let currentQueue = [
        { id: 1, name: 'Chúng Ta Của Hiện Tại', artist: 'Sơn Tùng M-TP', duration: '04:32' },
        { id: 2, name: 'Lạc Trôi', artist: 'Sơn Tùng M-TP', duration: '03:58' },
        { id: 3, name: 'Nơi Này Có Anh', artist: 'Sơn Tùng M-TP', duration: '04:15' },
        { id: 4, name: 'Hãy Trao Cho Anh', artist: 'Sơn Tùng M-TP', duration: '03:45' },
    ];
    let currentPlayingId = 1;

    // Open Queue Modal
    if (queueBtn) {
        queueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (queueModal) {
                queueModal.classList.add('active');
                renderQueue();
            }
        });
    }

    // Close Queue Modal
    function closeQueue() {
        if (queueModal) {
            queueModal.classList.remove('active');
        }
    }

    if (closeQueueBtn) {
        closeQueueBtn.addEventListener('click', closeQueue);
    }

    if (queueOverlay) {
        queueOverlay.addEventListener('click', closeQueue);
    }

    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && queueModal && queueModal.classList.contains('active')) {
            closeQueue();
        }
    });

    // Render Queue List
    function renderQueue() {
        if (!queueList) return;

        if (currentQueue.length === 0) {
            queueList.innerHTML = '<p class="empty-queue">Danh sách phát trống</p>';
            document.querySelector('.queue-count').textContent = '0 bài hát';
            return;
        }

        document.querySelector('.queue-count').textContent = `${currentQueue.length} bài hát`;

        queueList.innerHTML = currentQueue.map((song, index) => `
            <div class="queue-item ${song.id === currentPlayingId ? 'playing' : ''}" data-id="${song.id}">
                <span class="queue-item-number">${index + 1}</span>
                <div class="queue-item-thumbnail">
                    <i class="fas fa-music"></i>
                </div>
                <div class="queue-item-info">
                    <p class="song-name">${song.name}</p>
                    <p class="song-artist">${song.artist}</p>
                </div>
                <span class="queue-item-duration">${song.duration}</span>
                <div class="queue-item-actions">
                    <button class="queue-item-btn btn-remove-queue" title="Xóa">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.queue-item').forEach(item => {
            item.addEventListener('click', function() {
                const songId = parseInt(this.dataset.id);
                playSongFromQueue(songId);
            });
        });

        // Remove from queue
        document.querySelectorAll('.btn-remove-queue').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const item = this.closest('.queue-item');
                const songId = parseInt(item.dataset.id);
                removeFromQueue(songId);
            });
        });
    }

    // Play song from queue
    function playSongFromQueue(songId) {
        const song = currentQueue.find(s => s.id === songId);
        if (song) {
            currentPlayingId = songId;

            // Update now playing
            const nowPlayingSong = document.querySelector('.now-playing-item .song-info-queue .song-name');
            const nowPlayingArtist = document.querySelector('.now-playing-item .song-info-queue .song-artist');
            const nowPlayingDuration = document.querySelector('.now-playing-item .song-duration');

            if (nowPlayingSong) nowPlayingSong.textContent = song.name;
            if (nowPlayingArtist) nowPlayingArtist.textContent = song.artist;
            if (nowPlayingDuration) nowPlayingDuration.textContent = song.duration;

            // Update main player
            const mainSongName = document.querySelector('.player-left .song-info .song-name');
            const mainSongArtist = document.querySelector('.player-left .song-info .song-artist');

            if (mainSongName) mainSongName.textContent = song.name;
            if (mainSongArtist) mainSongArtist.textContent = song.artist;

            // Update play button
            const playIcon = document.querySelector('.btn-play-main i');
            if (playIcon) {
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
            }

            renderQueue();
        }
    }

    // Remove from queue
    function removeFromQueue(songId) {
        currentQueue = currentQueue.filter(s => s.id !== songId);
        renderQueue();
    }
    
    // Play/Pause toggle
    if (playButton) {
      playButton.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-play')) {
          icon.classList.remove('fa-play');
          icon.classList.add('fa-pause');
        } else {
          icon.classList.remove('fa-pause');
          icon.classList.add('fa-play');
        }
      });
    }
    
    // Progress bar click
    if (progressBar) {
      progressBar.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width * 100;
        if (progressFill) {
          progressFill.style.width = percent + '%';
        }
      });
    }
    
    // Volume slider
    if (volumeSlider) {
      volumeSlider.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width * 100;
        if (volumeFill) {
          volumeFill.style.width = percent + '%';
        }
      });
    }
    
    // Heart icon toggle (favorite)
    const heartButtons = document.querySelectorAll('.fa-heart');
    heartButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        if (this.classList.contains('far')) {
          this.classList.remove('far');
          this.classList.add('fas');
          this.style.color = '#ff4757';
        } else {
          this.classList.remove('fas');
          this.classList.add('far');
          this.style.color = '';
        }
      });
    });
    
    // Mobile sidebar toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.style.cssText = 'display: none; position: fixed; top: 16px; left: 16px; z-index: 101; width: 40px; height: 40px; border-radius: 8px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);';
    
    const sidebar = document.querySelector('.sidebar');
    
    if (window.innerWidth <= 768) {
      document.body.appendChild(menuToggle);
      menuToggle.style.display = 'flex';
      menuToggle.style.alignItems = 'center';
      menuToggle.style.justifyContent = 'center';
    }
    
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768 && 
          !sidebar.contains(e.target) && 
          !menuToggle.contains(e.target) &&
          sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
    
    // Window resize handler
    window.addEventListener('resize', function() {
      if (window.innerWidth <= 768) {
        menuToggle.style.display = 'flex';
      } else {
        menuToggle.style.display = 'none';
        sidebar.classList.remove('open');
      }
    });
    
    // Smooth scroll for view all links
    const viewAllLinks = document.querySelectorAll('.view-all');
    viewAllLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('View all clicked');
      });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.playlist-card, .album-card, .artist-card');
    cards.forEach(card => {
      card.addEventListener('click', function() {
        console.log('Card clicked:', this);
      });
    });
    
    // Play button on cards
    const playButtons = document.querySelectorAll('.play-button, .btn-play-album');
    playButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Play clicked');
      });
    });
    
    // Trending item click
    const trendingItems = document.querySelectorAll('.trending-item');
    trendingItems.forEach(item => {
      item.addEventListener('click', function() {
        console.log('Trending item clicked:', this);
      });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          console.log('Search for:', this.value);
        }
      });
    }
    
    // Category chips
    const categoryChips = document.querySelectorAll('.category-chip');
    categoryChips.forEach(chip => {
      chip.addEventListener('click', function(e) {
        e.preventDefault();
        categoryChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      });
    });
});

