const presentationSlides = {
    "0": { title: "Welcome!", htmlID: "stationid",},
    "1": { title: "Current Conditions", htmlID: "current",},
    "2": { title: "Day One Forecast", htmlID: "forecast-shortterm",},
    "3": { title: "Day Two Forecast", htmlID: "forecast-shortterm-d2",},
    "4": { title: "Extended Outlook", htmlID: "forecast-extended", },
    //"5": { title: "Air Quality", htmlID: "airquality"}
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