import { MAIN_PLAYER_ID } from "../constants"
import { availableCards } from "../data/card-data"
import { Card } from "./card"
import { Deck } from "./deck"
import { Player } from "./player"

export class GameMat {
  deck!: Deck
  players: Player[]
  activePlayerId: number = 0

  playerSelectionMode: boolean = false
  cardSelectionMode: boolean = false

  lastSelectedCardId!: string

  gameMatElement: HTMLDivElement
  playerSelectionModal: HTMLDivElement
  cardSelectionModal: HTMLDivElement

  constructor(players: Player[]) {
    this.gameMatElement = document.querySelector<HTMLDivElement>("#gameMat")!
    this.playerSelectionModal = document.querySelector<HTMLDivElement>(
      "#playerSelectionModal"
    )!
    this.cardSelectionModal = document.querySelector<HTMLDivElement>(
      "#cardSelectionModal"
    )!

    this.players = players

    this._initGame()
    this._renderGameMat()
    this._bindEvents()

    this._listenForPlayedCards()
    this._listenForPlayerMatInteraction()
  }

  private _bindEvents(): void {
    this.gameMatElement
      .querySelector<HTMLButtonElement>("#debugButton")
      ?.addEventListener("click", this.debugGame.bind(this))

    this.gameMatElement
      .querySelector<HTMLButtonElement>("#drawButton")
      ?.addEventListener("click", this._activePlayerDraws.bind(this))

    this.playerSelectionModal
      .querySelector<HTMLButtonElement>("#cancelPlayerSelectionModeBtn")
      ?.addEventListener("click", () => this._togglePlayerSelectionModal())

    this.cardSelectionModal
      .querySelector<HTMLButtonElement>("#cancelCardSelectionModeBtn")
      ?.addEventListener("click", () => this._toggleCardSelectionModal())

    const cardContainer =
      this.cardSelectionModal.querySelector<HTMLDivElement>("#cardContainer")

    if (cardContainer) {
      availableCards.forEach(
        ({ title, description, value, amount, color, descColor }, index) => {
          const card = new Card(
            `${value}-${index}`,
            title,
            description,
            value,
            amount,
            color,
            descColor
          )
          cardContainer.innerHTML += card.getTemplate(true)
        }
      )
    }
  }

  private _initGame(): void {
    this._resetDeck()
    this._initPlayersHand()
    this._activePlayerDraws()
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

  private _listenForPlayedCards(): void {
    document.addEventListener("playedCard", (event: Event) => {
      const cardId: string = (event as CustomEvent).detail.split("-")[0]
      this.lastSelectedCardId = cardId
      switch (cardId) {
        case CardType.KING_CAT:
          break
        case CardType.NOT_A_PET:
          break
        case CardType.HERMIT_HOME_SWAP:
          break
        case CardType.JITTERY_JUGGLER:
          break
        case CardType.DOGGY_GRAVE_DIGGER:
          break
        case CardType.SNAKE_SORCERER:
          break
        case CardType.SHELL_SHIELD:
          break
        case CardType.BATTLE_BUNNY:
          break
        case CardType.MOUSE_TRAPPER:
          break
        case CardType.CRYSTAL_BOWL:
          this._togglePlayerSelectionModal()
          break
        case CardType.ROYAL_ROBOVAC:
          break
        default:
          break
      }

      this._renderGameMat()
    })
  }

  private _listenForPlayerMatInteraction(): void {
    document.addEventListener("selectedPlayerMat", (event: Event) => {
      const player: Player = (event as CustomEvent).detail

      switch (this.lastSelectedCardId) {
        case CardType.KING_CAT:
          break
        case CardType.NOT_A_PET:
          break
        case CardType.HERMIT_HOME_SWAP:
          break
        case CardType.JITTERY_JUGGLER:
          break
        case CardType.DOGGY_GRAVE_DIGGER:
          break
        case CardType.SNAKE_SORCERER:
          break
        case CardType.SHELL_SHIELD:
          break
        case CardType.BATTLE_BUNNY:
          break
        case CardType.MOUSE_TRAPPER:
          break
        case CardType.CRYSTAL_BOWL:
          console.log("Playing Crystal bowl on player ", player.id)
          this._toggleCardSelectionModal()
          break
        case CardType.ROYAL_ROBOVAC:
          break
        default:
          break
      }
    })
  }

  private _activePlayerDraws(): void {
    const card = this.deck.draw()
    if (card) {
      this.players[this.activePlayerId].hand.push(card)
    }
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
  }

  private _renderPlayerMats() {
    this.players.forEach((player) => {
      const playerMatElement = document.querySelector<HTMLDivElement>(
        `#player-${player.id}`
      )!

      playerMatElement.innerHTML = this.players[player.id].handTemplate
      player.hand.forEach((card) => card.bindEvents())

      if (player.id !== MAIN_PLAYER_ID) {
        playerMatElement.addEventListener("click", () => {
          document.dispatchEvent(
            new CustomEvent("selectedPlayerMat", { detail: player })
          )
        })
      }
    })
  }

  private _togglePlayerSelectionModal(): void {
    this.playerSelectionMode = !this.playerSelectionMode

    const modal = document.querySelector<HTMLDivElement>(
      "#playerSelectionModal"
    )

    if (modal) {
      modal.style.display = this.playerSelectionMode ? "block" : "none"

      if (this.playerSelectionMode) {
      }
    }
  }

  private _toggleCardSelectionModal(): void {
    this.cardSelectionMode = !this.cardSelectionMode

    if (this.cardSelectionMode) {
      this._togglePlayerSelectionModal()
    }

    const modal = document.querySelector<HTMLDivElement>("#cardSelectionModal")

    if (modal) {
      modal.style.display = this.cardSelectionMode ? "flex" : "none"

      if (this.cardSelectionMode) {
      }
    }
  }

  debugGame(): void {
    console.log("Players: ", this.players)
    console.log("Deck: ", this.deck)
  }
}

enum CardType {
  KING_CAT = "10",
  NOT_A_PET = "9",
  HERMIT_HOME_SWAP = "8",
  JITTERY_JUGGLER = "7",
  DOGGY_GRAVE_DIGGER = "6",
  SNAKE_SORCERER = "5",
  SHELL_SHIELD = "4",
  BATTLE_BUNNY = "3",
  MOUSE_TRAPPER = "2",
  CRYSTAL_BOWL = "1",
  ROYAL_ROBOVAC = "0",
}
