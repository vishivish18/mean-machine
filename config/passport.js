var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('./auth');
var User = require('../app/models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    passport.use(new GoogleStrategy({

            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,

        },
        function(token, refreshToken, profile, done) {
            console.log(profile);


            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google


            // try to find the user based on their google id
            User.findOne({ 'google.id': profile.id }, function(err, user) {
                if (err) {
                    console.log("err", err)
                    return done(err);
                }

                if (user) {
                    console.log("user found")

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    console.log("Its Signup")
                    var newUser = new User();
                    //return done(null, profile);
                    // set all of the relevant information
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.google.photo = profile.photos[0].value;


                    // // save the user
                    console.log(newUser)
                    newUser.save(function(err, user) {
                        if (err)
                            throw err;

                        console.log(user);
                        return done(null, newUser);
                    });
                    // if the user isnt in our database, create a new user

                }
            });


        }));

};
