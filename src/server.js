import express from "express";
import morgan  from "morgan";
import rootRouter from "./routers/rootRouter.js"
import path from 'path';
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
import passport from 'passport';
import NaverStrategy from 'passport-naver';
import session from 'express-session';
import User from './models/User.js';
import fetch from 'node-fetch';

const app = express();
const logger = morgan("dev");
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
async function fetchUserProfileFromNaver(accessToken) {
    // Set up the URL and headers for the API call
    const url = 'https://openapi.naver.com/v1/nid/me'; // Replace with the correct URL
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    };

    // Make the API call
    const response = await fetch(url, options);

    // If the call was successful, return the data
    if (response.ok) {
        const data = await response.json();
        console.log("Fetched User Profile:", data);  // <-- Add this line
        return data.response; // assuming 'response' object contains the user profile data
    }

    // If the call wasn't successful, throw an error
    else {
        console.error("Failed to Fetch User Profile:", response.status);  // <-- Add this line
        throw new Error('Failed to fetch user profile from Naver');
    }
}



passport.use(new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAV_CLIENT_SECRET,
    callbackURL: process.env.NAVER_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    console.log('NaverStrategy invoked');
    console.log('accessToken:', accessToken);
    console.log('refreshToken:', refreshToken);
    console.log('profile:', profile);
    try {
      // Fetch additional profile information here using `accessToken`
      const userProfile = await fetchUserProfileFromNaver(accessToken);

      // check if user exists in your database
      let user = await User.findOne({ naverId: profile.id });

      // if user doesn't exist, create a new user
      if (!user) {
        user = await User.create({
          naverId: profile.id,
          email: userProfile.email,
          name: userProfile.name,
          phoneNumber: userProfile.phoneNumber,
          // include other profile information you want to store
        });
      }

      // if there is an error, return the error
      // if everything went fine, return the user
      return done(null, user);
    } catch (error) {
      console.error('Error during User creation:', error);
      done(error);
    }
  }
));



app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/naver',
  passport.authenticate('naver', null), function(req, res) {
    console.log('/auth/naver failed, stopped');
});

app.get('/auth/naver/callback',
  passport.authenticate('naver', {
    failureRedirect: '#!/auth/login'
  }), function(req, res) {
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const PORT = 4000;
const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`)
app.use("/",rootRouter);
app.listen(PORT,handleListening);
