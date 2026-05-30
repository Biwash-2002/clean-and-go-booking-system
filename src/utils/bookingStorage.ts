/**
 * bookingStorage.ts
 *
 * Centralised helpers for reading/writing booking history in localStorage.
 * Bookings are scoped PER USER using the key pattern:
 *   car_wash_bookings_<normalised-email>
 *
 * This prevents history from leaking across accounts or appearing on
 * fresh registrations / logins where no booking has been made yet.
 */

/** Returns the storage key for the currently logged-in user, or null if not logged in. */
export const getBookingsKey = (): string | null => {
    const email = localStorage.getItem('car_wash_logged_in_email');
    if (!email) return null;
    // Normalise to lowercase and strip whitespace for safety
    return `car_wash_bookings_${email.trim().toLowerCase()}`;
};

/** Load the booking array for the current user. Returns [] if none or not logged in. */
export const loadUserBookings = <T = unknown>(): T[] => {
    const key = getBookingsKey();
    if (!key) return [];
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

/** Save the booking array for the current user. No-op if not logged in. */
export const saveUserBookings = <T = unknown>(bookings: T[]): void => {
    const key = getBookingsKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(bookings));
};

/** Add a single booking to the front of the current user's history. */
export const addUserBooking = <T = unknown>(booking: T): T[] => {
    const existing = loadUserBookings<T>();
    const updated = [booking, ...existing];
    saveUserBookings(updated);
    return updated;
};
