document.addEventListener('DOMContentLoaded', () => {
    const songs = [
        {
            id: 1,
            title: 'Midnight Runaway',
            artist: 'Che',
            genre: 'Dark Pop',
            duration: '02:08',
            year: '2024',
            label: 'Neon Room',
            mood: 'Moody, Night Drive',
            format: 'Single',
            theme: 'Noi tam, dem muon',
            likes: '2.4K',
            shares: '318',
            followers: '8 nguoi theo doi',
            summary: 'Mot ban thu dark-pop co nhiet do lanh, giong hat mo sat tai va nhung lop synth mo suong.',
            bio: 'Che theo duoi dark-pop va alternative electronic, thuong khai thac nhung ban thu co khong khi ve dem.',
            cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
            artistAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
            lyrics: [
                'Duong pho mo den, em di qua nhu mot vet sao cham.',
                'Tieng bass rut nhe vao nguc, moi nhip la mot lan khong noi thanh loi.',
                'Ta giu im lang, de thanh pho hat ho phan con lai.',
                'Neu dem nay qua dai, cu de bai hat nay chay cung em.'
            ]
        },
        {
            id: 2,
            title: 'Velvet Signal',
            artist: 'Che',
            genre: 'Alternative Pop',
            duration: '03:16',
            year: '2023',
            label: 'Neon Room',
            mood: 'Late Night, Reflective',
            format: 'Single',
            theme: 'Do thi, ky uc',
            likes: '1.9K',
            shares: '204',
            followers: '8 nguoi theo doi',
            summary: 'Nhe hon, mem hon, nhung van giu chat am toi va khoang vang rong quanh giong hat.',
            bio: 'Che theo duoi dark-pop va alternative electronic, thuong khai thac nhung ban thu co khong khi ve dem.',
            cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
            artistAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
            lyrics: [
                'Tat ca tin hieu gui den deu ve muon hon mot nhip.',
                'Em ngoi giua can phong toi, doi nhung dieu khong ai goi ten.',
                'Co nhung luc ky uc la mot tan so ta khong tat duoc.'
            ]
        },
        {
            id: 3,
            title: 'Paper Moon Motel',
            artist: 'Che',
            genre: 'Indie Electronic',
            duration: '02:54',
            year: '2025',
            label: 'Blue Flicker',
            mood: 'Cinematic, Lonely',
            format: 'EP Track',
            theme: 'Hanh trinh, lang thang',
            likes: '3.1K',
            shares: '426',
            followers: '8 nguoi theo doi',
            summary: 'Co cau truc rong, nhieu khoang tho de dan day xuc cam truoc khi beat bung mo.',
            bio: 'Che theo duoi dark-pop va alternative electronic, thuong khai thac nhung ban thu co khong khi ve dem.',
            cover: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=900&q=80',
            artistAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
            lyrics: [
                'Bien ten motel cu rop trong gio nhu mot tam poster bong troc.',
                'Anh nghe thay tieng giay keo rat nho, giong nhu ai do dang bo di.'
            ]
        },
        {
            id: 4,
            title: 'Chrome Bloom',
            artist: 'Mina Grey',
            genre: 'Synthwave',
            duration: '03:40',
            year: '2024',
            label: 'Polar Arcade',
            mood: 'Drive, Neon',
            format: 'Single',
            theme: 'Anh sang, toc do',
            likes: '5.7K',
            shares: '610',
            followers: '13 nghin nguoi theo doi',
            summary: 'Beat nhanh hon, giai dieu mo rong va cham chat synthwave de nghe luc di dem.',
            bio: 'Mina Grey tap trung vao synthwave va electro-pop, noi bat voi cac ban thu mang tinh hinh anh cao.',
            cover: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?auto=format&fit=crop&w=900&q=80',
            artistAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
            lyrics: [
                'Chrome bloom under city lights.',
                'Another engine glow beneath the skin.'
            ]
        }
    ];

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
