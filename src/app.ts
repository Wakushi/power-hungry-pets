import {GameMat} from "./components/game-mat.ts";
import {GameService} from "./services/game.service.ts";
import {PlayerSelectionModal} from "./components/player-selection-modal.ts";
import {CardSelectionModal} from "./components/card-selection-modal.ts";
import {EventService} from "./services/event.service.ts";
import {CardViewModal} from "./components/card-view-modal.ts";
import {GameOverModal} from "./components/game-over-modal.ts";

export class App {
    static init() {
        // FUTURE START SCREEN
        new GameOverModal()
        new CardViewModal()
        new PlayerSelectionModal()
        new CardSelectionModal()
        EventService.getInstance().listenForEvents()
        GameService.getInstance().startGame(2)
        ///////////////////////
        new GameMat(GameService.getInstance())
    }
}
