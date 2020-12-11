import { ErrorClass } from '@framework/ErrorClass';

export class InvalidInputError extends ErrorClass {
    constructor(message: string = '') {
        super(message);
        this.name = InvalidInputError.name;
    }
}
