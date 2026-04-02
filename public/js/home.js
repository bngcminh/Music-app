// Music Player Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Player controls
    const playButton = document.querySelector('.btn-play-main');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeFill = document.querySelector('.volume-fill');
    
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

