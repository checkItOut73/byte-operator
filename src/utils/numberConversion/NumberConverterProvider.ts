import { NumberRepresentation } from '@utils/numberConversion/NumberRepresentation';
import { NumberConverterInterface } from '@utils/numberConversion/NumberConverterInterface';
import { BinaryNumberConverter } from '@utils/numberConversion/BinaryNumberConverter';
import { HexadecimalNumberConverter } from '@utils/numberConversion/HexadecimalNumberConverter';
import { DecimalNumberConverter } from '@utils/numberConversion/DecimalNumberConverter';

export class NumberConverterProvider {
    private static binaryNumberConverter = new BinaryNumberConverter();
    private static decimalNumberConverter = new DecimalNumberConverter();
    private static hexadecimalNumberConverter = new HexadecimalNumberConverter();

    public static getNumberConverterForRepresentation(
        numberRepresentation: NumberRepresentation
    ): NumberConverterInterface {
        switch (numberRepresentation) {
            case NumberRepresentation.BINARY:
                return self.binaryNumberConverter;
            case NumberRepresentation.DECIMAL:
                return self.decimalNumberConverter;
            case NumberRepresentation.HEXADECIMAL:
                return self.hexadecimalNumberConverter;
            default:
                throw new Error(`No number converter defined for the given representation (${numberRepresentation})!`);
        }
    }
}

const self = NumberConverterProvider;
