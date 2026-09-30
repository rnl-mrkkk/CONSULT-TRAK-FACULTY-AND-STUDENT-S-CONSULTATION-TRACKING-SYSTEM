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
        // SOCS Faculty
        { id: 1, faculty: 'Mr. Jaafar Omar', displayName: 'Mr. Jaafar Omar', department: 'SOCS', fullDepartment: 'SOCS Faculty', title: null, day: 'Monday', time: '9:00 AM - 12:00 PM', slots: 5, available: true },
        { id: 2, faculty: 'Mrs. Elsie Ybanez', displayName: 'Mrs. Elsie Ybanez', department: 'SOCS', fullDepartment: 'SOCS DEAN', title: 'SOCS DEAN', day: 'Monday', time: '2:00 PM - 5:00 PM', slots: 4, available: true },
        { id: 3, faculty: 'Mr. Efraim Barcela', displayName: 'Mr. Efraim Barcela', department: 'SOCS', fullDepartment: 'SOCS Faculty', title: null, day: 'Tuesday', time: '10:00 AM - 1:00 PM', slots: 6, available: true },
        { id: 4, faculty: 'Mr. Mark Lester Catungal', displayName: 'Mr. Mark Lester Catungal', department: 'SOCS', fullDepartment: 'SOCS Faculty', title: null, day: 'Tuesday', time: '2:00 PM - 5:00 PM', slots: 5, available: true },
        { id: 5, faculty: 'Mrs. Shinikie Dangasi', displayName: 'Mrs. Shinikie Dangasi', department: 'SOCS', fullDepartment: 'SOCS Faculty', title: null, day: 'Wednesday', time: '9:00 AM - 12:00 PM', slots: 4, available: true },
        { id: 6, faculty: 'Mr. Ricky Egos', displayName: 'Mr. Ricky Egos', department: 'SOCS', fullDepartment: 'SOCS Faculty', title: null, day: 'Wednesday', time: '2:00 PM - 5:00 PM', slots: 5, available: true },
        { id: 7, faculty: 'Ms. Jeanibel Mandeg', displayName: 'Ms. Jeanibel Mandeg', department: 'SOCS', fullDepartment: 'SOCS Faculty', title: null, day: 'Thursday', time: '9:00 AM - 12:00 PM', slots: 6, available: true },

        // SBM Faculty
        { id: 8, faculty: 'Mr. Ernesto Medina', displayName: 'Mr. Ernesto Medina', department: 'SBM', fullDepartment: 'SBM Faculty', title: null, day: 'Thursday', time: '2:00 PM - 5:00 PM', slots: 5, available: true },
        { id: 9, faculty: 'Dr. Julito V. Mandac Jr.', displayName: 'Dr. Julito V. Mandac Jr.', department: 'SBM', fullDepartment: 'SBM DEAN', title: 'SBM DEAN', day: 'Friday', time: '9:00 AM - 12:00 PM', slots: 4, available: true },
        { id: 10, faculty: 'Ms. Charmagne B. Merontos', displayName: 'Ms. Charmagne B. Merontos', department: 'SBM', fullDepartment: 'SBM Faculty', title: null, day: 'Friday', time: '2:00 PM - 5:00 PM', slots: 5, available: true },
        { id: 11, faculty: 'Mr. Glady C. Quirante', displayName: 'Mr. Glady C. Quirante', department: 'SBM', fullDepartment: 'SBM Faculty', title: null, day: 'Monday', time: '10:00 AM - 1:00 PM', slots: 6, available: true },
        { id: 12, faculty: 'Ms. Maricar P. Rellon', displayName: 'Ms. Maricar P. Rellon', department: 'SBM', fullDepartment: 'SBM Faculty', title: null, day: 'Tuesday', time: '9:00 AM - 12:00 PM', slots: 5, available: true }

        // SON Department - empty for now, but structure exists
    ],

    // Department list for filters
    departments: [
        { code: 'SOCS', name: 'SOCS Faculty' },
        { code: 'SBM', name: 'SBM Faculty' },
        { code: 'SON', name: 'SON Department' }
    ],

    // My requests
    myRequests: [
        { id: 1, faculty: 'Mr. Jaafar Omar', subject: 'Course/Subject Requirements', concern: 'Need help choosing electives for next semester', preferredDate: '2026-09-28', preferredTime: '10:00 AM', status: 'pending', submittedAt: '2026-09-24' },
        { id: 2, faculty: 'Mrs. Shinikie Dangasi', subject: 'Course/Subject Requirements', concern: 'Struggling with calculus problems', preferredDate: '2026-09-28', preferredTime: '2:00 PM', status: 'pending', submittedAt: '2026-09-24' },
        { id: 3, faculty: 'Ms. Maricar P. Rellon', subject: 'Grades', concern: 'Questions about my recent major exam result', preferredDate: '2026-09-30', preferredTime: '11:00 AM', status: 'pending', submittedAt: '2026-09-25' },
        { id: 4, faculty: 'Dr. Julito V. Mandac Jr.', subject: 'Recommendation Letter Request', concern: 'Request for a recommendation letter for internship applications', preferredDate: '2026-09-30', preferredTime: '9:00 AM', status: 'pending', submittedAt: '2026-09-25' }
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
// STORAGE & SYNCHRONIZATION
// ========================================

const STORAGE_KEYS = {
    REQUESTS: 'ct_faculty_requests',
    RECORDS: 'ct_faculty_records'
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
    const requests = getMyRequests();
    const records = getHistory();

    const pending = requests.filter(r => r.status === 'pending').length;
    const upcoming = requests.filter(r => r.status === 'scheduled' || r.status === 'accepted').length;
    const completed = records.filter(r => r.status === 'completed').length + requests.filter(r => r.status === 'completed').length;
    const cancelled = requests.filter(r => r.status === 'cancelled').length;

    return {
        pendingRequests: pending,
        upcomingAppointments: upcoming,
        completedConsultations: completed,
        cancelledAppointments: cancelled
    };
}

/**
 * Get faculty availability
 */
const AVAILABILITY_STORAGE_KEY = 'ct_faculty_availability';
const AVAILABILITY_OWNERS_STORAGE_KEY = 'ct_availability_owners';
const FACULTY_INFO_STORAGE_KEY = 'ct_faculty_info';
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOT_MINUTES = 30;

// Statuses that occupy a real, reserved time on a faculty member's calendar.
const ACTIVE_SCHEDULE_STATUSES = ['scheduled', 'completed'];

/**
 * Convert "9:00 AM" / "09:00" to minutes since midnight.
 * Returns null when the value cannot be parsed.
 */
function timeToMinutes(time) {
    if (!time) return null;
    if (typeof time === 'number') return time;

    const match = String(time).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const meridiem = match[3] ? match[3].toLowerCase() : null;

    if (isNaN(hours) || isNaN(minutes) || minutes > 59) return null;
    if (meridiem) {
        if (hours < 1 || hours > 12) return null;
        if (meridiem === 'pm' && hours !== 12) hours += 12;
        if (meridiem === 'am' && hours === 12) hours = 0;
    } else if (hours > 23) {
        return null;
    }
    return hours * 60 + minutes;
}

/**
 * Format minutes-since-midnight back to "9:00 AM".
 */
function minutesToTime(totalMinutes) {
    if (totalMinutes === null || totalMinutes === undefined) return '';
    const hours24 = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    const meridiem = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${meridiem}`;
}

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
 * Day-of-week for an ISO date, matched against DAY_NAMES.
 */
function getDayNameForISODate(isoDate) {
    const date = parseISODate(isoDate);
    if (!date) return null;
    return DAY_NAMES[(date.getDay() + 6) % 7];
}

/**
 * Today's ISO date (YYYY-MM-DD) in local time.
 */
function getTodayISO() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

const TIME_REGEX = /(\d{1,2}):(\d{2})\s*(am|pm)?/gi;

/**
 * Extract every clock time mentioned in free-text such as
 * "Monday 9:00 AM - 12:00 PM" and return them in minutes.
 */
function extractTimes(text) {
    if (!text) return [];
    const results = [];
    let match;
    TIME_REGEX.lastIndex = 0;
    while ((match = TIME_REGEX.exec(String(text))) !== null) {
        const minutes = timeToMinutes(`${match[1]}:${match[2]}${match[3] ? ' ' + match[3] : ''}`);
        if (minutes !== null) results.push(minutes);
    }
    return results;
}

/**
 * Derive [start, end] in minutes from a request's time text.
 * A single clock time is treated as a 30-minute consultation.
 */
function resolveRequestTimeRange(request) {
    const raw = request.confirmedTime || request.preferredTime || request.time;
    const times = extractTimes(raw);
    if (times.length >= 2) return { start: times[0], end: times[1] };
    if (times.length === 1) return { start: times[0], end: times[0] + 30 };
    return null;
}

/**
 * The date a request occupies on the calendar.
 */
function resolveRequestDate(request) {
    return request.confirmedDate || request.preferredDate || request.date || null;
}

/**
 * Load the availability array the faculty side wrote to LocalStorage.
 *
 * Two sources are merged:
 *  - Real slots, filtered strictly by owner.
 *  - The static demo list, but only for faculty who have never edited their
 *    own schedule. A member who emptied their schedule stays empty.
 */
function loadSharedAvailability() {
    const owners = loadSharedAvailabilityOwners();

    let stored = [];
    try {
        const raw = localStorage.getItem(AVAILABILITY_STORAGE_KEY);
        if (raw !== null && raw !== undefined) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) stored = normalizeAvailability(parsed);
        }
    } catch (e) {
        console.warn('Error reading shared availability:', e);
    }

    // Faculty present in real storage, plus anyone who manages their own schedule
    const managed = new Set();
    stored.forEach(s => { if (s.faculty) managed.add(s.faculty); });
    owners.forEach(name => managed.add(name));

    const demo = normalizeAvailability(studentData.facultyAvailability
        .filter(f => f.available)
        .map(f => {
            const times = extractTimes(f.time);
            return {
                id: f.id,
                day: f.day,
                startTime: times[0] !== undefined ? minutesToTime(times[0]) : '9:00 AM',
                endTime: times[1] !== undefined ? minutesToTime(times[1]) : '12:00 PM',
                maxStudents: f.slots || 1,
                available: true,
                // Identity and department must survive, the department pages
                // group and label every slot by these
                faculty: f.faculty,
                displayName: f.displayName,
                department: f.department,
                fullDepartment: f.fullDepartment,
                title: f.title
            };
        }));

    // Demo slots only apply to faculty who have not taken control themselves
    const demoForUnmanaged = demo.filter(s => s.faculty && !managed.has(s.faculty));

    return enrichAvailabilityProfile(stored.concat(demoForUnmanaged));
}

function loadSharedAvailabilityOwners() {
    try {
        const raw = localStorage.getItem(AVAILABILITY_OWNERS_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {}
    return [];
}

/**
 * Bring stored availability into a single predictable shape.
 *
 * Older demo rows use a `"9:00 AM - 12:00 PM"` range string instead of
 * separate start/end fields, so handle both.
 *
 * Every other field on the row is preserved. The department pages group and
 * label slots using `department`, `fullDepartment`, `displayName` and `title`,
 * so dropping those would empty out the SOCS / SBM / SON sections.
 */
function normalizeAvailability(rows) {
    if (!Array.isArray(rows)) return [];
    return rows.map((s, i) => {
        let startTime = s.startTime;
        let endTime = s.endTime;

        if ((startTime === undefined || endTime === undefined) && typeof s.time === 'string') {
            const parts = extractTimes(s.time);
            if (startTime === undefined && parts[0] !== undefined) startTime = minutesToTime(parts[0]);
            if (endTime === undefined && parts[1] !== undefined) endTime = minutesToTime(parts[1]);
        }

        const max = parseInt(s.maxStudents, 10);
        return {
            ...s,
            id: s.id !== undefined ? s.id : `av-${i}`,
            day: s.day || '',
            startTime: startTime || '9:00 AM',
            endTime: endTime || '12:00 PM',
            maxStudents: isNaN(max) || max < 1 ? 1 : max,
            // Absent flag means enabled
            available: s.available === undefined ? true : !!s.available,
            faculty: s.faculty || null,
            displayName: s.displayName || s.faculty || 'Faculty'
        };
    });
}

/**
 * Fill in department metadata for a slot from the faculty directory.
 *
 * Slots created on the faculty availability page only know their owner, but the
 * student pages still need to know which department section to file them under.
 */
function enrichAvailabilityProfile(slots) {
    const directory = {};
    studentData.facultyAvailability.forEach(f => {
        if (f.faculty) directory[f.faculty] = f;
    });

    return slots.map(s => {
        if (s.department) return s;
        const entry = s.faculty ? directory[s.faculty] : null;
        if (!entry) return s;
        return {
            ...s,
            department: entry.department,
            fullDepartment: entry.fullDepartment,
            title: entry.title,
            displayName: s.displayName || entry.displayName || s.faculty
        };
    });
}

/**
 * Name of the signed-in faculty member, from session then from storage.
 */
function getSharedFacultyName() {
    const session = getSessionStudent();
    if (session.role === 'faculty' && session.name) return session.name;
    try {
        const stored = localStorage.getItem(FACULTY_INFO_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.name) return parsed.name;
        }
    } catch (e) {}
    return 'Mr. Jaafar Omar';
}

/**
 * Real, bookable appointment windows for a faculty member (FR5/FR6).
 * Reads the same LocalStorage the faculty availability manager writes to,
 * so disabling a slot immediately removes it from the student's list.
 *
 * @param {string} facultyName
 * @param {number} [days] How many days ahead to offer (default 21)
 * @returns {Array<{date, day, startTime, endTime, time, remaining, label, available}>}
 */
function getBookableSlots(facultyName, days = 21) {
    const allSlots = loadSharedAvailability();
    // Strict ownership: a slot only counts for the faculty member it belongs to
    const mine = allSlots.filter(s =>
        s.available !== false && !!s.faculty && s.faculty === facultyName
    );
    if (mine.length === 0) return [];

    const requests = getMyRequestsRaw();
    const today = new Date();
    const windows = [];

    for (let offset = 1; offset <= days; offset++) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
        const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const dayName = DAY_NAMES[(date.getDay() + 6) % 7];

        mine.filter(s => s.day === dayName).forEach(slot => {
            const slotStart = timeToMinutes(slot.startTime);
            const slotEnd = timeToMinutes(slot.endTime);
            if (slotStart === null || slotEnd === null || slotEnd <= slotStart) return;

            const max = parseInt(slot.maxStudents, 10);
            const capacity = isNaN(max) || max <= 0 ? 0 : max;

            // Capacity check against this student's own bookings in the window
            const bookedCount = requests.filter(r => {
                if (r.faculty !== facultyName) return false;
                if (!ACTIVE_SCHEDULE_STATUSES.includes(r.status)) return false;
                if (resolveRequestDate(r) !== iso) return null;
                const rr = resolveRequestTimeRange(r);
                return rr && rr.start >= slotStart && rr.end <= slotEnd;
            }).length;

            if (capacity > 0 && bookedCount >= capacity) return;

            // Offer 30-minute start times within the window, skipping only the
            // specific times that overlap an existing booking
            for (let t = slotStart; t + SLOT_MINUTES <= slotEnd; t += SLOT_MINUTES) {
                const startTime = minutesToTime(t);
                const collides = requests.some(r => {
                    if (r.faculty !== facultyName) return false;
                    if (!ACTIVE_SCHEDULE_STATUSES.includes(r.status)) return false;
                    if (resolveRequestDate(r) !== iso) return false;
                    const rr = resolveRequestTimeRange(r);
                    return rr && t < rr.end && rr.start < t + SLOT_MINUTES;
                });
                if (collides) continue;

                windows.push({
                    date: iso,
                    day: dayName,
                    startTime,
                    endTime: minutesToTime(t + SLOT_MINUTES),
                    time: startTime,
                    remaining: capacity > 0 ? Math.max(0, capacity - bookedCount) : null,
                    label: `${dayName}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${startTime}`
                });
            }
        });
    }

    return windows;
}

/**
 * Faculty availability for display, grouped per faculty member.
 * Keeps the existing card shape so the current GUI keeps working,
 * but reflects slots the faculty has actually enabled.
 */
function getFacultyAvailability() {
    const shared = loadSharedAvailability();
    if (shared.length > 0 && shared.some(s => s.faculty)) {
        return shared
            .filter(s => s.available !== false)
            .map(s => ({
                id: s.id,
                faculty: s.faculty,
                displayName: s.displayName || s.faculty,
                // Must be carried through, the department pages group by these
                department: s.department || null,
                fullDepartment: s.fullDepartment || null,
                title: s.title || null,
                day: s.day,
                time: `${s.startTime} - ${s.endTime}`,
                startTime: s.startTime,
                endTime: s.endTime,
                slots: s.maxStudents || 1,
                available: true
            }));
    }
    return studentData.facultyAvailability.filter(f => f.available);
}

/**
 * Get all faculty
 */
function getAllFaculty() {
    return studentData.facultyAvailability;
}

/**
 * Get the signed-in student's identity from the session
 */
function getSessionStudent() {
    try {
        const sessionStr = localStorage.getItem('userSession');
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            return {
                name: session.name || 'Student',
                studentId: session.studentId || null,
                email: session.username || null
            };
        }
    } catch (e) {}
    return { name: 'Student', studentId: null, email: null };
}

/**
 * Check whether a stored record belongs to the signed-in student.
 * `ct_faculty_requests` is shared with the faculty side, so it holds
 * every student's requests and must be filtered before display.
 */
function isOwnRequest(r, me) {
    if (r.studentId && me.studentId) return r.studentId === me.studentId;
    if (r.email && me.email) return r.email === me.email;
    if (r.student && me.name) return r.student === me.name;
    return true;
}

/**
 * Read the shared request array without filtering by student.
 * Used internally by conflict checks and duplicate detection.
 */
function getMyRequestsRaw() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
        if (stored) {
            const requests = JSON.parse(stored);
            if (Array.isArray(requests)) return requests;
        }
    } catch (e) {
        console.warn('Error reading requests:', e);
    }
    return studentData.myRequests;
}

/**
 * Get my requests (synchronized with LocalStorage)
 */
function getMyRequests() {
    const me = getSessionStudent();
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
        if (stored) {
            const requests = JSON.parse(stored);
            if (Array.isArray(requests)) {
                const mine = requests
                    .filter(r => isOwnRequest(r, me))
                    .map(r => ({
                        id: r.id,
                        faculty: r.faculty || 'Mr. Jaafar Omar',
                        subject: r.subject,
                        concern: r.concern,
                        preferredDate: r.preferredDate,
                        preferredTime: r.preferredTime,
                        status: r.status || 'pending',
                        scheduledDate: r.confirmedDate || r.preferredDate,
                        scheduledTime: r.confirmedTime || r.preferredTime,
                        venue: r.venue,
                        notes: r.instructions,
                        rejectionReason: r.rejectionReason,
                        cancellationReason: r.cancellationReason,
                        submittedAt: r.submittedAt
                    }));
                return mine;
            }
        }
    } catch (e) {
        console.warn('Error reading requests:', e);
    }
    return studentData.myRequests;
}

/**
 * Get appointments
 */
function getAppointments() {
    const requests = getMyRequests();
    return requests.map(r => ({
        id: r.id,
        faculty: r.faculty || 'Mr. Jaafar Omar',
        subject: r.subject,
        date: r.scheduledDate || r.preferredDate,
        time: r.scheduledTime || r.preferredTime,
        status: r.status,
        location: r.venue || 'Room 302, Engineering Building',
        // Every reason a card can show must be carried through, otherwise the
        // card renders an empty explanation for that status
        rejectionReason: r.rejectionReason,
        cancellationReason: r.cancellationReason,
        outcomeNotes: r.outcomeNotes,
        notes: r.notes
    }));
}

/**
 * Get history
 */
function getHistory() {
    try {
        const storedRecords = localStorage.getItem(STORAGE_KEYS.RECORDS);
        if (storedRecords) {
            const records = JSON.parse(storedRecords);
            if (Array.isArray(records) && records.length > 0) {
                return records.map(rec => ({
                    id: rec.id,
                    faculty: rec.faculty || 'Mr. Jaafar Omar',
                    subject: rec.subject,
                    date: rec.date,
                    time: rec.time,
                    duration: rec.duration || '30 min',
                    status: rec.status || 'completed',
                    outcome: rec.concerns || rec.recommendations || 'Consultation completed'
                }));
            }
        }
    } catch (e) {
        console.warn('Error reading records:', e);
    }
    return studentData.history;
}

/**
 * Submit new consultation request
 */
function submitRequest(request) {
    let requests = [];
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
        if (stored) requests = JSON.parse(stored);
    } catch (e) {}

    const newId = requests.length ? Math.max(...requests.map(r => r.id || 0)) + 1 : (Math.max(...studentData.myRequests.map(r => r.id)) + 1);

    const me = getSessionStudent();
    const studentName = me.name;
    const studentId = me.studentId || '2023-10021';
    const email = me.email || 'student@dummy.com';
    const facultyName = request.faculty || 'Mr. Jaafar Omar';

    // --- Input validation (FR3) ---
    if (!request.subject || !request.subject.trim()) {
        return { error: 'Please choose a topic for your consultation.' };
    }
    if (!request.concern || !request.concern.trim()) {
        return { error: 'Please describe your concern so the faculty can prepare.' };
    }
    if (!request.preferredDate) {
        return { error: 'Please pick a preferred date.' };
    }
    if (!request.preferredTime) {
        return { error: 'Please pick a preferred time slot.' };
    }
    if (parseISODate(request.preferredDate) === null) {
        return { error: 'That date is not valid. Please pick again.' };
    }
    if (request.preferredDate < getTodayISO()) {
        return { error: 'Please choose a date that is today or later.' };
    }

    // --- FR6: duplicate request guard ---
    const requestedRange = resolveRequestTimeRange({ preferredTime: request.preferredTime });
    const duplicate = requests.find(r => {
        if (r.faculty !== facultyName) return false;
        if (r.subject !== request.subject.trim()) return false;
        if (r.status === 'cancelled' || r.status === 'rejected') return false;
        const rDate = resolveRequestDate(r);
        if (rDate !== request.preferredDate) return false;
        const rRange = resolveRequestTimeRange(r);
        if (!requestedRange || !rRange) return String(r.preferredTime) === String(request.preferredTime);
        return requestedRange.start < rRange.end && rRange.start < requestedRange.end;
    });
    if (duplicate) {
        return { error: `You already have a "${request.subject.trim()}" request with ${facultyName} on ${request.preferredDate}. Duplicate requests are not allowed.` };
    }

    // --- FR6: student already booked at this time ---
    const overlap = requests.find(r => {
        if (!ACTIVE_SCHEDULE_STATUSES.includes(r.status)) return false;
        if (!isOwnRequest(r, { name: studentName, studentId: studentId, email: email })) return false;
        if (resolveRequestDate(r) !== request.preferredDate) return false;
        const rRange = resolveRequestTimeRange(r);
        if (!requestedRange || !rRange) return false;
        return requestedRange.start < rRange.end && rRange.start < requestedRange.end;
    });
    if (overlap) {
        return { error: `Time conflict: you already have a ${overlap.status} consultation with ${overlap.faculty} on ${request.preferredDate} at ${overlap.confirmedTime || overlap.preferredTime}.` };
    }

    // --- FR6: slot must be inside the faculty's published availability ---
    const dayName = getDayNameForISODate(request.preferredDate);
    const availability = loadSharedAvailability();
    const daySlots = availability.filter(s => s.day === dayName && s.available !== false &&
        !!s.faculty && s.faculty === facultyName);
    if (daySlots.length === 0) {
        return { error: `${facultyName} has no available slots on ${dayName}. Please pick another day.` };
    }
    const inside = daySlots.some(s => {
        const sStart = timeToMinutes(s.startTime);
        const sEnd = timeToMinutes(s.endTime);
        if (sStart === null || sEnd === null || !requestedRange) return false;
        return requestedRange.start >= sStart && requestedRange.end <= sEnd;
    });
    if (!inside) {
        const windows = daySlots.map(s => `${s.startTime} - ${s.endTime}`).join(', ');
        return { error: `${request.preferredTime} is outside ${facultyName}'s availability on ${dayName} (${windows}). Please pick a time within those hours.` };
    }

    const newRequest = {
        id: newId,
        student: studentName,
        studentId: studentId,
        email: email,
        faculty: facultyName,
        subject: request.subject.trim(),
        concern: request.concern.trim(),
        preferredDate: request.preferredDate,
        preferredTime: request.preferredTime,
        status: 'pending',
        submittedAt: getTodayISO()
    };

    requests.unshift(newRequest);
    try {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    } catch (e) {}

    studentData.myRequests.unshift(newRequest);
    return newId;
}

/**
 * Cancel own request
 */
function cancelRequest(requestId) {
    let requests = [];
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
        if (stored) requests = JSON.parse(stored);
    } catch (e) {}

    const req = requests.find(r => r.id === parseInt(requestId, 10));
    if (req && req.status === 'pending') {
        req.status = 'cancelled';
        req.cancellationReason = 'Cancelled by student';
        req.cancelledAt = new Date().toISOString().split('T')[0];
        try {
            localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
        } catch (e) {}
        return true;
    }
    return false;
}

/**
 * Cancel appointment
 */
function cancelAppointment(appointmentId) {
    let requests = [];
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
        if (stored) requests = JSON.parse(stored);
    } catch (e) {}

    const req = requests.find(r => r.id === parseInt(appointmentId, 10));
    if (req && (req.status === 'scheduled' || req.status === 'pending')) {
        req.status = 'cancelled';
        req.cancellationReason = 'Cancelled by student';
        req.cancelledAt = new Date().toISOString().split('T')[0];
        try {
            localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
        } catch (e) {}
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
    cancelAppointment,
    getBookableSlots,
    timeToMinutes,
    minutesToTime,
    getTodayISO,
    getDayNameForISODate
};
