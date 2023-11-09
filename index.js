import express  from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.open-meteo.com/v1/forecast";
const joke_URL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=religious,racist";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true} ));

app.get("/", (req, res) => {
    res.render("index.ejs", { 
        data: "WEATHER",
        joke: "JOKE",
    });
});

app.post("/data", async (req, res) => {
    const d = new Date();
    let hour = d.getHours();
    
    const today = new Date();
    const options = {
        weekday: "long",
        day:"numeric",
        month: "long",
    }; 
    const day = today.toLocaleDateString("en-US", options);
    
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    console.log(hour);
    try{
    const result = await axios.get(API_URL + "?timezone=America%2FNew_York", {
        params: {
            latitude: latitude,
            longitude: longitude,
            hourly: "temperature_2m,weather_code",
            forecast_days: 1,
            temperature_unit: "fahrenheit",
        }
    });
   
    const wheather_code = JSON.stringify(result.data.hourly.weather_code[hour]);
    
   if ( wheather_code === "0" ) {
        var weather = "Clear sky";
    } if (wheather_code === "1" || wheather_code === "2" || wheather_code === "3") {
        weather = "Mainly clear, partly cloudy, and overcast";
    } if (wheather_code === "45" || wheather_code === "48" ) {
        weather = "Fog and depositing rime fog";
    } if (wheather_code === "51" || wheather_code === "53" || wheather_code === "55") {
        weather = "Drizzle: Light, moderate, and dense intensity";
    } if (wheather_code === "56" || wheather_code === "57") {
        weather = "Freezing Drizzle: Light and dense intensity";
    } if (wheather_code === "61" || wheather_code === "63" || wheather_code === "65") {
        weather = "Rain: Slight, moderate and heavy intensity";
    } if (wheather_code === "66" || wheather_code === "67") {
        weather = "Freezing Rain: Light and heavy intensity";
    } if (wheather_code === "71" || wheather_code === "73" || wheather_code === "75") {
        weather = "Snow fall: Slight, moderate, and heavy intensity";
    } if (wheather_code === "75") {
        weather = "Snow grains";
    } if (wheather_code === "80" || wheather_code === "81" || wheather_code === "82") {
        weather = "Rain showers: Slight, moderate, and violent";
    } if (wheather_code === "85" || wheather_code === "86") {
        weather = "Snow showers slight and heavy";
    } if (wheather_code === "95") {
        weather = "Thunderstorm: Slight or moderate";
    } if (wheather_code === "96" || wheather_code === "99") {
        weather = "Thunderstorm with slight and heavy hail";
    } 

    const respond = {
       temperature: JSON.stringify(result.data.hourly.temperature_2m[hour] ),
       latitude: JSON.stringify(result.data.latitude),
       longitude: JSON.stringify(result.data.longitude),
       weather: weather,
       day: day,
    }

    res.render("index.ejs", { 
        joke: "JOKE",
        data: respond,
    } );    
    } catch (error) {
        res.render("index.ejs", { error: error.reason});
    }
});


app.post("/joke", async (req, res) => {

    try {
        const result = await axios.get(joke_URL);
        const respond = {
           setup: JSON.stringify(result.data.setup),
           delivery: JSON.stringify(result.data.delivery),
        } 
        res.render("index.ejs", {
            data: "WEATHER",
            joke: respond
        });
    } catch (error) {
        res.render("index.ejs", { error: error.reason});
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});