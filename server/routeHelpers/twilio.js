const config = require('../../config.js');
const accountSid = config.ACCOUNTSID;
const authToken = config.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

const sendReminder = (userName, showName, callback) => {
console.log('sendReminder activated!');
client.messages
  .create({
    to: config.MYNUMBER,
    from: config.TWILIONUMBER,
    body: `Hey ${userName}, This is Watch Potato. We are reminding you that you should watch ${showName} today on your free time! After you are done, please send us a rating (1-5)!`
    // mediaUrl: 'https://climacons.herokuapp.com/clear.png',
  })
  .then((message) => console.log(message.sid));
}

const askForRating = (userName, showName, callback) => {
console.log('askForRating activated!');
client.messages
  .create({
    to: config.MYNUMBER,
    from: config.TWILIONUMBER,
    body: `Hey ${userName}! How was ${showName}? We would love for you to send us back a rating between 1-5 for our database collections`
  })
  .then((message) => console.log(message.sid));
}


// module.exports.sendReminder = sendReminder;
// module.exports.askForRating = askForRating;


/* 
we want this function to send the user a notification at a specific
time to remind the user on when to watch the show.

after the alotted time of binge watching the show,
-we would like to ask the user what the rating of the episode was
-the user can respond with 1-5 with the rating and this will in turn
 update the shows rating on DB.

*/
// to field will be to user's number from database
// from field will be from our free trial twilio number
// body is the text that we want to show to the user
// mediaURL is the image we can send to the user as well


//server routes to connect to these helper functions to send sms text to user

//app.use(bodyParser.urlencoded({ extended: false}));
//the above line is required to getting the text from user
// app.post('/twilio')

const twilio = (req, res) => {
  console.log('twilio called from server');
  let number = '+14152354088';
  let name = 'Devon';
  let showName = 'The Wire';
  //sends out the reminder to user about watching show
  console.log('twilio clicked');
  sendReminder(number, name, showName);
  //sends a txt asking for a rating for the show
  setTimeout(function(){
    askForRating(number, name, showName);
  }, 30000)
  res.send('asking for rating');
}

// app.post('/message'); 

const message = (req, res) => {
  // From is the users phone number, we can match this with name in DB
  // Body is the body of the txt message sent back
  const { From, Body } = req.body;

  console.log('server received a text from twilio reply: ', Body);
//currently not working correctly but it does send a reply
  res.send(`
    <Response>
      <Message>
        Hi, ${From}! Thank you very much for your rating of ${Body}. We have updated our databases with your latest review!
      </Message>
    </Response> 
    `);
};


module.exports.sendReminder = sendReminder;
module.exports.askForRating = askForRating;

module.exports = {
  post: {
    twilio,
    message,
  }
}