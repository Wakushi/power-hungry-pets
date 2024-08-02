import {CardType} from "../lib/types/card.type.ts";
import {GameService} from "./game.service.ts";
import {toggleCardSelectionModal, togglePlayerSelectionModal} from "../lib/game.utils.ts";
import {Player} from "../concepts/player.ts";
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
            if (!activePlayer) return


            if (activePlayer.protected) {
                activePlayer.protected = false
            }

            if (this._gameService.interactionMode === 'activation') {
                activePlayer.discard(+cardValue)
                this._activateCardEffect(cardValue, activePlayer)
                this._gameService.lastCardPlayedId = cardValue
            }

            if (this._gameService.interactionMode === 'selection') {
                this._checkLastCardIdInteraction(cardValue)
            }

        })
    }

    private _listenForPlayerMatInteraction(): void {
        document.addEventListener("selectedPlayerMat", (event: Event) => {

            const activePlayer = this._gameService.activePlayer
            this._gameService.lastSelectedPlayer = (event as CustomEvent).detail

            if (!activePlayer) return;

            if (this._gameService.lastSelectedPlayer.protected) {
                alert('Player ' + this._gameService.lastSelectedPlayer.id + ' is protected !')
                return
            }

            const selectedPlayer = this._gameService.lastSelectedPlayer
            const selectedPlayerCard = this._gameService.lastSelectedPlayer.hand[0]

            switch (this._gameService.lastCardPlayedId) {
                case CardType.HERMIT_HOME_SWAP:
                    const [currentPlayerCard] = activePlayer.hand.splice(0, 1)
                    const [targetPlayerCard] = selectedPlayer.hand.splice(0, 1)
                    activePlayer.hand.push(targetPlayerCard)
                    selectedPlayer.hand.push(currentPlayerCard)

                    this._gameService.onNextTurn()
                    break
                case CardType.SNAKE_SORCERER:
                    selectedPlayer.discard(selectedPlayerCard.value)

                    if (selectedPlayerCard.value.toString() === CardType.KING_CAT) {
                        selectedPlayer.eliminate()
                    } else {
                        selectedPlayer.hand.push(this._gameService.deck.draw())
                    }

                    this._gameService.onNextTurn()
                    break
                case CardType.BATTLE_BUNNY:
                    const activePlayerCard = activePlayer.hand[0]

                    if (activePlayerCard.value > selectedPlayerCard.value) {
                        selectedPlayer.eliminate()
                    } else if (activePlayerCard.value < selectedPlayerCard.value) {
                        activePlayer.eliminate()
                    }

                    this._gameService.onNextTurn()
                    break
                case CardType.CRYSTAL_BOWL:
                    toggleCardSelectionModal(true)
                    this._gameService.interactionMode = 'selection'
                    break
                default:
                    break
            }

            togglePlayerSelectionModal(false)
        })
    }

    private _listenForPlayerElimination(): void {
        document.addEventListener('playerEliminated', () => {
            this._gameService.onPlayerElimination()
        })
    }

    private _activateCardEffect(cardValue: string, activePlayer: Player): void {
        if (activePlayer.id !== MAIN_PLAYER_ID) {
            console.log('AI simulates playing ' + cardValue)
            this._gameService.onNextTurn()
            return
        }

        switch (cardValue) {
            case CardType.NOT_A_PET:
                this._gameService.players.forEach((player) => {
                    if (player.id !== activePlayer.id && player.hand[0].value.toString() === CardType.KING_CAT) {
                        const [playerCard] = player.hand.splice(0, 1)
                        const [activePlayerCard] = activePlayer.hand.splice(0, 1)
                        player.hand.push(activePlayerCard)
                        activePlayer.hand.push(playerCard)
                    }
                })
                this._gameService.onNextTurn()
                break
            case CardType.HERMIT_HOME_SWAP:
                togglePlayerSelectionModal(true)
                break
            case CardType.JITTERY_JUGGLER:
                this._gameService.players.forEach((player) => {
                    const playerCard = player.hand.splice(0, 1)[0]
                    this._gameService.deck.insertCardAtIndex(playerCard, 0)
                })

                this._gameService.deck.shuffleDeck()

                this._gameService.players.forEach((player) => {
                    player.hand.push(this._gameService.deck.draw())
                })

                this._gameService.onNextTurn()
                break
            case CardType.DOGGY_GRAVE_DIGGER:
                document.dispatchEvent(new CustomEvent("toggleCardViewModal", {
                    detail: {
                        show: true,
                        playedCardValue: CardType.DOGGY_GRAVE_DIGGER,
                        card: this._gameService.deck.sideCard,
                        deck: this._gameService.deck
                    }
                }))
                break
            case CardType.SNAKE_SORCERER:
                togglePlayerSelectionModal(true)
                break
            case CardType.SHELL_SHIELD:
                activePlayer.protected = true
                // TODO Add a shield icon next to the protected player mat
                this._gameService.onNextTurn()
                break
            case CardType.BATTLE_BUNNY:
                togglePlayerSelectionModal(true)
                break
            case CardType.MOUSE_TRAPPER:
                const card = this._gameService.deck.draw()
                document.dispatchEvent(new CustomEvent("toggleCardViewModal", {
                    detail: {
                        show: true,
                        playedCardValue: CardType.MOUSE_TRAPPER,
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

    private _checkLastCardIdInteraction(clickedCardId: string): void {

        switch (this._gameService.lastCardPlayedId) {
            case CardType.CRYSTAL_BOWL:
                if (this._gameService.lastSelectedPlayer.hand[0].value === +clickedCardId) {
                    this._gameService.lastSelectedPlayer.eliminate()
                }
                toggleCardSelectionModal(false)
                this._gameService.onNextTurn()
                break
            default:
                break
        }

    }

}