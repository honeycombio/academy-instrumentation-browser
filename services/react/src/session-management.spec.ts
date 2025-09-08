import { describe, expect, it } from 'vitest';
import { getSession, isSessionExpired, updateExpireTime } from './session-management';

describe('session management tests', () => {
    it('should get a session id', () => {
        const sessionId = getSession();
        expect(sessionId).toBeDefined();
        expect(sessionId).toEqual(getSession());
    });

    it('should have an unexpired date when created', () => {
        // start a session
        expect(getSession()).toBeDefined();

        // it is not expired, right?
        expect(isSessionExpired()).toBeFalsy();
    });

    it('should clear after expire time', () => {
        expect(getSession()).toBeDefined();
        updateExpireTime(50);
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                expect(isSessionExpired()).toBeTruthy()
                resolve();
            }, 1000);
        });
    });
    it('should be OK before expire time, then fail', async () => {
        expect(getSession()).toBeDefined();
        updateExpireTime(500);

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                expect(isSessionExpired()).toBeFalsy()
                resolve();
            }, 10);
        });

       await new Promise<void>((resolve) => {
           setTimeout(() => {
               expect(isSessionExpired()).toBeTruthy()
               resolve();
           }, 900);
       });
    });
});
