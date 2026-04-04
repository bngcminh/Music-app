// Profile Page Logic
document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active to clicked button and corresponding panel
            button.classList.add('active');
            const targetPanel = document.getElementById(`${targetTab}Tab`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Avatar Upload Preview
    const avatarInput = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('profileAvatarPreview');
    const defaultAvatar = document.getElementById('defaultAvatar');

    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    avatarPreview.src = event.target.result;
                    avatarPreview.style.display = 'block';
                    if (defaultAvatar) {
                        defaultAvatar.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Edit Profile Form
    const editForm = document.getElementById('editProfileForm');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('editUsername').value;
            const email = document.getElementById('editEmail').value;
            const bio = document.getElementById('editBio').value;

            // TODO: Call API to update profile
            console.log('Update profile:', { username, email, bio });

            alert('Cập nhật thông tin thành công!');
        });
    }

    // Change Password Form
    const passwordForm = document.getElementById('changePasswordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate
            if (newPassword !== confirmPassword) {
                alert('Mật khẩu mới không khớp!');
                return;
            }

            if (newPassword.length < 6) {
                alert('Mật khẩu phải có ít nhất 6 ký tự!');
                return;
            }

            // TODO: Call API to change password
            console.log('Change password');

            alert('Đổi mật khẩu thành công!');
            passwordForm.reset();
        });
    }

    // Playlist Actions
    const playlistEditButtons = document.querySelectorAll('.playlist-actions-item .btn-icon[title="Chỉnh sửa"]');
    const playlistDeleteButtons = document.querySelectorAll('.playlist-actions-item .btn-icon[title="Xóa"]');

    playlistEditButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const playlistItem = button.closest('.playlist-item');
            const playlistName = playlistItem.querySelector('h4').textContent;
            
            // TODO: Open edit modal or redirect to edit page
            console.log('Edit playlist:', playlistName);
            alert(`Chỉnh sửa playlist: ${playlistName}`);
        });
    });

    playlistDeleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const playlistItem = button.closest('.playlist-item');
            const playlistName = playlistItem.querySelector('h4').textContent;
            
            if (confirm(`Bạn có chắc muốn xóa playlist "${playlistName}"?`)) {
                // TODO: Call API to delete playlist
                console.log('Delete playlist:', playlistName);
                playlistItem.remove();
                alert('Đã xóa playlist!');
            }
        });
    });

    // Change Cover Button
    const changeCoverBtn = document.querySelector('.btn-change-cover');
    if (changeCoverBtn) {
        changeCoverBtn.addEventListener('click', () => {
            // TODO: Open file picker for cover image
            console.log('Change cover');
            alert('Tính năng đang phát triển!');
        });
    }
});
