import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';

// ensure environment vars
import dotenv from 'dotenv';
dotenv.config();

import about from './routes/about';
import home from './routes/home';
import ipfs from './routes/ifps';
import error from './routes/error';

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// register views
app.use('/', home);
app.use('/about', about);
app.use('/ipfs/*', ipfs);
app.use(error);

export default app;
