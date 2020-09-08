import "babel-polyfill";
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes  from './routes';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();


const app = express();
app.use(cors());

app.use(logger('dev')); // log requests to the console
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the networth API route',
}));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});