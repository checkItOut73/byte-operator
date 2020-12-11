export class ErrorClass extends Error {
    public static message: string;

    constructor(message: string = '') {
        super(message);
    }
}
