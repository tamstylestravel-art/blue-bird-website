const firebaseConfig = {
  apiKey: "AIzaSyCmzjgIsqDv_CFzv4nwd_Zg1j2V79R7Qus",
  authDomain: "blue-bird-pictures-studio.firebaseapp.com",
  projectId: "blue-bird-pictures-studio",
  storageBucket: "blue-bird-pictures-studio.firebasestorage.app",
  messagingSenderId: "627225426708",
  appId: "1:627225426708:web:3c9b8570ab16c1756e6001"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let currentIdToken = null;

// --- i18n Translation System ---
const translations = {
  en: {
    signInTitle: "Sign In to Hub",
    signInDesc: "Login with your Blue Bird account to access premium plugins and updates.",
    emailLabel: "Email",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    signInBtn: "Sign In",
    noAccount: "Don't have an account?",
    createAccount: "Create one here",
    enterEmailFirst: "Please enter your email first.",
    resetEmailSent: "Password reset email sent! Check your inbox.",
    resetEmailError: "Failed to send reset email. Check your email address.",
    closePremiereFirst: "⚠️ Please close Premiere Pro first before updating.",
    updateSuccess: "✅ Installed successfully!",
    updateError: "❌ Error:"
  },
  th: {
    signInTitle: "เข้าสู่ระบบ Hub",
    signInDesc: "เข้าสู่ระบบด้วยบัญชี Blue Bird เพื่อดาวน์โหลดและอัปเดตปลั๊กอิน",
    emailLabel: "อีเมล",
    passwordLabel: "รหัสผ่าน",
    forgotPassword: "ลืมรหัสผ่าน?",
    signInBtn: "เข้าสู่ระบบ",
    noAccount: "ยังไม่มีบัญชีผู้ใช้?",
    createAccount: "สมัครสมาชิก",
    enterEmailFirst: "กรุณาระบุอีเมล",
    resetEmailSent: "ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว! กรุณาตรวจสอบอีเมลของคุณ",
    resetEmailError: "ส่งอีเมลไม่สำเร็จ กรุณาตรวจสอบอีเมลอีกครั้ง",
    closePremiereFirst: "⚠️ กรุณาปิดโปรแกรม Premiere Pro ก่อนทำการอัปเดต",
    updateSuccess: "✅ อัปเดตเสร็จสมบูรณ์!",
    updateError: "❌ ข้อผิดพลาด:"
  }
};

let currentLang = localStorage.getItem('hub-lang') || 'en';

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.innerText = translations[currentLang][key];
    }
  });
  
  const langToggle = document.getElementById('btn-lang-toggle');
  if (langToggle) {
    // Show current language on the button
    langToggle.innerText = currentLang === 'en' ? 'EN' : 'TH';
  }
}

// Initial apply
applyTranslations();

// Toggle Event
const btnLangToggle = document.getElementById('btn-lang-toggle');
if (btnLangToggle) {
  btnLangToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'th' : 'en';
    localStorage.setItem('hub-lang', currentLang);
    applyTranslations();
  });
}
// -------------------------------

// UI Elements for Login
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const btnLoginText = document.getElementById('btn-login-text');
const btnLoginSpinner = document.getElementById('btn-login-spinner');
const btnProfile = document.getElementById('btn-profile');
const userEmailDisplay = btnProfile.childNodes[0]; // The text node before the SVG
const btnLogout = document.getElementById('btn-logout'); // Need to add id to logout button in index.html

// Auth State Observer
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // User is signed in
    loginScreen.classList.add('hidden');
    mainApp.classList.remove('hidden');
    
    // Update profile button text (first text node)
    userEmailDisplay.nodeValue = user.email + ' ';
    
    currentIdToken = await user.getIdToken();
    checkStatus(); // Fetch updates now that we have the token
  } else {
    // User is signed out
    loginScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
    currentIdToken = null;
  }
});

// Login Form Submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  btnLoginText.classList.add('hidden');
  btnLoginSpinner.classList.remove('hidden');
  document.getElementById('btn-login').disabled = true;
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
    // onAuthStateChanged will handle the rest
  } catch (error) {
    showToast("Login failed: " + error.message, true);
  } finally {
    btnLoginText.classList.remove('hidden');
    btnLoginSpinner.classList.add('hidden');
    document.getElementById('btn-login').disabled = false;
  }
});

// Logout logic
btnLogout.addEventListener('click', async (e) => {
  e.preventDefault();
  await auth.signOut();
});

// Toggle Password Visibility
const btnTogglePassword = document.getElementById('btn-toggle-password');
const loginPasswordInput = document.getElementById('login-password');
const iconEyeOpen = document.getElementById('icon-eye-open');
const iconEyeClosed = document.getElementById('icon-eye-closed');

if (btnTogglePassword && loginPasswordInput) {
  btnTogglePassword.addEventListener('click', () => {
    if (loginPasswordInput.type === 'password') {
      loginPasswordInput.type = 'text';
      iconEyeOpen.classList.add('hidden');
      iconEyeClosed.classList.remove('hidden');
    } else {
      loginPasswordInput.type = 'password';
      iconEyeOpen.classList.remove('hidden');
      iconEyeClosed.classList.add('hidden');
    }
  });
}

// External Links in Login
const linkForgotPassword = document.getElementById('link-forgot-password');
const linkRegister = document.getElementById('link-register');

if (linkForgotPassword) {
  linkForgotPassword.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    if (!email) {
      showToast(translations[currentLang].enterEmailFirst, "error");
      return;
    }
    
    try {
      await auth.sendPasswordResetEmail(email);
      showToast(translations[currentLang].resetEmailSent, "success");
    } catch (error) {
      console.error(error);
      showToast(translations[currentLang].resetEmailError, "error");
    }
  });
}

if (linkRegister) {
  linkRegister.addEventListener('click', (e) => {
    e.preventDefault();
    window.api.openExternal('https://bluebirdpicturesstudio.com/th/register');
  });
}

document.getElementById('btn-minimize').addEventListener('click', () => {
  window.api.minimize();
});

document.getElementById('btn-maximize').addEventListener('click', () => {
  window.api.maximize();
});

document.getElementById('link-my-account').addEventListener('click', (e) => {
  e.preventDefault();
  window.api.openExternal(`https://www.bluebirdpicturesstudio.com/${currentLang}/dashboard`);
  document.getElementById('profile-dropdown').classList.add('hidden');
});

// Window controls
document.getElementById('btn-close').addEventListener('click', () => {
  window.api.close();
});

document.getElementById('btn-footer-close').addEventListener('click', () => {
  window.api.close();
});

// Profile Dropdown Logic
const profileDropdown = document.getElementById('profile-dropdown');

btnProfile.addEventListener('click', (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!profileDropdown.contains(e.target) && !btnProfile.contains(e.target)) {
    profileDropdown.classList.add('hidden');
  }
});

function showToast(message, isError = false) {
  const toast = document.getElementById('message-toast');
  toast.innerText = message;
  toast.style.backgroundColor = isError ? '#ef4444' : '#007aff';
  toast.classList.remove('opacity-0');
  
  setTimeout(() => {
    toast.classList.add('opacity-0');
  }, 3000);
}

let pendingDownloadUrl = null;

async function checkStatus() {
  document.getElementById('product-status').innerText = "Checking...";
  
  // 1. Check local
  const local = await window.api.checkLocalVersion();
  
  if (!local.installed) {
    document.getElementById('current-version').innerText = "Not Installed";
    document.getElementById('product-status').innerText = "";
    document.getElementById('btn-main-action').classList.remove('hidden');
    document.getElementById('btn-action-text').innerText = "Install";
  } else {
    document.getElementById('current-version').innerText = `Installed v${local.version}`;
    document.getElementById('current-version').classList.remove('hidden');
    document.getElementById('product-status').innerText = `Installed with Blue Bird`;
    document.getElementById('btn-main-action').classList.add('hidden');
  }

  // 2. Check remote
  if (!currentIdToken) return; // Prevent fetching if not logged in
  
  const remote = await window.api.fetchRemoteVersion(currentIdToken);
  if (remote && remote.latestVersion && remote.downloadUrl) {
    const isUpdateAvailable = !local.installed || isNewerVersion(local.version, remote.latestVersion);
    
    if (isUpdateAvailable) {
      document.getElementById('nav-badge').classList.remove('hidden');
      document.getElementById('update-banner').classList.remove('hidden');
      document.getElementById('update-count').innerText = "1";
      
      document.getElementById('btn-main-action').classList.remove('hidden');
      document.getElementById('btn-action-text').innerText = local.installed ? "Update" : "Install";
      
      document.getElementById('whats-new-link').classList.remove('hidden');
      
      pendingDownloadUrl = remote.downloadUrl;
    } else {
      document.getElementById('nav-badge').classList.add('hidden');
      document.getElementById('update-banner').classList.add('hidden');
      document.getElementById('whats-new-link').classList.add('hidden');
    }
  }
}

function isNewerVersion(current, latest) {
  const c = current.split('.').map(Number);
  const l = latest.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
      const cv = c[i] || 0;
      const lv = l[i] || 0;
      if (lv > cv) return true;
      if (lv < cv) return false;
  }
  return false;
}

document.getElementById('btn-refresh').addEventListener('click', checkStatus);

async function performUpdate() {
  if (!pendingDownloadUrl) return;

  // Check if Premiere is running
  const isRunning = await window.api.checkPremiereRunning();
  if (isRunning) {
    document.getElementById('custom-alert-message').innerText = translations[currentLang].closePremiereFirst;
    const modal = document.getElementById('custom-alert-modal');
    modal.classList.remove('hidden');
    
    document.getElementById('btn-custom-alert-ok').onclick = () => {
      modal.classList.add('hidden');
    };
    return;
  }

  // UI changes
  document.getElementById('btn-main-action').disabled = true;
  document.getElementById('btn-main-action').classList.add('opacity-50');
  document.getElementById('btn-update-all').disabled = true;
  document.getElementById('btn-update-all').classList.add('opacity-50');
  
  document.getElementById('progress-container').classList.remove('hidden');
  document.getElementById('progress-container').classList.add('flex');
  
  // Start update
  window.api.startUpdate(pendingDownloadUrl);
}

document.getElementById('btn-main-action').addEventListener('click', performUpdate);
document.getElementById('btn-update-all').addEventListener('click', performUpdate);

// Listeners
window.api.onUpdateProgress((data) => {
  document.getElementById('progress-text').innerText = data.status;
  document.getElementById('progress-percent').innerText = `${data.percent}%`;
  document.getElementById('progress-bar').style.width = `${data.percent}%`;
});

window.api.onUpdateComplete((data) => {
  setTimeout(() => {
    document.getElementById('progress-container').classList.add('hidden');
    document.getElementById('progress-container').classList.remove('flex');
    
    document.getElementById('btn-main-action').disabled = false;
    document.getElementById('btn-main-action').classList.remove('opacity-50');
    document.getElementById('btn-update-all').disabled = false;
    document.getElementById('btn-update-all').classList.remove('opacity-50');
    
    if (data.success) {
      showToast(translations[currentLang].updateSuccess, false);
      checkStatus(); // Refresh UI
    } else {
      showToast(translations[currentLang].updateError + ": " + data.error, true);
    }
  }, 1000);
});

// Run on load
checkStatus();
