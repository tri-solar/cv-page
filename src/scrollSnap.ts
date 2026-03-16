/**
 * Scroll Snapping Logic
 */

let isScrollSnapping = false
const SNAP_COOLDOWN = 200
let scrollSnapEnabled = false
let wheelHandler: ((event: WheelEvent) => void) | null = null

function findNearestSection(currentScroll: number, sections: NodeListOf<Element>): HTMLElement | null {
    let nearestSection: { section: HTMLElement; distance: number } | null = null

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement
        const distance = section.offsetTop - currentScroll
        
        if (distance > 0 && (nearestSection === null || distance < nearestSection.distance)) {
            nearestSection = { section, distance }
        }
    }

    return nearestSection?.section || null
}

export function initScrollSnap() {
    setScrollSnapEnabled(true)
}

export function setScrollSnapEnabled(enabled: boolean) {
    if (enabled === scrollSnapEnabled) {
        return
    }

    scrollSnapEnabled = enabled

    if (enabled) {
        if (!wheelHandler) {
            wheelHandler = (event: WheelEvent) => {
                if (isScrollSnapping || event.deltaY <= 0) return

                const sections = document.querySelectorAll('section')
                if (sections.length === 0) {
                    return
                }

                const currentScroll = window.scrollY
                const nextSection = findNearestSection(currentScroll + window.innerHeight / 2, sections)
                const scrollThreshold = window.innerHeight * 0.1

                if (nextSection && nextSection.offsetTop - currentScroll > scrollThreshold) {
                    event.preventDefault()
                    isScrollSnapping = true
                    nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })

                    setTimeout(() => {
                        isScrollSnapping = false
                    }, SNAP_COOLDOWN)
                }
            }
        }

        window.addEventListener('wheel', wheelHandler, { passive: false })
        return
    }

    if (wheelHandler) {
        window.removeEventListener('wheel', wheelHandler)
    }
    isScrollSnapping = false
}
