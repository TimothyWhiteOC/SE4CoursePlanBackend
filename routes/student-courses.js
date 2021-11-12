var express = require('express');
const { authenticate, isAdminAdvisorOrSameStudent } = require('../controllers/auth');
var router = express.Router();

function validate(course) {
  var errorMessage = "[";
  if (isNaN(parseInt(course.studentID))) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage +=
      '{"attributeName":"studentID", "message":"StudentID must be integer"}';
  }
  if (course.courseNo == null || course.courseNo.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage +=
      '{"attributeName":"courseNo" , "message":"Must have courseNo"}';
  }
  if (course.semTerm == null || course.semTerm.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"semTerm" , "message":"Must have term"}';
  }
  if (isNaN(parseInt(course.semYear))) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"semYear" , "message":"Year must be integer"}';
  }
  errorMessage += "]";
  return errorMessage;
}

router.get('/:studentID/courses', [authenticate, isAdminAdvisorOrSameStudent], function(req, res, next) {
  res.locals.connection.query("SELECT sc.*, c.name, c.hours FROM student_courses sc, courses c, semesters s WHERE sc.studentID = ? AND c.courseNo = sc.courseNo AND s.semTerm = sc.semTerm and s.semYear = sc.semYear ORDER BY s.startDate", req.params.studentID, function(error, results, fields) {
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

router.get('/:studentID/courses/:courseNo', [authenticate, isAdminAdvisorOrSameStudent], function(req, res, next) {
  res.locals.connection.query("SELECT * FROM student_courses WHERE studentID = ? AND courseNo = ?", [req.params.studentID, req.params.courseNo], function(error, results, fields) {
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

router.put('/:studentID/courses/:courseNo', [authenticate, isAdminAdvisorOrSameStudent], function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
    res.locals.connection.query("UPDATE student_courses SET ? WHERE studentID=? AND courseNo=? AND semTerm=? and semYear=?", [req.body, req.params.studentID, req.params.courseNo, req.body.semTerm, req.body.semYear], function(error, results, fields) {
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

router.post('/:studentID/courses', [authenticate, isAdminAdvisorOrSameStudent], function(req, res, next) {
  var errorMessage = validate(req.body);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  }
  else {
      res.locals.connection.query("INSERT INTO student_courses SET ?", req.body, function(error, results, fields) {
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

router.delete('/:studentID/courses/:courseNo', [authenticate, isAdminAdvisorOrSameStudent], function(req, res, next) {
  res.locals.connection.query("DELETE FROM student_courses WHERE studentID = ? AND courseNo = ?", [req.params.studentID, req.params.courseNo], function(error, results, fields) {
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
