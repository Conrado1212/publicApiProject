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


// app.use((req,res, next)=>{
//   console.log('Request Headers:', req.headers);
//   const resSend = res.send;
//   res.send = function(body){
//       console.log('Res Body:', body);
//       resSend.call(this, body);
//   }
//   next();
// });

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
  title: ['New and trending','Games like','Last 30 days','Best of the year','All time top 250','All Games'],
  sidebar:['Home','Reviews',],
  order:['Relevance','Date added','Name','Release date','Popularity','Average rating'],
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
 // platforms: ['PC', 'PlayStation', 'Xbox', 'iOS', 'Android', 'Apple Macintosh', 'Linux', 'Nintendo']
  platforms: {},
  allGames: [],
  gamesCount:0
}
//"Name":['PC', 'PlayStation', 'Xbox', 'iOS', 'Android', 'Apple Macintosh', 'Linux', 'Nintendo'],
app.get('/', async(req,res)=>{
  try {
    const result = await axios.get(API_URL + "games?key=" + API_KEY);
  const gamesData = await main(1,20,"-relevance");
   // console.log(result.data.count);  
  
    data.gamesCount = result.data.count

    data.allGames = gamesData.results

   
  // console.log("DATA:", data.allGames.length());
    res.render("index.ejs",{ data: data, games: result.data.count});
    }catch(error){
        res.render("index.ejs", { content: JSON.stringify(error.response?.data || error) });
    }
});

async function getPlatforms(){
  try{
    const result = await axios.get(API_URL + "platforms/lists/parents?key=" + API_KEY);

    if (result.status !== 200) {
      throw new Error(`HTTP error: ${result.status}`);
    }   
    const excluded = [
      'Atari',
      'Commodore / Amiga',
      'SEGA',
      '3DO',
      'Neo Geo',
      'Web'
    ];

    const parents  = result.data.results.
   map(p=>p.name).
   filter(name =>!excluded.includes(name));

    const all = await axios.get(API_URL + "platforms?key=" + API_KEY);

    const playstation = all.data.results.filter(p =>p.name.includes("PlayStation") && p.name !="PlayStation")
    .map(p=>p.name);
   const xbox = all.data.results.filter(p =>p.name.includes("Xbox")  && p.name !="Xbox")
   .map(p=>p.name);

 // platforms = [...platforms, ...playstation, ...xbox]

  //data.platforms = [...new Set(platforms)];

  data.platforms ={
    parents,
    playstation,
    xbox
  }
   return data.platforms;
  }catch(e){
    console.error(`Invalid data ${e}`);
    return null;
  }
}
getPlatforms().then(data => {
  (data?.parents || []).forEach(p => {
   const key = p.toLowerCase();
  // console.log('key',key);
 //  console.log("Parent", p);

   if(Array.isArray(data[key])){
    // console.log("Dzieci", data[key]);
   }
  });
});
// getPlatforms().then(data => {
//   if(Array.isArray(data['playstation'])){
//     console.log("Dzieci", data['playstation']);  
//   }
// });
//console.log('parents',data.platforms.parents);

app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})

async function gameSearch(search){
  try{
    const result = await axios.get(API_URL + `games?search=${search}&key=` + API_KEY);
    if (result.status !== 200) {
      throw new Error(`HTTP error: ${result.status}`);
    } 
    return result.data;
  }catch(e){
    console.error(`Invalid data ${e}`);
    return null;
  }
}

//gameSearch("GTA").then(data => {
 // console.log('search ',data.results);
//});
//search game https://api.rawg.io/api/games?search=GTA&key=API_KEY
//search game https://api.rawg.io/api/platforms&key=API_KEY

//popul;ar games https://api.rawg.io/api/games?ordering=-rating&key=API_KEY     Revelance Date Added Name Release date Popularity Average rating


//Nowe wydania https://api.rawg.io/api/games?dates=2025-01-01,2025-12-31&ordering=-added&key=API_KEY



//GET  main page -> 

async function main(page = 1,pageSize = 20 ,ordering){
 
  let date = new Date();
const daTeNow = date.toISOString().split("T")[0];
const startOfYear = `${date.getFullYear()}-01-01`
try{
const result  = await axios.get(API_URL + `games?ordering=${ordering}&dates=${startOfYear},${daTeNow}&page_size=${pageSize}&page=${page}&key=` + API_KEY);

if (result.status !== 200) {
  throw new Error(`HTTP error: ${result.status}`);
} 
 
//data.allGames = result.data.results;

return {
 results: result.data.results, 
 fetched: result.data.results.length,
 count: result.data.count,
 next: result.data.next
};

}catch(e){
console.error(`Invalid data ${e}`);
return null;
}
}
main(1,20).then(console.log)

 //setTimeout(() => {
  // console.log('adadad');
 //  for (let i = 0; i < data.allGames.length; i++) {

    //console.log(`game${i}`, data.allGames[i].background_image);

  //   const platforms = data.allGames[i].platforms;
  //   const genres = data.allGames[i].genres;
  //   const screens = data.allGames[i].short_screenshots;
    // if (Array.isArray(platforms)) {
    //    console.log(`platforms${i}:`);
    //    platforms.forEach(plat => console.log('testkk', plat.platform.name));
    //  } else {
    //    console.warn(`platforms${i} is undefined or not an array`);
    //  }
    //  if (Array.isArray(genres)) {
    //    console.log(`gen${i}:`);
    //    genres.forEach(gen => console.log('gen: ', gen.name));
    //  } else {
    //   console.warn(`gen${i} is undefined or not an array`);
    //  }
   //  if (Array.isArray(screens)) {
  //    console.log(`screens${i}:`);
 //     screens.forEach(screen => console.log('testkk', screen));
  //  } else {
 //     console.warn(`screen${i} is undefined or not an array`);
 //   }
 // }
 //}, 3100);



app.get("/api/games", async (req, res) => {
  const {page, ordering} = req.query;
  console.log("page", page);
  console.log("ordering", ordering);
 // console.log('req.query ',req.query);
  const result = await main(Number(page),ordering);
  res.json(result);
});



//https://api.rawg.io/api/games?ordering=-relevance&dates=2024-01-01,2025-12-31&page_size=20


//https://api.rawg.io/api/games?key=API_KEY&dates=YYYY-MM-DD,YYYY-MM-DD&ordering=-added






app.get("/games-like-:slug", async (req, res) => {
  const slug = encodeURIComponent(req.params.slug);
console.log('slug', slug);
let game;
 try{
    game = await axios.get(`${API_URL}games/${slug}?key=${API_KEY}`);
  console.log('game Name ', game.data.name);
 }catch(e){
  if (e.response && e.response.status === 404) {
    return res.status(404).send("Game not found");
  }
  console.error(e);
  return res.status(500).send("Error fetching data")
 }
  
 const similar = await suggested(game.data.id);


  console.log(similar);
  res.render("gamesLike.ejs", {
    name: game.data.name,
    data: data,
     game: game.data,
     similar
    });
});

async function suggested(id) {
  try {
   
    const game = await axios.get(`${API_URL}games/${id}?key=${API_KEY}`);
    //console.log('game', game);
    const tags = game.data.tags.map(t => t.slug).slice(0, 3); 
    //console.log('tags: ',tags);
    
    const result = await axios.get(`${API_URL}games?key=${API_KEY}&tags=${tags.join(",")}&ordering=-rating&page_size=20`);

    const filtered = result.data.results.filter(g => g.id !== id);

    return filtered;
  } catch (e) {
    console.error("Error:", e.message);
    return null;
  }
}

//suggested(1).then(console.log);





