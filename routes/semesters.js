var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.connection.query("SELECT * FROM semesters ORDER BY startDate", function(error, results, fields) {
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

function validate(course) {
  var errorMessage = "[";

  if (course.semTerm == null || course.semTerm.length == 0) {
    errorMessage +=
      '{"attributeName":"semTerm", "message":"Must have term"}';
  }
  if (isNaN(parseInt(course.semYear))) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"semYear", "message":"Must have year"}';
  }
  if (course.startDate == null || course.startDate.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"startDate", "message":"Must have start date"}';
  }
  if (course.endDate == null || course.endDate.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"endDate", "message":"Must have end date"}';
  }
  errorMessage += "]";
  return errorMessage;
}

router.get('/:semTerm/:semYear', function(req, res, next) {
  res.locals.connection.query("SELECT * FROM semesters WHERE semTerm = ? and semYear = ?", [req.params.semTerm, req.params.semYear], function(error, results, fields) {
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

router.put('/:semTerm/:semYear', function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
    res.locals.connection.query("UPDATE semesters SET ? WHERE semTerm = ? and semYear = ?", [req.body, req.params.semTerm, req.params.semYear], function(error, results, fields) {
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
  }
});

router.post('/', function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
      res.locals.connection.query("INSERT INTO semesters SET ?", req.body, function(error, results, fields) {
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

router.delete('/:semTerm/:semYear', function(req, res, next) {
  res.locals.connection.query("DELETE FROM semesters WHERE semTerm = ? and semYear = ?", [req.params.semTerm, req.params.semYear], function(error, results, fields) {
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
