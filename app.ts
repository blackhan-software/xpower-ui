import cookieParser from 'cookie-parser';
import createError from 'http-errors'
import express from 'express';
import logger from 'morgan';
import path from 'path';

// ensure environment vars
import dotenv from 'dotenv';
dotenv.config();

import about from './routes/about';
import home from './routes/home';
import ipfs from './routes/ifps';
export const app = express();

// view engine setup
app.set('views', [
  path.join(__dirname, 'public', 'views'),
  path.join(__dirname, 'views'),
]);
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// register views
app.use('/', home);
app.use('/about', about);
app.use('/ipfs/*', ipfs);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  onError(createError(404), req, res, next);
});

// error handler
import type { ErrorRequestHandler } from "express";
const onError: ErrorRequestHandler = (e, req, res) => {
  // set locals, only providing error in development
  res.locals.status = e.status;
  res.locals.message = e.message;
  res.locals.error = req.app.get('env') === 'development' ? e : null;
  // render the error page
  res.status(e.status || 500);
  res.render('error/error.pug');
};

app.use(onError);
export default app;
