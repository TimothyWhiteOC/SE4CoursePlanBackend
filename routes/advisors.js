var express = require('express');
var router = express.Router();
var {authenticate, isAdminOrAdvisor, isAdminOrSameAdvisor, isAdmin} = require('../controllers/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.connection.query("SELECT * FROM advisors", function(error, results, fields) {
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

  if (course.fName == null || course.fName.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"fName", "message":"Must have first name"}';
  }
  if (course.lName == null || course.lName.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"lName", "message":"Must have last name"}';
  }
  if (course.dept == null || course.dept.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"dept", "message":"Must have dept"}';
  }
  if (course.email == null || course.email.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"email", "message":"Must have email"}';
  }
  errorMessage += "]";
  return errorMessage;
}

router.get('/:advisorID', [authenticate, isAdminOrAdvisor], function(req, res, next) {
  res.locals.connection.query("SELECT * FROM advisors WHERE advisorID = ?", req.params.advisorID, function(error, results, fields) {
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

router.put('/:advisorID', [authenticate, isAdminOrSameAdvisor], function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
    res.locals.connection.query("UPDATE advisors SET ? WHERE advisorID=?", [req.body, req.params.advisorID], function(error, results, fields) {
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

router.post('/', [authenticate, isAdmin], function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
      res.locals.connection.query("INSERT INTO advisors SET ?", req.body, function(error, results, fields) {
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

router.delete('/:advisorID', [authenticate, isAdmin], function(req, res, next) {
  res.locals.connection.query("DELETE FROM advisors WHERE advisorID = ?", req.params.advisorID, function(error, results, fields) {
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
