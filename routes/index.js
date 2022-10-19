var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getHotspots', function(req,res,next){
    req.pool.getConnection(function(err, connection){
        if (err){
            res.sendStatus(500);
            return;
        }
        var query = "SELECT h_id, venue, start_time, end_time, longitude, latitude, venue_name FROM hotspots INNER JOIN venues WHERE v_code = venue;";
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



router.get('/getLCVenues', function(req,res,next){


    req.pool.getConnection(function(err, connection){
        if (err){
            res.sendStatus(500);
            return;
        }
        var query = "SELECT v_code, longitude, latitude FROM venues;";
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

module.exports = router;