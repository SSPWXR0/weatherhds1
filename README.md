<img src="https://github.com/SSPWXR0/weatherhds1/blob/master/public/images/hdslogo_2024.png">
<body>
  <h1>WeatherHDS (Weather HTML Display System)</h1>

  <img src="https://github.com/SSPWXR0/weatherhds1/blob/master/public/images/hds_screenshots.jpg">

  <h2>Present continuous weather data on display screens, with easy deployment and free and open source software.</h2>
  <p>WeatherHDS is a Node.JS app that simplifies the presentation of modern and updated weather graphics on digital displays or other types of broadcasts. Designed with modularity and infinite customizability in mind, thanks to WeatherHDS's simplified
  underlying system completly built on standard web technologies.</p>

  <h1>Configuration</h1>
  <p>Dependencies: express</p>
  <p>Main presentation and LDL locations can be edited in server.js. Always restart the server for server config changes!</p>
  <p>The system rotates between locations once the last slide of the presentation is reached, it should loop back on the next location.</p>
  <p>slides.js manages how the slides work. Currently, it switches between the HTML containers every 8 to 10 seconds.</p>
  <p>The alerts page will show an intro slide whenever there are no alerts in effect.</p>

  <h1>Features</h1>
  <ul>
    <li>Built and designed for developers to adapt and improve the system.</li>
    <li>Completly customizable locations, no automatic geolocation (server.js, serverConfig)</li>
    <li>Switching between 4:3 (VGA), 16:9 (HDTV), 16:10 (Tablet), and 3:2 (NTSC DV) aspect ratios. Rendered at canvas sizes of 640x480, 854x480, 768x480 and 720x480 respectively, scaled to fit the viewport. This is controlled by `videoType` in the config.js file.</li>
    <li>LDL only mode. Displays a black screen with only the LDL, which you could superimpose onto programming with OBS Studio. This is controlled by `presentationType` in the config.js file.</li>
    <li>Switching between metric and imperial. (server.js, serverConfig)</li>
    <li>Switching between static and animated weather icons. (config.js)</li>
  </ul>

<h1>Config</h1>

<h3>Global Configuration</h3>
<ul>
  <li><code>networkName</code>: Network name used on the station ID card.</li>
  <li><code>affiliateName</code>: Affiliate name used on the station ID card.</li>
  <li><code>channelNumber</code>: Channel ID/number used on the station ID card.</li>
  <li><code>videoBackgrounds</code>: Enables or disables the video backgrounds on the current conditions slide.</li>
  <li><code>currentConditionsGradient</code>: Enables a background gradient on the current conditions slide based on time relative to sunrise or sunset.</li>
  <li><code>staticIcons</code>: If true, uses non-animated weather icons.</li>
  <li><code>transparentLDL</code>: Sets the background opacity for the LDL (0 = fully opaque, 1 = fully transparent).</li>
  <li><code>ldlClock</code>: In LDL-only mode, shows or hides the clock and network logo on the LDL.</li>
  <li><code>presentationConfig</code>: Object containing slide and display mode toggles (see Parameter Configuration section).</li>
  <li><code>loadingScreen</code>: Enables or disables a loading screen before presentation starts.</li>
  <li><code>topbarStyle</code>: Style of the top bar </li>
  <li><code>videoType</code>: Aspect ratio mode. (options: <code>vga</code>, <code>ntsc</code>, <code>hdtv</code>, <code>tablet</code>).</li>
  <li><code>textureFiltering</code>: Only affects radar — determines whether images are rendered pixelated or smooth.</li>
  <li><code>systemTimeZone</code>: Time zone in <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones">tz_database</a> format.</li>
  <li><code>tickerContent</code>: Text for the scrolling crawl on the LDL; empty string hides the crawl.</li>
  <li><code>overrideBackgroundImage</code>: URL to a custom background image; skips background rotation.</li>
  <li><code>backgroundSource</code>: <code>local</code> for bundled backgrounds, <code>online</code> for Bing image API backgrounds.</li>
  <li><code>verboseLogging</code>: Enables or disables extra console logging.</li>
</ul>

<h3>URL parameters </h3>
<i>Example: <code>http://localhost:3000/?videoType=1&ldl=true&background=true</code></i>
<ul>
  <li><code>videoType</code>: Sets the video type. Please see entry #3 of features.</li>
  <li><code>main</code>: Enables/disables main presentation mode.</li>
  <li><code>ldl</code>: Enables/disables LDL mode.</li>
  <li><code>backgrounds</code>: Enables/disables backgrounds in the presentation.</li>
  <li><code>repeatMain</code>: When true, loops the main presentation.</li>
  <li><code>ldlClock</code>: Toggles the LDL clock independently of global <code>ldlClock</code> setting.</li>
</ul>
<p></p>



  <h1>Credits</h1>
    <p>Credit to ScentedOrange for making the air quality and 7 day high and low pages. | https://github.com/ScentedOrangeDEV</p>
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
