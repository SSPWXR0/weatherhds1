const presentationSlides = {
    "0": { title: "Welcome!", htmlID: "stationid",},
    "1": { title: "Weather Alerts", htmlID: "alerts" ,},
    "2": { title: "Current Conditions", htmlID: "current",},
    "3": { title: "Latest Radar Image", htmlID: "radar",},
    "4": { title: "Day One Forecast", htmlID: "forecast-shortterm",},
    "5": { title: "Day Two Forecast", htmlID: "forecast-shortterm-d2",},
    "6": { title: "Extended Outlook", htmlID: "forecast-extended", },
    "7": { title: "7 Day High and Lows", htmlID: "7day-graph", },
    "8": { title: "Air Quality", htmlID: "airquality"}
}

let slideIndex = 0;

const slides = document.getElementsByClassName('main-slide')
const currentSlideText = document.getElementById('current-slide');

function showSlide(index) {
    for (let key in presentationSlides) {
        const slideElement = document.getElementById(presentationSlides[key].htmlID)
        if (slideElement) {
            slideElement.style.display = 'none';
        }
    }

    const currentSlideElement = document.getElementById(presentationSlides[index].htmlID)
    if (currentSlideElement) {
        currentSlideElement.style.display = 'block';        
    }

    currentSlideText.innerHTML = `${presentationSlides[index].title}`

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

    setTimeout(nextSlide, 10000);
}

function startSlideshow() {
    showSlide(slideIndex);
    setTimeout(nextSlide, 10000)
}

window.onload = startSlideshow