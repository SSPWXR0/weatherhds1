<img src="[https://github.com/SSPWXR0/weatherhds1/blob/main/public/img/hdslogo](https://github.com/SSPWXR0/weatherhds1/blob/master/public/img/hdslogo.png)">
<h1>WeatherHDS (Weather HTML Display System)</h1>
  <p>A very basic weather display application that displays weather information from an API on an HTML page.</p>
  <p>OBS Studio is required to add styling, extra text, and a ticker to the weather broadcast. Knowlege in JS, HTML, and CSS would also work. Or you can just use AI or something.</p>
<h1>Configuration</h1>
<p>*Node.js is required!</p>
<p>*The weather api that this app was designed for is: https://www.weatherapi.com/ (a free plan is available)</p>
<p>By default, the system comes with six locations that equate to a one hour broadcast cycle. To add/remove locations, modify the list at the top of weathermanager.js. (location_province)</p>
<p>The system rotates between these location every 10 minutes. To change this interval, it is located at the very bottom of weathermanager.js.</p>
<p>slides.js manages how the slides work. Currently, it switches between the HTML containers every 11 seconds.</p>
<p>To add more slides, simply add another div with the "container" class in index.html.</p>
<h1>Features</h1>
-radar container that parses images from dd.weather.gc.ca and plasters it on a div on index.html.
