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
        email: 'student@dummy.com',
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

    // Faculty availability - organized by department
    facultyAvailability: [
        // SOCS Department
        { id: 1, faculty: 'Mr. Jaafar Omar', displayName: 'Mr. Jaafar Omar', department: 'SOCS', fullDepartment: 'SOCS Department', title: null, day: 'Monday', time: '9:00 AM - 12:00 PM', slots: 5, available: true },
        { id: 2, faculty: 'Mrs. Elsie Ybanez', displayName: 'Mrs. Elsie Ybanez', department: 'SOCS', fullDepartment: 'SOCS DEAN', title: 'SOCS DEAN', day: 'Monday', time: '2:00 PM - 5:00 PM', slots: 4, available: true },
        { id: 3, faculty: 'Mr. Efraim Barcela', displayName: 'Mr. Efraim Barcela', department: 'SOCS', fullDepartment: 'SOCS Department', title: null, day: 'Tuesday', time: '10:00 AM - 1:00 PM', slots: 6, available: true },
        { id: 4, faculty: 'Mr. Mark Lester Catungal', displayName: 'Mr. Mark Lester Catungal', department: 'SOCS', fullDepartment: 'SOCS Department', title: null, day: 'Tuesday', time: '2:00 PM - 5:00 PM', slots: 5, available: true },
        { id: 5, faculty: 'Mrs. Shinikie Dangasi', displayName: 'Mrs. Shinikie Dangasi', department: 'SOCS', fullDepartment: 'SOCS Department', title: null, day: 'Wednesday', time: '9:00 AM - 12:00 PM', slots: 4, available: true },
        { id: 6, faculty: 'Mr. Ricky Egos', displayName: 'Mr. Ricky Egos', department: 'SOCS', fullDepartment: 'SOCS Department', title: null, day: 'Wednesday', time: '2:00 PM - 5:00 PM', slots: 5, available: true },
        { id: 7, faculty: 'Ms. Jeanibel Mandeg', displayName: 'Ms. Jeanibel Mandeg', department: 'SOCS', fullDepartment: 'SOCS Department', title: null, day: 'Thursday', time: '9:00 AM - 12:00 PM', slots: 6, available: true },

        // SBM Department
        { id: 8, faculty: 'Mr. Ernesto Medina', displayName: 'Mr. Ernesto Medina', department: 'SBM', fullDepartment: 'SBM Department', title: null, day: 'Thursday', time: '2:00 PM - 5:00 PM', slots: 5, available: true },
        { id: 9, faculty: 'Dr. Julito V. Mandac Jr.', displayName: 'Dr. Julito V. Mandac Jr.', department: 'SBM', fullDepartment: 'SBM DEAN', title: 'SBM DEAN', day: 'Friday', time: '9:00 AM - 12:00 PM', slots: 4, available: true },
        { id: 10, faculty: 'Ms. Charmagne B. Merontos', displayName: 'Ms. Charmagne B. Merontos', department: 'SBM', fullDepartment: 'SBM Department', title: null, day: 'Friday', time: '2:00 PM - 5:00 PM', slots: 5, available: true },
        { id: 11, faculty: 'Mr. Glady C. Quirante', displayName: 'Mr. Glady C. Quirante', department: 'SBM', fullDepartment: 'SBM Department', title: null, day: 'Monday', time: '10:00 AM - 1:00 PM', slots: 6, available: true },
        { id: 12, faculty: 'Ms. Maricar P. Rellon', displayName: 'Ms. Maricar P. Rellon', department: 'SBM', fullDepartment: 'SBM Department', title: null, day: 'Tuesday', time: '9:00 AM - 12:00 PM', slots: 5, available: true }

        // SON Department - empty for now, but structure exists
    ],

    // Department list for filters
    departments: [
        { code: 'SOCS', name: 'SOCS Department' },
        { code: 'SBM', name: 'SBM Department' },
        { code: 'SON', name: 'SON Department' }
    ],

    // My requests
    myRequests: [
        { id: 1, faculty: 'Mr. Jaafar Omar', subject: 'Course/Subject Requirements', concern: 'Need help choosing electives for next semester', preferredDate: '2026-09-15', preferredTime: '10:00 AM', status: 'pending', submittedAt: '2026-09-10' },
        { id: 2, faculty: 'Mrs. Shinikie Dangasi', subject: 'Course/Subject Requirements', concern: 'Struggling with calculus problems', preferredDate: '2026-09-16', preferredTime: '2:00 PM', status: 'scheduled', scheduledDate: '2026-09-16', scheduledTime: '2:00 PM', notes: 'Office hours', submittedAt: '2026-09-09' },
        { id: 3, faculty: 'Ms. Maricar P. Rellon', subject: 'Grades', concern: 'Questions about my recent major exam result', preferredDate: '2026-09-17', preferredTime: '11:00 AM', status: 'pending', submittedAt: '2026-09-11' },
        { id: 4, faculty: 'Dr. Julito V. Mandac Jr.', subject: 'Recommendation Letter Request', concern: 'Request for a recommendation letter for internship applications', preferredDate: '2026-09-14', preferredTime: '9:00 AM', status: 'rejected', rejectionReason: 'Faculty unavailable at requested time', submittedAt: '2026-09-08' }
    ],

    // Appointments
    appointments: [
        { id: 1, faculty: 'Mrs. Shinikie Dangasi', subject: 'Course/Subject Requirements', date: '2026-09-16', time: '2:00 PM', status: 'scheduled', location: 'Office 205' },
        { id: 2, faculty: 'Mr. Jaafar Omar', subject: 'Course/Subject Requirements', date: '2026-09-15', time: '10:00 AM', status: 'pending' },
        { id: 3, faculty: 'Ms. Maricar P. Rellon', subject: 'Grades', date: '2026-09-17', time: '11:00 AM', status: 'pending' }
    ],

    // Consultation history
    history: [
        { id: 1, faculty: 'Mr. Jaafar Omar', subject: 'Course/Subject Requirements', date: '2026-09-05', time: '10:00 AM', duration: '45 min', status: 'completed', outcome: 'Discussed course selection for fall semester' },
        { id: 2, faculty: 'Mrs. Shinikie Dangasi', subject: 'Academic Performance', date: '2026-09-02', time: '2:00 PM', duration: '30 min', status: 'completed', outcome: 'Reviewed problem set solutions' },
        { id: 3, faculty: 'Mr. Ricky Egos', subject: 'Academic Performance', date: '2026-09-21', time: '3:00 PM', duration: '30 min', status: 'scheduled', outcome: 'Scheduled project checkpoint review' },
        { id: 4, faculty: 'Ms. Charmagne B. Merontos', subject: 'Grades', date: '2026-09-19', time: '11:00 AM', duration: '30 min', status: 'pending', outcome: 'Awaiting confirmation of available slot' },
        { id: 5, faculty: 'Mr. Ernesto Medina', subject: 'Thesis / Capstone Advising', date: '2026-08-25', time: '9:00 AM', duration: '45 min', status: 'cancelled', outcome: 'Cancelled by student - scheduling conflict' },
        { id: 6, faculty: 'Dr. Julito V. Mandac Jr.', subject: 'OJT / Internship Concern', date: '2026-09-08', time: '3:00 PM', duration: '30 min', status: 'rejected', outcome: 'Request rejected - faculty unavailable' }
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
    if (appointment && appointment.status === 'scheduled') {
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