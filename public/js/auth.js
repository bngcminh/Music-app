// ========== Password Toggle ==========
document.querySelectorAll('.password-toggle').forEach(button => {
  button.addEventListener('click', function() {
    const wrapper = this.closest('.password-wrapper');
    const input = wrapper.querySelector('.form-control');
    const icon = this.querySelector('i');
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
});

// ========== Password Strength Checker ==========
const passwordInput = document.getElementById('password');
const strengthContainer = document.querySelector('.password-strength');
const strengthFill = document.querySelector('.strength-fill');
const strengthText = document.querySelector('.strength-text');

if (passwordInput && strengthContainer) {
  passwordInput.addEventListener('input', function() {
    const password = this.value;
    
    if (password.length === 0) {
      strengthContainer.classList.remove('show');
      return;
    }
    
    strengthContainer.classList.add('show');
    
    let strength = 0;
    let strengthLabel = 'Yếu';
    let strengthClass = 'weak';
    
    // Check password strength
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    // Determine strength level
    if (strength <= 1) {
      strengthLabel = 'Yếu';
      strengthClass = 'weak';
    } else if (strength === 2 || strength === 3) {
      strengthLabel = 'Trung bình';
      strengthClass = 'medium';
    } else {
      strengthLabel = 'Mạnh';
      strengthClass = 'strong';
    }
    
    // Update UI
    strengthFill.className = 'strength-fill ' + strengthClass;
    strengthText.textContent = 'Mật khẩu: ' + strengthLabel;
  });
}

// ========== Form Validation ==========
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Login Form Validation
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!username || !password) {
      showAlert('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('.btn-primary');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // TODO: Submit to backend
    // For now, just simulate
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      
      // Uncomment when backend is ready
      this.submit();
      console.log('Login data:', { username, password });
    }, 1500);
  });
}

// Register Form Validation
if (registerForm) {
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const agree = document.querySelector('input[name="agree"]').checked;
    
    // Validation
    let hasError = false;
    
    if (!username || username.length < 3) {
      showAlert('Tên hiển thị phải có ít nhất 3 ký tự', 'error');
      hasError = true;
    }
    
    if (!validateEmail(email)) {
      showAlert('Email không hợp lệ', 'error');
      hasError = true;
    }
    
    if (password.length < 6) {
      showAlert('Mật khẩu phải có ít nhất 6 ký tự', 'error');
      hasError = true;
    }
    
    if (password !== confirmPassword) {
      showAlert('Mật khẩu xác nhận không khớp', 'error');
      hasError = true;
    }
    
    if (!agree) {
      showAlert('Vui lòng đồng ý với điều khoản dịch vụ', 'error');
      hasError = true;
    }
    
    if (hasError) return;
    
    // Show loading state
    const submitBtn = this.querySelector('.btn-primary');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // TODO: Submit to backend
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      
      // Uncomment when backend is ready
      this.submit();
      console.log('Register data:', { username, email, password });
    }, 1500);
  });
}

// ========== Helper Functions ==========
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showAlert(message, type = 'error') {
  // Remove existing alerts
  const existingAlert = document.querySelector('.alert');
  if (existingAlert) existingAlert.remove();
  
  // Create alert
  const alert = document.createElement('div');
  alert.className = `alert ${type} show`;
  alert.innerHTML = `
    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Insert before form
  const form = document.querySelector('.auth-form');
  form.parentNode.insertBefore(alert, form);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(), 300);
  }, 5000);
}

