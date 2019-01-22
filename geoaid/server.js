// load enviroment variables
require('dotenv').config();

//depend ======================
const fs = require('fs'),
      https = require('https'),
      express = require('express'),
      app = express(),
      port = process.env.PORT || 8335,
      expressLayouts = require('express-ejs-layouts'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      cookieParser = require('cookie-parser'),
      flash = require('connect-flash'),
      expressValidator = require('express-validator');
      // Web3 = require('web3'),
      // rpc = require('json-rpc2');

var options = {
  key: fs.readFileSync('./geocoin_site.key'),
  cert: fs.readFileSync('./geocoin_site.crt')
};

var server = https.createServer(options, app);
var io = require('./app/sockets').listen(server, app);

// client = rpc.Client.$create(8545, "localhost");
// var accountAddress;

// web3 setup
// if (typeof web3 !== 'undefined') {
//   web3 = new Web3(web3.currentProvider);
// } else {
//   web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
// }

// print details & main account balance
// console.log("-----------------------------------------------------------------------");
// console.log("Eth Node Version: ", web3.version.node);
// console.log("Connected: ", web3.isConnected(), web3.currentProvider);
// console.log("syncing: ", web3.eth.syncing, ", Latest Block: ",web3.eth.blockNumber);
// // console.log("List all accounts", web3.eth.accounts);
// console.log("Total of "+ web3.eth.accounts.length+" accounts");
// console.log("-----------------------------------------------------------------------");

// for (var item in web3.eth.accounts) {
//   // console.log("accounts["+item+"]: " , web3.eth.accounts[item], ":",web3.eth.getBalance(web3.eth.accounts[item]).toNumber());
//   client.call('personal_unlockAccount', [web3.eth.accounts[item], 'jsdhjd1222ewd', 0], function(err,result){
//     console.log("is "+web3.eth.accounts[item]+" account unlocked "+result);
//   });
// }

//config application ======================

// set session and cookie parser
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET,
  cookie: {maxAge:60000},
  resave: false, //forces the session to be saved back to the store
  saveUninitialized: false //dont save unmodified
}));
app.use(flash());

//where to look for static assests
app.use(express.static(__dirname + '/public'));

//set tempelating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// connect to our db
mongoose.connect(process.env.DB_URI);

// use body parser to grab info from a from
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

// set the routes ======================
app.use(require('./app/routes'));

//start our server ======================
server.listen(port, () => { console.log(`App listening on https://localhost:${port}`); });
