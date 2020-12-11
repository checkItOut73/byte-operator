import { Pointer } from '@framework/Pointer';
import { ErrorBag } from '@framework/ErrorBag';

describe('Pointer | ', () => {
    let pointer: Pointer<number>;

    beforeEach(() => {
        pointer = new Pointer<number>(0);
    });

    describe('set method | ', () => {
        let listener1;
        let listener2;
        let ignoredListener;
        let unsubscribedListener;

        beforeEach(() => {
            listener1 = jest.fn();
            listener2 = jest.fn();
            ignoredListener = jest.fn();
            unsubscribedListener = jest.fn();

            pointer.subscribe(listener1);
            pointer.subscribe(listener2);
            pointer.subscribe(ignoredListener);
            pointer.subscribe(unsubscribedListener);
            pointer.unsubscribe(unsubscribedListener);
        });

        afterEach(() => {
            pointer.removeAllListeners();
        });

        test('set notifies the subscribed listeners of the new value', () => {
            pointer.set(1, [ignoredListener]);

            expect(listener1).toHaveBeenCalledWith(1);
            expect(listener2).toHaveBeenCalledWith(1);
            expect(ignoredListener).not.toHaveBeenCalled();
            expect(unsubscribedListener).not.toHaveBeenCalled();
        });

        describe('if an error occurs', () => {
            let previousValue;
            const listener1Error = new Error('error of listener1');
            const listener2Error1 = new Error('first error of listener2');
            const listener2Error2 = new Error('second error of listener2');
            const listener2ErrorBag = new ErrorBag([listener2Error1, listener2Error2]);

            beforeEach(() => {
                previousValue = pointer.get();

                listener1.mockImplementation((pointerValue) =>
                    previousValue === pointerValue ? Promise.resolve() : Promise.reject(listener1Error)
                );
                listener2.mockImplementation((pointerValue) =>
                    previousValue === pointerValue ? Promise.resolve() : Promise.reject(listener2ErrorBag)
                );
            });

            test('set rejects an error bag with all errors of the listeners', () => {
                return expect(pointer.set(1)).rejects.toEqual(
                    new ErrorBag([listener1Error, listener2Error1, listener2Error2])
                );
            });

            test('set rollbacks to the previous value', async () => {
                try {
                    await pointer.set(1);
                } catch (error) {}

                expect(pointer.get()).toBe(previousValue);
            });

            test('set does not rollback to the previous value if rollbackOnError is false', async () => {
                try {
                    await pointer.set(1, [], false);
                } catch (error) {}

                expect(pointer.get()).toBe(1);
            });
        });
    });

    describe('get method | ', () => {
        test('get returns the value', () => {
            expect(pointer.get()).toBe(0);
        });
    });

    describe('callListeners method | ', () => {
        test('callListeners calls all listeners with the current value', () => {
            const listener1 = jest.fn();
            const listener2 = jest.fn();
            pointer.subscribe(listener1);
            pointer.subscribe(listener2);

            const currentValue = pointer.get();

            pointer.callListeners();

            expect(listener1).toHaveBeenCalledWith(currentValue);
            expect(listener2).toHaveBeenCalledWith(currentValue);
        });
    });

    describe('removeAllListeners method | ', () => {
        test('removeAllListeners removes all listeners', () => {
            const listener1 = jest.fn();
            const listener2 = jest.fn();
            pointer.subscribe(listener1);
            pointer.subscribe(listener2);

            pointer.removeAllListeners();

            pointer.callListeners();

            expect(listener1).not.toHaveBeenCalled();
            expect(listener2).not.toHaveBeenCalled();
        });
    });

    describe('synchronize method | ', () => {
        let synchronizedPointer;

        beforeEach(() => {
            synchronizedPointer = new Pointer<string>('');
        });

        afterEach(() => {
            pointer.removeAllListeners();
            synchronizedPointer.removeAllListeners();
        });

        describe('synchronization of current value | ', () => {
            test('synchronize sets the converted current value into the synchronized pointer', () => {
                pointer.set(1);
                pointer.synchronize(synchronizedPointer, (value) => String(value));

                expect(synchronizedPointer.get()).toBe('1');
            });

            test('synchronize rejects if an error occurs in the converter', () => {
                const error = new Error('converter error');
                return expect(
                    pointer.synchronize(synchronizedPointer, () => {
                        throw error;
                    })
                ).rejects.toBe(error);
            });
        });

        describe('synchronization from base pointer to synchronizedPointer | ', () => {
            beforeEach(async () => {
                await pointer.synchronize(synchronizedPointer, (value) => String(value));
            });

            test('synchronize sets a listener so that the synchronized pointer is updated on a change of the base pointer', async () => {
                await pointer.set(33);

                expect(synchronizedPointer.get()).toBe('33');
            });

            describe('if an error occurs in one of the listeners of the synchronized pointer', () => {
                beforeEach(() => {
                    const previousValue = synchronizedPointer.get();
                    synchronizedPointer.subscribe((value) =>
                        previousValue === value ? Promise.resolve() : Promise.reject(new Error('some error'))
                    );
                });

                test('synchronize does not rollback the synchronizedPointer pointer on a change of the base pointer (the rollback is done once from the pointer that initialized the set cascades)', async () => {
                    try {
                        await pointer.set(99, [], false);
                    } catch (error) {}

                    expect(synchronizedPointer.get()).toBe('99');
                });
            });
        });

        describe('synchronization from synchronizedPointer to base pointer (if a backConverter is provided) | ', () => {
            beforeEach(async () => {
                await pointer.synchronize(
                    synchronizedPointer,
                    (value) => String(value),
                    (convertedValue) => parseInt(convertedValue)
                );
            });

            test('synchronize sets a listener so that the base pointer is updated on a change of the synchronized pointer', async () => {
                await synchronizedPointer.set('11');

                expect(pointer.get()).toBe(11);
            });

            describe('if an error occurs in one of the listeners of the base pointer', () => {
                beforeEach(() => {
                    const previousValue = pointer.get();
                    pointer.subscribe((pointerValue) =>
                        previousValue === pointerValue ? Promise.resolve() : Promise.reject(new Error('some error'))
                    );
                });

                test('synchronize does not rollback the base pointer on a change of the synchronized pointer (the rollback is done once from the pointer that initialized the set cascades)', async () => {
                    try {
                        await synchronizedPointer.set('22', [], false);
                    } catch (error) {}

                    expect(pointer.get()).toBe(22);
                });
            });
        });
    });

    describe('getConvertedPointer method | ', () => {
        let convertedPoitner;

        afterEach(() => {
            pointer.removeAllListeners();
        });

        describe('synchronization of current value | ', () => {
            test('getConvertedPointer sets the converted current value into the converted pointer', async () => {
                await pointer.set(1);
                convertedPoitner = pointer.getConvertedPointer((value) => String(value));

                expect(convertedPoitner.get()).toBe('1');
            });

            test('getConvertedPointer throws errors that occur in the converter', () => {
                const error = new Error('converter error');
                expect(() =>
                    pointer.getConvertedPointer(() => {
                        throw error;
                    })
                ).toThrow(error);
            });
        });

        describe('synchronization from base pointer to convertedPointer | ', () => {
            beforeEach(async () => {
                convertedPoitner = pointer.getConvertedPointer((value) => String(value));
            });

            test('getConvertedPointer sets a listener so that the converted pointer is updated on a change of the base pointer', async () => {
                await pointer.set(33);

                expect(convertedPoitner.get()).toBe('33');
            });

            describe('if an error occurs in one of the listeners of the converted pointer', () => {
                beforeEach(() => {
                    const previousValue = convertedPoitner.get();
                    convertedPoitner.subscribe((value) =>
                        previousValue === value ? Promise.resolve() : Promise.reject(new Error('some error'))
                    );
                });

                test('getConvertedPointer does not rollback the convertedPointer pointer on a change of the base pointer (the rollback is done once from the pointer that initialized the set cascades)', async () => {
                    try {
                        await pointer.set(99, [], false);
                    } catch (error) {}

                    expect(convertedPoitner.get()).toBe('99');
                });
            });
        });

        describe('synchronization from convertedPointer to base pointer (if a backConverter is provided) | ', () => {
            beforeEach(async () => {
                convertedPoitner = pointer.getConvertedPointer(
                    (value) => String(value),
                    (convertedValue) => parseInt(convertedValue)
                );
            });

            test('getConvertedPointer sets a listener so that the base pointer is updated on a change of the converted pointer', async () => {
                await convertedPoitner.set('11');

                expect(pointer.get()).toBe(11);
            });

            describe('if an error occurs in one of the listeners of the base pointer', () => {
                beforeEach(() => {
                    const previousValue = pointer.get();
                    pointer.subscribe((pointerValue) =>
                        previousValue === pointerValue ? Promise.resolve() : Promise.reject(new Error('some error'))
                    );
                });

                test('getConvertedPointer does not rollback the base pointer on a change of the converted pointer (the rollback is done once from the pointer that initialized the set cascades)', async () => {
                    try {
                        await convertedPoitner.set('22', [], false);
                    } catch (error) {}

                    expect(pointer.get()).toBe(22);
                });
            });
        });
    });

    describe('getPointerFromOptionalPointer | ', () => {
        describe('if a pointer is given,', () => {
            test('getPointerFromOptionalPointer returns the pointer', () => {
                let pointer = new Pointer<number>(1);

                expect(Pointer.getPointerFromOptionalPointer(pointer)).toBe(pointer);
            });
        });

        describe('if a value or object is given that is no pointer,', () => {
            test('getPointerFromOptionalPointer returns a pointer for this value or object', () => {
                let value = 1;

                let pointer = Pointer.getPointerFromOptionalPointer(value);
                expect(pointer).toBeInstanceOf(Pointer);
                expect(pointer.get()).toBe(value);
            });
        });
    });
});
