const mongoose = require ('mongoose'); 
const {Schema} = mongoose; 
const validator = require ('validator'); 
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const contactSchema = new Schema({
    name:{
        first: {
            type: String, 
            required: true
        }, 
        last: {
            type: String, 
            required: true
        }
    }, 
    phone: {
        cell: {
        type: String,
        required: false,
        hasText:{
            type: Boolean, 
            required: true
        }, 
        validate: {
          validator: (value) => {
            if (!value) return true; 
            const phone = parsePhoneNumberFromString(value); 
          return phone && phone.isValid(); 
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
    }, 
    home: {
        type: String, 
        required: false, 
        validate: {
            validator: (value) => {
                if (!value) return true; 
                const phone = parsePhoneNumberFromString(value);
                return phone && phone.isValid();
            }, 
            message: (props) => `${props.value} is not a valid number`
        }
    }
}, 
    email: {
        type: String, 
        required: false, 
        validate: {
                validator: function (value) {
                    if (!value) return true;
                  return validator.isEmail(value);
                },
                message: (props) => `${props.value} is not a valid email address!`,
              },
        }, 
        isAdmin: {
          type: Boolean, 
          default: false, 
          required: true
        }
});

contactSchema.pre('save', function (next) {
    if (this.phone && this.phone.cell) {
      this.phone.cell = this.phone.cell.replace(/\D/g, ''); // Remove non-numeric characters
    }
    if (this.phone && this.phone.home) {
      this.phone.home = this.phone.home.replace(/\D/g, ''); // Remove non-numeric characters
    }
    next();
  });
  

const Contact = mongoose.model('Contact', contactSchema); 
module.exports = Contact