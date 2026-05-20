/* =============================================
   ProWorkspace – Login Page Scripts
   ============================================= */

(function () {
  'use strict';

  /* ---------- Element References ---------- */
  const form        = document.getElementById('loginForm');
  const emailInput  = document.getElementById('email');
  const passInput   = document.getElementById('password');
  const togglePwBtn = document.getElementById('togglePw');
  const eyeIcon     = document.getElementById('eyeIcon');
  const emailError  = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const signInBtn   = document.getElementById('signInBtn');
  const btnText     = signInBtn.querySelector('.btn-text');
  const btnSpinner  = document.getElementById('btnSpinner');

  /* ---------- Password Visibility Toggle ---------- */
  togglePwBtn.addEventListener('click', function () {
    const isHidden = passInput.type === 'password';
    passInput.type = isHidden ? 'text' : 'password';

    // Swap eye icon between open and closed
    eyeIcon.innerHTML = isHidden
      ? /* eye-off */
        `<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.09 18.09 0 0 1 5.06-6.94"/>
         <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
         <line x1="1" y1="1" x2="23" y2="23"/>`
      : /* eye */
        `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
         <circle cx="12" cy="12" r="3"/>`;
  });

  /* ---------- Inline Validation Helpers ---------- */
  function validateEmail(value) {
    if (!value.trim()) return 'Email address is required.';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return 'Please enter a valid email address.';
    return '';
  }

  function validatePassword(value) {
    if (!value) return 'Password is required.';
    if (value.length < 6) return 'Password must be at least 6 characters.';
    return '';
  }

  function showError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    if (message) {
      inputEl.classList.add('error');
    } else {
      inputEl.classList.remove('error');
    }
  }

  /* Live validation on blur */
  emailInput.addEventListener('blur', function () {
    showError(emailInput, emailError, validateEmail(emailInput.value));
  });

  passInput.addEventListener('blur', function () {
    // Only validate if the field was actually changed from the demo value
    if (passInput.value !== '••••••••') {
      showError(passInput, passwordError, validatePassword(passInput.value));
    }
  });

  /* Clear error on input */
  emailInput.addEventListener('input', function () {
    if (emailError.textContent) {
      showError(emailInput, emailError, validateEmail(emailInput.value));
    }
  });

  passInput.addEventListener('input', function () {
    if (passwordError.textContent) {
      showError(passInput, passwordError, validatePassword(passInput.value));
    }
  });

  /* ---------- Form Submission ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const emailMsg = validateEmail(emailInput.value);
    const passMsg  = passInput.value === '••••••••' ? '' : validatePassword(passInput.value);

    showError(emailInput, emailError, emailMsg);
    showError(passInput, passwordError, passMsg);

    if (emailMsg || passMsg) return; // Stop if errors exist

    setLoading(true);

    // Simulate async sign-in request (replace with real API call)
    setTimeout(function () {
      setLoading(false);
      setSuccess();
    }, 1800);
  });

  /* ---------- UI State Helpers ---------- */
  function setLoading(isLoading) {
    signInBtn.disabled = isLoading;
    btnText.hidden     = isLoading;
    btnSpinner.hidden  = !isLoading;
  }

  function setSuccess() {
    signInBtn.classList.add('success');
    btnText.hidden    = false;
    btnSpinner.hidden = true;
    btnText.textContent = '✓  Signed In';

    // Reset after 2.5s (for demo purposes)
    setTimeout(function () {
      signInBtn.classList.remove('success');
      btnText.textContent = 'Sign In';
      signInBtn.disabled  = false;
    }, 2500);
  }
function setSuccess() {
 
  setTimeout(function () {
    window.location.href = 'dashboard.html'; // 👈 redirect after login
  }, 1000);
}
})();