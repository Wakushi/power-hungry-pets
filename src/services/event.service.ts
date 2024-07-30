import {CardType} from "../lib/types/card.type.ts";
import {GameService} from "./game.service.ts";
import {toggleCardSelectionModal, togglePlayerSelectionModal} from "../lib/game.utils.ts";
import {MAIN_PLAYER_ID} from "../constants.ts";

export class EventService {

    private static _instance: EventService
    private _gameService!: GameService

    private constructor(gameService: GameService) {
        this._gameService = gameService
    }

    public static getInstance(): EventService {
        if (!EventService._instance) {
            EventService._instance = new EventService(GameService.getInstance())
        }
        return EventService._instance
    }

    public listenForEvents(): void {
        this._listenForPlayedCards()
        this._listenForPlayerMatInteraction()
        this._listenForPlayerElimination()
    }

    private _listenForPlayedCards(): void {
        document.addEventListener("playedCard", (event: Event) => {
            const cardValue: string = (event as CustomEvent).detail.split("-")[0]

            const activePlayer = this._gameService.players.find((player) => player.id === this._gameService.activePlayerId)

            if (activePlayer) {
                activePlayer.discard(+cardValue)
            }

            if (this._gameService.activePlayerId === MAIN_PLAYER_ID) {
                if (this._checkLastCardIdInteraction(cardValue)) {
                    return
                }

                switch (cardValue) {
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
                        const card = this._gameService.deck.draw()
                        document.dispatchEvent(new CustomEvent("toggleCardViewModal", {
                            detail: {
                                show: true,
                                card,
                                deck: this._gameService.deck
                            }
                        }))
                        break
                    case CardType.CRYSTAL_BOWL:
                        togglePlayerSelectionModal(true)
                        break
                    case CardType.ROYAL_ROBOVAC:
                        this._gameService.onNextTurn()
                        break
                    default:
                        break
                }
            }

            this._gameService.lastCardPlayedId = cardValue
        })
    }

    private _listenForPlayerMatInteraction(): void {
        document.addEventListener("selectedPlayerMat", (event: Event) => {
            this._gameService.lastSelectedPlayer = (event as CustomEvent).detail

            switch (this._gameService.lastCardPlayedId) {
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
                    togglePlayerSelectionModal(false)
                    toggleCardSelectionModal(true)
                    break
                case CardType.ROYAL_ROBOVAC:
                    break
                default:
                    break
            }
        })
    }

    private _listenForPlayerElimination(): void {
        document.addEventListener('playerEliminated', () => {
            this._gameService.onPlayerElimination()
        })
    }

    private _checkLastCardIdInteraction(clickedCardId: string): boolean {

        let playedInteraction = false

        switch (this._gameService.lastCardPlayedId) {
            case CardType.CRYSTAL_BOWL:
                playedInteraction = true
                if (this._gameService.lastSelectedPlayer.hand[0].value === +clickedCardId) {
                    this._gameService.lastSelectedPlayer.eliminate()
                }
                toggleCardSelectionModal(false)
                this._gameService.onNextTurn()
                break
            default:
                break
        }

        return playedInteraction
    }

}