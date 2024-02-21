const containers = document.getElementsByClassName('container');
const backgroundContainer = document.getElementById('background-container');
let currentContainerIndex = 0;
let interval;
let isHidden = false;
let isPaused = false;

function showNextContainer() {
  containers[currentContainerIndex].classList.remove('visible');

  currentContainerIndex = (currentContainerIndex + 1) % containers.length;

  containers[currentContainerIndex].classList.add('visible');
}

containers[currentContainerIndex].classList.add('visible');

function handlePause() {

  isPaused = !isPaused;

  const pausedDiv = document.getElementById('paused');
  if (isPaused) {

    clearInterval(interval);

    pausedDiv.style.display = 'block';
  } else {

    interval = setInterval(showNextContainer, 11000); //default 11000

    pausedDiv.style.display = 'none';
  }
}

document.addEventListener('keydown', function(event) {

  if (event.key === '`') {

    showNextContainer();
  }

  else if (event.key === 'x') {

    isHidden = !isHidden;

    if (isHidden) {

      document.getElementById('slideshow').style.display = 'none';
    } else {

      document.getElementById('slideshow').style.display = 'block';
    }
  }
  else if (event.key === 'z') {
    handlePause();
  }
});

interval = setInterval(showNextContainer, 11000);