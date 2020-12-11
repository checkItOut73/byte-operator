import '@browser/styles/main.scss';
import { Pointer } from '@framework/Pointer';
import { ByteRepresentationField } from '@components/ByteRepresentationField';
import { SelectField } from '@components/SelectField';
import { Heading } from '@components/Heading';
import { Window } from '@components/Window';
import { NumberRepresentation } from '@utils/numberConversion/NumberRepresentation';
import { Body } from '@browser/Body';

const decimalNumberPointer = new Pointer<number>(5);

const binaryByteRepresentationField = new ByteRepresentationField(decimalNumberPointer, NumberRepresentation.BINARY);
const decimalByteRepresentationField = new ByteRepresentationField(decimalNumberPointer, NumberRepresentation.DECIMAL);
const hexadecimalByteRepresentationField = new ByteRepresentationField(
    decimalNumberPointer,
    NumberRepresentation.HEXADECIMAL
);

Body.append(binaryByteRepresentationField);
Body.append(decimalByteRepresentationField);
Body.append(hexadecimalByteRepresentationField);
Body.append(
    new Window(
        'NumberRepresentationField 1',
        new SelectField(NumberRepresentation, binaryByteRepresentationField.getNumberRepresentationPointer())
    )
);
Body.append(
    new Window(
        'NumberRepresentationField 2',
        new SelectField(NumberRepresentation, decimalByteRepresentationField.getNumberRepresentationPointer())
    )
);
Body.append(
    new Window(
        'NumberRepresentationField 3',
        new SelectField(NumberRepresentation, hexadecimalByteRepresentationField.getNumberRepresentationPointer())
    )
);
