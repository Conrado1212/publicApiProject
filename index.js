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

const upload = multer({storage})

const data = {
  logo: "PlayFinder",
  title: ['New and trending','Reviews','Last 30 days','Best of the year','Popular in 2025','All time top 250','All Games'],
  sidebar:['Home','Reviews','New Releases'],
  subtitle:['Based on player counts and release date']
}
app.get('/', async(req,res)=>{
  try {
    const result = await axios.get(API_URL + "games?key=" + API_KEY);
    console.log(result.data.count);
    console.log("DATA:", data);
    res.render("index.ejs",{ data: data, games: result.data.count});
    }catch(error){
        res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }

    // res.render("index.ejs",{
    //   data: data
    // });
});



app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})

