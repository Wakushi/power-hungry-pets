import {Modal} from "./modal.ts";
import {MAIN_PLAYER_ID} from "../constants.ts";
import {GameService} from "../services/game.service.ts";

export class GameOverModal extends Modal {

    gameOverMessageElement: HTMLParagraphElement
    playAgainBtnElement: HTMLButtonElement

    constructor() {
        super("#gameOverModal")
        this.gameOverMessageElement = this.modalElement.querySelector<HTMLParagraphElement>('#gameOverMessage')!
        this.playAgainBtnElement = this.modalElement.querySelector<HTMLButtonElement>('#playAgainBtn')!
        this._listenForEvents()
        this._bindEvents()

    }

    private _listenForEvents(): void {
        document.addEventListener("toggleGameOverModal", (event: Event) => {
            const customEvent = event as CustomEvent
            if (customEvent.detail) {
                this.gameOverMessageElement.innerText = GameService.getInstance().lastWinner.id === MAIN_PLAYER_ID ? 'You won !' : 'You lost !'
                this.open()
            } else {
                this.close()
            }
        })
    }

    private _bindEvents(): void {
        this.playAgainBtnElement.addEventListener('click', () => {
            GameService.getInstance().startGame(GameService.getInstance().players.length)
            this.close()
        })
    }

}