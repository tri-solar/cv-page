/**
 * Scroll Snapping Logic
 */

let isScrollSnapping = false
const SCROLL_THRESHOLD = window.innerHeight * 0.1
const SNAP_COOLDOWN = 200

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
    const sections = document.querySelectorAll('section')

    window.addEventListener('wheel', (event) => {
        if (isScrollSnapping || event.deltaY <= 0) return

        const currentScroll = window.scrollY
        const nextSection = findNearestSection(currentScroll + window.innerHeight / 2, sections)
        
        if (nextSection && nextSection.offsetTop - currentScroll > SCROLL_THRESHOLD) {
            event.preventDefault()
            isScrollSnapping = true
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
            
            setTimeout(() => {
                isScrollSnapping = false
            }, SNAP_COOLDOWN)
        }
    }, { passive: false })
}
