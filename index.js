var express = require('express');
//const bodyParser = require('body-parser');
const accountSid = 'AC60e14428b5aadcb553c05f4fc6fa442e'; 
const authToken = '6a966ec15cc6110d0912e5c48aebd988'; 
const client = require('twilio')(accountSid, authToken); 
 

const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
//app.use(bodyParser.raw());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var mapNews = {};

var latestNews = {
  '1': "*News*: Covid-19: India's total tally crosses 1.56 crore cases, more than 2,000 deaths in 24 hours",
  '2': "*News*: People are crying for medicines, oxygen but they are laughing during rallies, says Priyanka Gandhi Vadra",
  '3': "*News*: Covid-19: Save the country from lockdown, use as last resort, PM Narendra Modi tells states"
}

var mapTips = {};
var healthTips = {
  '1': "*Tip*: Eat a healthy diet.",
  '2': "*Tip*: Consume less salt and sugar.",
  '3': "*Tip*: Limit Unhealthy Foods and Eat Healthy Meals."
}
var mapMedia = {};
var mediaUrl = {
  '1': 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
  '1Msg' : 'Hope you like Boat',
  '2': 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
  '2Msg' : 'Cat',
  '3': 'https://homepages.cae.wisc.edu/~ece533/images/fruits.png',
  '3Msg' : 'Fruits',
  '4': 'https://images.unsplash.com/photo-1545093149-618ce3bcf49d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80'
};


app.post('/wa', function (req, res) {
    console.log('Got body:', req.body);
    var inputMsg = req.body.Body;
    var mediaUrlMsg = [];
    var pName = req.body.ProfileName || 'Customer';
    var outputMsg = 'Dear *' + pName + '* We are happy to help. You can choose from below options. \n Type *1* to know *Latest News* \n Type *2* to know *Health Tips* \n Type *3* to get *Picture*';
    if(inputMsg.trim() == '1') {

      if(!mapNews[req.body.From]) {
        mapNews[req.body.From] = '1';
      } else {
        if(mapNews[req.body.From] == '3') {
          mapNews[req.body.From] = '1';
        } else {
          if(mapNews[req.body.From] == '2'){
            mapNews[req.body.From] = '3';
          } else {
            mapNews[req.body.From] = '2';
          }
        }
      }

      outputMsg = latestNews[mapNews[req.body.From]];
    } else if(inputMsg.trim() == '2') {

      if(!mapTips[req.body.From]) {
        mapTips[req.body.From] = '1';
      } else {
        if(mapTips[req.body.From] == '3') {
          mapTips[req.body.From] = '1';
        } else {
          if(mapTips[req.body.From] == '2'){
            mapTips[req.body.From] = '3';
          } else {
            mapTips[req.body.From] = '2';
          }
        }
      }

      outputMsg = healthTips[mapTips[req.body.From]];;
    }else if(inputMsg.trim() == '3') {

      if(!mapMedia[req.body.From]) {
        mapMedia[req.body.From] = '1';
      } else {
        if(mapMedia[req.body.From] == '3') {
          mapMedia[req.body.From] = '1';
        } else {
          if(mapMedia[req.body.From] == '2'){
            mapMedia[req.body.From] = '3';
          } else {
            mapMedia[req.body.From] = '2';
          }
        }
      }

      mediaUrlMsg = [mediaUrl[mapMedia[req.body.From]]];
      outputMsg = mediaUrl[mapMedia[req.body.From] + 'Msg'];
    }

    
    client.messages 
      .create({ 
        mediaUrl: mediaUrlMsg,
         body:  outputMsg,//'Your ping code is ' + req.body.Body, 
         from: req.body.To, //'whatsapp:+14155238886',       
         to: req.body.From //'whatsapp:+917730967119' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();

    res.send('Got reply!');
  });
app.post('/wastatus', function (req, res) {
  console.log('Got body:', req.body);
  res.send('Got reply!');
});
const port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});