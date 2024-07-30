import {Deck} from "../concepts/deck.ts";
import {Player} from "../concepts/player.ts";
import {sendRenderGameMatEvent} from "../lib/game.utils.ts";

export class GameService {
    private static _instance: GameService;

    deck!: Deck
    players: Player[] = []
    activePlayerId: number = 0
    lastCardPlayedId!: string
    lastSelectedPlayer!: Player
    lastTurn = false

    private constructor() {
    }

    public static getInstance(): GameService {
        if (!GameService._instance) {
            GameService._instance = new GameService()
        }
        return GameService._instance
    }

    public startGame(playerAmount: number): void {
        this.activePlayerId = 0
        this._resetDeck()
        this._resetPlayers(playerAmount)
        this._resetPlayerHands()
        this._onTurnStart()
    }

    public onNextTurn(): void {
        this.activePlayerId = (this.activePlayerId + this.players.length + 1) % this.players.length
        this._onTurnStart()
    }

    public onPlayerElimination(): void {
        const activePlayers = this.players.filter(player => !player.eliminated)
        if (activePlayers.length === 1) {
            this._onGameOver(activePlayers[0])
        }
    }

    private _onTurnStart(): void {
        this._activePlayerDraws()
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
            // TODO Build the last turn mechanic
        }
    }

    private _onGameOver(winner: Player): void {
        console.log('Winner is Player ', winner.id)
    }


}