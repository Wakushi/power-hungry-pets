import {Modal} from "./modal.ts";

export class PlayerSelectionModal extends Modal {

    constructor() {
        super("#playerSelectionModal")
        this._listenForEvents()

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