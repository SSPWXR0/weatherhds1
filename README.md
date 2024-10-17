<img src="https://github.com/SSPWXR0/weatherhds1/blob/master/public/images/hdslogo_2024.png">
<body>
  <h1>WeatherHDS (Weather HTML Display System)</h1>

  <p>A basic web app that displays weather from the weather.com API in the style of a 24/7 weather channel broadcast.</p>

  <h1>Configuration</h1>

  <p>*Node.js is required!</p>

  <p>Dependencies: express</p>
  <p>Main presentation and LDL locations can be edited in config.js. Please reload the page once restarting the server.</p>
  <p>The system rotates between locations once the last slide of the presentation is reached, it should loop back on the next location.</p>
  <p>slides.js manages how the slides work. Currently, it switches between the HTML containers every 8 to 10 seconds.</p>
  <p>There are two alert standby screens that are shown when there are no alerts in effect on the alerts slide. One is normal, and the other one is used
  on METEOchannel.</p>

  <h1>Features</h1>
  <ul>
    <li>  <s>-radar container that parses images from dd.weather.gc.ca and plasters it on a div on index.html.</s> <s>nevermind we got rid of the radar lol</s>
  nevermind nevermind we brought back the radar. Sometimes it is not centered, because TWC API is weird. lmk if you find a solution lol.</li>
    <li>Switching between 4:3 (SDTV) and 16:9 (HDTV) aspect ratios. Rendered at canvas sizes of 640x480 and 854x480 respectively, and scaled to fit the viewport. This is controlled by `videoType` in the config file.</li>
    <li>LDL only mode. Displays a black screen with only the LDL, which you could superimpose onto programming with OBS Studio. This is controled by `presentationType` in the config file.</li>
    <li>Switching between metric and imperial.</li>
    <li>Switching between static and animated weather icons.</li>
  </ul> 


  <h1>Credits</h1>
    <p>Credit to ScentedOrange for making the air quality and 7 day high and low pages. | https://github.com/ScentedOrangeDEV</p>
  <p>Weather icons (MIT): https://github.com/basmilius/weather-icons | Copy of license included in weather icon directory</p>
  <p>Google Material icons (APACHE 2.0): https://fonts.google.com/icons | https://www.apache.org/licenses/LICENSE-2.0</p>
  <p>weather videos (Pexels): https://www.pexels.com/license/</p>

  <h1>version 2024.10.12: Known Issues</h1>
  <p>Always report issues on the issues page!</p>
  <ul>
    <li>Progress bar will occasionally not show, but will show normally at the next location.</li>
    <li>A few main presentation animations are a bit weird. (radar slide animation has been improved)</li>
  </ul> 
</body>
