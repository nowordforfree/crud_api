/**
 * Created by ozzy on 7/31/15.
 */

var db = require('./db');

var validateEmail = function(email) {
    var emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailregex.test(email);
}
var validatePhone = function(phone) {
    var phoneregex = /^\(?([0-9]{3})\)?([ -]?)([0-9]{3})\2([0-9]{4})$/;
    return phoneregex.test(phone);
}

var schema = new db.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    firstname: { type: String, default: '' },
    lastname: { type: String, default: '' },
    phone: {
        default: '',
        type: String,
        trim: true,
        validate: [validatePhone, 'Please put phone number in following format: (xxx) xxx xxxx or (xxx)-xxx-xxxx or xxx-xxx-xxxx or xxxxxxxxxx']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: 'Email address required',
        validate: [validateEmail, 'Please provide valid email address']
    }
})
var User = db.model('User', schema);

module.exports = {
    create: function(obj) {
        User.findOne({ username: obj.username }, function(err, data) {
            if (err) {
                throw err;
            } else {
                if (data) {
                    console.log('There is already a user with such username in database. Add canceled.');
                    return false;
                } else {
                    User.findOne({ email: obj.email }, function(err, data) {
                        if (err) {
                            throw err;
                        } else {
                            if (data) {
                                console.log('There is already a user with such email in database. Add canceled.');
                                return false;
                            } else {
                                var newuser = new User({
                                    username: obj.username,
                                    firstname: obj.firstname,
                                    lastname: obj.lastname,
                                    email: obj.email,
                                    phone: obj.phone
                                });
                                newuser.save(function(err) {
                                    if (err) {
                                        console.log(err.message);
                                        for (var key in err.errors) {
                                            console.log(err.errors[key].message);
                                        }
                                        return false;
                                    } else {
                                        return true;
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    read: function(id) {
        User.findOne({ _id: id }, function(err, user) {
            if (err) {
                throw err;
            } else {
                if (user) {
                    return user;
                }
            }
        })
    },
    update: function(id, obj, callback) {
        if (callback && typeof callback == 'function') {
            User.findOneAndUpdate({ _id: id }, obj, function(err) {
                if (err) {
                    throw err;
                }
            }, callback);
        } else {
            User.findOneAndUpdate({ _id: id }, obj, function(err) {
                if (err) {
                    throw err;
                }
            });
        }
    },
    delete: function(id, callback) {
        if (callback && typeof callback == 'function') {
            User.findOneAndRemove(id, callback);
        } else {
            User.findOneAndRemove(id).exec();
        }
    }
}