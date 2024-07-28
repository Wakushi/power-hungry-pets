import { Card } from "./card"
import { availableCards } from "../data/card-data"
import { shuffleArray } from "./utils"

export class Deck {
  private _cards: Card[] = []
  sideCard!: Card

  constructor() {
    this._init()
  }

  get cards(): Card[] {
    return this._cards
  }

  set cards(cards: Card[]) {
    this._cards = cards
  }

  private _init(): void {
    this._createDeck()
    this._shuffleDeck()
    this._extractRandomSideCard()
  }

  private _createDeck(): void {
    availableCards.forEach(
      ({ title, description, value, amount, color, descColor }) => {
        for (let i = 0; i < amount; i++) {
          this.cards.push(
            new Card(title, description, value, amount, color, descColor)
          )
        }
      }
    )
  }

  private _shuffleDeck(): void {
    this.cards = shuffleArray(this.cards)
  }

  private _extractRandomSideCard(): void {
    this.sideCard = this.cards.splice(
      Math.floor(Math.random() * this.cards.length),
      1
    )[0]
  }

  draw(): Card | null {
    if (!this.cards.length) return null
    return this.cards.splice(0, 1)[0]
  }
}
