import {MAIN_PLAYER_ID} from "../constants.ts"
import {GameService} from "../services/game.service.ts";

export class GameMat {
    gameService!: GameService
    gameMatElement: HTMLDivElement

    constructor(gameService: GameService) {
        this.gameService = gameService
        this.gameMatElement = document.querySelector<HTMLDivElement>("#gameMat")!
        this._renderGameMat()
    }

    private _bindEvents(): void {
        const debugBtn = document.querySelector<HTMLButtonElement>("#debugButton")!
        debugBtn.addEventListener("click", () => this.debugGame())
        document.addEventListener('renderGameMat', () => this._renderGameMat())
    }


    private _renderGameMat() {
        this.gameMatElement.innerHTML = `
        <div class="relative w-full h-[100vh] p-4 flex flex-col items-center justify-between">
            <div class="flex items-center gap-4 border p-10 rounded z-[4] bg-white cursor-pointer" id="player-1">
            </div>
            <button
                class="rounded bg-green-600 text-white px-4 py-2 font-semibold hover:bg-white hover:text-green-600"
                id="debugButton"
            >
            Debug
            </button>
            <div class="flex items-center gap-4 border p-10 rounded" id="player-0">
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

            playerMatElement.innerHTML = this.gameService.players[player.id].handTemplate

            if (player.id === MAIN_PLAYER_ID) {
                player.hand.forEach((card) => card.bindEvents())
            } else {
                playerMatElement.addEventListener("click", () => {
                    document.dispatchEvent(
                        new CustomEvent("selectedPlayerMat", {detail: player})
                    )
                })
            }
        })
    }


    debugGame(): void {
        console.log("Players: ", this.gameService.players)
        console.log("Deck: ", this.gameService.deck)
        console.log('Active player id: ', this.gameService.activePlayerId)
        this.simulateAIPlay()
    }

    simulateAIPlay(): void {
        const playerHand = this.gameService.players[this.gameService.activePlayerId].hand
        const randomCard = playerHand[Math.floor(Math.random() * playerHand.length)]
        console.log('AI PLAYS ', randomCard)
        randomCard.play()
    }
}


