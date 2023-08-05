// This handles the progression of the slides between each weather/info product.

const containers = document.getElementsByClassName('container');
const backgroundContainer = document.getElementById('background-container');
let currentContainerIndex = 0;

  // Define an array of image URLs
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

// Add event listener for the `keydown` event on the document
document.addEventListener('keydown', function(event) {
  // Check if the pressed key is the backtick (`) key
  if (event.key === '`') {
    // Call the showNextContainer() function to switch to the next container
    showNextContainer();
  }
});