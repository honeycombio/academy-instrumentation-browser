export function getSessionId() {
    const sessionId = sessionStorage.getItem('sessionId');

    let generateNewSessionId = false;

    if (!sessionId) {
        generateNewSessionId = true;
    }

    // TODO - Check session storage for lastMemeGenerateDate
    let sessionExpiryDate = sessionStorage.getItem('sessionExpiryDate');

    if (!sessionExpiryDate) {
        sessionExpiryDate = updateSessionExpiryDate();
    }

    const oldDate = new Date(sessionExpiryDate).getTime();
    const currentDate = new Date().getTime();
    const timeBetweenInMS = currentDate - oldDate;
    // console.log(`old, ${oldDate}, current, ${currentDate}`)
    // console.log(timeBetweenInMS);
    // if greater than 1 hour regenerate the date
    if (timeBetweenInMS > (1000 * 60 * 60)) {
        generateNewSessionId = true;
    }

    if (generateNewSessionId) {
        const newSessionId = crypto.randomUUID();
        sessionStorage.setItem("sessionId", newSessionId);
        // also update the expiry date
        updateSessionExpiryDate();
        return newSessionId;
    } else {
        return sessionId;
    }
}

export function updateSessionExpiryDate() {
    const expiryDate = new Date().toISOString();
    sessionStorage.setItem('sessionExpiryDate', expiryDate);
    return expiryDate;
}
