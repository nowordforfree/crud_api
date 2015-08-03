/**
 * Created by dev on 8/3/15.
 */
var express = require('express');
var router = express.Router();
var User = require('../db');

router.get('/', function(req, res, next) {
    res.writeHead(200, { 'ContentType': 'text/html' });
    res.end('Hello world!');
})

//create
router.post('/users', function(req, res, next) {
    if (!req.body) {
        res.status(400)
            .json({ message: 'No parameters found in request body' });
        return;
    }
    User.findOne({ username: req.body.username }, function(err, data) {
        if (err) {
            next();
        } else {
            if (data) {
                res.json({ message: 'There is already a user with such username in database. Add canceled.' });
            } else {
                User.findOne({ email: req.body.email }, function(err, data) {
                    if (err) {
                        next();
                    } else {
                        if (data) {
                            res.json({ message: 'There is already a user with such email in database. Add canceled.' });
                        } else {
                            var newuser = new User({
                                username: req.body.username,
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                email: req.body.email,
                                phone: req.body.phone
                            });
                            newuser.save(function(err) {
                                if (err) {
                                    res.writeHead(500, { 'ContentType': 'text/html' });
                                    res.write(err.message);
                                    for (var key in err.errors) {
                                        res.write(err.errors[key].message);
                                    }
                                    res.end();
                                } else {
                                    res.status(200)
                                        .end();
                                }
                            })
                        }
                    }
                })
            }
        }
    })
})

//read
router.get('/users/:id', function(req, res, next) {
    if (!req.params.id) {
        res.status(400)
            .json({ message: 'No parameters found in request'});
        return;
    }
    User.findOne({ _id: req.params.id }, function(err, user) {
        if (err) {
            next();
        } else {
            if (user) {
                res.status(200)
                    .json(user);
            }
        }
    })
})

//update
router.put('/users/:id', function(req, res, next) {
    if (!req.params.id) {
        res.status(400)
            .json({ message: 'No Id provided' });
        return;
    }

    User.findOneAndUpdate({ _id: req.params.id }, req.body, function(err) {
        if (err) {
            next();
        }
        res.end();
    });
});

//delete
router.delete('/users/:id', function(req, res, next) {
    if (!req.params.id) {
        res.status(400)
            .json({ message: 'No Id provided' });
        return;
    }
    User.findOneAndRemove(req.params.id, function() {
        res.status(200)
            .end();
    });
})

module.exports = router;