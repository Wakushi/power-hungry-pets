import {Modal} from "./modal.ts";
import {Card} from "../concepts/card.ts";
import {GameService} from "../services/game.service.ts";
import {CardType} from "../lib/types/card.type.ts";

export class CardViewModal extends Modal {

    cardViewContainerElement: HTMLDivElement

    cardViewMouseTrapCardElement: HTMLDivElement
    cardViewDiggerCardElement: HTMLDivElement

    cardIndexInputElement: HTMLInputElement
    cardIndexButtonElement: HTMLButtonElement

    switchCardBtnElement: HTMLButtonElement
    leaveCardBtnElement: HTMLButtonElement

    cardRendered!: Card

    constructor() {
        super("#cardViewModal")
        this.cardViewContainerElement = this.modalElement.querySelector<HTMLDivElement>("#cardViewContainer")!

        this.cardViewMouseTrapCardElement = this.modalElement.querySelector<HTMLDivElement>("#cardViewMouseTrapCard")!
        this.cardViewDiggerCardElement = this.modalElement.querySelector<HTMLDivElement>("#cardViewDiggerCard")!

        this.cardIndexInputElement = this.modalElement.querySelector<HTMLInputElement>("#newCardIndex")!
        this.cardIndexButtonElement = this.modalElement.querySelector<HTMLButtonElement>("#cardIndexBtn")!

        this.switchCardBtnElement = this.modalElement.querySelector<HTMLButtonElement>("#switchCardBtn")!
        this.leaveCardBtnElement = this.modalElement.querySelector<HTMLButtonElement>("#leaveCardBtn")!

        this._bindEvents()
        this._listenForEvents()
    }

    private _bindEvents(): void {
        this.cardIndexButtonElement.addEventListener('click', () => {
            GameService.getInstance().deck.insertCardAtIndex(this.cardRendered, +this.cardIndexInputElement.value)
            this.close()
            GameService.getInstance().onNextTurn()
        })

        this.switchCardBtnElement.addEventListener('click', () => {
            const activePlayer = GameService.getInstance().activePlayer
            if (!activePlayer) return
            const sideCard = GameService.getInstance().deck.sideCard
            const [activePlayerCard] = activePlayer.hand.splice(0, 1, sideCard)
            GameService.getInstance().deck.sideCard = activePlayerCard
            this.close()
            GameService.getInstance().onNextTurn()
        })

        this.leaveCardBtnElement.addEventListener('click', () => {
            this.close()
            GameService.getInstance().onNextTurn()
        })


    }

    private _listenForEvents(): void {
        document.addEventListener("toggleCardViewModal", (event: Event) => {
            const {show, card, playedCardValue, deck} = (event as CustomEvent).detail

            if (show) {
                this.open()
                this._renderCard(card)

                switch (playedCardValue) {
                    case CardType.MOUSE_TRAPPER:
                        this.cardViewMouseTrapCardElement.classList.remove('hidden')
                        this.cardViewDiggerCardElement.classList.add('hidden')
                        this.cardIndexInputElement.setAttribute('max', deck.length)
                        break
                    case CardType.DOGGY_GRAVE_DIGGER:
                        this.cardViewDiggerCardElement.classList.remove('hidden')
                        this.cardViewMouseTrapCardElement.classList.add('hidden')
                        break

                }

            }
        })
    }

    private _renderCard(card: Card): void {
        this.cardViewContainerElement.innerHTML = ""
        this.cardViewContainerElement.insertAdjacentHTML('beforeend', card.getTemplate({interactive: true}))
        this.cardRendered = card
    }


}