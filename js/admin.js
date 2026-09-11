/**
 * CONSULT-TRAK - Admin Dashboard JavaScript
 * Shared mock data and logic for all admin pages
 */

// ========================================
// MOCK DATA
// ========================================

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

    // User accounts
    accounts: [
        { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'student', status: 'active', department: 'Computer Science', createdAt: '2025-09-01' },
        { id: 2, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'student', status: 'active', department: 'Engineering', createdAt: '2025-09-02' },
        { id: 3, name: 'Michael Brown', email: 'michael.brown@example.com', role: 'faculty', status: 'active', department: 'Computer Science', createdAt: '2024-01-15' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'faculty', status: 'active', department: 'Mathematics', createdAt: '2024-01-20' },
        { id: 5, name: 'David Lee', email: 'david.lee@example.com', role: 'student', status: 'inactive', department: 'Physics', createdAt: '2025-09-05' },
        { id: 6, name: 'Jennifer Taylor', email: 'jennifer.taylor@example.com', role: 'faculty', status: 'active', department: 'Chemistry', createdAt: '2024-02-01' },
        { id: 7, name: 'Robert Garcia', email: 'robert.garcia@example.com', role: 'student', status: 'active', department: 'Biology', createdAt: '2025-09-10' },
        { id: 8, name: 'Lisa Anderson', email: 'lisa.anderson@example.com', role: 'faculty', status: 'active', department: 'Computer Science', createdAt: '2024-02-15' }
    ],

    // Consultation records (system-wide)
    consultations: [
        { id: 1, student: 'John Smith', faculty: 'Michael Brown', subject: 'Course Advising', date: '2026-09-10', time: '10:00 AM', status: 'completed', notes: 'Discussed course selection for next semester' },
        { id: 2, student: 'Emily Davis', faculty: 'Sarah Wilson', subject: 'Research Project', date: '2026-09-10', time: '2:00 PM', status: 'pending', notes: '' },
        { id: 3, student: 'Robert Garcia', faculty: 'Jennifer Taylor', subject: 'Lab Work', date: '2026-09-09', time: '11:00 AM', status: 'completed', notes: 'Reviewed lab results and methodology' },
        { id: 4, student: 'John Smith', faculty: 'Lisa Anderson', subject: 'Thesis Review', date: '2026-09-11', time: '9:00 AM', status: 'completed', notes: 'Initial thesis discussion' },
        { id: 5, student: 'Emily Davis', faculty: 'Michael Brown', subject: 'Career Guidance', date: '2026-09-12', time: '3:00 PM', status: 'pending', notes: '' },
        { id: 6, student: 'Robert Garcia', faculty: 'Sarah Wilson', subject: 'Math Tutoring', date: '2026-09-08', time: '1:00 PM', status: 'cancelled', notes: 'Student cancelled due to illness' }
    ],

    // Recent activity
    recentActivity: [
        { id: 1, action: 'New account created', user: 'Amanda White', role: 'student', time: '10 minutes ago' },
        { id: 2, action: 'Consultation completed', user: 'John Smith', role: 'student', time: '1 hour ago' },
        { id: 3, action: 'Request approved', user: 'Emily Davis', faculty: 'Michael Brown', time: '2 hours ago' },
        { id: 4, action: 'New consultation request', user: 'Robert Garcia', role: 'student', time: '3 hours ago' },
        { id: 5, action: 'Account deactivated', user: 'David Lee', role: 'student', time: '1 day ago' }
    ]
};

// ========================================
// FUNCTIONS
// ========================================

/**
 * Get account data for table display
 */
function getAccountData() {
    return adminData.accounts;
}

/**
 * Get consultation data for table display
 */
function getConsultationData() {
    return adminData.consultations;
}

/**
 * Get stats for dashboard
 */
function getStats() {
    return adminData.stats;
}

/**
 * Get recent activity
 */
function getRecentActivity() {
    return adminData.recentActivity;
}

/**
 * Add new account (mock)
 */
function addAccount(account) {
    const newId = Math.max(...adminData.accounts.map(a => a.id)) + 1;
    adminData.accounts.push({ ...account, id: newId });
    return newId;
}

/**
 * Toggle account status (mock)
 */
function toggleAccountStatus(accountId) {
    const account = adminData.accounts.find(a => a.id === accountId);
    if (account) {
        account.status = account.status === 'active' ? 'inactive' : 'active';
        return account;
    }
    return null;
}

/**
 * Delete account (mock)
 */
function deleteAccount(accountId) {
    const index = adminData.accounts.findIndex(a => a.id === accountId);
    if (index > -1) {
        adminData.accounts.splice(index, 1);
        return true;
    }
    return false;
}

/**
 * Get report data (mock)
 */
function getReportData() {
    const statusCounts = {
        completed: adminData.consultations.filter(c => c.status === 'completed').length,
        pending: adminData.consultations.filter(c => c.status === 'pending').length,
        cancelled: adminData.consultations.filter(c => c.status === 'cancelled').length
    };

    const facultyConsultations = {};
    adminData.consultations.forEach(c => {
        if (!facultyConsultations[c.faculty]) {
            facultyConsultations[c.faculty] = 0;
        }
        facultyConsultations[c.faculty]++;
    });

    return { statusCounts, facultyConsultations };
}

// Export for global use
window.adminData = adminData;
window.adminFunctions = {
    getAccountData,
    getConsultationData,
    getStats,
    getRecentActivity,
    addAccount,
    toggleAccountStatus,
    deleteAccount,
    getReportData
};