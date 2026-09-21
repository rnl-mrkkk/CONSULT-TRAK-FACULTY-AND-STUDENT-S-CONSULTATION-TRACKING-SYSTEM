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
 * Generic line icons (same stroke style as the login fields)
 */
const ICON_PATHS = {
    brand: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M3 10h18"/>',
    home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v11h14V10"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h2M3 12h2M3 18h2"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16v-5M12 16V8M17 16v-9"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    history: '<path d="M3 3v6h6"/><path d="M3.51 9a9 9 0 1 0 2.13-5.36"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
    hourglass: '<path d="M6 2h12M6 22h12"/><path d="M8 2v3a4 4 0 0 0 4 4 4 4 0 0 0 4-4V2"/><path d="M8 22v-3a4 4 0 0 1 4-4 4 4 0 0 1 4 4v3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    pin: '<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>'
};

function ctIcon(name, size) {
    const inner = ICON_PATHS[name];
    if (!inner) return '';
    const s = size || 20;
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

window.ctIcon = ctIcon;

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
    // Demo credentials - dummy123 for all accounts
    const validCredentials = {
        'admin@dummy.com': { password: 'dummy123', role: 'admin', name: 'Administrator' },
        'faculty@dummy.com': { password: 'dummy123', role: 'faculty', name: 'Faculty Member' },
        'student@dummy.com': { password: 'dummy123', role: 'student', name: 'Student' }
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
    alert('Password reset functionality would be implemented here.\n\nDemo accounts:\n• admin@dummy.com / dummy123\n• faculty@dummy.com / dummy123\n• student@dummy.com / dummy123');
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

    // Initialize notification bell
    initNotifications();
}

// ========================================
// NOTIFICATIONS
// ========================================

/**
 * Mock notification data by role
 */
const NOTIFICATIONS_BY_ROLE = {
    student: [
        { id: 1, text: 'Your consultation request with Dr. Mandac has been approved.', time: '2 min ago', type: 'success', unread: true },
        { id: 2, text: 'Appointment reminder: Meeting with Mrs. Ybanez tomorrow at 10:00 AM.', time: '15 min ago', type: 'warning', unread: true },
        { id: 3, text: 'New consultation schedule available for next week.', time: '1 hour ago', type: 'info', unread: true },
        { id: 4, text: 'Your consultation request with Mrs. Dangasi is pending review.', time: '3 hours ago', type: 'info', unread: false },
        { id: 5, text: 'Consultation record for "Data Structures" has been archived.', time: '1 day ago', type: 'info', unread: false }
    ],
    faculty: [
        { id: 1, text: 'New consultation request from John Smith — Course Requirements.', time: '5 min ago', type: 'warning', unread: true },
        { id: 2, text: 'Emily Davis requested a thesis advising session.', time: '20 min ago', type: 'warning', unread: true },
        { id: 3, text: 'Schedule update: Your availability for Friday has been modified.', time: '1 hour ago', type: 'info', unread: true },
        { id: 4, text: 'Robert Garcia confirmed the appointment for tomorrow.', time: '2 hours ago', type: 'success', unread: false },
        { id: 5, text: 'Monthly consultation report is ready for download.', time: '1 day ago', type: 'info', unread: false }
    ],
    admin: [
        { id: 1, text: 'New faculty account registered: Dr. Julito Mandac.', time: '10 min ago', type: 'success', unread: true },
        { id: 2, text: 'System backup completed successfully.', time: '30 min ago', type: 'success', unread: true },
        { id: 3, text: '3 consultation records require review.', time: '1 hour ago', type: 'warning', unread: true },
        { id: 4, text: 'Monthly usage report is now available.', time: '3 hours ago', type: 'info', unread: false },
        { id: 5, text: 'Account inactive: David Lee has been deactivated.', time: '1 day ago', type: 'info', unread: false }
    ]
};

const NOTIFICATION_ICON_SVG = {
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
    warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
};

/**
 * Initialize notification bell on all pages
 */
function initNotifications() {
    const bells = document.querySelectorAll('.notification-bell');
    if (!bells.length) return;

    const pageRole = document.body.getAttribute('data-role') || 'student';
    const notifications = NOTIFICATIONS_BY_ROLE[pageRole] || NOTIFICATIONS_BY_ROLE.student;
    const unreadCount = notifications.filter(n => n.unread).length;

    bells.forEach(bell => {
        // Update badge
        const badge = bell.querySelector('.badge');
        if (badge) {
            badge.textContent = unreadCount;
            if (unreadCount === 0) badge.classList.add('hidden');
        }

        // Build panel
        const panel = document.createElement('div');
        panel.className = 'notification-panel';
        panel.innerHTML = buildNotificationHTML(notifications);
        bell.appendChild(panel);

        // Toggle on bell click
        bell.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = panel.classList.contains('open');
            closeAllNotifications();
            if (!isOpen) panel.classList.add('open');
        });

        // Mark all read
        const markBtn = panel.querySelector('.mark-read-btn');
        if (markBtn) {
            markBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                markAllRead(panel, bell);
            });
        }
    });

    // Close on outside click
    document.addEventListener('click', closeAllNotifications);
}

/**
 * Build notification list HTML
 */
function buildNotificationHTML(notifications) {
    const items = notifications.map(n => `
        <div class="notification-item ${n.unread ? 'unread' : ''}" data-id="${n.id}">
            <div class="notification-icon ${n.type}">${NOTIFICATION_ICON_SVG[n.type]}</div>
            <div class="notification-body">
                <div class="notification-text">${n.text}</div>
                <div class="notification-time">${n.time}</div>
            </div>
        </div>
    `).join('');

    return `
        <div class="notification-header">
            <span>Notifications</span>
            <button class="mark-read-btn">Mark all read</button>
        </div>
        <div class="notification-list">${items}</div>
    `;
}

/**
 * Close all notification panels
 */
function closeAllNotifications() {
    document.querySelectorAll('.notification-panel.open').forEach(p => p.classList.remove('open'));
}

/**
 * Mark all notifications as read
 */
function markAllRead(panel, bell) {
    panel.querySelectorAll('.notification-item.unread').forEach(item => item.classList.remove('unread'));
    const badge = bell.querySelector('.badge');
    if (badge) badge.classList.add('hidden');
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