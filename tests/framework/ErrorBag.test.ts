import { ErrorBag } from '@framework/ErrorBag';

describe('ErrorBag | ', () => {
    let error1;
    let error2;
    let errorBag;

    beforeEach(() => {
        error1 = new Error('some error');
        error1.name = 'SomeError';
        error2 = new Error('another error');
        error2.name = 'AnotherError';
        errorBag = new ErrorBag([error1, error2]);
    });

    describe('getErrors method | ', () => {
        test('getErrors returns all errors', () => {
            expect(errorBag.getErrors()).toEqual([error1, error2]);
        });
    });

    describe('addError method | ', () => {
        test('addError adds an error', () => {
            const addedError = new Error('added error');
            errorBag.addError(addedError);

            expect(errorBag.getErrors()).toEqual([error1, error2, addedError]);
        });
    });

    describe('mergeErrorBag method | ', () => {
        test('mergeErrorBag merges all errors of the given error bag into the error bag', () => {
            const mergedError1 = new Error('some merged error');
            const mergedError2 = new Error('another merged error');
            const alreadyContainedError = error1;
            const mergedErrorBag = new ErrorBag([mergedError1, mergedError2, alreadyContainedError]);

            errorBag.mergeErrorBag(mergedErrorBag);

            expect(errorBag.getErrors()).toEqual([error1, error2, mergedError1, mergedError2, alreadyContainedError]);
        });
    });

    describe('hasErrors method | ', () => {
        test('hasErrors returns true if the error bag contains errors', () => {
            expect(errorBag.hasErrors()).toBe(true);
        });

        test('hasErrors returns false if the error does not contain errors', () => {
            errorBag = new ErrorBag();

            expect(errorBag.hasErrors()).toBe(false);
        });
    });

    describe('hasError method | ', () => {
        test('hasError returns true if the error bag contains the given error', () => {
            expect(errorBag.hasError(error1)).toBe(true);
            expect(errorBag.hasError(error2)).toBe(true);
        });

        test('hasErrors returns false if the error does not contain the given error', () => {
            const notContainedError = new Error('error that is not contained');
            notContainedError.name = 'NotContainedError';

            expect(errorBag.hasError(notContainedError)).toBe(false);
        });
    });
});
