var express = require('express');
var router = express.Router();

router.use(function(req,res,next){
    if('signin' in req.session){
        if(req.session.signin.user_type=='admin'){
            next();
        }
    }
});

router.post('/addHotspot', function(req,res,next){
    var new_hotspot = req.body;

    req.pool.getConnection(function(err, connection){
        if (err){
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var time = new Date(new_hotspot.year, new_hotspot.month-1, new_hotspot.day);
        var newTime = new Date(time);
        newTime.setDate(newTime.getDate()+14);

        query = "INSERT INTO hotspots (venue, start_time, end_time) VALUES (?, ?, ?);";
        connection.query(query, [new_hotspot.venue, time.toDateString(), newTime.toDateString()], function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(501);
                return;
            }
            res.sendStatus(200);
            return;
        });

    });
});


router.post('/removeHotspot', function(req,res,next){
    var hotspot = req.body;

    req.pool.getConnection(function(err, connection){
        if(err){
            res.sendStatus(500);
            return;
        }
        query = "DELETE FROM hotspots WHERE h_id = ?";
        connection.query(query, [hotspot.id], function(err, rows, fields){
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

router.post('/editHotspot', function(req, res, next){
    var hotspot = req.body;

    req.pool.getConnection(function(err, connection){
        if(err){
            res.sendStatus(500);
            return;
        }

        var time = new Date(hotspot.year, hotspot.month-1, hotspot.day);
        var newTime = new Date(hotspot.endYear, hotspot.endMonth-1, hotspot.endDay);

        query = "UPDATE hotspots SET venue = ?, start_time = ?, end_time = ? WHERE h_id = ?;";
        connection.query(query, [hotspot.venue, time.toDateString(), newTime.toDateString(), hotspot.h_id], function(err, rows, fields){
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

router.get('/getUsers', function(req,res,next){
    req.pool.getConnection(function(err, connection){
        if (err){
            res.sendStatus(500);
            return;
        }
        var query = "SELECT u_id, given_name, surname, username, user_type FROM users";
        connection.query(query, function(err, rows, fields){
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

router.post('/removeUser', function(req,res,next){
    var user = req.body;

    req.pool.getConnection(function(err, connection){
        if(err){
            res.sendStatus(500);
            return;
        }
        var query = "DELETE FROM users WHERE u_id = ?";
        connection.query(query, [user.id], function(err, rows, fields) {
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

router.post('/makeAdmin', function(req, res, next){
    var user = req.body;

    req.pool.getConnection(function(err, connection){
        if(err){
            res.sendStatus(500);
            return;
        }

        var query = `UPDATE users SET user_type = "admin" WHERE u_id = ?;`;
        connection.query(query, [user.id], function(err, rows, fields){
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

router.post('/editUser', function(req, res, next){
    var user = req.body;

    req.pool.getConnection(function(err, connection){
        if(err){
            res.sendStatus(500);
            return;
        }

        query = "UPDATE users SET username = ? WHERE u_id = ?;";
        connection.query(query, [user.username, user.u_id], function(err, rows, fields){
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


module.exports = router;