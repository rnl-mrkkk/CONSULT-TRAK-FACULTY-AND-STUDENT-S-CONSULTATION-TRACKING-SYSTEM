/**
 * CONSULT-TRAK - Admin Dashboard JavaScript
 * Account store, consultation reads, and report data for all admin pages
 */

// ========================================
// STORAGE KEYS (shared with student/faculty)
// ========================================

const ADMIN_STORAGE_KEYS = {
    REQUESTS: 'ct_faculty_requests',
    RECORDS: 'ct_faculty_records',
    ACCOUNTS: 'ct_accounts',
    FACULTY_AVAILABILITY: 'ct_faculty_availability'
};

// ========================================
// DEFAULT DATA
// ========================================

// First-run seed comes from script.js so login works before any admin page
// has been opened. The local list is only a fallback for a standalone load.
const DEFAULT_ACCOUNTS = (typeof window !== 'undefined' && Array.isArray(window.ctSeedAccounts))
    ? window.ctSeedAccounts
    : [
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

const adminData = {
    // Overview stats
    stats: {
        totalAccounts: 156,
        totalStudents: 120,
        totalFaculty: 32,
        totalAdmins: 4,
        pendingRequests: 8,
        completedToday: 12,
        activeConsultations: 45
    },

    // Recent activity
    recentActivity: [
        { id: 1, action: 'New account created', user: 'Amanda White', role: 'student', time: '10 minutes ago' },
        { id: 2, action: 'Consultation completed', user: 'John Smith', role: 'student', time: '1 hour ago' },
        { id: 3, action: 'Request accepted', user: 'Emily Davis', faculty: 'Mr. Jaafar Omar', time: '2 hours ago' },
        { id: 4, action: 'New consultation request', user: 'Robert Garcia', role: 'student', time: '3 hours ago' },
        { id: 5, action: 'Account deactivated', user: 'David Lee', role: 'student', time: '1 day ago' }
    ]
};

// ========================================
// STORAGE HELPERS
// ========================================

function safeGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.warn(`Error reading ${key}:`, e);
        return null;
    }
}

function safeSet(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        console.warn(`Error writing ${key}:`, e);
        return false;
    }
}

function readArray(key, fallback) {
    const stored = safeGet(key);
    if (!stored) return null;
    try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
        return null;
    }
}

/**
 * Load accounts, seeding the store on first run (FR1).
 */
function loadAccounts() {
    let accounts = readArray(ADMIN_STORAGE_KEYS.ACCOUNTS, null);
    if (!accounts) {
        accounts = JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS));
        safeSet(ADMIN_STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    }
    return accounts;
}

function saveAccounts(accounts) {
    return safeSet(ADMIN_STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
}

/**
 * Read a shared array, or null when the key has never been written.
 * Distinguishing "absent" from "empty" matters for empty-state accuracy.
 */
function readSharedArray(key) {
    return readArray(key, null);
}

// ========================================
// TIME / DATE HELPERS
// ========================================

/**
 * Parse "2026-09-15" safely (avoids timezone drift from new Date(str)).
 */
function parseISODate(value) {
    if (!value) return null;
    const match = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const date = new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
    if (isNaN(date.getTime())) return null;
    return date;
}

/**
 * Format a Date as YYYY-MM-DD in local time.
 */
function toISODate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getTodayISO() {
    return toISODate(new Date());
}

/**
 * Resolve a request/record to the date it is scheduled or occurred on.
 */
function resolveEntryDate(entry) {
    return entry.confirmedDate || entry.preferredDate || entry.date || null;
}

// ========================================
// CONSULTATION DATA (FR11 - admin sees real data)
// ========================================

/**
 * System-wide consultation rows, merged from live requests and records.
 * Combines the request lifecycle (pending/rejected/cancelled) with archived
 * consultation records so a single search covers every outcome.
 * @param {Object} [filters] Optional { search, status, faculty, dateFrom, dateTo }
 */
function getConsultationData(filters = {}) {
    const requests = readSharedArray(ADMIN_STORAGE_KEYS.REQUESTS) || [];
    const records = readSharedArray(ADMIN_STORAGE_KEYS.RECORDS) || [];

    const rows = [];

    requests.forEach(r => {
        rows.push({
            id: `R-${r.id}`,
            requestId: r.id,
            source: 'request',
            student: r.student || 'Unknown',
            studentId: r.studentId || '',
            faculty: r.faculty || 'Unassigned',
            subject: r.subject || 'General Consultation',
            date: resolveEntryDate(r),
            time: r.confirmedTime || r.preferredTime || '',
            status: r.status || 'pending',
            notes: r.concern || r.outcomeNotes || r.rejectionReason || r.cancellationReason || '',
            concerns: r.concern || '',
            recommendations: r.outcomeNotes || ''
        });
    });

    records.forEach(rec => {
        rows.push({
            id: `C-${rec.id}`,
            requestId: rec.requestId || null,
            source: 'record',
            student: rec.student || 'Unknown',
            studentId: rec.studentId || '',
            faculty: rec.faculty || 'Unassigned',
            subject: rec.subject || 'General Consultation',
            date: resolveEntryDate(rec),
            time: rec.time || '',
            status: rec.status || 'completed',
            notes: rec.concerns || '',
            concerns: rec.concerns || '',
            recommendations: rec.recommendations || ''
        });
    });

    return applyConsultationFilters(rows, filters);
}

/**
 * Shared search/filter logic for admin and faculty record screens (FR11).
 */
function applyConsultationFilters(rows, filters = {}) {
    const search = (filters.search || '').trim().toLowerCase();
    const status = filters.status || 'all';
    const faculty = filters.faculty || 'all';
    const dateFrom = filters.dateFrom || '';
    const dateTo = filters.dateTo || '';

    return rows.filter(row => {
        if (status !== 'all' && row.status !== status) return false;
        if (faculty !== 'all' && row.faculty !== faculty) return false;
        if (dateFrom && (!row.date || row.date < dateFrom)) return false;
        if (dateTo && (!row.date || row.date > dateTo)) return false;

        if (search) {
            const haystack = [
                row.student, row.studentId, row.faculty, row.subject,
                row.notes, row.concerns, row.recommendations
            ].filter(Boolean).join(' ').toLowerCase();
            if (haystack.indexOf(search) === -1) return false;
        }
        return true;
    });
}

/**
 * Distinct faculty names present in the consultation data, for filter dropdowns.
 */
function getFacultyList(rows) {
    const names = (rows || []).map(r => r.faculty).filter(Boolean);
    return Array.from(new Set(names)).sort();
}

// ========================================
// ACCOUNTS (FR1)
// ========================================

/**
 * Get account data for table display
 */
function getAccountData() {
    return loadAccounts();
}

/**
 * Get stats for dashboard, derived from live data where available.
 */
function getStats() {
    const accounts = loadAccounts();
    const requests = readSharedArray(ADMIN_STORAGE_KEYS.REQUESTS);
    const records = readSharedArray(ADMIN_STORAGE_KEYS.RECORDS);

    const active = accounts.filter(a => a.status === 'active');
    const today = getTodayISO();

    const pendingRequests = requests
        ? requests.filter(r => r.status === 'pending').length
        : adminData.stats.pendingRequests;

    const completedToday = records
        ? records.filter(r => r.status === 'completed' && resolveEntryDate(r) === today).length
        : adminData.stats.completedToday;

    const activeConsultations = requests
        ? requests.filter(r => r.status === 'scheduled').length
        : adminData.stats.activeConsultations;

    return {
        totalAccounts: accounts.length,
        totalStudents: accounts.filter(a => a.role === 'student').length,
        totalFaculty: accounts.filter(a => a.role === 'faculty').length,
        totalAdmins: accounts.filter(a => a.role === 'admin').length,
        activeAccounts: active.length,
        inactiveAccounts: accounts.length - active.length,
        pendingRequests,
        completedToday,
        activeConsultations
    };
}

/**
 * Get recent activity
 */
function getRecentActivity() {
    return adminData.recentActivity;
}

/**
 * Validate account input (FR1).
 * @returns {{ok: true}|{ok: false, message: string}}
 */
function validateAccount(account, existingId) {
    const name = (account.name || '').trim();
    const email = (account.email || '').trim().toLowerCase();
    const department = (account.department || '').trim();

    if (!name) return { ok: false, message: 'Full name is required.' };
    if (!email) return { ok: false, message: 'Email is required.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { ok: false, message: 'Please enter a valid email address.' };
    }
    if (!department) return { ok: false, message: 'Department is required.' };
    if (!['student', 'faculty', 'admin'].includes(account.role)) {
        return { ok: false, message: 'Please choose a valid role.' };
    }

    const accounts = loadAccounts();
    const duplicate = accounts.find(a =>
        a.email.toLowerCase() === email && parseInt(a.id, 10) !== parseInt(existingId, 10)
    );
    if (duplicate) {
        return { ok: false, message: `An account with ${email} already exists.` };
    }

    return { ok: true };
}

/**
 * Add a new account and persist it (FR1).
 * @returns {number|{error: string}} new account id, or a validation error
 */
function addAccount(account) {
    const validation = validateAccount(account, null);
    if (!validation.ok) return { error: validation.message };

    const accounts = loadAccounts();
    const newId = Math.max(...accounts.map(a => a.id), 0) + 1;
    const newAccount = {
        id: newId,
        name: account.name.trim(),
        email: account.email.trim(),
        role: account.role,
        department: account.department.trim(),
        status: 'active',
        studentId: account.role === 'student' ? (account.studentId || nextStudentId(accounts)) : null,
        createdAt: getTodayISO()
    };
    accounts.push(newAccount);
    saveAccounts(accounts);
    return newId;
}

/**
 * Edit an existing account and persist it (FR1).
 * @returns {boolean|{error: string}}
 */
function updateAccount(accountId, changes) {
    const accounts = loadAccounts();
    const account = accounts.find(a => a.id === parseInt(accountId, 10));
    if (!account) return { error: 'Account not found.' };

    const merged = { ...account, ...changes };
    const validation = validateAccount(merged, account.id);
    if (!validation.ok) return { error: validation.message };

    Object.assign(account, {
        name: merged.name.trim(),
        email: merged.email.trim(),
        role: merged.role,
        department: merged.department.trim(),
        studentId: merged.role === 'student' ? (merged.studentId || account.studentId) : null
    });
    saveAccounts(accounts);
    return true;
}

function nextStudentId(accounts) {
    const highest = accounts
        .filter(a => a.studentId && /^STU\d+$/.test(a.studentId))
        .map(a => parseInt(a.studentId.replace('STU', ''), 10))
        .filter(n => !isNaN(n));
    const next = (highest.length ? Math.max(...highest) : 0) + 1;
    return 'STU' + String(next).padStart(3, '0');
}

/**
 * Toggle account status and persist it (FR1).
 */
function toggleAccountStatus(accountId) {
    const accounts = loadAccounts();
    const account = accounts.find(a => a.id === parseInt(accountId, 10));
    if (account) {
        account.status = account.status === 'active' ? 'inactive' : 'active';
        saveAccounts(accounts);
        return account;
    }
    return null;
}

/**
 * Delete an account permanently and persist it (FR1).
 * Refuses to delete the account that is currently signed in.
 */
function deleteAccount(accountId) {
    const accounts = loadAccounts();
    const index = accounts.findIndex(a => a.id === parseInt(accountId, 10));
    if (index === -1) return { error: 'Account not found.' };

    const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
    if (currentUser && currentUser.username && accounts[index].email.toLowerCase() === currentUser.username.toLowerCase()) {
        return { error: 'You cannot delete the account you are currently signed in with.' };
    }

    accounts.splice(index, 1);
    saveAccounts(accounts);
    return true;
}

// ========================================
// REPORTS (FR12)
// ========================================

/**
 * Merge the request lifecycle row with the record it produced.
 * Without this, a completed consultation is counted twice in reports.
 */
function collapseRequestAndRecord(rows) {
    const recordByRequest = {};
    rows.forEach(row => {
        if (row.source === 'record' && row.requestId) recordByRequest[row.requestId] = row;
    });

    const out = [];
    const consumed = new Set();

    rows.forEach(row => {
        if (row.source === 'record' && row.requestId && recordByRequest[row.requestId]) {
            if (consumed.has('rec-' + row.requestId)) return;
            consumed.add('rec-' + row.requestId);
            out.push(row);
            return;
        }
        if (row.source === 'request' && recordByRequest[row.requestId]) {
            const rec = recordByRequest[row.requestId];
            if (consumed.has('rec-' + row.requestId)) return;
            consumed.add('rec-' + row.requestId);
            out.push({ ...rec, ...row, status: rec.status || 'completed' });
            return;
        }
        out.push(row);
    });

    return out;
}

/**
 * Build report data for a date range (FR12).
 * @param {Object} [options] { from, to, faculty } - faculty scopes the report to one member
 */
function getReportData(options = {}) {
    const rows = getConsultationData({
        faculty: options.faculty || 'all',
        dateFrom: options.from || '',
        dateTo: options.to || ''
    });

    // De-duplicate: a completed request also appears as a record
    const unique = collapseRequestAndRecord(rows);

    const statusCounts = {
        pending: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0,
        rejected: 0
    };
    unique.forEach(row => {
        if (statusCounts[row.status] !== undefined) statusCounts[row.status]++;
    });

    const facultyConsultations = {};
    unique.forEach(row => {
        if (!facultyConsultations[row.faculty]) {
            facultyConsultations[row.faculty] = { total: 0, completed: 0, pending: 0, cancelled: 0, rejected: 0, scheduled: 0 };
        }
        facultyConsultations[row.faculty].total++;
        if (facultyConsultations[row.faculty][row.status] !== undefined) {
            facultyConsultations[row.faculty][row.status]++;
        }
    });

    const byDate = {};
    unique.forEach(row => {
        if (!row.date) return;
        if (!byDate[row.date]) byDate[row.date] = 0;
        byDate[row.date]++;
    });

    return {
        total: unique.length,
        statusCounts,
        facultyConsultations,
        byDate,
        rows: unique,
        range: { from: options.from || '', to: options.to || '' }
    };
}

/**
 * Resolve a named period into an ISO date range (FR12).
 * @param {string} period week | month | semester | all
 */
function resolveDateRange(period) {
    const today = new Date();
    const to = toISODate(today);
    let from = '';

    if (period === 'week') {
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
        from = toISODate(start);
    } else if (period === 'month') {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        from = toISODate(start);
    } else if (period === 'semester') {
        const start = new Date(today.getFullYear(), today.getMonth() - 5, today.getDate());
        from = toISODate(start);
    }

    return { from, to };
}

/**
 * Build CSV text for a report (FR12).
 */
function toCSV(report) {
    const header = ['Date', 'Student', 'Student ID', 'Faculty', 'Subject', 'Time', 'Status', 'Concerns', 'Recommendations'];
    const escapeCell = value => {
        const str = value === null || value === undefined ? '' : String(value);
        return /[",\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str;
    };

    const lines = [header.join(',')];
    report.rows.forEach(row => {
        lines.push([
            row.date, row.student, row.studentId, row.faculty,
            row.subject, row.time, row.status, row.concerns, row.recommendations
        ].map(escapeCell).join(','));
    });
    return lines.join('\n');
}

/**
 * Trigger a browser download of the CSV report (FR12).
 */
function downloadCSV(filename, csvText) {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 0);
}

// Export for global use
window.adminData = adminData;
window.adminFunctions = {
    getAccountData,
    getConsultationData,
    applyConsultationFilters,
    getFacultyList,
    collapseRequestAndRecord,
    getStats,
    getRecentActivity,
    addAccount,
    updateAccount,
    toggleAccountStatus,
    deleteAccount,
    validateAccount,
    getReportData,
    resolveDateRange,
    toCSV,
    downloadCSV,
    getTodayISO
};
