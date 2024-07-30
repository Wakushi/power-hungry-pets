export class Card {
    id: string
    title: string
    description: string
    value: number
    amount: number
    color: string
    descColor: string

    constructor(
        id: string,
        title: string,
        description: string,
        value: number,
        amount: number,
        color: string,
        descColor: string
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.value = value
        this.amount = amount
        this.color = color
        this.descColor = descColor
    }

    public bindEvents(): void {
        const cardElement = document.getElementById(this.id)!
        cardElement.addEventListener("click", () => this.play())
    }

    public play(): void {
        document.dispatchEvent(new CustomEvent("playedCard", {detail: this.id}))
    }

    getTemplate(interactive = false): string {
        return ` 
      <article style="pointer-events: ${interactive ? "all" : "none"}" id=${
            this.id
        } class="flex flex-col bg-white w-[205px] min-h-[250px] rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-lg border-2 border-slate-100 hover:border-yellow-400">
        <div class="relative pb-[0.3rem] pt-2 pl-[3rem] font-bold" style="color: ${
            this.color
        };">
          <span class="absolute bg-white text-[2rem] top-0 left-[-5px] rounded-br-lg w-[50px] h-[50px] flex items-center justify-center z-[2]">${
            this.value
        }</span>
          <span class="relative text-[1.2rem] z-[2] leading-none">${
            this.title
        }</span>
        </div>
        <div class="flex-1 p-4 uppercase font-bold text-center leading-none" style="background-color: ${
            this.color
        };">
          <p style="color: ${this.descColor};">${this.description}</p>
        </div>
      </article>
    `
    }
}
