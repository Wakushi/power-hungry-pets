export function togglePlayerSelectionModal(open: boolean): void {
    document.dispatchEvent(
        new CustomEvent("togglePlayerSelectionModal", {detail: open})
    )
}

export function toggleCardSelectionModal(open: boolean): void {
    document.dispatchEvent(
        new CustomEvent("toggleCardSelectionModal", {detail: open})
    )
}

export function sendRenderGameMatEvent(): void {
    document.dispatchEvent(
        new CustomEvent("renderGameMat")
    )
}