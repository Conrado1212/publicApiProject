import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import multer from "multer";
import dotenv from 'dotenv'

dotenv.config()
const app = express();
const port  = 3000;

const API_URL ='https://api.rawg.io/api/';





const API_KEY = process.env.API_KEY
//console.log(API_KEY);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use( express.static("style"));

const storage = multer.diskStorage({
    destination :(req, file, cb)=>{
      cb(null, "style/images");
    },
    filename: (req, file, cb)=>{
      cb(null, file.originalname);
    }
  });
//<%= data.sidebarMenu[i].Name[j].replace("YEAR", new Date().getFullYear()) %>


const data = {
  logo: "PlayFinder",
  title: ['New and trending','Reviews','Last 30 days','Best of the year','Popular in 2025','All time top 250','All Games'],
  sidebar:['Home','Reviews',],
  sidebarMenu: [  {
    "title": "New Releases",
    "Name":['Last 30 days','This week','Next week','Release calendar'],
    "Icon":['fa-star','fa-fire','fa-forward-fast','_31']
  },
  {
    "title": "Top",
    "Name":['Best of the year', 'Popular in YEAR', 'All time top 250'],
    "Icon":['fa-trophy','fa-chart-simple','fa-crown']
  },
  {
    "mainTitle":"All Games",
    "title": "Browse",
    "Name":['Platforms', 'Stores', 'Collections','Reviews','Genres','Creators','Tags','Developers','Publishers'],
    "Icon":['fa-brands fa-unity','fa-download','fa-folder-open','fa-comment','fa-ghost','fa-user','fa-hashtag','fa-code','fa-newspaper'],
    showAll: true
  }, 
  {
    "title": "Platforms",
    "Name":['PC', 'PlayStation', 'Xbox','Nintendo switch','iOS','Android'],
    "Icon":['fa-brands fa-microsoft','fa-brands fa-playstation','fa-brands fa-xbox','fa-hat-wizard','fa-brands fa-apple','fa-brands fa-android'],
    showAll: true
  },
  {
    "title": "Genres",
    "Name":['Free', 'Action', 'Strategy','RPG','Shooter','Adventure','Puzzle','Racing','Sports'],
    "Img":['./images/free.png','./images/action.png','./images/strategy.png','./images/rpg.png','./images/shooter.png','./images/adventure.png','./images/puzzle.png','./images/racing.png','./images/sport.png'],
    showAll: true
  }
  ],
  subtitle:['Based on player counts and release date'],
  filter:['Revelance', 'Date Added', 'Name', 'Release date', 'Popularity', 'Average rating'],
  platforms: ['PC', 'PlayStation', 'Xbox', 'iOS', 'Android', 'Apple Macintosh', 'Linux', 'Nintendo']
}
//"Name":['PC', 'PlayStation', 'Xbox', 'iOS', 'Android', 'Apple Macintosh', 'Linux', 'Nintendo'],
app.get('/', async(req,res)=>{
  try {
    const result = await axios.get(API_URL + "games?key=" + API_KEY);
   // console.log(result.data.count);  
  //  console.log("DATA:", data);
    res.render("index.ejs",{ data: data, games: result.data.count});
    }catch(error){
        res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }

    // res.render("index.ejs",{
    //   data: data
    // });
});

async function getPlatforms(){
  try{
    const result = await axios.get(API_URL + "platforms?key=" + API_KEY);

    if (result.status !== 200) {
      throw new Error(`HTTP error: ${result.status}`);
    }   
    const names = result.data.results.map(p=>p.name)
    return names;
  }catch(e){
    console.error(`Invalid data ${e}`);
    return null;
  }
}
getPlatforms().then(console.log);
app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})



//search game https://api.rawg.io/api/games?search=GTA&key=API_KEY
//search game https://api.rawg.io/api/platforms&key=API_KEY

//popul;ar games https://api.rawg.io/api/games?ordering=-rating&key=API_KEY     Revelance Date Added Name Release date Popularity Average rating


//Nowe wydania https://api.rawg.io/api/games?dates=2025-01-01,2025-12-31&ordering=-added&key=API_KEY



