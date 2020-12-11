import { Component } from '@components/Component';

export class Div extends Component {
    protected element: HTMLDivElement;

    constructor(contentComponentS: Component | Array<Component> = []) {
        super();

        this.element = document.createElement('div');
        this.append(contentComponentS);
    }
}
