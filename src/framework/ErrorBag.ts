export class ErrorBag {
    private errors: Array<Error>;

    constructor(errors: Array<Error> = []) {
        this.errors = errors;
    }

    getErrors(): Array<Error> {
        return this.errors;
    }

    addError(error: Error) {
        this.errors.push(error);
    }

    mergeErrorBag(errorBag: ErrorBag) {
        errorBag.getErrors().forEach((error) => {
            this.addError(error);
        });
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }

    hasError(errorClass: Error): boolean {
        return undefined !== this.errors.find((error) => errorClass.name === error.name);
    }
}
