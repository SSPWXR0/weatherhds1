const containers = document.getElementsByClassName('container');
const backgroundContainer = document.getElementById('background-container');
let currentContainerIndex = 0;
let interval;
let isPaused = false; // Variable to track the pause state

  // Add whatever jpg image to this list and it will cycle through them at the intro screen.
  var images = [
    "backgrounds/add_more_images_in_slides_js.jpg",
    ];
    
function showNextContainer() {
  // Hide the current container
  containers[currentContainerIndex].classList.remove('visible');

  // Increment the index
  currentContainerIndex = (currentContainerIndex + 1) % containers.length;

  // Show the next container
  containers[currentContainerIndex].classList.add('visible');

  // Randomly select an image URL from the array
  var randomImage = images[Math.floor(Math.random() * images.length)];

  // Set the background image of the background container
  backgroundContainer.style.backgroundImage = "url('" + randomImage + "')";
}

// Show the first container initially
containers[currentContainerIndex].classList.add('visible');

// Change the container and background image every 3 seconds (adjust the duration as needed)
setInterval(showNextContainer, 11000);

document.addEventListener('keydown', function(event) {
  // Check if the pressed key is the backtick (`) key
  if (event.key === '`') {
    // Call the showNextContainer() function to switch to the next container
    showNextContainer();
  }
  // Check if the pressed key is the X key
  else if (event.key === 'x') {
    // Toggle the pause state
    isPaused = !isPaused;

    // Hide or show the slideshow based on the pause state
    if (isPaused) {
      // Pause the slideshow by clearing the interval
      clearInterval(interval);
      // Hide the slideshow
      document.getElementById('slideshow').style.display = 'none';
    } else {
      // Resume the slideshow by setting a new interval
      interval = setInterval(showNextContainer, 11000);
      // Show the slideshow
      document.getElementById('slideshow').style.display = 'block';
    }
  }
});