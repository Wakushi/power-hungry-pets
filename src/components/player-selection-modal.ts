import {Modal} from "./modal.ts";

export class PlayerSelectionModal extends Modal {

    constructor() {
        super("#playerSelectionModal")
        this._bindEvents()
        this._listenForEvents()

    }

    private _bindEvents(): void {
        const closeBtn = this.modalElement.querySelector<HTMLButtonElement>("#cancelPlayerSelectionModeBtn")!
        closeBtn.addEventListener('click', () => this.close())
    }

    private _listenForEvents(): void {
        document.addEventListener("togglePlayerSelectionModal", (event: Event) => {
            const customEvent = event as CustomEvent
            if (customEvent.detail) {
                this.open()
            } else {
                this.close()
            }
        })
    }


}