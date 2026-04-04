// Songs Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const songsGrid = document.getElementById('songsGrid');
    const searchInput = document.getElementById('searchSongs');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Mock songs data (replace with API call)
    const mockSongs = [
        { id: 1, name: 'Chúng Ta Của Hiện Tại', artist: 'Sơn Tùng M-TP', genre: 'vpop', image: null },
        { id: 2, name: 'Lạc Trôi', artist: 'Sơn Tùng M-TP', genre: 'vpop', image: null },
        { id: 3, name: 'Hãy Trao Cho Anh', artist: 'Sơn Tùng M-TP', genre: 'vpop', image: null },
        { id: 4, name: 'Shape of You', artist: 'Ed Sheeran', genre: 'usuk', image: null },
        { id: 5, name: 'Perfect', artist: 'Ed Sheeran', genre: 'usuk', image: null },
        { id: 6, name: 'Dynamite', artist: 'BTS', genre: 'kpop', image: null },
        { id: 7, name: 'Butter', artist: 'BTS', genre: 'kpop', image: null },
        { id: 8, name: 'As It Was', artist: 'Harry Styles', genre: 'usuk', image: null },
    ];

    let currentFilter = 'all';
    let searchQuery = '';

    // Render songs
    function renderSongs() {
        const filtered = mockSongs.filter(song => {
            const matchesFilter = currentFilter === 'all' || song.genre === currentFilter;
            const matchesSearch = song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  song.artist.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            songsGrid.innerHTML = '<p class="loading-text">Không tìm thấy bài hát nào</p>';
            return;
        }

        songsGrid.innerHTML = filtered.map(song => `
            <div class="song-card" data-id="${song.id}">
                <div class="song-thumbnail">
                    ${song.image ? `<img src="${song.image}" alt="${song.name}">` : '<i class="fas fa-music"></i>'}
                    <div class="play-overlay">
                        <button class="play-btn-overlay">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="song-info-card">
                    <p class="song-name-card">${song.name}</p>
                    <p class="song-artist-card">${song.artist}</p>
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.song-card').forEach(card => {
            card.addEventListener('click', () => {
                const songId = card.dataset.id;
                playSong(songId);
            });
        });
    }

    // Filter handlers
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderSongs();
        });
    });

    // Search handler
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderSongs();
    });

    // Play song
    function playSong(songId) {
        const song = mockSongs.find(s => s.id == songId);
        if (song) {
            const songNameEl = document.querySelector('.player-left .song-name');
            const songArtistEl = document.querySelector('.player-left .song-artist');
            
            if (songNameEl) songNameEl.textContent = song.name;
            if (songArtistEl) songArtistEl.textContent = song.artist;
            
            // Update play button
            const playBtn = document.querySelector('.player-center .play-btn i');
            if (playBtn) {
                playBtn.classList.remove('fa-play');
                playBtn.classList.add('fa-pause');
            }
        }
    }

    // Initial render
    renderSongs();
});
