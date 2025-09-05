/** Manage a session in the browser using window.sessionStorage so that
 * each launched tab gets its own storage and hence session.
 */

// constants
export const EXPIRE_AFTER_MS = 1000 * 60 * 5;
export const EXPIRE_AFTER_KEY = 'session.expireAfter';
export const SESSION_KEY = 'session.id';

// implementation

/**
 * Get (and optionally re-generate) a sessionId UUID from the sessionStorage.
 * This is used by the HoneycombWebSDK in our main.ts file to
 * manage a session id for our browser session.
 *
 * The session time is hardcoded in this example to last no longer than
 * 5 minutes without a call to `updateSessionExpiryDate` below. Once the
 * session expires, a new sessionId is generated and held in session
 * storage.
 *
 * Side effect: updates sessionId in sessionStorage when
 * generating a new sessionId.
 *
 * Side effect: the sessionExpiryDate key in sessionStorage is updated
 * whenever we expire a session (or if we generate it on the first
 * call of this method) by calling `updateSessionExpiryDate` below.
 */
export function getSession() : string {
    const sessionId = window.sessionStorage.getItem('session.id');

    // if either we don't have session.id or session.expireAfter in sessionStorage,
    // or we've passed the threshold to expire the session, create a new session
    // and set the expireAfter to now plus EXPIRE_AFTER_MS in time
    if (!sessionId || isSessionExpired()) {
        // create the session
        const newSessionId = crypto.randomUUID();
        window.sessionStorage.setItem(SESSION_KEY, newSessionId)

        // set the expiration time
        updateExpireTime();
        return newSessionId;
    }
    return sessionId;
}

export function isSessionExpired(): boolean {
    const expireAfter = window.sessionStorage.getItem(EXPIRE_AFTER_KEY);
    return !expireAfter || Number.parseInt(expireAfter, 10) < Date.now()
}

/**
 * A function that sets an expiration time EXPIRE_AFTER_MS milliseconds in the future
 * and stores it in `session.expireAfter` as a epoch-based number.
 */
export function updateExpireTime(afterMS?: number) : number {
    // if passed in (for testing), set the value sent. Otherwise expire by default setting
    const expireAfterMS = Date.now() + (afterMS ? afterMS : EXPIRE_AFTER_MS);
    window.sessionStorage.setItem(EXPIRE_AFTER_KEY, expireAfterMS.toString());
    return expireAfterMS;
}
