/**
 * Created by dev on 8/3/15.
 */
var mongoose = require('./mongoose');

var validateEmail = function(email) {
    var emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailregex.test(email);
}
var validatePhone = function(phone) {
    var phoneregex = /^\(?([0-9]{3})\)?([ -]?)([0-9]{3})\2([0-9]{4})$/;
    return phoneregex.test(phone);
}

var schema = new mongoose.Schema({
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
module.exports = mongoose.model('User', schema);