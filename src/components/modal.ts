export class Modal {
    modalElement: HTMLDivElement
    active = false

    constructor(nodeId: string) {
        this.modalElement = document.querySelector<HTMLDivElement>(
            nodeId
        )!
    }

    protected open(): void {
        this.active = true
        this.modalElement.style.display = "flex"
    }

    protected close(): void {
        this.active = false
        this.modalElement.style.display = "none"
    }
}