let config = {
    twcApiKey: "e1f10a1e78da46f5b10a1e78da96f525",
    token: "pk.eyJ1IjoicGV5dG9ud2R5bSIsImEiOiJjbGx0NHpmMHYwenJtM2tsaXRmaHF3ZHBsIn0.TlyGx6b0mqYSbzZUFjIQmg",
    interval_between_loops: "1000",
    interval_delay: "150"
}

const logTheFrickinTime = `[radar.js] | ${new Date().toLocaleString()} |`;

let radarTimeSlices;
let loops;
const maxLoops = 12;
let i = 0;
let map = null;
export let mapTTL = 0;

let maxTimeToLive = 6;

export function clearMap() {
    if (map) {
        map.remove();
        map = null;
        mapTTL = 0;
    }
}

export async function drawMap(lat, lon, product, zoom, htmlID) {

    if (!lat || !lon) {
        console.warn(logTheFrickinTime, "Latitude or Longitude is null or undefined. Cannot draw map.");
        return;
    }

    try {
        
        let cityLngLat = [lon, lat];
        console.log(cityLngLat)


        let total_frames = 48;
        let interval_delay = 1;


        let total_time_s = (total_frames * interval_delay) / 500;
        let radar_frame_rate = total_frames / total_time_s;
        console.log(radar_frame_rate);

        if (!map) {
            map = new mapboxgl.Map({
            container: htmlID,
            style: 'mapbox://styles/peytonwdym/clov0gd3u00mj01pe1wmhb2j5',
            center: cityLngLat,
            accessToken: config.token,
            telemetry: false,
            interactive: false,
            dragging: false,
            zoom: zoom,
        });
        map.on('load', fetchTiles);

        } else {
            if (mapTTL >= maxTimeToLive) {
                console.log("TS MAP OLD AS HELL! SENDING THIS SHYT TO THE FIRING SQUAD")
                clearMap();
                drawMap(lat, lon, product, zoom, htmlID);
                return;
            } else {
                map.setCenter(cityLngLat);
                map.setZoom(zoom);
                fetchTiles();
                mapTTL++;
            }
        }

        async function fetchTiles() {
                map.resize()

                i = 0;
                loops = 0;

                const res = await fetch(
                    `https://api.weather.com/v3/TileServer/series/productSet/PPAcore?apiKey=${config.twcApiKey}`
                ).then(r => r.json());

                radarTimeSlices = res.seriesInfo.radar.series.reverse();

                radarTimeSlices.forEach((timestamp, index) => {
                    if (index < total_frames) {
                        map.addLayer({
                            id: `radarlayer_${timestamp.ts}`,
                            type: "raster",
                            source: {
                                type: "raster",
                                tiles: [
                                    `https://api.weather.com/v3/TileServer/tile/${product}?ts=${timestamp.ts}&xyz={x}:{y}:{z}&apiKey=${config.twcApiKey}`
                                ],
                                tileSize: 512
                            },
                            layout: {
                                visibility: index === 0 ? 'visible' : 'none'
                            }
                        });
                    }
                });
            animateRadar();

            map.getStyle().layers.forEach(layer => {
                if (layer.type === 'symbol' && layer.layout && layer.layout['text-size']) {
                    map.setLayoutProperty(layer.id, 'text-size', 40);
                    map.setLayoutProperty('road-number-shield-navigation', 'text-size', 18);
                }
            });
        }

        const weatherRadarTime = document.getElementById("main-radar-time");

        function animateRadar() {
            if (!radarTimeSlices || radarTimeSlices.length === 0) return;

            if (loops < maxLoops) {
                let interval = setInterval(() => {
                    if (i >= radarTimeSlices.length) {
                        clearInterval(interval);
                        setTimeout(() => {
                            i = 0;
                            animateRadar();
                        }, config.interval_between_loops);
                        return;
                    }
                    const timestamp = radarTimeSlices[i];
                    const localDate = new Date(timestamp.ts * 1000);

                    let hours = localDate.getHours();
                    let minutes = localDate.getMinutes();
                    let ampm = hours >= 12 ? "PM" : "AM";

                    hours = hours ? hours : 12

                    minutes = minutes < 10 ? "0" + minutes : minutes;

                    const timeFmt = `${hours}:${minutes} ${ampm}`

                    weatherRadarTime.innerHTML = `${timeFmt}`;

                    radarTimeSlices.forEach((t, idx) => {
                        map.setLayoutProperty(`radarlayer_${t.ts}`, "visibility", idx === i ? "visible" : "none");
                    });

                    i++;
                }, config.interval_delay);
                loops++;
            } else {
                if (config.verboseLogging) {
                    console.log(logTheFrickinTime, "Reached max loops for radar animation.");
                }
            }
        }

    } catch (error) {
        //DONT FUCKING FLOOD MY CONSOLE
    }
}