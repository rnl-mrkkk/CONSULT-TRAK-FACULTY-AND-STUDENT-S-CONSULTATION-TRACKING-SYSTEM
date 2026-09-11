/**
 * CONSULT-TRAK - Faculty and Student Consultation Tracking System
 * JavaScript functionality for login, authentication, and dashboard interactions
 */

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get element by ID with error checking
 */
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id "${id}" not found`);
    }
    return element;
}

/**
 * Show error message for a form field
 */
function showError(fieldId, message) {
    const errorElement = getElement(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Clear error message for a form field
 */
function clearError(fieldId) {
    const errorElement = getElement(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

/**
 * Clear all error messages
 */
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Store data in localStorage with error handling
 */
function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        console.warn('localStorage not available:', e);
        return false;
    }
}

/**
 * Get data from localStorage with error handling
 */
function safeLocalStorageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.warn('localStorage not available:', e);
        return null;
    }
}

/**
 * Remove data from localStorage with error handling
 */
function safeLocalStorageRemove(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.warn('localStorage not available:', e);
        return false;
    }
}

/**
 * Detect where the current page lives so relative links stay correct
 * from the repo root, /html, or a role folder.
 */
function detectLocation() {
    const path = window.location.pathname.replace(/\\/g, '/');
    if (/\/html\/(admin|faculty|student)\//i.test(path)) return 'role';
    if (/\/html\//i.test(path)) return 'html';
    return 'root';
}

function getLoginHref() {
    const loc = detectLocation();
    if (loc === 'role') return '../login.html';
    if (loc === 'html') return 'login.html';
    return 'html/login.html';
}

function getRoleDashboardHref(role) {
    const loc = detectLocation();
    if (loc === 'role') return '../' + role + '/dashboard.html';
    if (loc === 'html') return role + '/dashboard.html';
    return 'html/' + role + '/dashboard.html';
}

/**
 * Get the user's role from session
 */
function getUserRole() {
    const session = safeLocalStorageGet('userSession');
    if (!session) return null;
    try {
        const userData = JSON.parse(session);
        return userData.role;
    } catch (e) {
        return null;
    }
}

// ========================================
// AUTHENTICATION
// ========================================

/**
 * Dummy login function (for demo purposes)
 * Returns the role if credentials are valid, null otherwise
 */
function mockLogin(username, password) {
    // Demo credentials - password123 for all accounts
    const validCredentials = {
        'admin@example.com': { password: 'password123', role: 'admin', name: 'Administrator' },
        'faculty@example.com': { password: 'password123', role: 'faculty', name: 'Faculty Member' },
        'student@example.com': { password: 'password123', role: 'student', name: 'Student' }
    };

    const lowerUsername = username.toLowerCase().trim();
    const validUser = validCredentials[lowerUsername];

    if (validUser && validUser.password === password) {
        return validUser;
    }

    return null;
}

/**
 * Check if user is authenticated - redirect to login if not
 */
function requireAuth() {
    const userSession = safeLocalStorageGet('userSession');
    if (!userSession) {
        window.location.href = getLoginHref();
        return false;
    }
    return true;
}

/**
 * Ensure the signed-in user matches the folder they are viewing.
 */
function requireRole(expectedRole) {
    if (!requireAuth()) return false;
    const user = getCurrentUser();
    if (!user || user.role !== expectedRole) {
        if (user && user.role) {
            window.location.href = getRoleDashboardHref(user.role);
        } else {
            window.location.href = getLoginHref();
        }
        return false;
    }
    return true;
}

/**
 * Get current user data from session
 */
function getCurrentUser() {
    const userSession = safeLocalStorageGet('userSession');
    if (!userSession) return null;
    try {
        return JSON.parse(userSession);
    } catch (e) {
        return null;
    }
}

// ========================================
// LOGIN PAGE FUNCTIONALITY
// ========================================

/**
 * Initialize login page
 */
function initLoginPage() {
    const loginForm = getElement('loginForm');
    const passwordToggle = getElement('passwordToggle');
    const rememberMeCheckbox = getElement('rememberMe');
    const forgotPasswordLink = getElement('forgotPassword');

    if (!loginForm) return;

    // Password show/hide toggle
    if (passwordToggle) {
        passwordToggle.addEventListener('click', handlePasswordToggle);
    }

    // Form submission
    loginForm.addEventListener('submit', handleLoginSubmit);

    // Remember me - restore saved username if exists
    const savedUsername = safeLocalStorageGet('rememberedUsername');
    if (savedUsername && rememberMeCheckbox) {
        const usernameField = getElement('username');
        if (usernameField) {
            usernameField.value = savedUsername;
            rememberMeCheckbox.checked = true;
        }
    }

    // Forgot password link
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }

    // Real-time validation on input
    const usernameField = getElement('username');
    const passwordField = getElement('password');

    if (usernameField) {
        usernameField.addEventListener('input', () => clearError('username'));
    }
    if (passwordField) {
        passwordField.addEventListener('input', () => clearError('password'));
    }
}

/**
 * Toggle password visibility
 */
function handlePasswordToggle() {
    const passwordField = getElement('password');
    const toggleIcon = document.querySelector('.toggle-icon');

    if (!passwordField) return;

    const eyeOpen = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    const eyeClosed = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        if (toggleIcon) toggleIcon.innerHTML = eyeClosed;
    } else {
        passwordField.type = 'password';
        if (toggleIcon) toggleIcon.innerHTML = eyeOpen;
    }
}

/**
 * Validate login form
 */
function validateLoginForm(username, password) {
    let isValid = true;
    clearAllErrors();

    // Validate username/email
    if (!username || username.trim() === '') {
        showError('username', 'Email is required');
        isValid = false;
    } else if (username.includes('@') && !isValidEmail(username)) {
        showError('username', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password
    if (!password || password.trim() === '') {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 4) {
        showError('password', 'Password must be at least 4 characters');
        isValid = false;
    }

    return isValid;
}

/**
 * Handle login form submission
 */
function handleLoginSubmit(event) {
    event.preventDefault();

    const usernameField = getElement('username');
    const passwordField = getElement('password');
    const rememberMeCheckbox = getElement('rememberMe');
    const loginBtn = getElement('loginBtn');

    if (!usernameField || !passwordField) return;

    const username = usernameField.value;
    const password = passwordField.value;
    const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;

    // Validate form
    if (!validateLoginForm(username, password)) {
        return;
    }

    // Show loading state
    if (loginBtn) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
    }

    // Mock login - simulate API call delay
    setTimeout(() => {
        const userData = mockLogin(username, password);

        if (userData) {
            // Handle "Remember Me"
            if (rememberMe) {
                safeLocalStorageSet('rememberedUsername', username);
            } else {
                safeLocalStorageRemove('rememberedUsername');
            }

            // Store user session
            safeLocalStorageSet('userSession', JSON.stringify({
                username: username,
                role: userData.role,
                name: userData.name,
                loginTime: new Date().toISOString()
            }));

            // Redirect to role-specific dashboard
            window.location.href = getRoleDashboardHref(userData.role);
        } else {
            // Show error
            showError('password', 'Invalid credentials. Please try again.');

            // Reset loading state
            if (loginBtn) {
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
        }
    }, 800);
}

/**
 * Handle forgot password click
 */
function handleForgotPassword(event) {
    event.preventDefault();
    alert('Password reset functionality would be implemented here.\n\nDemo accounts:\n• admin@example.com / password123\n• faculty@example.com / password123\n• student@example.com / password123');
}

// ========================================
// DASHBOARD PAGE FUNCTIONALITY
// ========================================

/**
 * Initialize dashboard page
 */
function initDashboardPage() {
    const logoutBtn = getElement('logoutBtn');

    // Check if user is logged in
    if (!requireAuth()) {
        return;
    }

    const userData = getCurrentUser();
    if (!userData) {
        window.location.href = getLoginHref();
        return;
    }

    const pageRole = document.body.getAttribute('data-role');
    if (pageRole && userData.role !== pageRole) {
        window.location.href = getRoleDashboardHref(userData.role);
        return;
    }

    // Display user info
    const userNameEl = getElement('userName');
    if (userNameEl && userData.name) {
        userNameEl.textContent = userData.name;
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Highlight current page in sidebar
    highlightCurrentPage();
}

/**
 * Highlight the current page in the sidebar
 */
function highlightCurrentPage() {
    const path = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && path.includes(href.replace('.html', ''))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Handle logout
 */
function handleLogout(event) {
    event.preventDefault();

    const confirmLogout = confirm('Are you sure you want to log out?');

    if (confirmLogout) {
        safeLocalStorageRemove('userSession');
        window.location.href = getLoginHref();
    }
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize the appropriate page based on current location
 */
function initializePage() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const isLoginPage = document.body.classList.contains('login-body');

        if (isLoginPage) {
            initLoginPage();
        } else {
            initDashboardPage();
        }
    }
}

// Start initialization
initializePage();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        validateLoginForm,
        mockLogin,
        getCurrentUser,
        requireAuth
    };
}