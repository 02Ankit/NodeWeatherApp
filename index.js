const http = require("http")
const fs = require("fs")
const requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal)=>{
   

    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp );
    temperature = temperature.replace("{%humidity%}", orgVal.main.humidity);
    temperature = temperature.replace("{%windSpeed%}", orgVal.wind.speed );
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;

}
const server = http.createServer((req, res)=>{
  
    //create routing
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?lat=21.2514&lon=81.6296&appid=b35df5536c188dba6a9d9a6111a338d0&units=metric")
        .on("data", (chunk)=>{
            const objData = JSON.parse(chunk)

            const arrayData = [objData];
            const realTimeData = arrayData
            .map((val) => {
                return replaceVal(homeFile, val)
            }).join("")
            
          res.write(realTimeData);
          // console.log(realTimeData);
        })
        .on("end", (err) => {
          if (err){ return console.log("connection closed due to errors", err);}
          res.end();
        });
    } else {
      res.end("File not found");
    }
});

//listen to server 
server.listen(8000, "127.0.0.1", () =>{
    console.log("Start Web Server Localhost:8000")
})