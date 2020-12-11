import { Pointer } from '@framework/Pointer';
import { OptionalPointer } from '@framework/OptionalPointer';
import { InputField } from '@components/InputField';
import { UnchangedInputError } from '@components/errors/UnchangedInputError';
import { EmptyInputError } from '@components/errors/EmptyInputError';
import { InvalidInputError } from '@components/errors/InvalidInputError';
import { NumberConverterInterface } from '@utils/numberConversion/NumberConverterInterface';
import { NumberRepresentation } from '@utils/numberConversion/NumberRepresentation';
import { NumberConverterProvider } from '@utils/numberConversion/NumberConverterProvider';

export class NumberRepresentationField extends InputField {
    protected decimalNumberPointer: Pointer<number>;
    protected numberRepresentationPointer: Pointer<NumberRepresentation>;
    private numberConverterPointer: Pointer<NumberConverterInterface>;

    constructor(
        decimalNumberOptionalPointer: OptionalPointer<number>,
        numberRepresentationOptionalPointer: OptionalPointer<NumberRepresentation>
    ) {
        super();
        this.decimalNumberPointer = Pointer.getPointerFromOptionalPointer(decimalNumberOptionalPointer);
        this.numberRepresentationPointer = Pointer.getPointerFromOptionalPointer(numberRepresentationOptionalPointer);
        this.numberConverterPointer = this.numberRepresentationPointer.getConvertedPointer(
            NumberConverterProvider.getNumberConverterForRepresentation
        );

        this.decimalNumberPointer.synchronize(
            this.inputValuePointer,
            this.convertDecimalNumberToRepresentationString.bind(this),
            this.convertInputValueToDecimalNumber.bind(this)
        );
        this.numberConverterPointer.subscribe(async () => {
            this.decimalNumberPointer.callListeners();
        });
    }

    private convertDecimalNumberToRepresentationString(
        decimalNumber: number,
        previousNumberRepresentationString: string
    ): string {
        const numberConverter = this.numberConverterPointer.get();

        const numberRepresentationString: string = String(numberConverter.getConvertedNumber(decimalNumber));

        if (numberConverter.areNumberStringsEqual(previousNumberRepresentationString, numberRepresentationString)) {
            return previousNumberRepresentationString;
        }

        return numberRepresentationString;
    }

    private convertInputValueToDecimalNumber(inputValue: string): number {
        if ('' === inputValue) {
            throw new EmptyInputError();
        }

        const numberConverter = this.numberConverterPointer.get();

        if (!numberConverter.isNumberStringValid(inputValue)) {
            throw new InvalidInputError();
        }

        return numberConverter.getDecimalNumber(inputValue);
    }

    public getDecimalNumberPointer(): Pointer<number> {
        return this.decimalNumberPointer;
    }

    public getNumberRepresentationPointer(): Pointer<NumberRepresentation> {
        return this.numberRepresentationPointer;
    }

    public getNumberConverterPointer(): Pointer<NumberConverterInterface> {
        return this.numberConverterPointer;
    }
}
