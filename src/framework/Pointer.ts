import { OptionalPointer } from '@framework/OptionalPointer';
import { ErrorBag } from '@framework/ErrorBag';

export class Pointer<T> {
    protected value: T;
    protected listeners: Array<(value: T) => Promise<void>> = [];

    constructor(value: T) {
        this.value = value;
    }

    public async set(
        value: T,
        ignoredListeners: Array<(value: T) => void> = [],
        rollbackOnError: boolean = true
    ): Promise<void> {
        let previousValue = this.value; // TODO copy for non-primitive types
        this.value = value;
        let errorBag = new ErrorBag();

        await this.listeners.forEachAsyncParallel(async (listener) => {
            if (ignoredListeners.includes(listener)) {
                return;
            }

            try {
                await listener(this.value);
            } catch (error) {
                if (error instanceof ErrorBag) {
                    errorBag.mergeErrorBag(error);
                } else {
                    errorBag.addError(error);
                }
            }
        });

        if (errorBag.hasErrors()) {
            if (rollbackOnError) {
                await this.set(previousValue, ignoredListeners);
            }

            throw errorBag;
        }
    }

    public get(): T {
        return this.value;
    }

    public subscribe(listener: (value: T) => Promise<void>) {
        this.listeners.push(listener);
    }

    public unsubscribe(listener: (value: T) => void) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    public async callListeners() {
        const value = this.get();

        await this.listeners.forEachAsyncParallel(async (listener) => {
            await listener(value);
        });
    }

    public removeAllListeners() {
        this.listeners = [];
    }

    public async synchronize<SP>(
        synchronizedPointer: Pointer<SP>,
        converter: (value: T, previousConvertedValue: SP) => SP,
        backConverter?: (convertedValue: SP, previousValue: T) => T
    ): Promise<void> {
        await synchronizedPointer.set(converter(this.value, synchronizedPointer.get()));

        this.subscribeSynchronizationListeners(synchronizedPointer, converter, backConverter);
    }

    private subscribeSynchronizationListeners<SP>(
        synchronizedPointer: Pointer<SP>,
        converter: (value: T, previousConvertedValue: SP) => SP,
        backConverter?: (convertedValue: SP, previousValue: T) => T
    ): void {
        let synchronizedPointerListener;
        const pointerListener = async (value: T) => {
            await synchronizedPointer.set(
                converter(value, synchronizedPointer.get()),
                [synchronizedPointerListener],
                false
            );
        };

        if (backConverter) {
            synchronizedPointerListener = async (convertedValue: SP, previousValue: T) => {
                await this.set(backConverter(convertedValue, previousValue), [pointerListener], false);
            };
        }

        this.subscribe(pointerListener);
        synchronizedPointer.subscribe(synchronizedPointerListener);
    }

    public getConvertedPointer<CT>(
        converter: (value: T) => CT,
        backConverter?: (convertedValue: CT) => T
    ): Pointer<CT> {
        const convertedPointer = new Pointer<CT>(null);

        this.synchronizeWithoutAwaitingInitialSet(convertedPointer, converter, backConverter);

        return convertedPointer;
    }

    private synchronizeWithoutAwaitingInitialSet<SP>(
        synchronizedPointer: Pointer<SP>,
        converter: (value: T, previousConvertedValue: SP) => SP,
        backConverter?: (convertedValue: SP, previousValue: T) => T
    ): void {
        synchronizedPointer.set(converter(this.value, synchronizedPointer.get()));

        this.subscribeSynchronizationListeners(synchronizedPointer, converter, backConverter);
    }

    public static getPointerFromOptionalPointer<T>(optionalPointer: OptionalPointer<T>): Pointer<T> {
        if (optionalPointer instanceof Pointer) {
            return optionalPointer;
        }

        return new Pointer<T>(optionalPointer);
    }
}
