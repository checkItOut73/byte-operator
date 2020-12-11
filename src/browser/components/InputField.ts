import { Pointer } from '@framework/Pointer';
import { OptionalPointer } from '@framework/OptionalPointer';
import { ErrorBag } from '@framework/ErrorBag';
import { Component } from '@components/Component';
import { InvalidInputError } from '@components/errors/InvalidInputError';
import { EmptyInputError } from '@components/errors/EmptyInputError';

const INPUT_FIELD_MAX_LENGTH_DEFAULT = 524288;

export class InputField extends Component {
    protected element: HTMLInputElement;
    protected inputValuePointer: Pointer<string>;
    protected maxLengthPointer: Pointer<number> = new Pointer<number>(INPUT_FIELD_MAX_LENGTH_DEFAULT);

    constructor(valueOptionalPointer: OptionalPointer<string> = '') {
        super();

        this.inputValuePointer = Pointer.getPointerFromOptionalPointer(valueOptionalPointer);

        this.element = document.createElement('input');
        this.element.type = 'text';
        this.element.className = 'inputField';

        this.setInputValue(this.inputValuePointer.get());
        const setInputValue = this.setInputValue.bind(this);
        this.inputValuePointer.subscribe(setInputValue);
        this.maxLengthPointer.subscribe(this.setMaxLength.bind(this));
        this.onInput(() => {
            this.inputValuePointer
                .set(this.getInputValue(), [setInputValue])
                .then(() => {
                    this.markValid();
                })
                .catch((error) => {
                    if (error instanceof ErrorBag) {
                        const errorBag = error;

                        if (errorBag.hasError(InvalidInputError)) {
                            this.markInvalid();
                        } else if (errorBag.hasError(EmptyInputError)) {
                            this.markEmpty();
                        } else {
                            this.markInvalid();
                        }
                    } else {
                        this.markInvalid();
                        throw error;
                    }
                });
        });
    }

    protected setInputValue(inputValue: string) {
        this.element.value = inputValue;
        this.markValid();
    }

    protected getInputValue(): string {
        return this.element.value;
    }

    private setMaxLength(maxLength: number) {
        this.element.maxLength = maxLength;
    }

    private markValid() {
        this.element.style.borderColor = 'initial';
    }

    protected markInvalid() {
        this.element.style.borderColor = '#f00';
    }

    private markEmpty() {
        this.element.style.borderColor = '#00f';
    }
}
