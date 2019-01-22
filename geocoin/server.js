import config from './config';
import apiRouter from './api';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import https from 'https';
import fs from 'fs';

const app = express();

const options = {
  key: fs.readFileSync('./geocoin_site.key'),
  cert: fs.readFileSync('./geocoin_site.crt')
};

const server = https.createServer(options, app);

// const server = express();

app.use(bodyParser.json());

app.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public')
}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {content: '...'});
});

app.get('/admin', (req, res) => {
  res.render('admin', {page: 'admin', content: '...'});
});

app.use('/api', apiRouter).use(express.static('public'));

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});
