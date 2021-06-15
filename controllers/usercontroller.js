const router = require("express").Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors")

router.post("/register", async (req, res) => {
    
    let { username, password } = req.body.user;
    try{

   const User = await UserModel.create({
        username, 
        password
    });
    res.status(201).json({
        message: "User successfully registered",
        user: User
    });
    } catch (err) {
        if (err instanceof UniqueContraintError) {
            res.status(409).json({
                message: "Email already in use",
            });
        } else {
        res.status(500).json({
            message: "Failed to register user"
        });
    }
    }
});

module.exports = router;