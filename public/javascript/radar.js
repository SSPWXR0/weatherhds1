const config = {
    twcApiKey: "e1f10a1e78da46f5b10a1e78da96f525",
    token: "pk.eyJ1IjoicGV5dG9ud2R5bSIsImEiOiJjbGx0NHpmMHYwenJtM2tsaXRmaHF3ZHBsIn0.TlyGx6b0mqYSbzZUFjIQmg",
    intervalBetweenLoops: 1000,
    intervalDelay: 150,
    totalFrames: 48,
    maxLoops: 12,
    maxTimeToLive: 6
};

const log = () => `[radar.js] | ${new Date().toLocaleString()} |`;

let radarTimeSlices = [];
let currentFrame = 0;
let loopCount = 0;
let map = null;
let animationTimer = null;
let loopTimer = null;
let isPreloaded = false;
let preloadPromise = null;
export let mapTTL = 0;

const weatherRadarTimeEl = (() => {
    let el = null;
    return () => el || (el = document.getElementById("main-radar-time"));
})();

const formatTime = (ts) => {
    const d = new Date(ts * 1000);
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m < 10 ? '0' + m : m} ${ampm}`;
};

export function clearMap() {
    if (!map) return;
    
    stopAnimation();
    map.remove();
    map = null;
    mapTTL = 0;
    radarTimeSlices = [];
    isPreloaded = false;
    preloadPromise = null;
}

function stopAnimation() {
    if (animationTimer) {
        clearInterval(animationTimer);
        animationTimer = null;
    }
    if (loopTimer) {
        clearTimeout(loopTimer);
        loopTimer = null;
    }
}

async function preloadRadarTiles(product) {
    if (preloadPromise) return preloadPromise;
    
    preloadPromise = (async () => {
        try {
            const res = await fetch(
                `https://api.weather.com/v3/TileServer/series/productSet/PPAcore?apiKey=${config.twcApiKey}`
            );
            
            if (!res.ok) throw new Error('Fetch failed');
            
            const data = await res.json();
            radarTimeSlices = data.seriesInfo.radar.series
                .reverse()
                .slice(0, config.totalFrames);

            const preloadImages = radarTimeSlices.map(timestamp => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = `https://api.weather.com/v3/TileServer/tile/${product}?ts=${timestamp.ts}&xyz={x}:{y}:{z}&apiKey=${config.twcApiKey}`
                        .replace('{x}', '0')
                        .replace('{y}', '0')
                        .replace('{z}', '3');
                });
            });

            await Promise.all(preloadImages);
            isPreloaded = true;
            return radarTimeSlices;
        } catch (error) {
            console.error(log(), "Preload error:", error.message);
            preloadPromise = null;
            throw error;
        }
    })();
    
    return preloadPromise;
}

export async function preloadRadar(lat, lon, product) {
    if (isPreloaded) return;
    
    try {
        await preloadRadarTiles(product);
        console.log(log(), "Radar preloaded successfully");
    } catch (error) {
        console.error(log(), "Preload failed:", error.message);
    }
}

export async function drawMap(lat, lon, product, zoom, htmlID) {
    if (!lat || !lon) {
        console.warn(log(), "Invalid coordinates");
        return;
    }

    const cityLngLat = [lon, lat];

    if (map) {
        if (mapTTL >= config.maxTimeToLive) {
            clearMap();
            return drawMap(lat, lon, product, zoom, htmlID);
        }
        
        map.setCenter(cityLngLat);
        map.setZoom(zoom);
        mapTTL++;
        return fetchAndAnimate();
    }

    map = new mapboxgl.Map({
        container: htmlID,
        style: 'mapbox://styles/peytonwdym/clov0gd3u00mj01pe1wmhb2j5',
        center: cityLngLat,
        accessToken: config.token,
        telemetry: false,
        interactive: false,
        zoom: zoom,
        attributionControl: false,
        preserveDrawingBuffer: false
    });

    map.once('load', () => {
        map.getStyle().layers.forEach(layer => {
            if (layer.type === 'symbol' && layer.layout?.['text-size']) {
                map.setLayoutProperty(layer.id, 'text-size', 40);
            }
        });
        
        try {
            map.setLayoutProperty('road-number-shield-navigation', 'text-size', 18);
        } catch (e) {}
        
        fetchAndAnimate();
    });

    async function fetchAndAnimate() {
        try {
            map.resize();
            stopAnimation();
            currentFrame = 0;
            loopCount = 0;

            if (!isPreloaded) {
                await preloadRadarTiles(product);
            }

            const style = map.getStyle();
            if (style?.layers) {
                style.layers.forEach(layer => {
                    if (layer.id.startsWith('radarlayer_')) {
                        map.removeLayer(layer.id);
                        map.removeSource(layer.id);
                    }
                });
            }

            radarTimeSlices.forEach((timestamp, idx) => {
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
                    layout: { visibility: idx === 0 ? 'visible' : 'none' },
                    paint: { 'raster-fade-duration': 0 }
                });
            });

            await new Promise(resolve => setTimeout(resolve, 500));

            animateRadar();

        } catch (error) {
            console.error(log(), "Radar error:", error.message);
        }
    }

    function animateRadar() {
        if (!radarTimeSlices.length || loopCount >= config.maxLoops) return;

        const timeEl = weatherRadarTimeEl();
        
        animationTimer = setInterval(() => {
            if (currentFrame >= radarTimeSlices.length) {
                clearInterval(animationTimer);
                loopTimer = setTimeout(() => {
                    currentFrame = 0;
                    loopCount++;
                    animateRadar();
                }, config.intervalBetweenLoops);
                return;
            }

            const timestamp = radarTimeSlices[currentFrame];
            
            if (timeEl) {
                timeEl.textContent = formatTime(timestamp.ts);
            }

            radarTimeSlices.forEach((t, idx) => {
                map.setLayoutProperty(
                    `radarlayer_${t.ts}`,
                    "visibility",
                    idx === currentFrame ? "visible" : "none"
                );
            });

            currentFrame++;
        }, config.intervalDelay);
        
        loopCount++;
    }
}