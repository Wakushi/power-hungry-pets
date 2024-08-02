import {MAIN_PLAYER_ID} from "../constants.ts"
import {GameService} from "../services/game.service.ts";
import {CardType} from "../lib/types/card.type.ts";

export class GameMat {
    gameService!: GameService
    gameMatElement: HTMLDivElement

    constructor(gameService: GameService) {
        this.gameService = gameService
        this.gameMatElement = document.querySelector<HTMLDivElement>("#gameMat")!
        document.addEventListener('renderGameMat', () => this._renderGameMat())
        this._renderGameMat()
    }

    private _bindEvents(): void {
        const debugBtn = document.querySelector<HTMLButtonElement>("#debugButton")!
        const aiPlayBtn = document.querySelector<HTMLButtonElement>("#aiPlayButton")!
        debugBtn.addEventListener("click", () => this.debugGame())
        aiPlayBtn.addEventListener("click", () => this.simulateAIPlay())
    }


    private _renderGameMat() {
        this.gameMatElement.innerHTML = `
        <div class="relative w-full h-[100vh] p-4 flex flex-col items-center justify-between">
            <div class="uppercase text-2xl font-bold absolute top-10 left-10">Player ${this.gameService.activePlayerId}'s turn</div>
            <div class="flex items-center">
                <div class="flex items-center gap-4 border p-10 rounded z-[4] bg-white" id="player-1"></div>
                <div class="flex items-center relative h-[150px] w-[300px] self-baseline" id="player-1-discard"></div>
            </div>
            <div class="flex gap-5">
                <button
                    id="debugButton"
                    class="rounded bg-green-600 text-white px-4 py-2 font-semibold hover:bg-white hover:text-green-600"
                >
                    Debug
                </button>
                <button
                    id="aiPlayButton"
                    class="rounded bg-green-600 text-white px-4 py-2 font-semibold hover:bg-white hover:text-green-600"
                >
                    AI plays
                </button>
                </div>
            <div class="flex items-center">
                <div class="flex items-center gap-4 border p-10 rounded bg-white" id="player-0"></div>
                <div class="flex items-center relative h-[150px] w-[300px] self-baseline" id="player-0-discard"></div>
            </div>
      </div>
    `
        this._renderPlayerMats()
        this._bindEvents()
    }

    private _renderPlayerMats() {
        this.gameService.players.forEach((player) => {
            const playerMatElement = document.querySelector<HTMLDivElement>(
                `#player-${player.id}`
            )!

            playerMatElement.insertAdjacentHTML('beforeend', this.gameService.players[player.id].handTemplate)

            if (player.id === MAIN_PLAYER_ID) {
                player.hand.forEach((card) => card.bindEvents())
            } else {
                playerMatElement.addEventListener("click", () => {
                    document.dispatchEvent(
                        new CustomEvent("selectedPlayerMat", {detail: player})
                    )
                })
            }

            const playerDiscardElement = document.querySelector<HTMLDivElement>(
                `#player-${player.id}-discard`
            )!

            playerDiscardElement.insertAdjacentHTML('beforeend', this.gameService.players[player.id].discardTemplate)
        })
    }


    debugGame(): void {
        console.log('Deck: ', this.gameService.deck)
        console.log('Players: ', this.gameService.players)
    }

    simulateAIPlay(): void {
        const playerHand = this.gameService.players[this.gameService.activePlayerId].hand
        const randomCardIndex = Math.floor(Math.random() * playerHand.length)
        const randomCard = playerHand[randomCardIndex]

        if (randomCard.value.toString() === CardType.KING_CAT) {
            if (randomCardIndex === 0) {
                playerHand[1].play()
            } else {
                playerHand[0].play()
            }
            return
        }

        randomCard.play()
    }
}


