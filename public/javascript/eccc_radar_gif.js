function fetchLatestRadarImage() {
  // Fetch the latest radar image URL from your Node.js server
  fetch('http://localhost:3000/api/radar/latest')
    .then((response) => response.json())
    .then((data) => {
      if (data.imageUrl) {
        // Display the latest radar image
        displayRadarImage(data.imageUrl);
      } else {
        console.error(data.error || 'No radar images found on the server.');
      }
    })
    .catch((error) => {
      console.error('Error fetching radar images:', error);
    });
}

function displayRadarImage(imageUrl) {
  // Create an image element and set its source to the radar image URL
  const radarImage = document.createElement('img');
  radarImage.src = imageUrl;

  // Append the image element to the radarDiv container
  const radarDiv = document.getElementById('radarDiv');
  radarDiv.innerHTML = ''; // Clear the container before adding the new image
  radarDiv.appendChild(radarImage);
}

// Call the fetchLatestRadarImage function initially to show the latest image
fetchLatestRadarImage();

// Set up a timer to fetch and display the latest radar image every 6 minutes
setInterval(fetchLatestRadarImage, 6 * 60 * 1000);
