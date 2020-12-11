import { NumberConverterInterface } from '@utils/numberConversion/NumberConverterInterface';
import { bin2dec, dec2bin, trimLeadingZeros } from '@utils/numberConversion/numberConversion';

export class BinaryNumberConverter implements NumberConverterInterface {
    public getConvertedNumber(decimalNumber: number): number {
        return dec2bin(decimalNumber);
    }

    public getDecimalNumber(convertedNumberString: string): number {
        return bin2dec(parseInt(convertedNumberString));
    }

    public isNumberStringValid(numberString: string): boolean {
        return /^[01]+$/.test(numberString);
    }

    public areNumberStringsEqual(numberString1: string, numberString2: string): boolean {
        return trimLeadingZeros(numberString1) === trimLeadingZeros(numberString2);
    }
}
