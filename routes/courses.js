var express = require('express');
const { authenticate, isAdminOrAdvisor } = require('../controllers/auth');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.connection.query("SELECT courseNo, name FROM courses", function(error, results, fields) {
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
  if (course.dept == null || course.dept.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage +=
      '{"attributeName":"dept", "message":"Must have dept"}';
  }
  if (course.courseNo == null || course.courseNo.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage +=
      '{"attributeName":"courseNo" , "message":"Must have courseNo"}';
  }
  if (course.name == null || course.name.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"name" , "message":"Must have name"}';
  }
  if (isNaN(parseInt(course.level))) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"level" , "message":"Level must be integer"}';
  }
  if (isNaN(parseInt(course.hours))) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"hours" , "message":"Hours must be integer"}';
  }
  errorMessage += "]";
  return errorMessage;
}

router.get('/:courseNo', function(req, res, next) {
  res.locals.connection.query("SELECT * FROM courses WHERE courseNo = ?", req.params.courseNo, function(error, results, fields) {
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

router.put('/:courseNo', [authenticate, isAdminOrAdvisor], function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
    res.locals.connection.query("UPDATE courses SET ? WHERE courseNo=?", [req.body, req.params.courseNo], function(error, results, fields) {
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
      res.locals.connection.query("INSERT INTO courses SET ?", req.body, function(error, results, fields) {
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

router.delete('/:courseNo', [authenticate, isAdminOrAdvisor], function(req, res, next) {
  res.locals.connection.query("DELETE FROM courses WHERE courseNo = ?", req.params.courseNo, function(error, results, fields) {
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

router.get('/semester/:semTerm', function(req, res, next) {
  res.locals.connection.query("SELECT * FROM courses WHERE courseNo IN (SELECT courseNo FROM course_semesters WHERE semTerm = ?)", req.params.semTerm, function(error, results, fields) {
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

module.exports = router;
