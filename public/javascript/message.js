const textList = [
    "welcome to a weather channel, we have weather",
  ];
  
  let currentIndex = 0;
  
  function changeText() {
    const textElement = document.getElementById("textElement");
    if (textElement) {
      textElement.textContent = textList[currentIndex];
      currentIndex = (currentIndex + 1) % textList.length;
    }
  }
  
  // Initial text display
  changeText();
  
  setInterval(changeText, 60000);

      // Get the seasonmsg div element
const seasonMsg = document.getElementById('seasonmsg');

// Define an array of texts for each season
const texts = {
  spring: "Happy Spring!",
  summer: "Happy Summer!",
  autumn: "Happy Autumn!",
  winter: "cold"
};

// Function to get the current season based on the current month
function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  switch (month) {
    case 3:
    case 4:
    case 5:
      return "spring";
    case 6:
    case 7:
    case 8:
      return "summer";
    case 9:
    case 10:
    case 11:
      return "autumn";
    default:
      return "winter";
  }
}

// Function to update the text in the seasonmsg div
function updateSeasonMessage() {
  const currentSeason = getCurrentSeason();
  const text = texts[currentSeason];
  seasonMsg.textContent = text;
}

// Update the initial text
updateSeasonMessage();

// Update the text every 30 seconds
setInterval(updateSeasonMessage, 30000);