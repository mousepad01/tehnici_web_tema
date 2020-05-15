const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");

const fs = require("fs");

const app = express();

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));

app.get("/", (req, res) =>{

    res.sendFile(__dirname + "/home 2.html");
    console.log("http://localhost:3000 accessed");
});

app.post("/search_history", (req, res) => {     
    
    const loggedList = readJSONfile();

    var newLogInput = {

        id : uuid.v4.apply(),
        logName: req.body.name,
        gender : req.body.gender,
        age : req.body.age,
        height : req.body.height,
        weight : req.body.weight,
        activity_level: req.body.activity_level,
        bmr: req.body.bmr,
        totalKCAL: req.body.totalKCAL
    }

    loggedList.push(newLogInput);

    writeJSONfile(loggedList);

    res.status(200).send(newLogInput);
});

app.delete("/search_history_by_name/:name", (req, res) => {

    let loggedList = readJSONfile();
    let name = req.params.name;
    
    let logFound = false;
  
    for(let i = 0; i < loggedList.length; i++){
        
        if(loggedList[i].logName == name){
            
            logFound = true;
            
            loggedList.splice(i, 1);
            break;
        }
    }

    if(logFound == true){

        writeJSONfile(loggedList);
        res.status(200).send("log deleted from history successfully");
    }
    else{

        res.status(404).send("could not delete log from history; id not found!");
    }
});

app.get("/search_history", (req, res) =>{       

    const loggedList = readJSONfile();

    if(loggedList != undefined){

        res.status(200).send(loggedList);
    }
    else{

        res.status(404).send("History log is empty!");
    }
});

app.get("/search_history_by_id/:id", (req, res) =>{     //available only by manual activation
    
    let id = req.params.id;
    let loggedList = readJSONfile();

    let logFound = false;

    for(let i = 0; i < loggedList.length; i++){

        if(loggedList[i].id == id){

            logFound = true;
            res.status(200).send(loggedList[i]);
            break;
        }
    }

    if(!logFound){

        res.status(404).send("Search history with that id not found!");
    }
});

app.get("/search_history_by_name/:name", (req, res) =>{
    
    let name = req.params.name;
    let loggedList = readJSONfile();

    let logFound = false;

    for(let i = 0; i < loggedList.length; i++){

        if(loggedList[i].logName == name){

            logFound = true;
            res.status(200).send(loggedList[i]);
            break;
        }
    }

    if(!logFound){

        res.status(404).send("Search history with that name not found!");
    }
});

function readJSONfile(){
    
    return JSON.parse(fs.readFileSync("db.json"))["search_history"];
}

function writeJSONfile(to_write){

    fs.writeFileSync(
        "db.json", 
        JSON.stringify({ "search_history" : to_write}, null, 4),
        "utf8",
        err =>{

            if(err){

                console.log(err);
            }
        }
    );
}

app.listen(3000, () =>{

    console.log("Server running at http://localhost:3000");
});


