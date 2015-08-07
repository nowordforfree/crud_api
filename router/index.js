/**
 * Created by dev on 8/3/15.
 */

 var express = require('express');
 var router = express.Router();
 var User = require('../db');

 router.use('/', function(req, res, next) {
 	res.header('Access-Control-Allow-Origin', '*');
 	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
 	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
 	next();
 })

 router.get('/users', function(req, res, next) {
	User.find({}, function(err, data) {
 		if (err) {
 			return next(err);
 		}
 		res.json(data);
 	})
 })

//create
router.post('/users', function(req, res, next) {
	if (!req.body) {
		return res.json({ message: 'No parameters found in request body' });
	}
	User.findOne({ username: req.body.username }, function(err, data) {
		if (err) {
			return next(err);
		} else {
			if (data) {
				res.json({ message: 'There is already a user with such username in database. Please provide unique username.' });
			} else {
				User.findOne({ email: req.body.email }, function(err, data) {
					if (err) {
						return next(err);
					} else {
						if (data) {
							res.json({ message: 'There is already a user with such email in database. Please provide unique email.' });
						} else {
							var newuser = new User({
								username: req.body.username,
								firstname: req.body.firstname,
								lastname: req.body.lastname,
								email: req.body.email,
								phone: req.body.phone
							});
							newuser.save(function(err, user) {
								if (err) {
									return next(err);
								} else {
									res.json(user);
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
		return res.json({ message: 'No parameters found in request'});
	}
	User.findById(req.params.id, function(err, user) {
		if (err) {
			return next(err);
		} else {
			if (user) {
				res.json(user);
			}
		}
	})
})

//update
router.put('/users/:id', function(req, res, next) {
	if (!req.params.id) {
		return res.json({ message: 'No Id provided' });
	}
	User.findOne({ username: req.body.username }, function(err, data) {
		if (err) {
			return next(err);
		} else {
			if (data && data._id != req.params.id) {
				res.json({ message: 'There is already a user with such username in database. Please provide unique username.' });
			} else {
				User.findOne({ email: req.body.email }, function(err, data) {
					if (err) {
						return next(err);
					} else {
						if (data && data._id != req.params.id) {
							res.json({ message: 'There is already a user with such email in database. Please provide unique email.' });
						} else {
							User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
								if (err) {
									return next(err);
								} else {
									res.json({ });
								}
							});
						}
					}
				});
			}
		}
	});
})

//delete
router.delete('/users/:id', function(req, res, next) {
	if (!req.params.id) {
		return res.json({ message: 'No Id provided' });
	}
	User.findByIdAndRemove(req.params.id, function(err, user) {
		if (err) {
			next(err);
		} else {
			res.json(user);
		}
	});
})

router.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message,
			error: err
		}
	});
});

module.exports = router;