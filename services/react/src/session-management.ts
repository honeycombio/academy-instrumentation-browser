/**
 * Get (and optionally re-generate) a sessionId UUID from the sessionStorage.
 * This is used by the HoneycombWebSDK in our main.ts file to
 * manage a session id for our browser session.
 *
 * The session time is hardcoded in this example to last no longer than
 * one hour without a call to `updateSessionExpiryDate` below. Once the
 * session expires, a new sessionId is generated and held in session
 * storage.
 *
 * Side effect: updates sessionId in sessionStorage when
 * generating a new sessionId.
 *
 * Side effect: the sessionExpiryDate key in localStorage is updated
 * whenever we expire a session (or if we generate it on the first
 * call of this method) by calling `updateSessionExpiryDate` below.
 */
export function getSession() {
    const sessionId = sessionStorage.getItem('session.id');

    let generateNewSessionId = false;

    // for the first time in a browser tab - we'll need
    // to create a new session id in session storage
    if (!sessionId) {
        generateNewSessionId = true;
    }

    // get our expiry date (in ISO format)
    let sessionExpiryDate = sessionStorage.getItem('sessionExpiryDate');

    // generate it if not found
    if (!sessionExpiryDate) {
        sessionExpiryDate = updateSessionExpiryDate();
    }

    // now, do a time diff calculation in ms to see how long
    // we've been running since the expiry date
    const oldDate = new Date(sessionExpiryDate).getTime();
    const currentDate = new Date().getTime();
    const timeBetweenInMS = currentDate - oldDate;

    // if greater than 1 hour we expire the session
    if (timeBetweenInMS > (1000 * 60 * 60)) {
        generateNewSessionId = true;
    }

    if (generateNewSessionId) {
        const newSessionId = crypto.randomUUID();
        sessionStorage.setItem("session.id", newSessionId);
        // also update the expiry date
        updateSessionExpiryDate();
        return newSessionId;
    } else {
        return sessionId;
    }
}

/**
 * A function that causes our session expiry date to shift to the
 * current date/time, resetting the expiry time of the session, which
 * extends the life of a session.
 */
export function updateSessionExpiryDate() {
    const expiryDate = new Date().toISOString();
    sessionStorage.setItem('sessionExpiryDate', expiryDate);
    return expiryDate;
}
