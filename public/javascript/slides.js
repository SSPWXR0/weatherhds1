const presentationSlides = {
    "0": { title: "Welcome!", htmlID: "stationid", durationMS: "8000"},
    "1": { title: "Weather Alerts", htmlID: "alerts", durationMS: "8000"},
    "2": { title: "Current Conditions", htmlID: "current", durationMS: "10000"},
    "3": { title: "Latest Radar Image", htmlID: "radar", durationMS: "8000"},
    "4": { title: "Day One Forecast", htmlID: "forecast-shortterm", durationMS: "8000"},
    "5": { title: "Day Two Forecast", htmlID: "forecast-shortterm-d2", durationMS: "8000"},
    "6": { title: "Extended Outlook", htmlID: "forecast-extended", durationMS: "10000" },
    "7": { title: "7 Day High and Lows", htmlID: "7day-graph", durationMS: "10000" },
    "8": { title: "Air Quality", htmlID: "airquality", durationMS: "8000"},
    "9": { title: "Again... Current Conditions", htmlID: "current", durationMS: "10000"},
}

let slideIndex = 0;
let duration

const slides = document.getElementsByClassName('main-slide')
const currentSlideText = document.getElementById('current-slide');

function showSlide(index) {
    for (let key in presentationSlides) {
        const slideElement = document.getElementById(presentationSlides[key].htmlID)
        if (slideElement) {

            setTimeout(() => {
                slideElement.style.animation = `mainPresentationSlideIn 500ms ease-in-out`
            }, duration - 500);

            slideElement.style.display = 'none';
        }
    }

    const currentSlideElement = document.getElementById(presentationSlides[index].htmlID)
    if (currentSlideElement) {

        setTimeout(() => {
            currentSlideElement.style.animation = `mainPresentationSlideOut 350ms ease-in-out 1 forwards`
        }, duration - 300);

        currentSlideElement.style.display = 'block';    
    }

    currentSlideText.innerHTML = `${presentationSlides[index].title}`

    console.log(`Showing Main Presentation Slide: ${presentationSlides[index].htmlID} for a duration of ${presentationSlides[index].durationMS}`)

    duration = Number(presentationSlides[index].durationMS);

}



function nextSlide() {
    slideIndex++;
    const totalSlides = Object.keys(presentationSlides).length;

    if (slideIndex < totalSlides) {
        showSlide(slideIndex);
    } else {
        slideIndex = 0;
        nextLocation();
    }

    setTimeout(nextSlide, duration);
}

function startSlideshow() {
    showSlide(slideIndex);
    setTimeout(nextSlide, duration);
}

window.onload = startSlideshow