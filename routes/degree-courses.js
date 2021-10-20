var express = require('express');
var router = express.Router();

function validate(course) {
  var errorMessage = "[";
  if (isNaN(parseInt(course.majorID))) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage +=
      '{"attributeName":"majorID", "message":"MajorID must be integer"}';
  }
  if (course.courseNo == null || course.courseNo.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage +=
      '{"attributeName":"courseNo" , "message":"Must have courseNo"}';
  }
  errorMessage += "]";
  return errorMessage;
}

router.get('/:majorID/courses', function(req, res, next) {
  res.locals.connection.query("SELECT * FROM major_courses WHERE majorID = ?", req.params.majorID, function(error, results, fields) {
    if (error) {
      res.status(500);
      res.send(JSON.stringify({ status: 500, error: error, response: null }));
    } else {
      res.status(200);
      res.send(JSON.stringify(results));
    }
    res.locals.connection.end();
  });
});

router.post('/:majorID/courses', function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
      res.locals.connection.query("INSERT INTO major_courses SET ?", req.body, function(error, results, fields) {
      if (error) {
        res.status(500);
        res.send(JSON.stringify({ status: 500, error: error, response: null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.status(201);
        res.send(JSON.stringify(results));
        //If there is no error, all is good and response is 200OK.
      }
      res.locals.connection.end();
    });
  }
});

router.delete('/:majorID/courses/:courseNo', function(req, res, next) {
  res.locals.connection.query("DELETE FROM major_courses WHERE majorID = ? AND courseNo = ?", [req.params.majorID, req.params.courseNo], function(error, results, fields) {
    if (error) {
      res.status(500);
      res.send(JSON.stringify({ status: 500, error: error, response: null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.status(200);
      res.send(JSON.stringify(results));
      //If there is no error, all is good and response is 200OK.
    }
    res.locals.connection.end();
  });
});

module.exports = router;
