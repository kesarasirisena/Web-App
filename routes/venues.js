var express = require('express');
var router = express.Router();

router.post('/editVenue', function(req,res,next){
    if('signin' in req.session && (req.session.signin.user_type == 'admin' || req.session.signin.user_type == 'venue')){
        var venue = req.body;

        req.pool.getConnection(function(err, connection){
            if(err){
                res.sendStatus(500);
                return;
            }
            console.log(venue.venue_name);

            var query = "UPDATE venues SET venue_name=? WHERE v_code = ?;";
            connection.query(query, [venue.venue_name, venue.v_code], function(err, rows, fields){
                connection.release();
                if(err){
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(200);
                return;

            });

        });


    }
    else{
        res.sendStatus(403);
        return;
    }



});

router.post('/removeVenue', function(req,res,next){
    if('signin' in req.session && (req.session.signin.user_type == 'admin' || req.session.signin.user_type == 'venue')){
        var venue = req.body;

        req.pool.getConnection(function(err, connection){
            if(err){
                res.sendStatus(500);
                return;
            }
            var query = "DELETE FROM venues WHERE v_code = ?;";
            connection.query(query, [venue.id], function(err, rows, fields){
                connection.release();
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(200);
                return;
            });



        });
    }

});



router.get('/getVenues', function(req,res,next){

    if('signin' in req.session && req.session.signin.user_type == 'admin'){
        req.pool.getConnection(function(err, connection){
            if (err){
                res.sendStatus(500);
                return;
            }
            var query = "SELECT * FROM venues";
            connection.query(query, function(err, rows, fields) {

                connection.release();
                if(err){
                    res.sendStatus(500);
                    return;
                }
                res.json(rows);
                return;
            });
        });
    }
    else if((!('signin' in req.session)) || (req.session.signin.user_type == 'user')){
        res.json({});
        return;
    }
    else{
        next();
    }
});

router.use(function(req,res,next){
    if('signin' in req.session){
        if(req.session.signin.user_type=='venue'){
            next();
        }
    }
});


router.get('/getVenues', function(req,res,next){
    req.pool.getConnection(function(err, connection){
        if (err){
            res.sendStatus(500);
            return;
        }
        var query = "SELECT * FROM venues WHERE user = ?";
        connection.query(query, [req.session.signin.u_id], function(err, rows, fields) {

            connection.release();
            if(err){
                res.sendStatus(500);
                return;
            }

            res.json(rows);
            return;
        });
    });
});

router.post('/addVenue', function(req,res,next){

    var newVenue = req.body;
    var vname = newVenue.name;
    var user = req.session.signin.u_id;
    var vlon = newVenue.longitude;
    var vlat = newVenue.latitude;



    req.pool.getConnection(function(err, connection){
        if (err){
            res.sendStatus(500);
            return;
        }

        query = "INSERT INTO venues (venue_name, user, longitude, latitude) VALUES (?, ?, ?,?);";
        connection.query(query, [vname, user, vlon, vlat], function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
                return;
            }
            return;
        });

    });
});


module.exports = router;