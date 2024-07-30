import {Card} from "./card.ts"
import {sendRenderGameMatEvent} from "../lib/game.utils.ts";

export class Player {
    id: number
    hand: Card[] = []
    discards: Card[] = []
    wins: number = 0
    eliminated: boolean = false

    constructor(id: number) {
        this.id = id
    }

    public eliminate(): void {
        this.eliminated = true
        document.dispatchEvent(new CustomEvent("playerEliminated", {detail: this}))
    }

    public discard(cardValue: number): void {
        const cardIndex = this.hand.findIndex(c => c.value === cardValue)
        if (cardIndex !== -1) {
            const discarded = this.hand.splice(cardIndex, 1)[0]
            this.discards.push(discarded)
            sendRenderGameMatEvent()
        }
    }

    get handTemplate(): string {
        let hand = ""
        this.hand.forEach((card) => {
            hand += card.getTemplate(this.id === 0)
        })
        return hand
    }
}
