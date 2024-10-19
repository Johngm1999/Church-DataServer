const { check } = require("express-validator");

exports.logincheck = [
    check("USERNAME").notEmpty().withMessage("Username can not be blank"),
    check("PASSWORD")
        .notEmpty()
        .isLength({
            min: 6,
        })
        .withMessage("Please check your password"),
];

exports.paginator = [
    check("page").notEmpty().withMessage("page number is missing"),
];
