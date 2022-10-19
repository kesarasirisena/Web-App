var express = require('express');
var router = express.Router();

const CLIENT_ID = '970189977830-hir0k9caolqovgu34hqp59vloqe2p39g.apps.googleusercontent.com';

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
var argon2 = require('argon2');




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getUserInfo', function(req,res,next){
    if('signin' in req.session){
        var userInfo = {userType:req.session.signin.user_type, username:req.session.signin.username, givenName:req.session.signin.given_name, surname:req.session.signin.surname};
        res.json(userInfo);
        return;
    }
    res.json({username:"", givenName:"", surname:"", userType:""});
    return;
});



router.post('/login', function(req, res, next) {

    if( 'user' in req.body && 'pass' in req.body ) {

       req.pool.getConnection( function(err,connection) {
           if (err) {

               res.sendStatus(500);
               return;
           }
           var query = `SELECT u_id, given_name, surname, username, user_type, password
                            FROM users WHERE username = ?`;
           connection.query(query,[req.body.user], async function(err, rows, fields) {
             connection.release(); // release connection
             if (err) {

               res.sendStatus(500);
               return;
             }


             if(rows.length == 1) {

                if (await argon2.verify(rows[0].password, req.body.pass)) {
                      delete rows[0].password;
                      req.session.signin = rows[0];

                      res.json(rows[0]);

                    }

                    else {

                      return res.sendStatus(401);
                  }


             } else {

               res.sendStatus(401);


             }


           });
       });


   } else if('token' in req.body ) {

       async function verify() {
         const ticket = await client.verifyIdToken({
             idToken: req.body.token,
             audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
             // Or, if multiple clients access the backend:
             //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
         });
         const payload = ticket.getPayload();



         req.pool.getConnection( function(err,connection) {
               if (err) {

                   res.sendStatus(500);
                   return;
               }
               var query = `SELECT u_id, given_name, surname, username, user_type, password
                            FROM users WHERE username = ?;`;
               connection.query(query,[payload['email']], function(err, rows, fields) {
                 connection.release(); // release connection
                 if (err) {

                   res.sendStatus(500);
                   return;
                 }
                 if (rows.length == 1) {


                      req.session.signin = rows[0];

                      req.session.signin.username = payload['email'];

                      res.json(rows[0]);

                    } else {

                        res.sendStatus(401);
                        return;
                    }




               });
           });
       }
       verify().catch(function(){res.sendStatus(401);});

   } else {
       res.sendStatus(400);
   }

});








router.post('/signup', async function(req, res, next) {

    if( 'given_name' in req.body &&
        'surname' in req.body &&
        'user' in req.body &&
        'pass' in req.body &&
        'user_type' in req.body){

    phash = await argon2.hash(req.body.pass);

    req.pool.getConnection( function(err,connection) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            var query = `INSERT INTO users (given_name, surname, username, password, user_type)
                         VALUES(?, ?, ?, ?, ?);`;

            connection.query(query,[req.body.given_name, req.body.surname, req.body.user, phash, req.body.user_type], function(err, rows, fields){

                connection.release(); // release connection
                if(err) {

                    res.sendStatus(500);
                    return;
                }


                    res.end();



            });

    });




        }  else {

          res.sendStatus(400);
        }





});

router.get('/getCheckins', function(req, res, next) {

    if(!('signin' in req.session)){
        res.json({});
        return;
    }

    req.pool.getConnection(function(err, connection){
        if (err){
            res.sendStatus(500);
            return;
        }

        if(req.session.signin.user_type == 'venue'){
            var query = " SELECT venue_name, longitude, latitude, check_ins.user, time, given_name, surname FROM ((venues INNER JOIN check_ins ON venue = v_code) INNER JOIN users ON check_ins.user = u_id) WHERE check_ins.venue IN (SELECT v_code FROM venues WHERE user = ?);";
            connection.query(query, [req.session.signin.u_id], function(err, rows, fields){
                connection.release();
                if(err){
                    res.sendStatus(500);
                    return;
                }
                res.json(rows);
                return;
            });
        } else if (req.session.signin.user_type == 'admin'){
            var query = " SELECT venue_name, longitude, latitude, check_ins.user, time, given_name, surname FROM ((venues INNER JOIN check_ins ON venue = v_code) INNER JOIN users ON check_ins.user = u_id) WHERE check_ins.venue;";
            connection.query(query, [req.session.signin.u_id], function(err, rows, fields){
                connection.release();
                if(err){
                    res.sendStatus(500);
                    return;
                }
                res.json(rows);
                return;
            });
        }
        else{
            var query = "SELECT venue_name, longitude, latitude, time FROM venues INNER JOIN check_ins ON venue = v_code WHERE check_ins.user= ?;";
            connection.query(query, [req.session.signin.u_id], function(err, rows, fields){
                connection.release();
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                console.log(rows);
                res.json(rows);
                return;
            });
        }

    });
});




//Edit Account Information Routes


router.post('/editUsername', function(req,res,next){
    var username = req.body.username;
    req.session.signin.username = username;

    req.pool.getConnection(function(err, connection){
        if(err){
            res.sendStatus(500);
            return;
        }

        query = "UPDATE users SET username = ? WHERE u_id = ?;";
        connection.query(query, [username, req.session.signin.u_id], function(err, rows, fields){
            connection.release();
            if(err){
               res.sendStatus(500);
               return;
            }
            res.sendStatus(200);
        });

    });


});

router.post('/editGivenName', function(req,res,next){
    var givenName = req.body.givenName;
    req.session.signin.given_name = givenName;

    req.pool.getConnection(function(err, connection){
        if(err){
            res.sendStatus(500);
            return;
        }

        query = "UPDATE users SET given_name = ? WHERE u_id = ?;";
        connection.query(query, [givenName, req.session.signin.u_id], function(err, rows, fields){
            connection.release();
            if(err){
               res.sendStatus(500);
               return;
            }
            res.sendStatus(200);
        });

    });


});

router.use(function(req, res, next){

    if('signin' in req.session){

        next();

    }

    else {

        res.sendStatus(403);

    }

});

router.post('/logout', function(req,res,next){
    req.session.destroy();
});


router.post('/addCheckin', function(req,res,next){

    var v_code = req.body.checkinCode;
    var user = req.session.signin.u_id;

    req.pool.getConnection(function(err, connection){

        if(err){
            res.sendStatus(500);
            return;
        }
        var date = new Date();
        var time = new Date(date.getFullYear(), date.getMonth(), date.getDate());


        var query = "INSERT INTO check_ins (venue, user, time) VALUES (?, ?, ?);";

        connection.query(query, [v_code, user, time.toDateString()], function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
            return;
        });
    });

});






router.post('/editSurname', function(req,res,next){
    var surname = req.body.surname;
    req.session.signin.surname = surname;

    req.pool.getConnection(function(err, connection){
        if(err){
            res.sendStatus(500);
            return;
        }

        query = "UPDATE users SET surname = ? WHERE u_id = ?;";
        connection.query(query, [surname, req.session.signin.u_id], function(err, rows, fields){
            connection.release();
            if(err){
               res.sendStatus(500);
               return;
            }
            res.sendStatus(200);
        });

    });


});

router.post('/addGoogle', function(req,res,next){
    var username = req.body.username;
    req.session.signin.username = username;

    req.pool.getConnection(function(err, connection){
        if(err){
            res.sendStatus(500);
            return;
        }

        query = "UPDATE users SET username = ? WHERE u_id = ?;";
        connection.query(query, [username, req.session.signin.u_id], function(err, rows, fields){
            connection.release();
            if(err){
               res.sendStatus(500);
               return;
            }
            res.sendStatus(200);
        });

    });


});





module.exports = router;