import { Pointer } from '@framework/Pointer';
import { Component } from '@components/Component';

class DocumentComponent extends Component {
    constructor() {
        super();

        // @ts-ignore
        this.element = document;
    }
}

export const Document = new DocumentComponent();
