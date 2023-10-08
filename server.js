const express = require('express');
const path = require('path');
const { parseString } = require('xml2js');

const app = express();
const port = 3000;

// Serve the 'public' directory as static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server on port 3000
app.listen(port, () => {
  console.log('Server is running on http://localhost:3000');
});

app.get('/api/eccc/:province/:code/:language', async (req, res) => {
  try {
    const { province, code, language } = req.params;

    // Construct the URL based on the provided parameters
    const url = `https://dd.weather.gc.ca/citypage_weather/xml/${province}/${code}_${language}.xml`;
    
    const response = await fetch(url);
    const xmlData = await response.text();
    
    parseString(xmlData, (err, result) => {
      if (err) {
        console.error(`Error parsing XML for location ${code}:`, err);
        return res.status(500).json({ error: `Error parsing XML for location ${code}` });
      }
      
      const jsonData = result;
      // Now you can process jsonData and extract the required information
      
      // Send the weather data as JSON response
      res.json(jsonData);
      console.log(`Pushed Environment Canada weather info for ${code} to client.`);
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data.' });
  }
});

app.get('/api/eccc/radar', async (req, res) => {
  const radarDirectories = [
    'PNR', // Add more radar directories as needed
    'PYR',
    'NATIONAL'
  ];
  const imageTypes = ['WT', 'A11Y'];

  try {
    const radarData = [];
    for (const directory of radarDirectories) {
      for (const imageType of imageTypes) {
        if (directory === 'PNR') {
          // For PNR directory, use the original code to fetch the latest image
          const baseUrl = 'https://dd.weather.gc.ca/radar/PRECIPET/GIF/PNR/';
          const response = await fetch(baseUrl);
          const data = await response.text();
          const timestamps = data.match(/\d{12}_PNR_PRECIPET_RAIN_(WT|A11Y).gif/g);
          if (timestamps && timestamps.length > 0) {
            timestamps.sort((a, b) => (a > b ? -1 : 1));
            const latestTimestamp = timestamps[0].substring(0, 12);
            const imageUrl = `${baseUrl}${latestTimestamp}_PNR_PRECIPET_RAIN_${imageType}.gif`;
            radarData.push({ radarDirectory: 'PNR', imageType, imageUrl });
          }
        } else {
          // For PYR and NATIONAL directories, use the modified regular expressions
          const baseUrl = `https://dd.weather.gc.ca/radar/PRECIPET/GIF/${directory}/`;
          const response = await fetch(baseUrl);
          const data = await response.text();
          const timestampsPYR = data.match(/\d{12}_PYR_PRECIPET_(RAIN|SNOW)_(WT|A11Y).gif/g);
          const timestampsNATIONAL = data.match(/\d{12}_NATIONAL_PRECIPET_(RAIN|SNOW)_(WT|A11Y).gif/g);
          const timestamps = [...(timestampsPYR || []), ...(timestampsNATIONAL || [])];
          if (timestamps && timestamps.length > 0) {
            timestamps.sort((a, b) => (a > b ? -1 : 1));
            const latestTimestamp = timestamps[0].substring(0, 12);
            const imageUrl = `${baseUrl}${latestTimestamp}_${directory}_PRECIPET_RAIN_${imageType}.gif`;
            radarData.push({ radarDirectory: directory, imageType, imageUrl });
          }
        }
      }
    }

    if (radarData.length > 0) {
      // Send the radar data as JSON response
      res.json(radarData);
    } else {
      res.status(404).json({ error: 'No radar images found on the server.' });
    }
  } catch (error) {
    console.error('Error fetching radar images:', error);
    res.status(500).json({ error: 'Error fetching radar images.' });
  }
});