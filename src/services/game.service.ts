import {Deck} from "../concepts/deck.ts";
import {Player} from "../concepts/player.ts";
import {sendRenderGameMatEvent} from "../lib/game.utils.ts";
import {MAIN_PLAYER_ID} from "../constants.ts";

export class GameService {
    private static _instance: GameService;

    deck!: Deck
    players: Player[] = []
    activePlayerId: number = 0
    private _interactionMode: 'selection' | 'activation' = 'activation'

    lastCardPlayedId!: string
    lastSelectedPlayer!: Player
    lastWinner!: Player

    lastTurn = false
    private _gameOver = false


    private constructor() {
    }

    public static getInstance(): GameService {
        if (!GameService._instance) {
            GameService._instance = new GameService()
        }
        return GameService._instance
    }

    public startGame(playerAmount: number): void {
        this._gameOver = false
        this.activePlayerId = 0
        this._resetDeck()
        this._resetPlayers(playerAmount)
        this._resetPlayerHands()
        this._onTurnStart()
    }

    public onNextTurn(): void {
        if (this.lastTurn) {
            this._compareCards()
        }
        if (!this._gameOver) {
            this.activePlayerId = (this.activePlayerId + this.players.length + 1) % this.players.length
            this.interactionMode = 'activation'
            this._onTurnStart()
        }
    }

    public onPlayerElimination(): void {
        const activePlayers = this.players.filter(player => !player.eliminated)
        if (activePlayers.length === 1) {
            this._onGameOver(activePlayers[0])
        }
    }

    public get activePlayer(): Player | undefined {
        return this.players.find((player) => player.id === this.activePlayerId)
    }

    public set interactionMode(mode: 'selection' | 'activation') {
        this._interactionMode = mode
    }

    public get interactionMode(): 'selection' | 'activation' {
        return this._interactionMode
    }

    private _onTurnStart(): void {
        this._activePlayerDraws()
        if (this.activePlayerId !== MAIN_PLAYER_ID) {
            setTimeout(() => {
                this._simulateAIPlay()
            }, 1000)
        }
    }

    private _resetPlayers(playerAmount: number): void {
        this.players = Array.from(
            {length: playerAmount},
            (_, index) => new Player(index)
        )
    }

    private _resetPlayerHands(): void {
        this.players.forEach((player) => player.hand.push(this.deck.draw()))
    }

    private _resetDeck(): void {
        this.deck = new Deck()
    }

    private _activePlayerDraws(): void {
        this.players[this.activePlayerId].hand.push(this.deck.draw())
        sendRenderGameMatEvent()
        if (!this.deck.cards.length) {
            this.lastTurn = true
        }
    }

    private _compareCards(): void {
        let winner: Player = this.players[0]

        this.players.filter((p) => !p.eliminated).forEach((player) => {
            if (player.hand[0].value > winner.hand[0].value) {
                winner = player
            }
        })

        this._onGameOver(winner)
    }

    private _onGameOver(winner: Player): void {
        this._gameOver = true
        this.lastWinner = winner
        document.dispatchEvent(new CustomEvent("toggleGameOverModal", {detail: true}))
    }

    private _simulateAIPlay(): void {
        const playerHand = this.players[this.activePlayerId].hand
        const randomCard = playerHand[Math.floor(Math.random() * playerHand.length)]
        randomCard.play()
    }

}