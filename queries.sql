 INSERT INTO venues VALUES (1, "ADELAIDE OVAL", 1, 5403, 1238423);

 INSERT INTO users VALUES (1,"JOHN", "JOHNSON", "Jman", "venue", "HASHDJ");

 INSERT INTO locations VALUES (5403,127.32,123);

 INSERT INTO hotspots (h_id, location, start_time, end_time VALUES (1, 5043, NOW(), ADDTIME(NOW(), "14 0:0:00"));

 SELECT IF (EXISTS(SELECT * FROM hotspots WHERE location=5403), 1, 0);


UPDATE hotspots
  SET location = ?
  SET start_time = ?
  SET end_time = ?
  WHERE h_id = 3;



SELECT * FROM venues
  WHERE user = ? --User ID from the session



  SELECT c_id, venue_name, longitude, latitude, time
  FROM venues INNER JOIN check_ins
  ON venue = v_code
  WHERE check_ins.user = ?;


CREATE VIEW checkInsPerVenue
AS
 SELECT venue_name, longitude, latitude, check_ins.user, time
 FROM venues INNER JOIN check_ins
 ON venue = v_code;
 WHERE check_ins.venue IN (SELECT v_code FROM venues WHERE user = ?);