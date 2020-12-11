import { NumberConverterInterface } from '@utils/numberConversion/NumberConverterInterface';
import { dec2hex, hex2dec, trimLeadingZeros } from '@utils/numberConversion/numberConversion';

export class HexadecimalNumberConverter implements NumberConverterInterface {
    public getConvertedNumber(decimalNumber: number): string {
        return dec2hex(decimalNumber);
    }

    public getDecimalNumber(convertedNumberString: string): number {
        return hex2dec(convertedNumberString);
    }

    public isNumberStringValid(numberString: string): boolean {
        return /^[0-9A-F]+$/i.test(numberString);
    }

    public areNumberStringsEqual(numberString1: string, numberString2: string): boolean {
        return trimLeadingZeros(numberString1).toLowerCase() === trimLeadingZeros(numberString2).toLowerCase();
    }
}
