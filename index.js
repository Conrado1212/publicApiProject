import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import multer from "multer";

const app = express();
const port  = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());


app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})