import { Pointer } from '@framework/Pointer';

const numberConverter: Mock<NumberConverterInterface> = {
    getConvertedNumber: jest.fn(),
    getDecimalNumber: jest.fn(),
    isNumberStringValid: jest.fn(),
    areNumberStringsEqual: jest.fn()
};

const NumberConverterProviderMock: Mock<typeof NumberConverterProvider> = {
    getNumberConverterForRepresentation: jest.fn()
};
jest.mock('@utils/numberConversion/NumberConverterProvider', () => ({
    NumberConverterProvider: NumberConverterProviderMock
}));

import { NumberRepresentationField } from '@components/NumberRepresentationField';
import { NumberRepresentation } from '@utils/numberConversion/NumberRepresentation';
import { NumberConverterProvider } from '@utils/numberConversion/NumberConverterProvider';
import { NumberConverterInterface } from '@utils/numberConversion/NumberConverterInterface';

describe('NumberRepresentationField | ', () => {
    let numberRepresentationField;

    beforeEach(() => {
        NumberConverterProviderMock.getNumberConverterForRepresentation.mockReturnValue(
            numberConverter as NumberConverterInterface
        );
    });

    test('', () => {
        numberConverter.getConvertedNumber.mockReturnValue(999);
        numberConverter.areNumberStringsEqual.mockReturnValue(false);

        numberRepresentationField = new NumberRepresentationField(55, NumberRepresentation.HEXADECIMAL);

        expect(numberRepresentationField.getInputValue()).toBe('999');
    });

    test('', async () => {
        numberConverter.getDecimalNumber.mockReturnValue(123);
        numberConverter.isNumberStringValid.mockReturnValue(true);

        const decimalNumberPointer = new Pointer<number>(55);
        numberRepresentationField = new NumberRepresentationField(
            decimalNumberPointer,
            NumberRepresentation.HEXADECIMAL
        );
        await new Promise((resolve) => setImmediate(resolve));

        const inputFieldElement = numberRepresentationField.getElement();
        inputFieldElement.value = 'test';
        inputFieldElement.dispatchEvent(new Event('input'));

        expect(numberConverter.getDecimalNumber).toHaveBeenCalledWith('test');
        expect(decimalNumberPointer.get()).toBe(123);
    });
});
