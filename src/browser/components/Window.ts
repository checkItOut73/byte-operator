import { Component } from '@components/Component';
import { Heading } from '@components/Heading';
import { Div } from '@components/Div';
import { Document } from '@browser/Document';

export class Window extends Div {
    protected element: HTMLDivElement;

    constructor(headingText: string, contentComponentS: Component | Array<Component> = []) {
        super();
        this.addClass('window');
        this.element.style.left = '0px';
        this.element.style.top = '0px';
        this.append(this.getDraggableHeading(headingText).addClass('window__heading'));
        this.append(new Div(contentComponentS).addClass('window__content'));
    }

    private getDraggableHeading(headingText: string): Heading {
        let dragged: boolean;
        let dragX: number;
        let dragY: number;

        const heading = new Heading(headingText).onMouseDown((event) => {
            dragged = true;
            dragX = event.clientX;
            dragY = event.clientY;
        });

        Document.onMouseMove((event) => {
            if (!dragged) {
                return;
            }

            this.moveBy(event.clientX - dragX, event.clientY - dragY);
            dragX = event.clientX;
            dragY = event.clientY;
        }).onMouseUp(() => {
            dragged = false;
        });

        return heading;
    }

    private moveBy(x: number, y: number) {
        this.element.style.left = parseInt(this.element.style.left) + x + 'px';
        this.element.style.top = parseInt(this.element.style.top) + y + 'px';
    }
}
