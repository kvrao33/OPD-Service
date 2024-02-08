console.log("Project ID : "+process.env.GOOGLE_CLOUD_PROJECT_ID);
import 'dotenv/config';
import * as config from './config.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router/index.js'


const app = express();

app.use(cors());

// Increase the limit to handle larger payloads
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


// simple route
app.get("/",async (req, res) => { 
  res.json({message:" OPD Server is running"});
});

app.use(router);

// set port, listen for requests
const PORT = config.PORT;
console.log(process.env.PORT);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});