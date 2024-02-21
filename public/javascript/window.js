const viewport = document.getElementsByClassName("view")[0]

function ScaleViewportToTheWindowIGuessLmao() {
    const aspectRatio = 4/3;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    const scaleRatioWidth = containerWidth / 800;
    const scaleRatioHeight = containerHeight / 600;

    const scaleRatio = Math.min(scaleRatioWidth, scaleRatioHeight);

    viewport.style.transformOrigin = `top left`;

    const centeredLeft = (containerWidth - viewport.offsetWidth * scaleRatio) / 2;
    const centeredTop = (containerHeight - viewport.offsetHeight * scaleRatio) / 2;

    viewport.style.left = `${centeredLeft}px`;
    viewport.style.top = `${centeredTop}px`;

    viewport.style.transform = `scale(${scaleRatio})`;
}

ScaleViewportToTheWindowIGuessLmao();

window.addEventListener('resize', ScaleViewportToTheWindowIGuessLmao);