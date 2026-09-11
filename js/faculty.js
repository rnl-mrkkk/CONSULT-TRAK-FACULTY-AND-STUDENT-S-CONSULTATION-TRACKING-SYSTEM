/**
 * CONSULT-TRAK - Faculty Dashboard JavaScript
 * Shared mock data and logic for all faculty pages
 */

// ========================================
// MOCK DATA
// ========================================

const facultyData = {
    // Faculty member info
    faculty: {
        id: 1,
        name: 'Dr. Michael Brown',
        email: 'faculty@example.com',
        department: 'Computer Science',
        office: 'Room 302, Engineering Building',
        phone: '(555) 123-4567',
        bio: 'Associate Professor specializing in Software Engineering and Database Systems.'
    },

    // Stats
    stats: {
        pendingRequests: 5,
        todayAppointments: 3,
        completedThisWeek: 12,
        totalStudents: 45
    },

    // Availability slots
    availability: [
        { id: 1, day: 'Monday', startTime: '9:00 AM', endTime: '12:00 PM', maxStudents: 5, available: true },
        { id: 2, day: 'Monday', startTime: '2:00 PM', endTime: '5:00 PM', maxStudents: 4, available: true },
        { id: 3, day: 'Wednesday', startTime: '10:00 AM', endTime: '1:00 PM', maxStudents: 6, available: true },
        { id: 4, day: 'Friday', startTime: '9:00 AM', endTime: '12:00 PM', maxStudents: 5, available: false }
    ],

    // Consultation requests (incoming from students)
    requests: [
        { id: 1, student: 'John Smith', studentId: 'STU001', email: 'john.smith@example.com', subject: 'Course Advising', concern: 'Need help choosing electives for next semester', preferredDate: '2026-09-15', preferredTime: '10:00 AM', status: 'pending', submittedAt: '2026-09-10' },
        { id: 2, student: 'Emily Davis', studentId: 'STU002', email: 'emily.davis@example.com', subject: 'Research Project', concern: 'Looking for guidance on thesis topic', preferredDate: '2026-09-16', preferredTime: '2:00 PM', status: 'pending', submittedAt: '2026-09-11' },
        { id: 3, student: 'Robert Garcia', studentId: 'STU003', email: 'robert.garcia@example.com', subject: 'Programming Help', concern: 'Struggling with data structures assignment', preferredDate: '2026-09-14', preferredTime: '11:00 AM', status: 'accepted', submittedAt: '2026-09-09' },
        { id: 4, student: 'Amanda White', studentId: 'STU004', email: 'amanda.white@example.com', subject: 'Career Guidance', concern: 'Internship opportunities and career paths', preferredDate: '2026-09-17', preferredTime: '3:00 PM', status: 'pending', submittedAt: '2026-09-11' },
        { id: 5, student: 'David Lee', studentId: 'STU005', email: 'david.lee@example.com', subject: 'Course Material', concern: 'Questions about lecture notes', preferredDate: '2026-09-12', preferredTime: '9:00 AM', status: 'rejected', submittedAt: '2026-09-08', rejectionReason: 'Time slot already booked' }
    ],

    // Consultation records (completed)
    records: [
        { id: 1, student: 'Sarah Johnson', studentId: 'STU010', subject: 'Thesis Review', date: '2026-09-10', time: '10:00 AM', duration: '45 min', status: 'completed', concerns: 'Discussed thesis outline and methodology', recommendations: 'Expand literature review section', followUp: 'Schedule next meeting in 2 weeks' },
        { id: 2, student: 'Mark Thompson', studentId: 'STU011', subject: 'Project Help', date: '2026-09-09', time: '2:00 PM', duration: '30 min', status: 'completed', concerns: 'Database design for capstone project', recommendations: 'Use normalized schema and add indexes', followUp: null },
        { id: 3, student: 'Lisa Chen', studentId: 'STU012', subject: 'Career Advice', date: '2026-09-08', time: '11:00 AM', duration: '60 min', status: 'completed', concerns: 'Job market for software engineers', recommendations: 'Build portfolio projects and contribute to open source', followUp: 'Follow up on internship applications' },
        { id: 4, student: 'Kevin Martinez', studentId: 'STU013', subject: 'Course Advice', date: '2026-09-05', time: '9:00 AM', duration: '30 min', status: 'cancelled', concerns: 'Course selection for spring semester', recommendations: null, followUp: null, cancellationReason: 'Student cancelled due to scheduling conflict' }
    ],

    // Today's schedule
    todaySchedule: [
        { id: 1, student: 'Robert Garcia', time: '9:00 AM', subject: 'Programming Help', status: 'scheduled' },
        { id: 2, student: 'Sarah Johnson', time: '11:00 AM', subject: 'Thesis Review', status: 'completed' },
        { id: 3, student: 'Guest', time: '2:00 PM', subject: 'Office Hours', status: 'open' }
    ]
};

// ========================================
// FUNCTIONS
// ========================================

/**
 * Get faculty info
 */
function getFacultyInfo() {
    return facultyData.faculty;
}

/**
 * Get stats
 */
function getStats() {
    return facultyData.stats;
}

/**
 * Get pending requests
 */
function getPendingRequests() {
    return facultyData.requests.filter(r => r.status === 'pending');
}

/**
 * Get all requests
 */
function getAllRequests() {
    return facultyData.requests;
}

/**
 * Get availability slots
 */
function getAvailability() {
    return facultyData.availability;
}

/**
 * Get consultation records
 */
function getRecords() {
    return facultyData.records;
}

/**
 * Get today's schedule
 */
function getTodaySchedule() {
    return facultyData.todaySchedule;
}

/**
 * Accept a request
 */
function acceptRequest(requestId) {
    const request = facultyData.requests.find(r => r.id === requestId);
    if (request) {
        request.status = 'accepted';
        return true;
    }
    return false;
}

/**
 * Reject a request
 */
function rejectRequest(requestId, reason) {
    const request = facultyData.requests.find(r => r.id === requestId);
    if (request) {
        request.status = 'rejected';
        request.rejectionReason = reason;
        return true;
    }
    return false;
}

/**
 * Update availability
 */
function updateAvailability(slotId, changes) {
    const slot = facultyData.availability.find(s => s.id === slotId);
    if (slot) {
        Object.assign(slot, changes);
        return true;
    }
    return false;
}

/**
 * Add new availability slot
 */
function addAvailabilitySlot(slot) {
    const newId = Math.max(...facultyData.availability.map(s => s.id)) + 1;
    facultyData.availability.push({ ...slot, id: newId });
    return newId;
}

/**
 * Remove availability slot
 */
function removeAvailabilitySlot(slotId) {
    const index = facultyData.availability.findIndex(s => s.id === slotId);
    if (index > -1) {
        facultyData.availability.splice(index, 1);
        return true;
    }
    return false;
}

/**
 * Save consultation record
 */
function saveConsultationRecord(record) {
    const newId = Math.max(...facultyData.records.map(r => r.id), 0) + 1;
    facultyData.records.push({ ...record, id: newId, status: 'completed' });
    return newId;
}

// Export for global use
window.facultyData = facultyData;
window.facultyFunctions = {
    getFacultyInfo,
    getStats,
    getPendingRequests,
    getAllRequests,
    getAvailability,
    getRecords,
    getTodaySchedule,
    acceptRequest,
    rejectRequest,
    updateAvailability,
    addAvailabilitySlot,
    removeAvailabilitySlot,
    saveConsultationRecord
};