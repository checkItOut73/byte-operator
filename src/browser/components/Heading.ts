import { Component } from '@components/Component';

export class Heading extends Component {
    protected element: HTMLHeadingElement;

    constructor(text: string = '') {
        super();

        this.element = document.createElement('h1');
        this.setHeadlineText(text);
    }

    private setHeadlineText(text: string): this {
        this.element.innerText = text;

        return this;
    }

    public addClass(className: string): this {
        this.element.classList.add(className);

        return this;
    }
}
