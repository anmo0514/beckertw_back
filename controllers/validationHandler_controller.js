const {validationResult}  = require("express-validator");

const validation_result = validationResult.withDefaults({
    formatter: (error) => error.msg,
});

const validate = (req, res, next) => {
    /**
     * Middleway to handle error message from express-validator's body validator.
     */
    const errors = validation_result(req).mapped();
    if (Object.keys(errors).length) {
        return res.status(422).json({
            status: 422,
            errors,
        });
    }
    next();
};

module.exports = {
    validate,
}