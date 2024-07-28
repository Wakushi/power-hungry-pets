import { Deck } from "./deck"
import { Player } from "./player"

export class GameMat {
  deck!: Deck
  players: Player[]
  activePlayerId: number = 0

  gameMatElement: HTMLDivElement

  constructor(players: Player[]) {
    this.gameMatElement = document.querySelector<HTMLDivElement>("#gameMat")!
    this.players = players

    this._initGame()
    this._render()
    this._renderPlayerMats()
    this._bindEvents()
  }

  private _bindEvents(): void {
    this.gameMatElement
      .querySelector<HTMLButtonElement>("#debugButton")
      ?.addEventListener("click", this.debugGame.bind(this))

    this.gameMatElement
      .querySelector<HTMLButtonElement>("#drawButton")
      ?.addEventListener("click", this._activePlayerDraws.bind(this))
  }

  private _initGame(): void {
    this._resetDeck()
    this._initPlayersHand()
  }

  private _initPlayersHand(): void {
    this.players.forEach((player) => {
      const card = this.deck.draw()
      if (card) {
        player.hand.push(card)
      }
    })
  }

  private _resetDeck(): void {
    this.deck = new Deck()
  }

  private _activePlayerDraws(): void {
    const card = this.deck.draw()
    if (card) {
      this.players[this.activePlayerId].hand.push(card)
    }
  }

  debugGame(): void {
    console.log("Players: ", this.players)
    console.log("Deck: ", this.deck)
  }

  private _renderPlayerMats() {
    this.players.forEach((player) => {
      const playerMatElement = document.querySelector<HTMLDivElement>(
        `#player-${player.id}`
      )!
      playerMatElement.innerHTML = this.players[player.id].handTemplate
    })
  }

  private _render() {
    this.gameMatElement.innerHTML = `
        <div class="relative w-full h-[100vh] p-4 flex flex-col items-center justify-center">
            <button
                class="rounded bg-green-600 text-white px-4 py-2 font-semibold hover:bg-white hover:text-green-600"
                id="debugButton"
            >
            Debug
            </button>

            <button
                class="rounded bg-green-600 text-white hover:bg-white hover:text-green-600 font-semibold h-[200px] w-[150px] border"
                id="drawButton"
            >
            Draw
            </button>

            <div id="player-0">
            </div>
      </div>
    `
  }
}
