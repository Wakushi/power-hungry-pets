import {Modal} from "./modal.ts";
import {Card} from "../concepts/card.ts";
import {GameService} from "../services/game.service.ts";

export class CardViewModal extends Modal {

    cardViewContainerElement: HTMLDivElement
    cardIndexInputElement: HTMLInputElement
    cardIndexButtonElement: HTMLButtonElement
    cardRendered!: Card

    constructor() {
        super("#cardViewModal")
        this.cardViewContainerElement = this.modalElement.querySelector<HTMLDivElement>("#cardViewContainer")!
        this.cardIndexInputElement = this.modalElement.querySelector<HTMLInputElement>("#newCardIndex")!
        this.cardIndexButtonElement = this.modalElement.querySelector<HTMLButtonElement>("#cardIndexBtn")!
        this._bindEvents()
        this._listenForEvents()
    }

    private _bindEvents(): void {
        this.cardIndexButtonElement.addEventListener('click', () => {
            GameService.getInstance().deck.insertCardAtIndex(this.cardRendered, +this.cardIndexInputElement.value)
            this.close()
            GameService.getInstance().onNextTurn()
        })
    }

    private _listenForEvents(): void {
        document.addEventListener("toggleCardViewModal", (event: Event) => {
            const {show, card, deck} = (event as CustomEvent).detail

            if (show) {
                this.open()
                this._renderCard(card)
                this.cardIndexInputElement.setAttribute('max', deck.length)
            }
        })
    }

    private _renderCard(card: Card): void {
        this.cardViewContainerElement.innerHTML = ""
        this.cardViewContainerElement.insertAdjacentHTML('beforeend', card.getTemplate({interactive: true}))
        this.cardRendered = card
    }


}