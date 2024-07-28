import { Card } from "./card"

export class Player {
  id: number
  hand: Card[] = []
  wins: number = 0
  eliminated: boolean = false

  constructor(id: number) {
    this.id = id
  }

  get handTemplate(): string {
    let hand = ""
    this.hand.forEach((card) => {
      hand += card.template
    })
    return hand
  }
}
