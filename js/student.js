/**
 * CONSULT-TRAK - Student Dashboard JavaScript
 * Shared mock data and logic for all student pages
 */

// ========================================
// MOCK DATA
// ========================================

const studentData = {
    // Student info
    student: {
        id: 1,
        name: 'John Smith',
        email: 'student@example.com',
        studentId: 'STU001',
        department: 'Computer Science',
        year: 'Junior',
        enrolled: '2024-09-01'
    },

    // Stats
    stats: {
        pendingRequests: 2,
        upcomingAppointments: 3,
        completedConsultations: 8,
        cancelledAppointments: 1
    },

    // Faculty availability
    facultyAvailability: [
        { id: 1, faculty: 'Dr. Michael Brown', department: 'Computer Science', day: 'Monday', time: '9:00 AM - 12:00 PM', slots: 5, available: true },
        { id: 2, faculty: 'Dr. Michael Brown', department: 'Computer Science', day: 'Monday', time: '2:00 PM - 5:00 PM', slots: 4, available: true },
        { id: 3, faculty: 'Dr. Sarah Wilson', department: 'Mathematics', day: 'Tuesday', time: '10:00 AM - 1:00 PM', slots: 6, available: true },
        { id: 4, faculty: 'Dr. Jennifer Taylor', department: 'Chemistry', day: 'Wednesday', time: '9:00 AM - 12:00 PM', slots: 5, available: true },
        { id: 5, faculty: 'Dr. Lisa Anderson', department: 'Computer Science', day: 'Wednesday', time: '2:00 PM - 5:00 PM', slots: 4, available: false },
        { id: 6, faculty: 'Dr. Michael Brown', department: 'Computer Science', day: 'Friday', time: '9:00 AM - 12:00 PM', slots: 5, available: true }
    ],

    // My requests
    myRequests: [
        { id: 1, faculty: 'Dr. Michael Brown', subject: 'Course Advising', concern: 'Need help choosing electives for next semester', preferredDate: '2026-09-15', preferredTime: '10:00 AM', status: 'pending', submittedAt: '2026-09-10' },
        { id: 2, faculty: 'Dr. Sarah Wilson', subject: 'Math Tutoring', concern: 'Struggling with calculus problems', preferredDate: '2026-09-16', preferredTime: '2:00 PM', status: 'accepted', scheduledDate: '2026-09-16', scheduledTime: '2:00 PM', notes: 'Office hours', submittedAt: '2026-09-09' },
        { id: 3, faculty: 'Dr. Jennifer Taylor', subject: 'Lab Help', concern: 'Questions about chemistry lab report', preferredDate: '2026-09-14', preferredTime: '11:00 AM', status: 'rejected', rejectionReason: 'Faculty unavailable at requested time', submittedAt: '2026-09-08' }
    ],

    // Appointments
    appointments: [
        { id: 1, faculty: 'Dr. Sarah Wilson', subject: 'Math Tutoring', date: '2026-09-16', time: '2:00 PM', status: 'accepted', location: 'Office 205' },
        { id: 2, faculty: 'Dr. Michael Brown', subject: 'Research Discussion', date: '2026-09-18', time: '10:00 AM', status: 'pending' },
        { id: 3, faculty: 'Dr. Lisa Anderson', subject: 'Project Review', date: '2026-09-20', time: '3:00 PM', status: 'pending' }
    ],

    // Consultation history
    history: [
        { id: 1, faculty: 'Dr. Michael Brown', subject: 'Course Advising', date: '2026-09-05', time: '10:00 AM', duration: '45 min', status: 'completed', outcome: 'Discussed course selection for fall semester' },
        { id: 2, faculty: 'Dr. Sarah Wilson', subject: 'Homework Help', date: '2026-09-02', time: '2:00 PM', duration: '30 min', status: 'completed', outcome: 'Reviewed problem set solutions' },
        { id: 3, faculty: 'Dr. Jennifer Taylor', subject: 'Lab Introduction', date: '2026-08-28', time: '11:00 AM', duration: '60 min', status: 'completed', outcome: 'Introduction to lab procedures and safety' },
        { id: 4, faculty: 'Dr. Michael Brown', subject: 'Thesis Topic', date: '2026-08-25', time: '9:00 AM', duration: '45 min', status: 'cancelled', outcome: 'Cancelled by student - scheduling conflict' },
        { id: 5, faculty: 'Dr. Lisa Anderson', subject: 'Programming Help', date: '2026-08-20', time: '3:00 PM', duration: '30 min', status: 'completed', outcome: 'Debugged assignment code' }
    ]
};

// ========================================
// FUNCTIONS
// ========================================

/**
 * Get student info
 */
function getStudentInfo() {
    return studentData.student;
}

/**
 * Get stats
 */
function getStats() {
    return studentData.stats;
}

/**
 * Get faculty availability
 */
function getFacultyAvailability() {
    return studentData.facultyAvailability.filter(f => f.available);
}

/**
 * Get all faculty
 */
function getAllFaculty() {
    return studentData.facultyAvailability;
}

/**
 * Get my requests
 */
function getMyRequests() {
    return studentData.myRequests;
}

/**
 * Get appointments
 */
function getAppointments() {
    return studentData.appointments;
}

/**
 * Get history
 */
function getHistory() {
    return studentData.history;
}

/**
 * Submit new consultation request
 */
function submitRequest(request) {
    const newId = Math.max(...studentData.myRequests.map(r => r.id)) + 1;
    studentData.myRequests.push({
        ...request,
        id: newId,
        status: 'pending',
        submittedAt: new Date().toISOString().split('T')[0]
    });
    return newId;
}

/**
 * Cancel own request
 */
function cancelRequest(requestId) {
    const request = studentData.myRequests.find(r => r.id === requestId);
    if (request && request.status === 'pending') {
        request.status = 'cancelled';
        return true;
    }
    return false;
}

/**
 * Cancel appointment
 */
function cancelAppointment(appointmentId) {
    const appointment = studentData.appointments.find(a => a.id === appointmentId);
    if (appointment && appointment.status === 'accepted') {
        appointment.status = 'cancelled';
        return true;
    }
    return false;
}

// Export for global use
window.studentData = studentData;
window.studentFunctions = {
    getStudentInfo,
    getStats,
    getFacultyAvailability,
    getAllFaculty,
    getMyRequests,
    getAppointments,
    getHistory,
    submitRequest,
    cancelRequest,
    cancelAppointment
};