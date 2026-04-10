document.addEventListener('DOMContentLoaded', () => {
    
    const heroPlayBtn = document.getElementById('heroPlayBtn');
    const relatedSongs = document.getElementById('relatedSongs');
    let currentSongId = 1;

    function setText(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }

    function setImage(selector, src, alt) {
        const element = document.querySelector(selector);
        if (element) {
            element.src = src;
            element.alt = alt;
        }
    }

    function updatePlayer(song) {
        setText('.player-song-name', song.title);
        setText('.player-artist-name', song.artist);
        setImage('.player-thumbnail img', song.cover, song.title);

        const playIcon = document.querySelector('.btn-play-main i');
        if (playIcon) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        }
    }

    function renderLyrics(song) {
        const lyricsBody = document.getElementById('songLyrics');
        if (!lyricsBody) {
            return;
        }

        if (!song.lyrics || song.lyrics.length === 0) {
            lyricsBody.innerHTML = '<div class="lyrics-placeholder">Loi bai hat se som duoc cap nhat...</div>';
            return;
        }

        lyricsBody.innerHTML = song.lyrics.map(line => `<p>${line}</p>`).join('');
    }

    function renderRelatedSongs(song) {
        if (!relatedSongs) {
            return;
        }

        const suggestions = songs
            .filter(item => item.id !== song.id)
            .sort((left, right) => {
                const sameArtistLeft = left.artist === song.artist ? 1 : 0;
                const sameArtistRight = right.artist === song.artist ? 1 : 0;
                return sameArtistRight - sameArtistLeft;
            })
            .slice(0, 4);

        relatedSongs.innerHTML = suggestions.map(item => `
            <article class="related-song ${item.id === currentSongId ? 'is-active' : ''}" data-song-id="${item.id}">
                <div class="related-song-cover">
                    <img src="${item.cover}" alt="${item.title}">
                </div>
                <div class="related-song-copy">
                    <h4 class="related-song-title">${item.title}</h4>
                    <p class="related-song-subtitle">${item.artist} • ${item.summary}</p>
                </div>
                <span class="related-song-tag">${item.genre}</span>
                <span class="related-song-duration">${item.duration}</span>
            </article>
        `).join('');

        relatedSongs.querySelectorAll('.related-song').forEach(item => {
            item.addEventListener('click', () => {
                const nextSongId = Number(item.dataset.songId);
                renderSongDetail(nextSongId);
            });
        });
    }

    function renderSongDetail(songId) {
        const song = songs.find(item => item.id === songId);
        if (!song) {
            return;
        }

        currentSongId = song.id;

        setImage('#songCover', song.cover, song.title);
        setText('#songTitle', song.title);
        setText('#songSummary', song.summary);
        setText('#songArtist', song.artist);
        setText('#songDuration', song.duration);
        setText('#songGenre', song.genre);
        setText('#songLikes', song.likes);
        setText('#songShares', song.shares);
        setText('#songYear', song.year);
        setText('#songLabel', song.label);
        setText('#songMood', song.mood);
        setText('#artistName', song.artist);
        setText('#artistFollowers', song.followers);
        setText('#artistBio', song.bio);
        setText('#songFormat', song.format);
        setText('#songTheme', song.theme);
        setImage('#artistAvatar', song.artistAvatar, song.artist);

        renderLyrics(song);
        renderRelatedSongs(song);
        updatePlayer(song);
    }

    if (heroPlayBtn) {
        heroPlayBtn.addEventListener('click', () => {
            renderSongDetail(currentSongId);
        });
    }

    renderSongDetail(currentSongId);

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
});
