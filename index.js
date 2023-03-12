const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-laxman:test123admin@sample.jj2m4ux.mongodb.net/VidDb?retryWrites=true&w=majority");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

const vidSchema = new mongoose.Schema({
  vidName: {
    type: String,
    required: true,
    unique: true
  },
  vidThumb: {
    type: String,
    required: true,
    unique: true
  },
  vidLink: {
    type: String,
    required: true,
    unique: true
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
});

const Vids = mongoose.model("Vid", vidSchema);

app.get("/", function(req, res) {
  Vids.find().then(function(vids, err) {
    res.render("index", {
      videos: vids
    });
  });
});

app.get("/like/:vidId", function(req, res) {
  const requestedVidId = req.params.vidId;
  Vids.updateOne({
    _id: requestedVidId
  }, {
    $inc: {
      likes: 1
    }
  }, {
    new: true
  }, function(err, vid) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/" + requestedVidId);
    }
  });
});


app.get("/:vidId", function(req, res) {
  const videoID = req.params.vidId;
  if (videoID.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    Vids.findOne({
      _id: videoID
    }).then(async function(vid, err) {
      if (err) {
        console.log(err);
      } else {
        Vids.updateOne({
          _id: videoID
        }, {
          $inc: {
            views: 1
          }
        }, {
          new: true
        }, function(err, vid) {
          if (err) {
            console.log(err);
          } else {
            console.log(vid);
          }
        });
        res.render("vid", {
          video: await vid
        });

      }
    });
  } else {
    console.log("not an id");
  }
});


app.post("/signIn", function(req, res) {
  res.render("signIn");
});

app.listen(3000 || process.env.PORT, function() {
  console.log("Server Started");
});
