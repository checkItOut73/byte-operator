import { OptionalPointer } from '@framework/OptionalPointer';
import { NumberRepresentationField } from '@components/NumberRepresentationField';
import { InvalidInputError } from '@components/errors/InvalidInputError';
import { NumberRepresentation } from '@utils/numberConversion/NumberRepresentation';

export class ByteRepresentationField extends NumberRepresentationField implements Promise<ByteRepresentationField> {
    private promise: Promise<ByteRepresentationField>;

    constructor(
        decimalNumberOptionalPointer: OptionalPointer<number>,
        numberRepresentationOptionalPointer: OptionalPointer<NumberRepresentation>
    ) {
        super(decimalNumberOptionalPointer, numberRepresentationOptionalPointer);
        this.element.style.textAlign = 'right';
        this.element.size = 8;

        this.throwErrorIfDecimalNumberIsInvalid(this.decimalNumberPointer.get());
        this.decimalNumberPointer.subscribe(this.throwErrorIfDecimalNumberIsInvalid.bind(this));
        this.numberRepresentationPointer.synchronize(
            this.maxLengthPointer,
            this.getMaxLengthForNumberRepresentation.bind(this)
        );
        this.promise = Promise.resolve(this);
    }

    public [Symbol.toStringTag];

    finally(): Promise<ByteRepresentationField> {
        return Promise.resolve(null);
    }

    then<TResult1 = ByteRepresentationField, TResult2 = never>(...args: any): Promise<TResult1 | TResult2> {
        return this.promise.then(...args);
    }

    catch<TResult = never>(...args: any): Promise<ByteRepresentationField> {
        return this.promise.catch(...args);
    }

    throwErrorIfDecimalNumberIsInvalid(decimalNumber) {
        if (decimalNumber < 0 || decimalNumber > 255) {
            throw new InvalidInputError('The given decimalNumber is outside the byte range [0, 255]!');
        }
    }

    private getMaxLengthForNumberRepresentation(numberRepresentation: NumberRepresentation): number {
        switch (numberRepresentation) {
            case NumberRepresentation.BINARY:
                return 8;
            case NumberRepresentation.DECIMAL:
                return 3;
            case NumberRepresentation.HEXADECIMAL:
                return 2;
            default:
                throw new Error(
                    `No input field max length defined for the given representation (${numberRepresentation})!`
                );
        }
    }
}
