/* --- UPDATED & 100% RELIABLE CLERK AUTH FLOW --- */

// Modal open hote hi Clerk ka official login box khulega
function openLoginModal() {
  if (window.Clerk) {
    window.Clerk.openSignIn();
  } else {
    alert('Authentication load ho raha hai, kripya 2 second ruk kar dubara click karein.');
  }
}

// Google / Facebook direct click handler
async function triggerOAuth(provider) {
  if (!window.Clerk) {
    alert('Authentication service load ho rahi hai...');
    return;
  }
  // Native Clerk SignIn open karega jisme Google direct integrate hota hai
  window.Clerk.openSignIn();
}

function handleAuthSubmit(e, mode) {
  e.preventDefault();
  if (window.Clerk) {
    if (mode === 'login') {
      window.Clerk.openSignIn();
    } else {
      window.Clerk.openSignUp();
    }
  }
}

/* --- CLERK INITIALIZATION & STATE CHECK --- */
function checkAuthState() {
  if (!window.Clerk) return;
  const loginBtn = document.getElementById('open-login-btn');
  const userBtnDiv = document.getElementById('user-button');

  if (window.Clerk.user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userBtnDiv) {
      userBtnDiv.style.display = 'block';
      userBtnDiv.innerHTML = '';
      window.Clerk.mountUserButton(userBtnDiv, {
        afterSignOutUrl: window.location.href
      });
    }
    
    // Custom modal agar open ho toh close karein
    closeLoginModal();

    // Form me user details auto-fill
    if (window.Clerk.user.fullName && !document.getElementById('name').value) {
      document.getElementById('name').value = window.Clerk.user.fullName;
    }
    if (window.Clerk.user.primaryEmailAddress && !document.getElementById('email').value) {
      document.getElementById('email').value = window.Clerk.user.primaryEmailAddress.emailAddress;
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (userBtnDiv) userBtnDiv.style.display = 'none';
  }
}

window.addEventListener('load', () => {
  const clerkCheck = setInterval(() => {
    if (window.Clerk) {
      clearInterval(clerkCheck);
      if (typeof window.Clerk.load === 'function') {
        window.Clerk.load().then(() => {
          checkAuthState();
          if (window.Clerk.addListener) {
            window.Clerk.addListener(checkAuthState);
          }
        });
      }
    }
  }, 100);
});
