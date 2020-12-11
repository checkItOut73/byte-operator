export class Component {
    protected element: HTMLElement;

    public getElement(): HTMLElement {
        return this.element;
    }

    public append(componentS: Component | Array<Component>): this {
        if (!Array.isArray(componentS)) {
            componentS = [componentS];
        }

        componentS.forEach((component) => {
            this.element.appendChild(component.getElement());
        });

        return this;
    }

    public addClass(className: string): this {
        this.element.classList.add(className);

        return this;
    }

    public onMouseDown(listener: (this: HTMLElement, event: MouseEvent) => any): this {
        return this.addEventListener('mousedown', listener);
    }

    public onMouseMove(listener: (this: HTMLElement, event: MouseEvent) => any): this {
        return this.addEventListener('mousemove', listener);
    }

    public onMouseUp(listener: (this: HTMLElement, event: MouseEvent) => any): this {
        return this.addEventListener('mouseup', listener);
    }

    public onChange(listener: (this: HTMLElement, event: Event) => any): this {
        return this.addEventListener('change', listener);
    }

    public onInput(listener: (this: HTMLElement, event: Event) => any): this {
        return this.addEventListener('input', listener);
    }

    private addEventListener(eventName: string, listener: (this: HTMLElement, event: UIEvent) => any): this {
        this.element.addEventListener(eventName, listener);

        return this;
    }
}
