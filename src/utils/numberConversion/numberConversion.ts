const BINARY_BASE = 2;
const HEXADECIMAL_BASE = 16;

export function dec2bin(decimalNumber: number): number {
    return parseInt(decimalNumber.toString(BINARY_BASE));
}

export function bin2dec(binaryNumber: number): number {
    return parseInt(String(binaryNumber), BINARY_BASE);
}

export function dec2hex(decimalNumber: number): string {
    return decimalNumber.toString(HEXADECIMAL_BASE);
}

export function hex2dec(hexadecimalNumber: string): number {
    return parseInt(String(hexadecimalNumber), HEXADECIMAL_BASE);
}

export function trimLeadingZeros(numberString: string): string {
    return numberString.replace(/^0*/, '');
}
