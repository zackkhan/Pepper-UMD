const express = require('express');
var bodyParser = require('body-parser')
const app = express();
var http = require('http').Server(app)
var axios = require('axios')
var mongoose = require('mongoose')
const {google} = require('googleapis');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var port = process.env.PORT || 4000;
var http = require('http').Server(app)

var mongoUrl = "mongodb://zack:zack123@ds119820.mlab.com:19820/meal-app"
mongoose.connect(mongoUrl)

var locations = {};
locations["South Campus Diner"] = ["Diner Entrance", "Salad Bar", "Gazebo", "Stir Fry"]
locations["North Campus Diner"] = ["Diner Entrance", "Salad Bar"]
locations["Default"] = ["Diner Entrance"]


const notificationTypes = {
    MEALCANCELED: 'MEALCANCELED',
    NEWFRIEND: 'NEWFRIEND',
    REMINDER: 'REMINDER',
    STALE : 'STALE'
}

var friendSchema = new mongoose.Schema({
    FCMToken: String,
    available: Boolean,
    restaurantName: String,
    timestamp: Date,
    friendID: String,
    emoji: String
  });

var Friend = mongoose.model('Friend', friendSchema);

async function cleanDatabaseTask(){
    setInterval(cleanDatabase, 60000);
}
// Cleans database of stale users that haven't responded in 4 minutes (each minute is 60000 ms)
async function cleanDatabase() {
    console.log("Cleaning the database")
    Friend.find({}, function(err, friends) {
        friends.forEach(async function (friend){
            const currTime = Date.now();
            let minuteDifference = Math.abs(currTime - friend.timestamp)
            minuteDifference = Math.round(minuteDifference / 60000)
            if (minuteDifference >= 4){
                // send notification
                sendNotification(friend, null, notificationTypes.STALE)
                await Friend.deleteOne({_id: friend._id}, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`successfully deleted stale user ${friend._id}`)
                    }
                })
            }
        })
    })
}

app.get("/status/:FCMToken", function(req, res) {
    var currentFriend = await Friend.findOne({FCMToken: req.params.FCMToken});
    if (currentFriend == null) {
        res.status(200).send("EMPTY");
    } else if (currentFriend.friendID == "") {
        res.status(200).send("SEARCHING")
    } else {
        res.status(200).send("MATCHED")
    }
});
// save new friend in DB
app.post("/newfriend", function(req, res) {
    var q = new Friend({friendID: "", timestamp: req.body.timestamp, FCMToken: req.body.FCMToken, available: true, restaurantName: req.body.restaurantName});
    q.save();
    console.log("New friend")
    console.log(q._id)
    res.statusMessage = String(q._id)
    res.status(200).send(String(q._id))
})

app.post("/remindFriend", function(req, res) {
    const currentUser = req
    const newFriend = req
    sendNotification(currentUser, newFriend, notificationTypes.REMINDER)
})

app.get("/", function(req, res) {
//    console.log("SITE HIT")
})

app.post("/cancelmeal", async function(req, res) {
    console.log("Canceling Meal")
    var user = Friend.findOne({FCMToken: req.body.FCMToken});
    const currentFriendID = user.friendID;
    
    await Friend.deleteOne({FCMToken: req.body.FCMToken}, function(err) {
        if (err){
            console.log(err);
        } else {
            console.log(`Successfully deleted user with token ${req.body.FCMToken}`)
            res.status(200).send("successfully deleted");
        }
    })

    var currentFriend = await Friend.findOne({_id: currentFriendID});
    currentFriend.available = true;
    currentFriend.save();
    sendNotification(currentFriend, null, notificationTypes.MEALCANCELED)
});


app.get("/getfriend/:currentUserId", async function(req, res) {
    var currentUser = await Friend.findOne({_id: req.params.currentUserId})
    var newFriend = await Friend.findOne({_id: {$ne: req.params.currentUserId}, restaurantName: currentUser.restaurantName, available: true})    

    // TODO: Fix this check (newFriend can be null at times)
    if (newFriend != null) {
        var emoji = "tada"

        // storing references to each other
        currentUser.friendID = newFriend._id
        newFriend.friendID = currentUser._id
        
        newFriend.emoji = emoji;
        currentUser.emoji = emoji;

        newFriend.available = false;
        currentUser.available = false;

        newFriend.save();
        currentUser.save();
        
        res.status(200).send(JSON.stringify(newFriend));

        // notify both users about the match
        sendNotification(currentUser, newFriend, notificationTypes.NEWFRIEND)
        sendNotification(newFriend, currentUser, notificationTypes.NEWFRIEND)
    } else {
        res.send(null)
    }
})

http.listen(port, function() {
    console.log('Example app listening on port '+ port )
});

async function sendNotification(friend, newFriend, messageType) {
    var accessToken = await getAccessToken();
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        }
    };
    console.log("FCM Token")
    console.log(friend.FCMToken)
    var notification_data;
    if (messageType == notificationTypes.MEALCANCELED) {
        notification_data = {
        "message": {
            "notification": {
                "body": `No worries! We are looking for another friend for you`,
                "title": "Unfortunately your friend had to go!"
                },
            "token" : friend.FCMToken  
            }
        }
    } else if (messageType == notificationTypes.NEWFRIEND){
        notification_data = {
            "message": {
            "notification": {
                "body": `A friend wants to meet you!`,
                "title": "Meet a Friend"
                },
            "data" : {
                "name" : newFriend.name,
                "identification" : newFriend.identification,
                "location" : newFriend.location,
                "id": newFriend._id
                },
            "token" : friend.FCMToken  
            }
        }
    } else if (messageType == notificationTypes.REMINDER) {
        notification_data = {
            "message": {
            "notification": {
                "body": `Your friend ${newFriend.name} is waiting for you at ${friend.location}!`,
                "title": "Meet a Friend"
                },
            "data" : {
                "name" : newFriend.name,
                "identification" : newFriend.identification,
                "location" : newFriend.location,
                "id": newFriend._id
                },
            "token" : friend.FCMToken  
            }
        }
    } else if (messageType == notificationTypes.STALE) {
        notification_data = {
            "message": {
            "notification": {
                "body": `Respond in-app to continue looking for new friends!`,
                "title": "Are you still there?"
                },
            "data" : {
                },
            "token" : friend.FCMToken  
            }
        }
    }

    axios.post("https://fcm.googleapis.com/v1/projects/meal-app-ab05c/messages:send", notification_data, axiosConfig)
    .then(function (response) {
        console.log("Notification successfully sent")
        console.log(response);
        })
    .catch(function (error) {
    console.log("Error")
    console.log(error);
    });
}

function getAccessToken() {
    var SCOPES = ['https://www.googleapis.com/auth/firebase.messaging']
    return new Promise(function(resolve, reject) {
      var key = require('./meal-app-ab05c-firebase-adminsdk-0s8nb-2dd1eab96e.json');
      var jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        SCOPES,
        null
      );
      jwtClient.authorize(function(err, tokens) {
        if (err) {
        console.log("REJECT")
          reject(err);
          return;
        }
        resolve(tokens.access_token);
      });
    });
  }