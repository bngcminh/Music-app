document.addEventListener('DOMContentLoaded', () => {
    const playlistData = {
        id: 1,
        title: 'Huji After Hours',
        type: 'Playlist',
        subtitle: 'Mot playlist cho nhung dem lang, bass day, nhieu synth va giong hat thi tham.',
        owner: 'Che',
        ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        followers: '12.4K theo doi',
        likes: '5.2K',
        shares: '421',
        totalDuration: '24:18',
        countText: '6 bai hat',
        mood: 'Moody',
        category: 'Night Drive',
        updated: 'Cap nhat 09/04/2026',
        description: 'Playlist nay bat dau voi nhung ban thu toi gian, day khong khi thanh pho luc 2h sang va ket thuc bang nhung track mo rong hon de giu mood.',
        curatorBio: 'Chuyen tap hop nhung ban dark-pop, dream electronic va alternative co nhiet do lanh.',
        curatorStats: '8 playlist public • 12.4K theo doi',
        cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
        tracks: [
            {
                id: 1,
                title: 'Goi Dau (voi Ha Le)',
                subtitle: 'Khoi dong bang ambient vocal va nhiep synth mong.',
                uploader: 'meo meo meo rua mat nhu meo',
                uploaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
                artist: 'Thang, Ha Le',
                duration: '04:24',
                cover: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 2,
                title: 'Midnight Alley',
                subtitle: 'Lop beat ro giong va texture lo-fi giu nhiet do thap.',
                uploader: 'neon room radio',
                uploaderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
                artist: 'Che',
                duration: '03:10',
                cover: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 3,
                title: 'Velvet Signal',
                subtitle: 'Ban chuyen canh mem, co khoang thở dai va giong hat rat gan.',
                uploader: 'neon room radio',
                uploaderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
                artist: 'Che',
                duration: '03:16',
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 4,
                title: 'Paper Moon Motel',
                subtitle: 'Do mo rong hon, tinh anh nhieu hon va rat hop nghe ban dem.',
                uploader: 'blue flicker',
                uploaderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                artist: 'Che',
                duration: '02:54',
                cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 5,
                title: 'Chrome Bloom',
                subtitle: 'Tang nhiet nhe voi mau synthwave va toc do ro hon.',
                uploader: 'polar arcade',
                uploaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
                artist: 'Mina Grey',
                duration: '03:40',
                cover: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?auto=format&fit=crop&w=400&q=80'
            },
            {
                id: 6,
                title: 'Slow Horizon',
                subtitle: 'Ket playlist bang mot ban thu rong va thoang, nhieu reverb.',
                uploader: 'night commute',
                uploaderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                artist: 'Lune, Che',
                duration: '07:14',
                cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80'
            }
        ],
        relatedPlaylists: [
            {
                id: 11,
                title: 'Glass City Motion',
                subtitle: 'Electro-pop, neon, toc do vua',
                cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80'
            },
            {
                id: 12,
                title: 'Blue Echo Room',
                subtitle: 'Dream electronic va vocal lanh',
                cover: 'https://images.unsplash.com/photo-1519996521430-12149e9f8b4a?auto=format&fit=crop&w=300&q=80'
            },
            {
                id: 13,
                title: 'Night Bus Tapes',
                subtitle: 'Lo-fi, downtempo, dem muon',
                cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80'
            }
        ]
    };

    const tracksTable = document.getElementById('playlistTracks');
    const relatedPlaylists = document.getElementById('relatedPlaylists');
    const playAllBtn = document.getElementById('playAllBtn');
    let currentTrackId = playlistData.tracks[0]?.id || null;

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

    function updateSharedPlayer(track) {
        if (!track) {
            return;
        }

        setText('.player-song-name', track.title);
        setText('.player-artist-name', track.artist);
        setImage('.player-thumbnail img', track.cover, track.title);

        const playIcon = document.querySelector('.btn-play-main i');
        if (playIcon) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        }
    }

    function renderPlaylistHero() {
        setImage('#playlistCover', playlistData.cover, playlistData.title);
        setImage('#playlistOwnerAvatar', playlistData.ownerAvatar, playlistData.owner);
        setImage('#curatorAvatar', playlistData.ownerAvatar, playlistData.owner);
        setText('#playlistType', playlistData.type);
        setText('#playlistCountText', playlistData.countText);
        setText('#playlistTitle', playlistData.title);
        setText('#playlistSubtitle', playlistData.subtitle);
        setText('#playlistOwner', playlistData.owner);
        setText('#playlistFollowers', playlistData.followers);
        setText('#playlistDuration', playlistData.totalDuration);
        setText('#playlistLikes', playlistData.likes);
        setText('#playlistShares', playlistData.shares);
        setText('#playlistMood', playlistData.mood);
        setText('#playlistCategory', playlistData.category);
        setText('#playlistUpdated', playlistData.updated);
        setText('#playlistDescription', playlistData.description);
        setText('#curatorName', playlistData.owner);
        setText('#curatorBio', playlistData.curatorBio);
        setText('#curatorStats', playlistData.curatorStats);
    }

    function renderTracks() {
        if (!tracksTable) {
            return;
        }

        tracksTable.innerHTML = playlistData.tracks.map((track, index) => `
            <tr class="track-row ${track.id === currentTrackId ? 'is-active' : ''}" data-track-id="${track.id}">
                <td class="track-index">${index + 1}</td>
                <td>
                    <div class="track-main">
                        <div class="track-cover">
                            <img src="${track.cover}" alt="${track.title}">
                        </div>
                        <div class="track-copy">
                            <h4 class="track-title">${track.title}</h4>
                            <p class="track-subtitle">${track.subtitle}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="uploader-pill">
                        <img src="${track.uploaderAvatar}" alt="${track.uploader}">
                        <span>${track.uploader}</span>
                    </div>
                </td>
                <td class="track-artist">${track.artist}</td>
                <td class="track-duration">${track.duration}</td>
            </tr>
        `).join('');

        tracksTable.querySelectorAll('.track-row').forEach(row => {
            row.addEventListener('click', () => {
                currentTrackId = Number(row.dataset.trackId);
                const currentTrack = playlistData.tracks.find(track => track.id === currentTrackId);
                renderTracks();
                updateSharedPlayer(currentTrack);
            });
        });
    }

    function renderRelatedPlaylists() {
        if (!relatedPlaylists) {
            return;
        }

        relatedPlaylists.innerHTML = playlistData.relatedPlaylists.map(item => `
            <article class="mini-playlist-card">
                <img src="${item.cover}" alt="${item.title}">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.subtitle}</p>
                </div>
            </article>
        `).join('');
    }

    if (playAllBtn) {
        playAllBtn.addEventListener('click', () => {
            const firstTrack = playlistData.tracks[0];
            currentTrackId = firstTrack.id;
            renderTracks();
            updateSharedPlayer(firstTrack);
        });
    }

    renderPlaylistHero();
    renderTracks();
    renderRelatedPlaylists();
    updateSharedPlayer(playlistData.tracks[0]);

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
