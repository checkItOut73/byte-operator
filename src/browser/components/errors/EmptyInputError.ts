import { ErrorClass } from '@framework/ErrorClass';

export class EmptyInputError extends ErrorClass {
    constructor(message: string = '') {
        super(message);
        this.name = EmptyInputError.name;
    }
}
