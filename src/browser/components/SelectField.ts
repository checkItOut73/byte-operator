import { Pointer } from '@framework/Pointer';
import { OptionalPointer } from '@framework/OptionalPointer';
import { Component } from '@components/Component';
import { NumberRepresentation } from '@utils/numberConversion/NumberRepresentation';

export class SelectField<Enum extends string> extends Component {
    protected element: HTMLSelectElement;
    private options: { [key: string]: Enum };
    private selectedOptionPointer: Pointer<Enum>;

    constructor(options: { [key: string]: Enum }, selectedOptionOptionalPointer: OptionalPointer<Enum>) {
        super();
        this.options = options;
        this.selectedOptionPointer = Pointer.getPointerFromOptionalPointer(selectedOptionOptionalPointer);

        this.element = document.createElement('select');
        this.appendOptionElements();
        this.selectOption(this.selectedOptionPointer.get());
        this.selectedOptionPointer.subscribe(this.selectOption.bind(this));
        this.onChange(async () => {
            await this.selectedOptionPointer.set(this.getSelectedOption());
        });
    }

    private appendOptionElements() {
        Object.entries(this.options).forEach(([key, description]) => {
            const optionField = document.createElement('option');
            optionField.value = key;
            optionField.innerText = description;
            this.element.appendChild(optionField);
        });
    }

    private getSelectedOption(): Enum {
        return this.element.options[this.element.selectedIndex].text as Enum;
    }

    public selectOption(option: Enum) {
        this.element.selectedIndex = Object.values(this.options).indexOf(option);
    }
}
