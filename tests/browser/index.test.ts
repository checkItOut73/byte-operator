import { Body } from '@browser/Body';
import { ByteRepresentationField } from '../../src/browser/components/ByteRepresentationField';
import { NumberRepresentation } from '../../src/utils/numberConversion/NumberRepresentation';
import { Pointer } from '../../src/framework/Pointer';
import { SelectField } from '../../src/browser/components/SelectField';
import { Window } from '../../src/browser/components/Window';

const mainScssSpy = jest.fn();
jest.mock('@browser/styles/main.scss', () => mainScssSpy);

// TODO use type safe mocks

jest.mock('@framework/Pointer', () => ({
    Pointer: (value) => ({
        value
    })
}));

jest.mock('@components/ByteRepresentationField', () => ({
    ByteRepresentationField: (decimalNumber, numberRepresentation) => {
        const byteRepresentationField = {
            decimalNumber,
            numberRepresentation
        };

        Object.defineProperty(byteRepresentationField, 'getNumberRepresentationPointer', {
            value: () => numberRepresentation,
            enumerable: false
        });
        return byteRepresentationField;
    }
}));

jest.mock('@components/SelectField', () => ({
    SelectField: (options, selectedOption) => ({
        options,
        selectedOption
    })
}));

jest.mock('@components/Heading', () => ({
    Heading: (text) => ({
        text
    })
}));

jest.mock('@components/Window', () => ({
    Window: (headingText, contentComponentS) => ({
        headingText,
        contentComponentS
    })
}));

jest.mock('@browser/Body', () => ({
    Body: {
        contentComponents: [],
        append: function(contentComponent) {
            this.contentComponents.push(contentComponent);
        }
    }
}));

describe('index | ', () => {
    function requireModule() {
        require('@browser/index.ts');
    }

    test('the correct elements are appended to the body', () => {
        requireModule();

        const decimalNumberPointer = new Pointer<number>(5);
        // @ts-ignore
        expect(Body.contentComponents.splice(0, 4)).toEqual([
            new ByteRepresentationField(decimalNumberPointer, NumberRepresentation.BINARY),
            new ByteRepresentationField(decimalNumberPointer, NumberRepresentation.DECIMAL),
            new ByteRepresentationField(decimalNumberPointer, NumberRepresentation.HEXADECIMAL),
            new Window(
                'NumberRepresentationField 1',
                new SelectField(NumberRepresentation, NumberRepresentation.HEXADECIMAL) // TODO muss Fehler auslösen
            )
        ]);
    });
});
