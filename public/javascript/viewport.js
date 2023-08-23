const container =  document.getElementById('view');

function findMaxHeightWidth() {
    const aspectRatio = 4 / 3
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    let maxWidth = windowWidth
    let maxHeight = windowHeight

    if (windowWidth / windowHeight > aspectRatio) {
        maxWidth = windowHeight * aspectRatio
    } else {
        maxHeight = windowWidth / aspectRatio
    }
    container.style.maxWidth = `${maxWidth}px`
    container.style.maxHeight = `${maxHeight}px`

}
findMaxHeightWidth();

window.addEventListener('resize', findMaxHeightWidth)