<img src="https://github.com/SSPWXR0/weatherhds1/blob/main/public/img/hdslogo.png">
<h1>WeatherHDS (Weather HTML Display System)</h1>
  <p>A very basic weather display application that displays weather information from Environment Canada on an HTML page. Suitable for continuous weather channel broadcasts.</p>
<h1>Configuration</h1>
<p>*Node.js is required!</p>
<p>By default, the system comes with six locations that equate to a one hour broadcast cycle. To add/remove locations, modify the list at the top of weathermanager.js.</p>
<p>The system rotates between these location every 10 minutes. To change this interval, it is located at the very bottom of weathermanager.js.</p>
<p>slides.js manages how the slides work. Currently, it switches between the HTML containers every 11 seconds.</p>
<p>To add more slides, simply add another div with the "container" class in index.html.</p>
<h1>Features</h1>
-radar container that parses images from dd.weather.gc.ca and plasters it on a div on index.html.
