/**
 * CONSULT-TRAK - Faculty Dashboard JavaScript
 * Shared mock data, persistence, and controller logic for all faculty pages
 */

// ========================================
// STORAGE & INITIAL MOCK DATA
// ========================================

const STORAGE_KEYS = {
    REQUESTS: 'ct_faculty_requests',
    RECORDS: 'ct_faculty_records',
    AVAILABILITY: 'ct_faculty_availability',
    FACULTY_INFO: 'ct_faculty_info',
    // Faculty who have taken control of their own schedule. Needed because an
    // empty array and "never touched it" look identical once slots are deleted.
    AVAILABILITY_OWNERS: 'ct_availability_owners',
    SEED_VERSION: 'ct_seed_version'
};

// Bump this whenever the demo request data below changes. Browsers keep the
// previously saved requests forever, so without this marker a visitor would
// keep seeing the old statuses and never the updated demo data.
const DEMO_SEED_VERSION = 2;


// ========================================
// TIME HELPERS (FR6 - conflict detection)
// ========================================

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
    } else {
        if (hours > 23) return null;
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
 * Returns null for invalid/past-or-present dates the UI cannot offer.
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

// Statuses that occupy a real, reserved time on a faculty member's calendar.
const ACTIVE_SCHEDULE_STATUSES = ['scheduled', 'completed'];

const TIME_REGEX = /(\d{1,2}):(\d{2})\s*(am|pm)?/gi;

/**
 * Extract every clock time mentioned in free-text input such as
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
 * Derive [start, end] in minutes from a request's preferred/confirmed time text.
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

const DEFAULT_FACULTY_INFO = {
    id: 1,
    name: 'Mr. Jaafar Omar',
    email: 'faculty@dummy.com',
    department: 'SOCS Faculty',
    office: 'Room 302, Engineering Building',
    phone: '(555) 123-4567',
    bio: 'Associate Professor specializing in Software Engineering and Database Systems.'
};

/**
 * Availability belongs to a specific faculty member (FR7).
 * Every row carries the owner so one member can never see, edit or delete
 * another member's slots, and so the student picker can filter correctly.
 */
const DEFAULT_AVAILABILITY = [
    { id: 1, day: 'Monday', startTime: '9:00 AM', endTime: '12:00 PM', maxStudents: 5, available: true, faculty: DEFAULT_FACULTY_INFO.name },
    { id: 2, day: 'Monday', startTime: '2:00 PM', endTime: '5:00 PM', maxStudents: 4, available: true, faculty: DEFAULT_FACULTY_INFO.name },
    { id: 3, day: 'Wednesday', startTime: '10:00 AM', endTime: '1:00 PM', maxStudents: 6, available: true, faculty: DEFAULT_FACULTY_INFO.name },
    { id: 4, day: 'Friday', startTime: '9:00 AM', endTime: '12:00 PM', maxStudents: 5, available: false, faculty: DEFAULT_FACULTY_INFO.name }
];

const DEFAULT_REQUESTS = [
    {
        id: 1,
        student: 'John Smith',
        studentId: '2023-10021',
        email: 'john.smith@dummy.com',
        faculty: 'Mr. Jaafar Omar',
        subject: 'Course/Subject Requirements',
        concern: 'Need advice on electives for next semester and prerequisites for Senior Capstone Project.',
        preferredDate: '2026-09-28',
        preferredTime: '10:00 AM',
        venue: 'Room 302, Engineering Building',
        status: 'pending',
        submittedAt: '2026-09-23'
    },
    {
        id: 2,
        student: 'Emily Davis',
        studentId: '2022-04512',
        email: 'emily.davis@dummy.com',
        faculty: 'Mr. Jaafar Omar',
        subject: 'Thesis / Capstone Advising',
        concern: 'Looking for guidance and feedback on the proposed database schema and system architecture for my thesis.',
        preferredDate: '2026-09-28',
        preferredTime: '3:00 PM',
        venue: 'Google Meet (Online)',
        status: 'pending',
        submittedAt: '2026-09-23'
    },
    {
        id: 3,
        student: 'Robert Garcia',
        studentId: '2024-10892',
        email: 'robert.garcia@dummy.com',
        faculty: 'Mr. Jaafar Omar',
        subject: 'Academic Performance',
        concern: 'Struggling with binary search trees and recursion assignments. Requesting tutoring guidance.',
        preferredDate: '2026-09-30',
        preferredTime: '12:00 PM',
        venue: 'Room 302, Engineering Building',
        status: 'pending',
        submittedAt: '2026-09-24'
    },
    {
        id: 4,
        student: 'Amanda White',
        studentId: '2023-08734',
        email: 'amanda.white@dummy.com',
        faculty: 'Mr. Jaafar Omar',
        subject: 'OJT / Internship Concern',
        concern: 'Need review of internship endorsement letter and company qualification criteria.',
        preferredDate: '2026-09-30',
        preferredTime: '11:00 AM',
        venue: 'Room 302, Engineering Building',
        status: 'pending',
        submittedAt: '2026-09-24'
    },
    {
        id: 5,
        student: 'David Lee',
        studentId: '2023-01923',
        email: 'david.lee@dummy.com',
        faculty: 'Mr. Jaafar Omar',
        subject: 'Grades',
        concern: 'Inquiry regarding practical midterm exam scores and rubrics breakdown.',
        preferredDate: '2026-09-28',
        preferredTime: '9:00 AM',
        status: 'pending',
        submittedAt: '2026-09-22'
    },
    {
        id: 6,
        student: 'Sarah Johnson',
        studentId: '2022-03129',
        email: 'sarah.johnson@dummy.com',
        faculty: 'Mr. Jaafar Omar',
        subject: 'Thesis / Capstone Advising',
        concern: 'Requesting a final review of my Chapter 3 research methodology and testing instruments before submission.',
        preferredDate: '2026-09-30',
        preferredTime: '10:00 AM',
        venue: 'Room 302, Engineering Building',
        status: 'pending',
        submittedAt: '2026-09-25'
    }
];

const DEFAULT_RECORDS = [
    {
        id: 1,
        faculty: 'Mr. Jaafar Omar',
        student: 'Sarah Johnson',
        studentId: '2022-03129',
        subject: 'Thesis / Capstone Advising',
        date: '2026-09-15',
        time: '1:30 PM',
        duration: '45 min',
        status: 'completed',
        concerns: 'Discussed thesis outline, data collection methods, and methodology validation.',
        recommendations: 'Expand literature review section and refine survey questionnaires.',
        followUp: 'Schedule mock defense in 3 weeks'
    },
    {
        id: 2,
        faculty: 'Mr. Jaafar Omar',
        student: 'Mark Thompson',
        studentId: '2023-05421',
        subject: 'Academic Performance',
        date: '2026-09-14',
        time: '2:00 PM',
        duration: '30 min',
        status: 'completed',
        concerns: 'Database design normalization and query optimization issues in web project.',
        recommendations: 'Apply 3NF schema design and add indexed foreign keys.',
        followUp: null
    },
    {
        id: 3,
        faculty: 'Mr. Jaafar Omar',
        student: 'Lisa Chen',
        studentId: '2022-07823',
        subject: 'OJT / Internship Concern',
        date: '2026-09-11',
        time: '11:00 AM',
        duration: '60 min',
        status: 'completed',
        concerns: 'Internship placement options and technical portfolio preparation.',
        recommendations: 'Publish GitHub repository projects and prepare clean resume CV.',
        followUp: 'Follow up on internship company endorsements'
    },
    {
        id: 4,
        faculty: 'Mr. Jaafar Omar',
        student: 'Kevin Martinez',
        studentId: '2024-02319',
        subject: 'Course/Subject Requirements',
        date: '2026-09-08',
        time: '9:00 AM',
        duration: '30 min',
        status: 'cancelled',
        concerns: 'Course prerequisite waiver discussion.',
        recommendations: null,
        followUp: null,
        cancellationReason: 'Student cancelled due to sudden medical appointment'
    }
];

// In-memory runtime state synced with LocalStorage
function loadStoredArray(key, defaultData) {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.warn(`Error reading ${key} from storage:`, e);
    }
    // Initialize default in storage
    saveStoredArray(key, defaultData);
    return JSON.parse(JSON.stringify(defaultData));
}

function saveStoredArray(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn(`Error saving ${key} to storage:`, e);
    }
}

/**
 * Keep the saved demo requests in step with the demo data in this file.
 *
 * A browser keeps whatever was saved under ct_faculty_requests, so editing
 * DEFAULT_REQUESTS alone would never reach anyone who had already loaded the
 * page: they would keep seeing the previous statuses. Recording the seed
 * version lets us tell "saved earlier" from "up to date" and refresh the
 * demo request list exactly once per data change.
 *
 * Only the demo request list is refreshed. Availability and consultation
 * records are left alone so real edits made by the faculty are never lost.
 */
function syncDemoRequestsWithSeed() {
    let saved = 0;
    try {
        saved = parseInt(localStorage.getItem(STORAGE_KEYS.SEED_VERSION), 10) || 0;
    } catch (e) {
        saved = 0;
    }
    if (saved >= DEMO_SEED_VERSION) return;

    saveStoredArray(STORAGE_KEYS.REQUESTS, DEFAULT_REQUESTS);
    try {
        localStorage.setItem(STORAGE_KEYS.SEED_VERSION, String(DEMO_SEED_VERSION));
    } catch (e) {
        console.warn('Error saving seed version:', e);
    }
}

syncDemoRequestsWithSeed();

const facultyData = {
    faculty: DEFAULT_FACULTY_INFO,
    availability: loadStoredArray(STORAGE_KEYS.AVAILABILITY, DEFAULT_AVAILABILITY),
    requests: loadStoredArray(STORAGE_KEYS.REQUESTS, DEFAULT_REQUESTS),
    records: loadStoredArray(STORAGE_KEYS.RECORDS, DEFAULT_RECORDS)
};

// ========================================
// CONTROLLER FUNCTIONS
// ========================================

/**
 * Get faculty info
 */
function getFacultyInfo() {
    return facultyData.faculty;
}

/**
 * Get dynamic stats for dashboard and navigation
 */
function getStats() {
    const requests = getAllRequests();
    const records = getRecords();

    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const scheduledRequests = requests.filter(r => r.status === 'scheduled');

    // Count today's appointments (matching current date or scheduled)
    const todayAppointments = scheduledRequests.length;

    // Completed consultations
    const completedCount = records.filter(r => r.status === 'completed').length +
                           requests.filter(r => r.status === 'completed').length;

    // Unique students handled
    const studentSet = new Set([
        ...requests.map(r => r.student || r.studentId),
        ...records.map(r => r.student || r.studentId)
    ]);

    return {
        pendingRequests,
        todayAppointments,
        completedThisWeek: completedCount,
        totalStudents: studentSet.size
    };
}

/**
 * Get all consultation requests
 */
function getAllRequests() {
    facultyData.requests = loadStoredArray(STORAGE_KEYS.REQUESTS, facultyData.requests);
    return facultyData.requests;
}

/**
 * Get pending consultation requests
 */
function getPendingRequests() {
    return getAllRequests().filter(r => r.status === 'pending');
}

/**
 * Get scheduled consultation requests
 */
function getScheduledRequests() {
    return getAllRequests().filter(r => r.status === 'scheduled');
}

/**
 * Get request by ID
 */
function getRequestById(requestId) {
    return getAllRequests().find(r => r.id === parseInt(requestId, 10));
}

/**
 * Find a scheduling conflict for a candidate appointment (FR6).
 *
 * Blocks, in order of severity:
 *  1. duplicate request  - same student + faculty + subject + date + time already open
 *  2. student overlap    - the student already has another consultation at that time
 *  3. faculty overlap    - the faculty member is already booked at that time
 *  4. slot capacity      - a weekly availability slot is full
 *
 * @param {Object} candidate
 * @param {Array} [requests] Full request list; defaults to stored requests
 * @param {Array} [slots] Faculty availability; defaults to stored availability
 * @param {number} [excludeRequestId] Ignore a request (e.g. the one being rescheduled)
 * @returns {{code: string, message: string}|null} conflict, or null when bookable
 */
function findScheduleConflict(candidate, requests, slots, excludeRequestId) {
    const list = Array.isArray(requests) ? requests : getAllRequests();
    const availability = Array.isArray(slots) ? slots : getAvailabilityFor(candidate.faculty);

    const date = resolveRequestDate(candidate);
    const range = resolveRequestTimeRange(candidate);

    if (!date) {
        return { code: 'NO_DATE', message: 'This consultation has no date. Please set a date before confirming.' };
    }
    if (!range) {
        return { code: 'NO_TIME', message: 'This consultation has no valid time. Please set a time before confirming.' };
    }

    const others = list.filter(r => parseInt(r.id, 10) !== parseInt(excludeRequestId, 10));
    const sameStudent = r => candidate.studentId
        ? (r.studentId || '') === candidate.studentId
        : (r.email && r.email === candidate.email) || (r.student && r.student === candidate.student);

    // 1. Duplicate request: identical open request from the same student
    const duplicate = others.find(r =>
        ACTIVE_SCHEDULE_STATUSES.concat('pending', 'accepted').includes(r.status) &&
        sameStudent(r) &&
        r.faculty === candidate.faculty &&
        r.subject === candidate.subject &&
        resolveRequestDate(r) === date &&
        r.status !== 'cancelled' && r.status !== 'rejected'
    );
    if (duplicate) {
        return {
            code: 'DUPLICATE',
            message: `You already have a "${candidate.subject}" request with ${candidate.faculty} for ${date}. Duplicate requests are not allowed.`
        };
    }

    const otherRange = r => {
        const rDate = resolveRequestDate(r);
        if (rDate !== date) return null;
        return resolveRequestTimeRange(r);
    };

    // 2. Student already has a different consultation at this time
    const studentClash = others.find(r => {
        if (!ACTIVE_SCHEDULE_STATUSES.includes(r.status)) return false;
        if (!sameStudent(r)) return false;
        const range2 = otherRange(r);
        return range2 && range.start < range2.end && range2.start < range.end;
    });
    if (studentClash) {
        return {
            code: 'STUDENT_OVERLAP',
            message: `Time conflict: you already have a ${studentClash.status} consultation with ${studentClash.faculty} on ${date} at ${studentClash.confirmedTime || studentClash.preferredTime}.`
        };
    }

    // 3. Faculty member is already booked at this time
    const facultyClash = others.find(r => {
        if (!ACTIVE_SCHEDULE_STATUSES.includes(r.status)) return false;
        if (r.faculty !== candidate.faculty) return false;
        if (r.id === candidate.id) return false;
        const range2 = otherRange(r);
        return range2 && range.start < range2.end && range2.start < range.end;
    });
    if (facultyClash) {
        return {
            code: 'FACULTY_OVERLAP',
            message: `Schedule conflict: ${candidate.faculty} already has a consultation on ${date} at ${facultyClash.confirmedTime || facultyClash.preferredTime}.`
        };
    }

    // 4. Weekly availability slot capacity
    const dayName = getDayNameForISODate(date);
    if (dayName) {
        const daySlots = availability.filter(s => s.day === dayName && s.available !== false);

        // A day may have several non-overlapping windows, so look for the one
        // that actually contains the requested range instead of taking the first.
        const containing = daySlots.find(s => {
            const sStart = timeToMinutes(s.startTime);
            const sEnd = timeToMinutes(s.endTime);
            if (sStart === null || sEnd === null) return false;
            return range.start >= sStart && range.end <= sEnd;
        });

        if (containing) {
            const slotStart = timeToMinutes(containing.startTime);
            const slotEnd = timeToMinutes(containing.endTime);
            const maxStudents = parseInt(containing.maxStudents, 10);
            if (!isNaN(maxStudents) && maxStudents > 0) {
                const booked = others.filter(r =>
                    r.faculty === candidate.faculty &&
                    ACTIVE_SCHEDULE_STATUSES.includes(r.status) &&
                    resolveRequestDate(r) === date &&
                    (() => {
                        const rr = resolveRequestTimeRange(r);
                        return rr && rr.start >= slotStart && rr.end <= slotEnd;
                    })()
                ).length;
                if (booked >= maxStudents) {
                    return {
                        code: 'SLOT_FULL',
                        message: `That slot is fully booked (${booked}/${maxStudents} consultations on ${dayName}, ${date}). Please choose another time.`
                    };
                }
            }
        } else {
            const windowText = daySlots
                .map(s => `${s.startTime} - ${s.endTime}`)
                .join(', ');
            if (daySlots.length > 0) {
                return {
                    code: 'OUTSIDE_AVAILABILITY',
                    message: `${date} is a ${dayName}, but ${candidate.faculty}'s availability is ${windowText}. Choose a time inside one of those windows.`
                };
            }
            // The day exists but every one of its slots is switched off
            if (availability.some(s => s.day === dayName)) {
                return {
                    code: 'SLOT_UNAVAILABLE',
                    message: `${candidate.faculty} has no active ${dayName} slots on ${date}. Pick another day.`
                };
            }
            return {
                code: 'DAY_NO_AVAILABILITY',
                message: `${candidate.faculty} has no ${dayName} availability. Pick another day.`
            };
        }
    }

    return null;
}

/**
 * Public conflict check used by the GUI to validate before submitting.
 * @param {Object} candidate
 * @param {number} [excludeRequestId]
 */
function checkScheduleConflict(candidate, excludeRequestId) {
    // Capacity is checked against the slots of the faculty member being booked
    const slots = getAvailabilityFor(candidate.faculty);
    return findScheduleConflict(candidate, getAllRequests(), slots, excludeRequestId);
}

/**
 * Accept a consultation request
 * Valid transition: Pending -> Accepted
 * @param {number} requestId
 * @param {Object} [details] Optional schedule customizations (venue, confirmedDate, confirmedTime, instructions)
 * @returns {boolean|{conflict: Object}} false on invalid transition, conflict object when blocked
 */
function acceptRequest(requestId, details = {}) {
    const requests = getAllRequests();
    const request = requests.find(r => r.id === parseInt(requestId, 10));
    if (!request) return false;

    // Strict status transition check: only pending requests can be accepted
    if (request.status !== 'pending') {
        console.warn(`Cannot accept request #${requestId}: current status is '${request.status}' (must be 'pending')`);
        return false;
    }

    const candidate = {
        id: request.id,
        student: request.student,
        studentId: request.studentId,
        email: request.email,
        faculty: request.faculty,
        subject: request.subject,
        confirmedDate: details.confirmedDate || request.preferredDate,
        confirmedTime: details.confirmedTime || request.preferredTime
    };

    const conflict = findScheduleConflict(candidate, requests, getAvailabilityFor(request.faculty), request.id);
    if (conflict) return { conflict };

    request.status = 'scheduled';
    request.confirmedDate = candidate.confirmedDate;
    request.confirmedTime = candidate.confirmedTime;
    request.venue = details.venue || details.location || request.venue || 'Room 302, Engineering Building';
    if (details.instructions) {
        request.instructions = details.instructions;
    }
    request.acceptedAt = new Date().toISOString().split('T')[0];

    saveStoredArray(STORAGE_KEYS.REQUESTS, requests);
    return true;
}

/**
 * Reject a consultation request with a reason
 * Valid transition: Pending -> Rejected
 * @param {number} requestId
 * @param {string} reason
 */
function rejectRequest(requestId, reason) {
    const requests = getAllRequests();
    const request = requests.find(r => r.id === parseInt(requestId, 10));
    if (!request) return false;

    // Strict status transition check: only pending requests can be rejected
    if (request.status !== 'pending') {
        console.warn(`Cannot reject request #${requestId}: current status is '${request.status}' (must be 'pending')`);
        return false;
    }

    if (!reason || !reason.trim()) {
        console.warn('Rejection reason is required.');
        return false;
    }

    request.status = 'rejected';
    request.rejectionReason = reason.trim();
    request.rejectedAt = new Date().toISOString().split('T')[0];

    saveStoredArray(STORAGE_KEYS.REQUESTS, requests);
    return true;
}

/**
 * Reschedule a consultation request
 * Only applicable for already accepted/scheduled requests
 * @param {number} requestId
 * @param {Object} details
 */
function rescheduleRequest(requestId, details = {}) {
    const requests = getAllRequests();
    const request = requests.find(r => r.id === parseInt(requestId, 10));
    if (!request) return false;

    if (request.status !== 'scheduled') {
        console.warn(`Cannot reschedule request #${requestId}: current status is '${request.status}' (must be 'scheduled')`);
        return false;
    }

    // FR6: the new time must not collide with other bookings
    const candidate = {
        id: request.id,
        student: request.student,
        studentId: request.studentId,
        email: request.email,
        faculty: request.faculty,
        subject: request.subject,
        confirmedDate: details.newDate || request.confirmedDate,
        confirmedTime: details.newTime || request.confirmedTime
    };
    const conflict = findScheduleConflict(candidate, requests, getAvailabilityFor(request.faculty), request.id);
    if (conflict) return { conflict };

    if (details.newDate) request.confirmedDate = details.newDate;
    if (details.newTime) request.confirmedTime = details.newTime;
    if (details.venue) request.venue = details.venue;
    if (details.instructions) request.instructions = details.instructions;
    if (details.reason) request.rescheduleReason = details.reason;
    request.status = 'scheduled';
    request.rescheduledAt = new Date().toISOString().split('T')[0];

    saveStoredArray(STORAGE_KEYS.REQUESTS, requests);
    return true;
}

/**
 * Complete a consultation request and archive it to consultation records
 * Valid transition: Accepted -> Completed
 * @param {number} requestId
 * @param {Object} outcomeDetails
 */
function completeRequest(requestId, outcomeDetails = {}) {
    const requests = getAllRequests();
    const request = requests.find(r => r.id === parseInt(requestId, 10));
    if (!request) return false;

    // Strict status transition check: only accepted/scheduled requests can be completed
    if (request.status !== 'scheduled') {
        console.warn(`Cannot complete request #${requestId}: current status is '${request.status}' (must be 'scheduled')`);
        return false;
    }

    request.status = 'completed';
    request.completedAt = new Date().toISOString().split('T')[0];
    request.outcomeNotes = outcomeDetails.concerns || outcomeDetails.notes || 'Consultation completed successfully.';

    // Save into consultation records table automatically
    const records = getRecords();
    const newRecordId = Math.max(...records.map(r => r.id), 0) + 1;
    const newRecord = {
        id: newRecordId,
        // Keep the link back to the request and the faculty who handled it so
        // history scoping and report de-duplication can rely on it (FR9/FR10/FR11)
        requestId: request.id,
        faculty: request.faculty || (facultyData.faculty && facultyData.faculty.name) || null,
        student: request.student,
        studentId: request.studentId,
        subject: request.subject,
        date: request.confirmedDate || request.preferredDate || new Date().toISOString().split('T')[0],
        time: request.confirmedTime || request.preferredTime || '10:00 AM',
        duration: outcomeDetails.duration || '30 min',
        status: 'completed',
        concerns: outcomeDetails.concerns || request.concern || 'Consultation conducted.',
        recommendations: outcomeDetails.recommendations || 'Provided advising and guidance.',
        followUp: outcomeDetails.followUp || null
    };
    records.unshift(newRecord);

    saveStoredArray(STORAGE_KEYS.REQUESTS, requests);
    saveStoredArray(STORAGE_KEYS.RECORDS, records);
    return true;
}

/**
 * Cancel an accepted/scheduled request
 * Valid transition: Accepted -> Cancelled
 * @param {number} requestId
 * @param {string} reason
 */
function cancelRequest(requestId, reason) {
    const requests = getAllRequests();
    const request = requests.find(r => r.id === parseInt(requestId, 10));
    if (!request) return false;

    // Strict status transition check: only accepted/scheduled requests can be cancelled
    if (request.status !== 'scheduled') {
        console.warn(`Cannot cancel request #${requestId}: current status is '${request.status}' (must be 'scheduled')`);
        return false;
    }

    if (!reason || !reason.trim()) {
        console.warn('Cancellation reason is required.');
        return false;
    }

    request.status = 'cancelled';
    request.cancellationReason = reason.trim();
    request.cancelledAt = new Date().toISOString().split('T')[0];

    saveStoredArray(STORAGE_KEYS.REQUESTS, requests);
    return true;
}

/**
 * Delete a request permanently
 * @param {number} requestId
 */
function deleteRequest(requestId) {
    let requests = getAllRequests();
    const initialLength = requests.length;
    requests = requests.filter(r => r.id !== parseInt(requestId, 10));
    if (requests.length !== initialLength) {
        saveStoredArray(STORAGE_KEYS.REQUESTS, requests);
        facultyData.requests = requests;
        return true;
    }
    return false;
}

/**
 * Get availability slots
 */
/**
 * Name of the faculty member currently signed in.
 * Session wins, then the stored faculty profile, then the demo default.
 */
function getCurrentFacultyName() {
    try {
        if (typeof getCurrentUser === 'function') {
            const user = getCurrentUser();
            if (user && user.role === 'faculty' && user.name) return user.name;
        }
    } catch (e) {}
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.FACULTY_INFO);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.name) return parsed.name;
        }
    } catch (e) {}
    return (facultyData.faculty && facultyData.faculty.name) || DEFAULT_FACULTY_INFO.name;
}

/**
 * Faculty who have edited their own schedule at least once.
 */
function getAvailabilityOwners() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.AVAILABILITY_OWNERS);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {}
    return [];
}

function markAvailabilityOwner(name) {
    const owners = getAvailabilityOwners();
    if (owners.indexOf(name) === -1) {
        owners.push(name);
        saveStoredArray(STORAGE_KEYS.AVAILABILITY_OWNERS, owners);
    }
}

/**
 * Availability for one faculty member (FR7).
 */
function getAvailabilityFor(facultyName) {
    if (!facultyName) return getAvailability();
    return getAvailability().filter(s => (s.faculty || DEFAULT_FACULTY_INFO.name) === facultyName);
}

/**
 * Availability the signed-in faculty member may manage.
 */
function getMyAvailability() {
    return getAvailabilityFor(getCurrentFacultyName());
}

function getAvailability() {
    facultyData.availability = loadStoredArray(STORAGE_KEYS.AVAILABILITY, facultyData.availability);
    return facultyData.availability;
}

/**
 * Validate an availability slot definition (FR7).
 * @returns {{ok: true}|{ok: false, message: string}}
 */
function validateAvailabilitySlot(slot, excludeId) {
    const day = slot.day;
    if (!day || DAY_NAMES.indexOf(day) === -1) {
        return { ok: false, message: 'Please choose a valid day of the week.' };
    }

    const start = timeToMinutes(slot.startTime);
    const end = timeToMinutes(slot.endTime);

    if (start === null) {
        return { ok: false, message: 'Please enter a valid start time.' };
    }
    if (end === null) {
        return { ok: false, message: 'Please enter a valid end time.' };
    }
    if (end <= start) {
        return { ok: false, message: 'End time must be later than start time.' };
    }

    const max = parseInt(slot.maxStudents, 10);
    if (isNaN(max) || max < 1) {
        return { ok: false, message: 'Maximum students must be at least 1.' };
    }
    if (max > 20) {
        return { ok: false, message: 'Maximum students cannot exceed 20.' };
    }

    // Overlap check against this faculty member's own slots on the same day (FR6).
    // Other members' schedules are irrelevant to whether this slot is valid.
    const slots = getMyAvailability();
    const overlap = slots.find(s => {
        if (s.day !== day) return false;
        if (excludeId !== undefined && parseInt(s.id, 10) === parseInt(excludeId, 10)) return false;
        const sStart = timeToMinutes(s.startTime);
        const sEnd = timeToMinutes(s.endTime);
        if (sStart === null || sEnd === null) return false;
        return start < sEnd && sStart < end;
    });
    if (overlap) {
        return {
            ok: false,
            message: `This overlaps an existing ${day} slot (${overlap.startTime} - ${overlap.endTime}). Choose a different time.`
        };
    }

    return { ok: true };
}

/**
 * Bookable appointment windows for the signed-in faculty, for the next 14 days (FR5/FR6).
 * Only slots the faculty marked available are returned, and slots that are
 * already fully booked are dropped so students cannot pick them.
 * @param {number} [days] How many days ahead to offer
 * @returns {Array<{date, day, startTime, endTime, label}>}
 */
function getBookableSlots(days = 14, facultyName) {
    const owner = facultyName || getCurrentFacultyName();
    const slots = getAvailabilityFor(owner).filter(s => s.available !== false);
    const requests = getAllRequests();
    const today = new Date();
    const windows = [];

    for (let offset = 1; offset <= days; offset++) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
        const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const dayName = DAY_NAMES[(date.getDay() + 6) % 7];

        slots.filter(s => s.day === dayName).forEach(slot => {
            const slotStart = timeToMinutes(slot.startTime);
            const slotEnd = timeToMinutes(slot.endTime);
            if (slotStart === null || slotEnd === null) return;

            const max = parseInt(slot.maxStudents, 10);
            const booked = requests.filter(r => {
                if (r.faculty !== owner) return false;
                if (!ACTIVE_SCHEDULE_STATUSES.includes(r.status)) return false;
                if (resolveRequestDate(r) !== iso) return false;
                const rr = resolveRequestTimeRange(r);
                return rr && rr.start >= slotStart && rr.end <= slotEnd;
            }).length;

            if (!isNaN(max) && max > 0 && booked >= max) return;

            windows.push({
                date: iso,
                day: dayName,
                startTime: slot.startTime,
                endTime: slot.endTime,
                remaining: isNaN(max) || max <= 0 ? null : Math.max(0, max - booked),
                label: `${dayName}, ${slot.startTime} - ${slot.endTime}`
            });
        });
    }

    return windows;
}

/**
 * Update availability (FR7). Only the signed-in member's own slot can change.
 */
function updateAvailability(slotId, changes) {
    const me = getCurrentFacultyName();
    const slots = getAvailability();
    const slot = slots.find(s =>
        s.id === parseInt(slotId, 10) && (s.faculty || DEFAULT_FACULTY_INFO.name) === me
    );
    if (slot) {
        const merged = { ...slot, ...changes };
        const validation = validateAvailabilitySlot(merged, slotId);
        if (!validation.ok) {
            return { ok: false, message: validation.message };
        }
        Object.assign(slot, changes);
        markAvailabilityOwner(me);
        saveStoredArray(STORAGE_KEYS.AVAILABILITY, slots);
        return { ok: true, slot };
    }
    return { ok: false, message: 'Slot not found.' };
}

/**
 * Add new availability slot (FR7)
 * @returns {number|{error: string}} new slot id, or a validation error
 */
function addAvailabilitySlot(slot) {
    const me = getCurrentFacultyName();
    const validation = validateAvailabilitySlot(slot);
    if (!validation.ok) {
        return { error: validation.message };
    }
    const slots = getAvailability();
    const newId = Math.max(...slots.map(s => s.id), 0) + 1;
    // Stamp the owner so this slot belongs to the member who created it
    slots.push({ ...slot, id: newId, available: slot.available !== false, faculty: me });
    markAvailabilityOwner(me);
    saveStoredArray(STORAGE_KEYS.AVAILABILITY, slots);
    return newId;
}

/**
 * Remove availability slot (FR7). Another member's slot is never removable.
 */
function removeAvailabilitySlot(slotId) {
    const me = getCurrentFacultyName();
    let slots = getAvailability();
    const initialLength = slots.length;
    slots = slots.filter(s => !(s.id === parseInt(slotId, 10) && (s.faculty || DEFAULT_FACULTY_INFO.name) === me));
    if (slots.length !== initialLength) {
        // Keep this member in the owner registry so an emptied schedule is not
        // silently refilled with the demo slots on the student side
        markAvailabilityOwner(me);
        saveStoredArray(STORAGE_KEYS.AVAILABILITY, slots);
        facultyData.availability = slots;
        return true;
    }
    return false;
}

/**
 * Get consultation records
 */
function getRecords() {
    facultyData.records = loadStoredArray(STORAGE_KEYS.RECORDS, facultyData.records);
    return facultyData.records;
}

/**
 * Save new consultation record
 */
function saveConsultationRecord(record) {
    const records = getRecords();
    const newId = Math.max(...records.map(r => r.id), 0) + 1;
    const newRecord = {
        ...record,
        id: newId,
        faculty: record.faculty || (facultyData.faculty && facultyData.faculty.name) || null,
        status: 'completed',
        date: record.date || getTodayISO(),
        time: record.time || '10:00 AM'
    };
    records.unshift(newRecord);
    saveStoredArray(STORAGE_KEYS.RECORDS, records);
    return newId;
}

/**
 * Combine requests and records into one searchable history (FR11).
 * Scoped to the signed-in faculty member when a name is given.
 *
 * @param {Object} [filters] { search, status, dateFrom, dateTo, faculty }
 * @returns {Array<{student, subject, date, time, status, detail}>}
 */
function getSearchableHistory(filters = {}) {
    const facultyName = filters.faculty || null;
    const rows = [
        ...getRecords().map(r => ({
            id: `C-${r.id}`,
            source: 'record',
            requestId: r.requestId || null,
            faculty: r.faculty || null,
            student: r.student,
            studentId: r.studentId || '',
            subject: r.subject,
            date: r.date,
            time: r.time || '',
            status: r.status || 'completed',
            detail: r.concerns || r.cancellationReason || r.recommendations || '',
            concerns: r.concerns || '',
            recommendations: r.recommendations || ''
        })),
        ...getAllRequests().map(r => ({
            id: `R-${r.id}`,
            source: 'request',
            requestId: r.id,
            faculty: r.faculty || null,
            student: r.student,
            studentId: r.studentId || '',
            subject: r.subject,
            date: resolveRequestDate(r) || '',
            time: r.confirmedTime || r.preferredTime || '',
            status: r.status || 'pending',
            detail: r.rejectionReason || r.cancellationReason || r.outcomeNotes || r.concern || '',
            concerns: r.concern || '',
            recommendations: r.outcomeNotes || ''
        }))
    ];

    const search = (filters.search || '').trim().toLowerCase();
    const status = filters.status || 'all';
    const dateFrom = filters.dateFrom || '';
    const dateTo = filters.dateTo || '';

    return rows.filter(row => {
        // Scope to a single faculty member across both sources
        if (facultyName && row.faculty !== facultyName) return false;
        if (status !== 'all' && row.status !== status) return false;
        if (dateFrom && (!row.date || row.date < dateFrom)) return false;
        if (dateTo && (!row.date || row.date > dateTo)) return false;

        if (search) {
            const haystack = [row.student, row.studentId, row.subject, row.detail, row.concerns, row.recommendations]
                .filter(Boolean).join(' ').toLowerCase();
            if (haystack.indexOf(search) === -1) return false;
        }
        return true;
    });
}

/**
 * Report data scoped to one faculty member (FR12).
 * A request and the record it produced are counted once, not twice.
 * @param {Object} [options] { from, to, faculty }
 */
function getReportData(options = {}) {
    const facultyName = options.faculty === 'all'
        ? null
        : (options.faculty || (facultyData.faculty && facultyData.faculty.name) || null);
    const scoped = getSearchableHistory({
        faculty: facultyName,
        dateFrom: options.from || '',
        dateTo: options.to || ''
    });

    const rows = collapseRequestAndRecord(scoped);

    const statusCounts = { pending: 0, scheduled: 0, completed: 0, cancelled: 0, rejected: 0 };
    rows.forEach(row => {
        if (statusCounts[row.status] !== undefined) statusCounts[row.status]++;
    });

    const byDate = {};
    rows.forEach(row => {
        if (!row.date) return;
        byDate[row.date] = (byDate[row.date] || 0) + 1;
    });

    return {
        total: rows.length,
        statusCounts,
        byDate,
        rows,
        range: { from: options.from || '', to: options.to || '' }
    };
}

/**
 * Merge the request lifecycle row with the record it produced.
 * Without this, a completed consultation is counted twice.
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
            // handled together with its request below
            if (consumed.has('rec-' + row.requestId)) return;
            consumed.add('rec-' + row.requestId);
            out.push(row);
            return;
        }
        if (row.source === 'request' && recordByRequest[row.requestId]) {
            const rec = recordByRequest[row.requestId];
            if (consumed.has('rec-' + row.requestId)) return;
            consumed.add('rec-' + row.requestId);
            out.push(Object.assign({}, rec, {
                id: row.id,
                requestId: row.requestId,
                source: 'merged',
                status: rec.status || 'completed',
                date: rec.date || row.date,
                time: rec.time || row.time,
                concerns: rec.concerns || row.concerns,
                recommendations: rec.recommendations || row.recommendations
            }));
            return;
        }
        out.push(row);
    });

    return out;
}

/**
 * Resolve a named period into an ISO date range (FR12).
 * @param {string} period week | month | semester | all
 */
function resolveDateRange(period) {
    const today = new Date();
    const to = getTodayISO();
    let from = '';

    if (period === 'week') {
        from = toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6));
    } else if (period === 'month') {
        from = toISODate(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()));
    } else if (period === 'semester') {
        from = toISODate(new Date(today.getFullYear(), today.getMonth() - 5, today.getDate()));
    }

    return { from, to };
}

function toISODate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * Build CSV text for a report (FR12).
 */
function toCSV(report) {
    const header = ['Date', 'Student', 'Student ID', 'Subject', 'Time', 'Status', 'Concerns', 'Recommendations'];
    const escapeCell = value => {
        const str = value === null || value === undefined ? '' : String(value);
        return /[",\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str;
    };

    const lines = [header.join(',')];
    (report.rows || []).forEach(row => {
        lines.push([
            row.date, row.student, row.studentId, row.subject,
            row.time, row.status, row.concerns, row.recommendations
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

/**
 * Get today's schedule combining scheduled requests and default slots
 */
function getTodaySchedule() {
    const requests = getAllRequests();
    const scheduled = requests
        .filter(r => r.status === 'scheduled')
        .map(r => ({
            id: r.id,
            student: r.student,
            time: r.confirmedTime || r.preferredTime || '10:00 AM',
            subject: r.subject,
            venue: r.venue || 'Room 302, Engineering Building',
            status: 'scheduled'
        }));

    if (scheduled.length > 0) {
        return scheduled;
    }

    return [
        { id: 101, student: 'Robert Garcia', time: '9:00 AM', subject: 'Course/Subject Requirements', status: 'scheduled' },
        { id: 102, student: 'Sarah Johnson', time: '11:00 AM', subject: 'Thesis / Capstone Advising', status: 'completed' },
        { id: 103, student: 'Open Consultation Slot', time: '2:00 PM', subject: 'Office Hours', status: 'open' }
    ];
}

// Export for global use
window.facultyData = facultyData;
window.facultyFunctions = {
    getFacultyInfo,
    getStats,
    getAllRequests,
    getPendingRequests,
    getScheduledRequests,
    getRequestById,
    acceptRequest,
    rejectRequest,
    rescheduleRequest,
    completeRequest,
    cancelRequest,
    deleteRequest,
    getAvailability,
    updateAvailability,
    addAvailabilitySlot,
    removeAvailabilitySlot,
    getRecords,
    saveConsultationRecord,
    getTodaySchedule,
    checkScheduleConflict,
    getBookableSlots,
    validateAvailabilitySlot,
    getSearchableHistory,
    getReportData,
    collapseRequestAndRecord,
    getCurrentFacultyName,
    getMyAvailability,
    getAvailabilityFor,
    getAvailabilityOwners,
    resolveDateRange,
    toCSV,
    downloadCSV,
    timeToMinutes,
    minutesToTime,
    getTodayISO,
    DAY_NAMES
};
