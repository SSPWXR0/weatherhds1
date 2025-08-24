let config = {
    twcApiKey: "e1f10a1e78da46f5b10a1e78da96f525",
    token: "pk.eyJ1IjoicGV5dG9ud2R5bSIsImEiOiJjbGx0NHpmMHYwenJtM2tsaXRmaHF3ZHBsIn0.TlyGx6b0mqYSbzZUFjIQmg",
    interval_between_loops: "1000",
    interval_delay: "100"
}

let radarTimeSlices;
let loops;
const maxLoops = 12;
let i = 0;
let map = null;

export function resizeThing() {
    map.resize()
}

export async function drawMap(lat, lon) {

    let cityLngLat = [lon, lat];
    console.log(cityLngLat)


    let total_frames = 48;
    let interval_delay = 50;

    let total_time_s = (total_frames * interval_delay) / 1000;
    let radar_frame_rate = total_frames / total_time_s;
    console.log(radar_frame_rate);


    map = new mapboxgl.Map({
        container: "radar-div-so-that-mapbox-will-be-happy",
        style: 'mapbox://styles/peytonwdym/clov0gd3u00mj01pe1wmhb2j5',
        center: cityLngLat,
        accessToken: config.token,
        telemetry: false,
        interactive: false,
        dragging: false,
        zoom: 6,
    });

    map.on('load', async () => {
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
                                `https://api.weather.com/v3/TileServer/tile/twcRadarMosaic?ts=${timestamp.ts}&xyz={x}:{y}:{z}&apiKey=${config.twcApiKey}`
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
    });
}


    //const weatherRadarTime = document.getElementById("main-radar-current-time"); not implemented yet too lazy

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
                const timeString = localDate.toLocaleTimeString();
                //weatherRadarTime.innerHTML = `Time: ${timeString}`;

                radarTimeSlices.forEach((t, idx) => {
                    map.setLayoutProperty(`radarlayer_${t.ts}`, "visibility", idx === i ? "visible" : "none");
                });

                i++;
            }, config.interval_delay);
            loops++;
        } else {
            console.log("done with radar loops");
        }
    }
