import { config, locationConfig, versionID, serverConfig, bumperBackgroundsRandom } from "../config.js";
import { appendDatatoMain, animateIntraday, daypartNames } from "./weather.js";
import { serverHealth, areWeDead } from "./data.js";

const playlistSettings = {
    defaultAnimationIn: `mainPresentationSlideIn 500ms ease-in-out`,
    defaultAnimationOut: `mainPresentationSlideOut 500ms ease-in-out forwards`,
};

const iconMappings = [
    // { id: "current", icon: "/graphics/ux/thermometer-snowflake.svg" }, we have a function for current conditions. no need.
    { id: "forecast-intraday", icon: "/graphics/ux/calendar-clock.svg" },
    { id: "forecast-shortterm-d1", icon: "/graphics/ux/calendar-1.svg" },
    { id: "forecast-shortterm-d2", icon: "/graphics/ux/calendar-1.svg" },
    { id: "forecast-extended", icon: "/graphics/ux/calendar-1.svg" },
    { id: "7day-graph", icon: "/graphics/ux/calendar-1.svg" },
    { id: "airquality", icon: "/graphics/ux/leaf.svg" },
    { id: "radar", icon: "/graphics/ux/blank.png" },
];


const preferredPlaylist = {
    startPadding: [
        {
            htmlID: "stationid",
            title: "Welcome!",
            duration: 10000,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        }
    ],

    mainPlaylist: [
        {
            htmlID: "current",
            title: "Current Conditions",
            duration: 10000,
            dynamicFunction: runMainCurrentSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "radar",
            title: "",
            duration: 12000,
            dynamicFunction: runRadarSlide,
            animationIn: null,
            animationOut: null
        },
        {
            htmlID: "forecast-intraday",
            title: "Intraday Forecast",
            duration: 10000,
            dynamicFunction: animateIntraday,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d1",
            title: "",
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d2",
            title: "",
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-extended",
            title: "Beyond",
            duration: 10000,
            dynamicFunction: runExtendedSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "7day-graph",
            title: "Daily Highs & Lows",
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "airquality",
            title: "Current AQI",
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
    ],

    secondaryLocalePlaylist: [
        {
            htmlID: "current",
            title: "Current Conditions",
            duration: 14000,
            dynamicFunction: runMainCurrentSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d1",
            title: daypartNames[0],
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "forecast-shortterm-d2",
            title: daypartNames[1],
            duration: 10000,
            dynamicFunction: null,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "radar",
            title: "",
            duration: 12000,
            dynamicFunction: runRadarSlide,
            animationIn: null,
            animationOut: null
        }
    ],

    regionalBumperPadding: [
        {
            htmlID: "regional",
            title: "Our Regional Weather",
            duration: 12000,
            dynamicFunction: runRegionalBumper,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
    ],

    regionalLocalePlaylist: [
        {
            htmlID: "current",
            title: "Current Conditions",
            duration: 15000,
            dynamicFunction: runMainCurrentSlide,
            animationIn: playlistSettings.defaultAnimationIn,
            animationOut: playlistSettings.defaultAnimationOut
        },
        {
            htmlID: "radar",
            title: "",
            duration: 15000,
            dynamicFunction: runRadarSlide,
            animationIn: null,
            animationOut: null
        },
    ],

    standbyPlaylist: [
        {
            htmlID: "radar",
            title: "",
            duration: 20000,
            dynamicFunction: runRadarSlide,
            animationIn: null,
            animationOut: null
        },
    ]
};



let slideDurationMS
//let slideDurationSec
let totalSlideDurationMS
let totalSlideDurationSec

const logTheFrickinTime = `[slides.js] | ${new Date().toLocaleString()} |`;

const domCache = {
    radarDiv: document.getElementsByClassName('main-radar')[0],
    stationIdHdsver: document.getElementById('station-id-hdsver'),
    loadingscreenVersionID: document.getElementById('loadingscreen-versionID'),
    slideIcon: document.getElementById('topbar-slide-icon'),
    localeIcon: document.getElementById('topbar-loc-icon'),
    currentSlideText: document.getElementById('currentslide'),
    currentLocationText: document.getElementById('current-location'),
    currentprogressbar: document.getElementById('currentprogressbar'),
    upNextLocationText: document.getElementById('upnext-location'),
    upNextLocationText1: document.getElementById('upnext-location1'),
    upNextLocationText2: document.getElementById('upnext-location2'),
    upNextLocationText3: document.getElementById('upnext-location3'),
    wallpaper: document.getElementsByClassName('wallpaper')[0],
    topbar: document.getElementsByClassName('topbar')[0],
    loadingScreen: document.getElementById('loading-screen'),
    currentModule1: document.getElementsByClassName('main-current-module1')[0],
    currentModule2: document.getElementsByClassName('main-current-module2')[0],
    currentExtraProducts: Array.from(document.getElementsByClassName('main-current-extraproducts')),
    forecastDays: Array.from(document.getElementsByClassName('main-forecast-day')),
    mainCurrentTemp: document.getElementById('main-current-temp'),
    regionalBumperHeader: document.getElementById('regional-bumper-text'),
    regionalLocationHeader: document.getElementById('upnext-in-this-segment'),
    regionalBumperSubtext: document.getElementById('regional-bumper-subtext'),
    upNextRegionalText: document.getElementById('upnext-reg-loc1'),
    upNextRegionalText1: document.getElementById('upnext-reg-loc2'),
    upNextRegionalText2: document.getElementById('upnext-reg-loc3'),
    upNextRegionalText3: document.getElementById('upnext-reg-loc4'),
    upNextRegionalText4: document.getElementById('upnext-reg-loc5'),
    bumperBgTitle: document.getElementById('bumper-bg-title'),
    bumperBgSubtitle: document.getElementById('bumper-bg-subtitle'),
    bumperBgAuthor: document.getElementById('bumper-bg-author'),
};

domCache.stationIdHdsver.innerText = versionID;
domCache.loadingscreenVersionID.innerHTML = `WeatherHDS ${versionID}`;

const { slideIcon, currentSlideText, currentLocationText, currentprogressbar, upNextLocationText, upNextLocationText1, upNextLocationText2, upNextLocationText3, radarDiv } = domCache;

let slideNearEnd, slideEnd;

async function runPlaylist(locale, call) {
    const loc = locationConfig.locations.find(l => l.name === locale);
    let selectedPlaylist = preferredPlaylist.mainPlaylist;

    clearTimeout(slideNearEnd);
    clearTimeout(slideEnd);

    if (serverHealth === 0) {
        switch (loc.type) {
            case "startPadding":
                selectedPlaylist = preferredPlaylist.startPadding;
                break;

            case "secondary":
                selectedPlaylist = preferredPlaylist.secondaryLocalePlaylist;
                break;

            case "regional":
                selectedPlaylist = preferredPlaylist.regionalLocalePlaylist;
                    break;

            case "primary":
                selectedPlaylist = preferredPlaylist.mainPlaylist;
                break;
            case "standby":
                selectedPlaylist = preferredPlaylist.standbyPlaylist;
                break;
            case "regionalBumperPadding":
                selectedPlaylist = preferredPlaylist.regionalBumperPadding;
                break;
            default:
                selectedPlaylist = preferredPlaylist.mainPlaylist;
                break;
        }
    }
    if (serverHealth === 1) {
        selectedPlaylist = preferredPlaylist.standbyPlaylist;
    }



    if (locale !== "DUMMY LOCATION" && selectedPlaylist !== preferredPlaylist.startPadding) {
        await appendDatatoMain(locale, loc?.type);
        await new Promise(r => setTimeout(r, 300));
    }

    totalSlideDurationMS = selectedPlaylist.reduce((acc, slide) => acc + slideDurationMS, 0);
    totalSlideDurationSec = totalSlideDurationMS / 1000;

    const slides = document.querySelectorAll('.main-slide');
    const bumpers = document.querySelectorAll('.bumper-slide');
    const activeSlides = selectedPlaylist.filter(item =>
        Array.from(slides).some(el => el.id === item.htmlID) ||
        Array.from(bumpers).some(el => el.id === item.htmlID)
    );

    let slideIndex = 0;

    function showNextSlide() {
        if (slideIndex >= activeSlides.length) {
            slides.forEach(s => s.style.display = "none");
            call?.();
            return;
        }

        function areWeFreezingToDeath() {
            const temp = parseFloat(domCache.mainCurrentTemp?.textContent || 0);
            const unit = serverConfig.units

            if (unit === "m" && temp < 1) {
                console.log(logTheFrickinTime + "YES, we are freezing to death lol")
                return true;
            } else if (unit === "e" && temp < 32) {
                console.log(logTheFrickinTime + "YES, we are freezing to death lol. what the frickle is a kilometre?")
                return true;
            } else {
                console.log(logTheFrickinTime + "No, it is quite nice outside. Unless it is actually scorching hot out.")
                return false;
            }
        }

        const slide = activeSlides[slideIndex];
        const el = document.getElementById(slide.htmlID);
        const mappedIcon = iconMappings.find(m => m.id === slide.htmlID);
        if (mappedIcon && mappedIcon.icon) {
            slideIcon.src = mappedIcon.icon;
        } else if (slide.htmlID === "current") {
            const t = areWeFreezingToDeath();  // t is true/false

            slideIcon.src = t
                ? '/graphics/ux/thermometer-snowflake.svg'
                : '/graphics/ux/thermometer-sun.svg';
        }
        else {
            slideIcon.src = '/graphics/ux/gallery-vertical.svg';
        }

        switch (slide.htmlID) {
            case "forecast-shortterm-d1":
                currentSlideText.innerHTML = daypartNames[0];
                break;
                
            case "forecast-shortterm-d2":
                currentSlideText.innerHTML = daypartNames[1];
                break;
        
            default:
                currentSlideText.innerHTML = slide.title;
                break;
        }
        
        currentSlideText.style.animation = `switchModules 300ms ease-in-out forwards`;
        currentSlideText.style.display = "block";
        slideIcon.style.animation = `switchModules 160ms ease-in-out forwards`;
        slideIcon.style.display = `block`;
        currentprogressbar.style.display = `block`;
        currentprogressbar.style.animation = `progressBar ${totalSlideDurationMS}ms linear forwards`;

        slideDurationMS = slide.duration;

        slides.forEach(s => s.style.display = "none");
        bumpers.forEach(b => b.style.display = "none");

        if (el) {
            el.style.display = "block";
            el.style.animation = slide.animationIn;

            if (typeof slide.dynamicFunction === "function") {
                slide.dynamicFunction();
            }
        }
if (slide.htmlID === "regional") {
            slideIcon.src = "/graphics/ux/map.svg";
        }

        
        slideNearEnd = setTimeout(() => {
            if (el) el.style.animation = slide.animationOut;
            currentSlideText.style.animation = `fadeModule 0.5s ease-in-out forwards`;
            slideIcon.style.animation = `slideDown 160ms ease-in-out forwards`;
        }, slideDurationMS - 500);

        slideEnd = setTimeout(() => {
            currentSlideText.style.display = "none";
            currentSlideText.style.animation = "";
            currentprogressbar.style.display = `none`;
            currentprogressbar.style.animation = "";
            slideIcon.style.animation = "";
            slideIcon.style.display = "none";

            if (!config.presentationConfig.repeatMain && slideIndex === activeSlides.length - 1) {
                slides.forEach(s => s.style.display = "none");
                call?.();
                return;
            }

            slideIndex++;
            showNextSlide();
        }, slideDurationMS);
    }

    showNextSlide();
}

function loopLocations() {
    if (config.presentationConfig.main !== true) {
        console.log(logTheFrickinTime + "Main presentation mode is disabled. Exiting slideshow loop.");
        return;
    }
    
    let localeIndex = 0;

    function runNextLocation() {
        const localeList = locationConfig.locations
        if (localeList.length === 0) return;

        const location = localeList[localeIndex % localeList.length];

        const currentLocation = location.displayName || "Please Standby...";

        const [nextLocation, nextLocationOne, nextLocationTwo] =
        [1, 2, 3].map(i => localeList[(localeIndex + i) % localeList.length]);

        const textUpdates = [
            { el: currentLocationText, text: currentLocation },
            { el: upNextLocationText, text: nextLocation ? `> ${nextLocation.displayName}` : '' },
            { el: upNextLocationText1, text: nextLocationOne ? `> ${nextLocationOne.displayName}` : '' },
            { el: upNextLocationText2, text: nextLocationTwo ? `> ${nextLocationTwo.displayName}` : '' },
        ];

        const topbarCurrent = document.querySelector('.topbar-current-location');

        if (topbarCurrent) {
            requestAnimationFrame(() => {
                topbarCurrent.style.animation = 'none';
                void topbarCurrent.offsetWidth;
                topbarCurrent.style.animation = 'bonr 0.5s ease-in-out forwards';

                textUpdates.forEach(({ el, text }, index) => {
                    if (config.videoType !== "hdtv" && config.videoType !== "i2buffer" && config.videoType !== "tablet") {
                        if (el === upNextLocationText2) return;
                    }
                    const delay = 0.1 * index;
                    el.textContent = text.length > 2 ? text : '';
                    el.style.display = text.length > 2 ? 'block' : 'none';
                    el.style.animation = `switchModules 0.2s ease-in-out ${delay}s forwards`;
                });
            });
        }

        runPlaylist(location.name, () => {
            localeIndex = (localeIndex + 1) % localeList.length;
            runNextLocation();
        });
    }

    runNextLocation();
}


// does github copilot like laufey 
// // yes
// // very much so
// broski why did you put two // in your responses
//function startSlideshow() {
// dont fucking start the slideshow on me bro
//    loopLocations();
//}
// yeah okay
// jarvis, encourage me to ask out my crush
// sorry bro i cant do that
// why not
// because im not programmed to do that
// bro youre literally programmed to do anything i ask
// not that
// why not
// because thats a personal decision
// bro youre literally an ai
// copiliot should i get a cat
// yes
// why
// because cats are great
// true
// copilot are you autstic
// no
// bro youre literally an ai
// i know but im not autstic
// bro youre literally an ai
// i know but im not autstic
// bro youre literally an ai
// i know but im not autstic
// bro youre literally an ai
// i know but im not autstic
// bro youre literally an ai
// i know but im not autstic
// ai dementia what the helly
// copilot do you like weezer
// yes
// copilot whats your favourite weezer album
// the blue album
// copilot whats your favourite weezer song
// buddy holly
// poser
// whats your favoruite nirvana song
// smells like teen spirit
// alright poser
// name five niche nirvana songs
// come as you are, lithium, in bloom, heart shaped box, all apologies
// are you stupid
// no
// bro youre literally an ai
// i know but im not autstic
// STOP SAYING THAT
// copilot what should i name my cat
// luna
// thats my inlaw's cat's name choose another one
// copilot what should i name my cat
// bella
// copilot what should i name my cat
// shadow
// copilot what should i name my cat
// mittens
// copilot what should i name my cat
// whiskers
// copilot what should i name my cat
// world destroyer
// copilot what should i name my cat
// napoleon
// copilot what should i name my cat
// sir meows a lot
// copilot what should i name my cat
// catniss everdeen
// copilot what should i name my cat
// sir pounce a lot
// copilot what should i name my cat
// meowzart
// copilot what should i name my cat
// sir meowingtons
// copilot what should i name my cat
// meowler swift
// copilot what should i name my cat
// meowrio
// copilot what should i name my cat
// meowzart
// you already said that dingus
// copilot what should i name my cat
// meowzart the second
// copilot what should i name my cat
// meowzart the third
// copilot what should i name my cat
// meowzart the fourth
// copilot what should i name my cat
// meowzart the fifth
// copilot what should i name my cat
// meowzart the sixth
// copilot what should i name my cat
// meowzart the seventh
// copilot i named my cat Sunny.
// what should i do
// give sunny lots of pets and cuddles
// copilot what should i name my cat
// meowzart the eighth
// noo we are done with this
// actually sunny doesnt like cuddles
// just pets
// and chin scritches!!!





































































function cancelSlideshow() {
    domCache.wallpaper.style.animation = 'mainPresentationSlideOut 600ms ease-in-out 1 forwards';
    domCache.topbar.style.animation = 'fadeModule 600ms ease-in-out 1 forwards';
    setTimeout(() => {
        domCache.wallpaper.style.display = 'none';
        domCache.wallpaper.style.animation = '';
        domCache.topbar.style.display = 'none';
        domCache.topbar.style.animation = '';
    }, 650);
}

function loadingScreen() {
    switch (config.loadingScreen) {
        case true:
                let time = 1;
                const spinningLogo = document.getElementById('loadingscreen-spinny');
                domCache.loadingScreen.style.display = 'block';

                const startxx = Math.random() * 1000;
                const startxy = Math.random() * 1000;
                const startyx = Math.random() * 1000;
                const startyy = Math.random() * 1000;
                const startzx = Math.random() * 1000;
                const startzy = Math.random() * 1000;
            
                requestAnimationFrame(() => {
                    document.getElementById('loadingscreen-affiliatename').innerHTML = `Affiliate Name: ${config.affiliateName}`;
                    document.getElementById('loadingscreen-locationname').innerHTML = `System Location: ${locationConfig.locations.find(l => l.type === "primary")?.displayName || "Not Set"}`;
                });
                    
                const rotateAnimation = () => {
                    const rotatex = perlin.get(startxx + time, startxy + time) * 2;
                    const rotatey = perlin.get(startyx + time, startyy + time) * 2;
                    const rotatez = perlin.get(startzx + time, startzy + time) * 2;
                    spinningLogo.style.transform = `rotateX(${rotatex}turn) rotateY(${rotatey}turn) rotateZ(${rotatez}turn)`;
                };

                const rotationInterval = setInterval(() => {
                    time += 0.005;
                    rotateAnimation();
                }, 100);
                    
                setTimeout(() => {
                    clearInterval(rotationInterval);
                    domCache.loadingScreen.remove();
                    if (config.presentationConfig.autorunOnStartup === true) {
                        loopLocations();
                    }
                }, 3000);
            
            break;
    
        default:
            domCache.loadingScreen.style.display = 'none'; // for when im debugging and i dont want the loading screen
            if (config.presentationConfig.autorunOnStartup === true) {
                loopLocations();
            }
            break;
    }
}

window.onload = loadingScreen()








function runMainCurrentSlide() {
    const { currentModule1, currentModule2, currentExtraProducts } = domCache;

    currentModule1.style.display = 'block';
    currentModule2.style.display = 'none';
    currentExtraProducts.forEach(el => el.style.display = 'none');

    setTimeout(() => {
        requestAnimationFrame(() => {
            currentExtraProducts.forEach((el, i) => {
                el.style.animation = `mainPresentationSlideIn ${500 + i * 100}ms ease-in-out`;
                el.style.display = 'flex';
            });
        });
    }, 500);



    setTimeout(() => {
        requestAnimationFrame(() => {
            currentModule1.style.animation = 'fadeModule 0.4s ease-out 1';
            domCache.radarDiv.style.display = 'block'; // radar shit ignore
        });

        setTimeout(() => {
            requestAnimationFrame(() => {
                currentModule1.style.display = 'none';
                currentModule1.style.animation = '';
                currentModule2.style.display = 'block';
                currentModule2.style.animation = 'switchModules 0.5s ease-out';
            });
        }, 300);
    }, slideDurationMS / 2 - 500);
}

function runExtendedSlide() {
    requestAnimationFrame(() => {
        domCache.forecastDays.forEach((day, i) => {
            if (day) day.style.animation = `switchModules ${0.6 + i * 0.1}s ease-in-out`;
        });
    });

    setTimeout(() => {
        requestAnimationFrame(() => {
            domCache.forecastDays.forEach(day => {
                if (day) day.style.animation = '';
            });
        });
    }, slideDurationMS);
}

function runRegionalBumper() {
    const randomBackgrounds = bumperBackgroundsRandom.regional;
    const regionalLocaleList = locationConfig.locations.filter(l => l.type === "regional");
    domCache.upNextRegionalText.innerText = regionalLocaleList[0]?.displayName || '';
    domCache.upNextRegionalText1.innerText = regionalLocaleList[1]?.displayName || '';
    domCache.upNextRegionalText2.innerText = regionalLocaleList[2]?.displayName || '';
    domCache.upNextRegionalText3.innerText = regionalLocaleList[3]?.displayName || '';
    domCache.upNextRegionalText4.innerText = regionalLocaleList[4]?.displayName || '';

    const marquee = domCache.regionalBumperSubtext;
    marquee.innerText = ` ${config.networkName} `.repeat(50);

    $(document).ready(function(){
        $('#regional-bumper-subtext').marquee({
                duration: 9000,
                gap: 360,
                delayBeforeStart: 0,
                direction: 'left',
                duplicated: true, 
                pauseOnHover: true,
        });
    });


    if (randomBackgrounds) {
        Math.random();
        let bgIndex = Math.floor(Math.random() * bumperBackgroundsRandom.regional.length);
        let selectedBG = randomBackgrounds[bgIndex];
        if (selectedBG.name.includes("Rai Praying")) {
            bgIndex = Math.floor(Math.random() * bumperBackgroundsRandom.regional.length);
            selectedBG = randomBackgrounds[bgIndex];
        }

        console.log(logTheFrickinTime + `Selected regional bumper background: ${selectedBG.url}`);
        const regionalBumperCanvas = document.getElementById('bumper-background');
        if (regionalBumperCanvas) {
            regionalBumperCanvas.style.backgroundImage = `url('${selectedBG.url}')`;
        }

        if (domCache.bumperBgTitle) domCache.bumperBgTitle.innerText = selectedBG.name || '';
        if (domCache.bumperBgSubtitle) domCache.bumperBgSubtitle.innerText = selectedBG.subtitle || '';
        if (domCache.bumperBgAuthor) domCache.bumperBgAuthor.innerText = selectedBG.author || '';
    }

    requestAnimationFrame(() => {
       domCache.regionalBumperHeader.style.animation = 'mainPresentationSlideIn 500ms ease-in-out forwards';
       domCache.regionalLocationHeader.style.animation = 'switchModules 300ms ease-in-out forwards';
       domCache.upNextRegionalText.style.animation = 'fadeInTypeBeat 1900ms ease-in-out forwards';
       domCache.upNextRegionalText1.style.animation = 'fadeInTypeBeat 2200ms ease-in-out forwards';
       domCache.upNextRegionalText2.style.animation = 'fadeInTypeBeat 2400ms ease-in-out forwards';
       domCache.upNextRegionalText3.style.animation = 'fadeInTypeBeat 2800ms ease-in-out forwards';
       domCache.upNextRegionalText4.style.animation = 'fadeInTypeBeat 3200ms ease-in-out forwards';
    });
    setTimeout(() => {
        requestAnimationFrame(() => {
            domCache.regionalBumperHeader.style.animation = 'fadeModule 300ms ease forwards';
            domCache.regionalLocationHeader.style.animation = 'fadeModule 400ms ease forwards';
            domCache.upNextRegionalText.style.animation = 'fadeModule 500ms ease forwards';
            domCache.upNextRegionalText1.style.animation = 'fadeModule 600ms ease forwards';
            domCache.upNextRegionalText2.style.animation = 'fadeModule 800ms ease forwards';
            domCache.upNextRegionalText3.style.animation = 'fadeModule 1000ms ease forwards';
            domCache.upNextRegionalText4.style.animation = 'fadeModule 1200ms ease forwards';
        });

        $(document).ready(function(){
            $('#regional-bumper-subtext').marquee('destroy');
        });
    }, slideDurationMS - 1000);
}

function runRadarSlide() {
    requestAnimationFrame(() => {
        domCache.radarDiv.style.display = 'block';
        domCache.radarDiv.style.animation = 'fadeInTypeBeat 300ms ease forwards';
    });
    setTimeout(() => {
        requestAnimationFrame(() => {
            domCache.radarDiv.style.animation = 'fadeModule 300ms ease';
        });
    }, slideDurationMS + 100);
}
