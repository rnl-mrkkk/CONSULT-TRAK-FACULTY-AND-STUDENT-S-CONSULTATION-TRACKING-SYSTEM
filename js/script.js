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
 * Escape text for safe interpolation into innerHTML.
 * Use for any value that originates from a form, localStorage, or
 * the session - user-supplied data must never reach innerHTML raw.
 */
function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

window.escapeHtml = escapeHtml;

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

// The account store written by the admin screens (FR1/FR2)
const ACCOUNTS_STORAGE_KEY = 'ct_accounts';
// Shared default password for every account in this demo system
const DEFAULT_PASSWORD = 'dummy123';

/**
 * Canonical first-run account seed.
 *
 * This lives in script.js (loaded on every page, including login) so the demo
 * accounts exist before any admin page is opened. Without it a fresh browser
 * could never log in, because the admin page that would otherwise seed the
 * store is itself behind a login.
 */
const SEED_ACCOUNTS = [
    { id: 1, name: 'John Smith', email: 'student@dummy.com', role: 'student', status: 'active', department: 'Computer Science', studentId: 'STU001', createdAt: '2025-09-01' },
    { id: 2, name: 'Emily Davis', email: 'emily.davis@dummy.com', role: 'student', status: 'active', department: 'Engineering', studentId: 'STU002', createdAt: '2025-09-02' },
    { id: 3, name: 'Mr. Jaafar Omar', email: 'faculty@dummy.com', role: 'faculty', status: 'active', department: 'SOCS', createdAt: '2024-01-15' },
    { id: 4, name: 'Mrs. Elsie Ybanez', email: 'elsie.ybanez@dummy.com', role: 'faculty', status: 'active', department: 'SOCS', createdAt: '2024-01-20' },
    { id: 5, name: 'David Lee', email: 'david.lee@dummy.com', role: 'student', status: 'inactive', department: 'Physics', studentId: 'STU003', createdAt: '2025-09-05' },
    { id: 6, name: 'Dr. Julito V. Mandac Jr.', email: 'julito.mandac@dummy.com', role: 'faculty', status: 'active', department: 'SBM', createdAt: '2024-02-01' },
    { id: 7, name: 'Robert Garcia', email: 'robert.garcia@dummy.com', role: 'student', status: 'active', department: 'Biology', studentId: 'STU004', createdAt: '2025-09-10' },
    { id: 8, name: 'Mrs. Shinikie Dangasi', email: 'shinikie.dangasi@dummy.com', role: 'faculty', status: 'active', department: 'SOCS', createdAt: '2024-02-15' },
    { id: 9, name: 'Administrator', email: 'admin@dummy.com', role: 'admin', status: 'active', department: 'Administration', createdAt: '2024-01-01' }
];

// Single source of truth shared with the admin page
if (typeof window !== 'undefined') window.ctSeedAccounts = SEED_ACCOUNTS;

/**
 * Read the account store, seeding the demo accounts on first run.
 */
function readAccounts() {
    try {
        const stored = safeLocalStorageGet(ACCOUNTS_STORAGE_KEY);
        if (!stored) {
            const seed = JSON.parse(JSON.stringify(SEED_ACCOUNTS));
            safeLocalStorageSet(ACCOUNTS_STORAGE_KEY, JSON.stringify(seed));
            return seed;
        }
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
        return null;
    }
}

/**
 * Look up credentials in the account store.
 *
 * Every account in this system shares one demo password, so authentication
 * checks the account exists and is active rather than comparing a stored
 * secret. This is a demo-grade check, not real security.
 *
 * @returns {{role, name, studentId, department, accountId, needsPasswordReset}|null}
 */
function mockLogin(username, password) {
    const lowerUsername = String(username || '').toLowerCase().trim();
    if (!lowerUsername || !password) return null;

    const accounts = readAccounts();
    if (!accounts) return null;

    const account = accounts.find(a => String(a.email || '').toLowerCase() === lowerUsername);
    if (!account) return null;

    // Deactivated accounts cannot sign in
    if (account.status === 'inactive') return { deactivated: true };

    if (password !== DEFAULT_PASSWORD) return null;

    return {
        role: account.role,
        name: account.name,
        studentId: account.studentId || null,
        department: account.department || null,
        accountId: account.id
    };
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

        if (userData && userData.deactivated) {
            showError('username', 'This account has been deactivated. Please contact the administrator.');
            resetLoginButton(loginBtn);
            return;
        }

        if (userData) {
            // Handle "Remember Me"
            if (rememberMe) {
                safeLocalStorageSet('rememberedUsername', username);
            } else {
                safeLocalStorageRemove('rememberedUsername');
            }

            // Store user session
            safeLocalStorageSet('userSession', JSON.stringify({
                username: username.toLowerCase().trim(),
                role: userData.role,
                name: userData.name,
                studentId: userData.studentId,
                department: userData.department,
                accountId: userData.accountId,
                loginTime: new Date().toISOString()
            }));

            // Keep the faculty profile in sync so availability records
            // can be attributed to the signed-in member (FR5/FR7)
            if (userData.role === 'faculty') {
                safeLocalStorageSet('ct_faculty_info', JSON.stringify({
                    name: userData.name,
                    email: username.toLowerCase().trim(),
                    department: userData.department
                }));
            }

            // Redirect to role-specific dashboard
            window.location.href = getRoleDashboardHref(userData.role);
        } else {
            // Show error
            showError('password', 'Invalid credentials. Please try again.');

            // Reset loading state
            resetLoginButton(loginBtn);
        }
    }, 800);
}

function resetLoginButton(loginBtn) {
    if (loginBtn) {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
}

/**
 * Handle forgot password click
 */
function handleForgotPassword(event) {
    event.preventDefault();
    alert('Password reset is not available in this demo.\n\nAll accounts use the password: dummy123\n\nDemo accounts:\n• admin@dummy.com\n• faculty@dummy.com\n• student@dummy.com');
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
    const sidebarNameEl = document.querySelector('.sidebar-user-name');
    if (sidebarNameEl && userData.name) {
        sidebarNameEl.textContent = userData.name;
    }
    const sidebarAvatarEl = document.querySelector('.sidebar-user-avatar');
    if (sidebarAvatarEl && userData.name) {
        const initials = userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        sidebarAvatarEl.textContent = initials || 'U';
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
// PAGE ACCESS CONTROL
// ========================================

/**
 * Guard every page before it renders (FR2).
 *
 * Redirects to the login page when there is no session, and to the user's own
 * dashboard when they try to open a page belonging to another role. Returns
 * false so callers can stop running page scripts.
 *
 * @returns {boolean}
 */
function requireRoleForPage() {
    if (!requireAuth()) return false;

    const user = getCurrentUser();
    if (!user) {
        window.location.href = getLoginHref();
        return false;
    }

    const pageRole = document.body.getAttribute('data-role');
    if (pageRole && user.role !== pageRole) {
        window.location.href = getRoleDashboardHref(user.role);
        return false;
    }

    // FR2: hide navigation the current role cannot use
    applyRoleNavigation(user.role);
    return true;
}

/**
 * Hide sidebar links the signed-in role cannot reach, so the GUI does not
 * offer pages that the role check would block anyway.
 */
function applyRoleNavigation(role) {
    const allowed = ROLE_NAV[role] || [];
    document.querySelectorAll('.nav-item').forEach(link => {
        const href = link.getAttribute('href') || '';
        const isAllowed = allowed.some(page => href.includes(page));
        if (!isAllowed) {
            link.style.display = 'none';
        }
    });
}

/**
 * Page filenames each role is allowed to open.
 * Used by applyRoleNavigation to hide unreachable menu entries.
 */
const ROLE_NAV = {
    student: ['dashboard.html', 'my-requests.html', 'faculty-availability.html', 'appointments.html', 'history.html'],
    faculty: ['dashboard.html', 'consultation-requests.html', 'availability.html', 'consultation-records.html', 'history.html', 'reports.html'],
    admin: ['dashboard.html', 'manage-accounts.html', 'consultation-records.html', 'reports.html']
};

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
            // FR2: block the page from rendering for anyone without the right role
            if (!requireRoleForPage()) {
                return;
            }
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
        requireAuth,
        requireRole,
        requireRoleForPage
    };
}