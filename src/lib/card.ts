export class Card {
  title: string
  description: string
  value: number
  amount: number
  color: string
  descColor: string

  constructor(
    name: string,
    description: string,
    value: number,
    amount: number,
    color: string,
    descColor: string
  ) {
    this.title = name
    this.description = description
    this.value = value
    this.amount = amount
    this.color = color
    this.descColor = descColor
  }

  get template(): string {
    return ` 
      <article class="flex flex-col bg-white w-[205px] min-h-[250px] rounded-lg overflow-hidden shadow-lg">
        <div class="relative pb-[0.3rem] pt-2 pl-[3rem] font-bold" style="color: ${this.color};">
          <span class="absolute bg-white text-[2rem] top-0 left-[-5px] rounded-full w-[50px] h-[50px] flex items-center justify-center">${this.value}</span>
          <span class="relative text-[1.2rem] z-[2] leading-none">${this.title}</span>
        </div>
        <div class="flex-1 p-4 uppercase font-bold text-center leading-none" style="background-color: ${this.color};">
          <p style="color: ${this.descColor};">${this.description}</p>
        </div>
      </article>
    `
  }
}
