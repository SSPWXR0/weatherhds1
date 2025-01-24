<img src="https://github.com/SSPWXR0/weatherhds1/blob/master/public/images/hdslogo_2024.png">
<body>
  <h1>WeatherHDS (Weather HTML Display System)</h1>

  <img src="https://github.com/SSPWXR0/weatherhds1/blob/master/public/images/hds_screenshots.jpg">

  <h2>Present continuous weather data on display screens, with easy deployment and free and open source software.</h2>
  <p>WeatherHDS is a Node.JS app that simplifies the presentation of modern and updated weather graphics on digital displays or other types of broadcasts. Designed with modularity and infinite customizability in mind, thanks to WeatherHDS's simplified
  underlying system completly built on standard web technologies.</p>

  <h1>Configuration</h1>
  <p>Dependencies: express</p>
  <p>Main presentation and LDL locations can be edited in config.js. Please reload the page once restarting the server.</p>
  <p>The system rotates between locations once the last slide of the presentation is reached, it should loop back on the next location.</p>
  <p>slides.js manages how the slides work. Currently, it switches between the HTML containers every 8 to 10 seconds.</p>
  <p>The alerts page will show an intro slide whenever there are no alerts in effect.</p>

  <h1>Features</h1>
  <ul>
    <li>Built and designed for developers to adapt and improve the system.</li>
    <li>Completly customizable locations, no automatic geolocation</li>
    <li>Switching between 4:3 (VGA), 16:9 (HDTV), 16:10 (Tablet), and 3:2 (NTSC DV) aspect ratios. Rendered at canvas sizes of 640x480, 854x480, and 768x480 respectively, and scaled to fit the viewport. This is controlled by `videoType` in the config file.</li>
    <li>LDL only mode. Displays a black screen with only the LDL, which you could superimpose onto programming with OBS Studio. This is controlled by `presentationType` in the config file.</li>
    <li>Switching between metric and imperial.</li>
    <li>Switching between static and animated weather icons.</li>
  </ul> 


  <h1>Credits</h1>
    <p>Credit to ScentedOrange for making the air quality and 7 day high and low pages. | https://github.com/ScentedOrangeDEV</p>
    <p>Credit to Dalk for writing TWC API weather fetching functions. | https://github.com/Dalk21</p>
    <p>Credit to LeWolfYT for providing solutions to issues regarding the 7 day highs and the LDL progress bars | https://github.com/LeWolfYT</p>
  <p>Weather icons (MIT): https://github.com/basmilius/weather-icons | Copy of license included in weather icon directory</p>
  <p>Google Material icons (APACHE 2.0): https://fonts.google.com/icons | https://www.apache.org/licenses/LICENSE-2.0</p>
  <p>weather videos (Pexels): https://www.pexels.com/license/</p>

  <h1>Unresolved Issues</h1>
  <p>Always report issues on the issues page!</p>
  <ul>
    <li>Memory leak (accumulating memory usage as the program operates)</li>
  </ul> 
</body>