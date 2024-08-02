import {Card} from "./card.ts"
import {sendRenderGameMatEvent} from "../lib/game.utils.ts";
import {MAIN_PLAYER_ID} from "../constants.ts";

export class Player {
    id: number
    hand: Card[] = []
    discards: Card[] = []
    wins: number = 0
    eliminated = false
    protected = false

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
            hand += card.getTemplate({interactive: this.id === MAIN_PLAYER_ID, opponent: this.id !== MAIN_PLAYER_ID})
        })
        return hand
    }

    get discardTemplate(): string {
        let hand = ""
        this.discards.forEach((card, index) => {
            hand += card.getTemplate({interactive: false, size: 'small', discardIndex: index})
        })
        return hand
    }
}
