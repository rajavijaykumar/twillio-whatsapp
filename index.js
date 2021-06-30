var express = require('express');
//const bodyParser = require('body-parser');
const accountSid = 'AC60e14428b5aadcb'+'553c05f4fc6fa442e'; 
const authToken = 'b6b42ad2eda7b770'+'9dcd5e511b597c24'; 
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


app.get('/nse', async function (req, res) {
  data = await downloadScript()
  console.dir(data)
  res.send(data);
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



let DateStr = 0, Series = 1, OpenPrice = 2, HighPrice = 3, LowPrice = 4,
    PrevClose = 5, LastPrice = 6, ClosePrice = 7, VWAP = 8,
    FiftyTwoWH = 9, FiftyTwoWL = 10, Volumn = 11, Value = 12,
    NoOfTrades = 13, PL = 14, PER = 15, High_Low = 16,
    Open_High = 17, Open_Low = 18;

const https = require('https');
//const { resolve } = require('path');
const zlib = require('zlib');
//downloadScript();
async function downloadScript() {

  let promise = new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.nseindia.com',
      port: 443,
      path: '/',
      method: 'GET',
      agent: false,
      headers: {
          "X-Requested-With": "XMLHttpRequest",
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36',
          'accept-language': 'en-US,en;q=0.9'
      }
  }

  const req = https.request(options,  (res) =>  {
      //console.log(`statusCode: ${res.statusCode}`);
      //console.log(res.headers);
      var cookieStr = '';
      res.headers["set-cookie"].map(c => cookieStr += (c.substring(0, c.indexOf(';') + 1)) + ' ');
      //var htmlData = [];
      res.on('data', data => {
          //htmlData.push(data);
      });
      res.on('end', async function () {
          /*var buffer = Buffer.concat(htmlData);
          zlib.gunzip(buffer, function (err, decoded) {
              //console.log(decoded.toString());
          });*/
         let d = await downloadAllScriptData(cookieStr);
         resolve(d)
      });
  });
  req.on('error', error => {
      console.error(error);
  })
  req.end();
  });

  return promise;
    
}

async function downloadAllScriptData(cookieStr) {

    var today = new Date()
    var todayDay = (today.getDate() < 10 ? '0' + today.getDate() : today.getDate());
    var todayMonth = (today.getMonth() < 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1))
    var todayStr = todayDay + '-' + todayMonth + '-' + today.getFullYear()

    var fromDay = new Date()
    fromDay.setDate(today.getDate() - 400)
    var fromDayDate = (fromDay.getDate() < 10 ? '0' + fromDay.getDate() : fromDay.getDate());
    var fromDayMonth = (fromDay.getMonth() < 9 ? '0' + (fromDay.getMonth() + 1) : (fromDay.getMonth() + 1))
    var fromDayStr = fromDayDate + '-' + fromDayMonth + '-' + fromDay.getFullYear()

    let sArr = ['INFY', 'PNB']
    let obj = {};
    for(let i=0; i<sArr.length; i++) {
        let d = await downloadData(cookieStr, sArr[i], fromDayStr, todayStr)
        obj[sArr[i]] = d;
    }
    return obj
}

async function downloadData(cookie, scriptName, fromDayStr, todayStr) {

  let promise = new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.nseindia.com',
      port: 443,
      path: '/api/historical/cm/equity?symbol=' + encodeURIComponent(scriptName) + "&series=[%22EQ%22]&from=" + fromDayStr + "&to=" + todayStr + "&csv=true",
      method: 'GET',
      agent: false,
      headers: {
          "X-Requested-With": "XMLHttpRequest",
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36',
          'accept-language': 'en-US,en;q=0.9',
          cookie: cookie
      }
  }

  const req = https.request(options, res => {
      //console.log(`statusCode: ${res.statusCode}`);
      var htmlData = [];
      res.on('data', data => {
          htmlData.push(data)
      });
      res.on('end', function () {
          var buffer = Buffer.concat(htmlData);
          zlib.gunzip(buffer, function (err, decoded) {
              var csv = decoded.toString()

              let scriptData = csv.match(/[^\r\n]+/g);
              scriptData.splice(0, 1)
              let data = []
              scriptData.forEach(d => {
                  d = d.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
                  data.push(d.map(v => v.replace(/"/g, "")).map(v => v.replace(/,/g, "")))
              });
              data.forEach((d, index) => {
                  d[Series] = '';
                  d[FiftyTwoWH] = '';
                  d[FiftyTwoWL] = '';
                  d.forEach((s, index, arr) => {
                      if (!isNaN(s)) {
                          arr[index] = parseFloat(s)
                      }
                  });
                  if (index < (data.length - 1)) {
                      data[index][PL] = parseFloat((d[ClosePrice] - d[PrevClose]).toFixed(2))
                      data[index][PER] = parseFloat(((d[ClosePrice] - d[PrevClose]) * 100 / d[PrevClose]).toFixed(2))
                  } else {
                      data[index][PL] = 0
                      data[index][PER] = 0
                  }
                  data[index][High_Low] = parseFloat((d[HighPrice] - d[LowPrice]).toFixed(2))

                  data[index][Open_High] = parseFloat((d[HighPrice] - d[OpenPrice]).toFixed(2))
                  data[index][Open_Low] = parseFloat((d[OpenPrice] - d[LowPrice]).toFixed(2))
              });
              console.dir(data);
              resolve(data)
          });
      });
  });
  req.on('error', error => {
      console.error(error);
  });
  req.end();
  })

  return promise

    
}

const port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});