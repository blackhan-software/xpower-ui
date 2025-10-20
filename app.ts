import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import path from 'path';

// ensure environment vars
import dotenv from 'dotenv';
dotenv.config();

// import routes
import error from './routes/error';
import home from './routes/home';
import ipfs from './routes/ipfs';
import migrate from './routes/migrate';
import nfts from './routes/nfts';
import ppts from './routes/ppts';
import robots from './routes/robots';
import spa from './routes/spa';

// register view engine for pigs
import { Pig } from './source/engines';
export const app = express();
Pig.register(app);

// setup view engine(s)
app.set('views', [
  path.join(__dirname, 'public', 'views'),
  path.join(__dirname, 'views'),
]);

app.set('view engine', 'pug');
app.set('view engine', 'pig');

// register middleware
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// register views
app.use('/migrate', migrate);
app.use('/', home);
app.use('/', spa);
app.use('/nfts', nfts);
app.use('/ppts', ppts);
app.use('/robots.txt', robots);
app.use('/ipfs/*path', ipfs);
app.use(error);

export default app;
