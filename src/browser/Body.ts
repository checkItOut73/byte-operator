import { Pointer } from '@framework/Pointer';
import { Component } from '@components/Component';

class BodyComponent extends Component {
    constructor() {
        super();
        this.element = document.body;
    }
}

export const Body = new BodyComponent();
