const Joi = require('joi');
const AppError = require("./AppError");

const regSchema = Joi.object({
    user_name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string().min(8).required(),

    repeat_password: Joi.ref('password'),

    email: Joi.string().email().required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    
    password: Joi.string().min(8).required()  
});

const changePassSchema = Joi.object({
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.ref('newPassword'),
});

const validateReg = async (req, res, next) => {
    req.body.email = req.body.email.toLowerCase();
    const { user_name, email, password, repeat_password } = req.body;
    const {error} = regSchema.validate({ user_name, email, password, repeat_password });
    if(error){
        return next(new AppError(error?.message, 400,error?.details));
    }
    
    next();
};

const validateLogin = async (req, res, next) => {
    req.body.email = req.body.email.toLowerCase();
    const { email, password } = req.body;
    const {error} = loginSchema.validate({  email, password });
    if(error){
        return next(new AppError(error?.message, 400,error?.details));
    }
    next();
};

const validateChangePass = async (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;
    const {error} = changePassSchema.validate({ newPassword, confirmPassword });
    if(error){
        return next(new AppError(error?.message, 400,error?.details));
    }
    next();
};
module.exports = { validateReg, validateLogin, validateChangePass };
  
