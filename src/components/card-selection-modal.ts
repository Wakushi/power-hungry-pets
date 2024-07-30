import {availableCards} from "../lib/data/card-data.ts";
import {Card} from "../concepts/card.ts";
import {Modal} from "./modal.ts";

export class CardSelectionModal extends Modal {

    constructor() {
        super("#cardSelectionModal")
        this._listenForEvents()

    }

    private _listenForEvents(): void {
        document.addEventListener("toggleCardSelectionModal", (event: Event) => {
            const customEvent = event as CustomEvent
            if (customEvent.detail) {
                this.open()
                this._renderCards()
            } else {
                this.close()
            }
        })
    }

    private _renderCards(): void {
        const cardContainer =
            this.modalElement.querySelector<HTMLDivElement>("#cardContainer")!

        cardContainer.innerHTML = ""

        if (cardContainer) {
            availableCards.forEach(
                ({title, description, value, amount, color, descColor}) => {
                    const card = new Card(
                        `${value}-${amount}`,
                        title,
                        description,
                        value,
                        amount,
                        color,
                        descColor
                    )
                    cardContainer.insertAdjacentHTML('beforeend', card.getTemplate({interactive: true}))
                    card.bindEvents()
                }
            )
        }
    }


}