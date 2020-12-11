import { NumberConverterInterface } from '@utils/numberConversion/NumberConverterInterface';
import { trimLeadingZeros } from '@utils/numberConversion/numberConversion';

export class DecimalNumberConverter implements NumberConverterInterface {
    public getConvertedNumber(decimalNumber: number): number {
        return decimalNumber;
    }

    public getDecimalNumber(convertedNumberString: string): number {
        return parseInt(convertedNumberString);
    }

    public isNumberStringValid(numberString: string): boolean {
        return /^[0-9]+$/.test(numberString);
    }

    public areNumberStringsEqual(numberString1: string, numberString2: string): boolean {
        return trimLeadingZeros(numberString1) === trimLeadingZeros(numberString2);
    }
}
