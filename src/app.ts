import { GameMat } from "./lib/game-mat"
import { Player } from "./lib/player"

export class App {
  static init() {
    const playerAmount = 1
    const players = Array.from(
      { length: playerAmount },
      (_, index) => new Player(index)
    )
    new GameMat(players)
  }
}
