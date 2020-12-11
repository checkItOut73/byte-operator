import { ErrorClass } from '@framework/ErrorClass';

export class UnchangedInputError extends ErrorClass {
    constructor(message: string = '') {
        super(message);
        this.name = UnchangedInputError.name;
    }
}
