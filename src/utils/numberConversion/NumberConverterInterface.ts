export interface NumberConverterInterface {
    getConvertedNumber(decimalNumber: number): number | string;
    getDecimalNumber(convertedNumberString: string): number;
    isNumberStringValid(numberString: string): boolean;
    areNumberStringsEqual(numberString1: string, numberString2: string): boolean;
}
