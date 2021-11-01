var express = require('express');
const { authenticate, isAdminOrAdvisor, isAdminAdvisorOrSameStudent } = require('../controllers/auth');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.connection.query("SELECT studentID, fName, lName FROM students", function(error, results, fields) {
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

  if (course.studentID == null || course.studentID.length == 0) {
    errorMessage +=
      '{"attributeName":"studentID", "message":"Must have studentID"}';
  }
  if (course.fName == null || course.fName.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"fName", "message":"Must have first name"}';
  }
  if (course.lName == null || course.lName.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"lName", "message":"Must have last name"}';
  }
  if (course.email == null || course.email.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"email", "message":"Must have email"}';
  }
  errorMessage += "]";
  return errorMessage;
}

router.get('/:studentID', [authenticate, isAdminOrAdvisor], function(req, res, next) {
  res.locals.connection.query("SELECT * FROM students WHERE studentID = ?", req.params.studentID, function(error, results, fields) {
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

router.put('/:studentID', [authenticate, isAdminAdvisorOrSameStudent], function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
    res.locals.connection.query("UPDATE students SET ? WHERE studentID=?", [req.body, req.params.studentID], function(error, results, fields) {
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

router.post('/', [authenticate, isAdminOrAdvisor], function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
      res.locals.connection.query("INSERT INTO students SET ?", req.body, function(error, results, fields) {
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

router.delete('/:studentID', [authenticate, isAdminOrAdvisor], function(req, res, next) {
  res.locals.connection.query("DELETE FROM students WHERE studentID = ?", req.params.studentID, function(error, results, fields) {
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
