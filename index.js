import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import multer from "multer";
import dotenv from 'dotenv'

dotenv.config()
const app = express();
const port  = 3000;
const data = {
  logo: "PlayFinder"
}
const API_URL ='https://api.rawg.io/api/';

const API_KEY = process.env.API_KEY
console.log(API_KEY);

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

app.get('/', (req,res)=>{
    res.render("index.ejs",{
      data: data
    });
});


app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})

