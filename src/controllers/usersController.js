const bcrypt = require('bcrypt')
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')
const userQueries = require('./queries/userQueries')
const { transporter } = require('../utils/emailConfig');
const User = require('../models/usersModel');

//Get allUsers From db

const getAllUsers = (req, res) => {
    console.log(req.body)

    // pool.query(userQueries.getAllUsers, (err, result) => {
    //     if (err) throw err
    res.status(200).json({ success: true, message: "All Users Fetched" })
    // })

}

//Get Register User In db

const registerUser = asyncHandler(async (req, res) => {
    const { username, name, email, password, confirmPassword, phone, pic = "" } = req.body;
    if (!name || !email || !password || !confirmPassword || !phone) {
        res.status(400).json({ success: false, message: "Please enter all mandatory feilds." });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ success: false, message: "User already exists" });
    }
    if (password === confirmPassword) {
        // Hasing the password before saving into db 
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const user = await User.create({
            username,
            name,
            email,
            password: hashPassword,
            phone,
            pic,
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: "User Stored",
                data: {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    pic: user.pic
                }
            });
        } else {
            res.status(400).json({ success: false, message: "User not found" });
        }
    } else {
        res.json({ success: false, message: "password and confirm Password did not matched" })
    }
})

//Check User and provide login JWT token

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    console.log(req.body)
    if (username && password) {
        const user = await User.findOne({ $or: [{ email: username }, { username }] })
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                const token = jwt.sign({
                    userId: user._id, username: user.username, email: user.email
                },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: '5d'
                    })

                res.json({
                    success: true,
                    message: "Success",
                    data:
                    {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        pic: user.pic,
                        access_token: token
                    }
                }
                );
            } else {
                res.json({ success: false, message: "Invalid username or password" })
            }
        } else {
            res.status(401).json({ success: false, message: "User not found" });
        }
    } else {
        res.json({ success: false, message: "All Feilds Required for login" })
    }
})


// Change Password for authenticated user

const changePassword = async (req, res) => {
    // const { id, username } = req.user
    // const { password, confirmPassword } = req.body
    // if (password === confirmPassword) {
    //     const salt = await bcrypt.genSalt(10)
    //     const hashPassword = await bcrypt.hash(password, salt)
    //     pool.query(userQueries.updateUserPassword, [hashPassword, id], (err, result) => {
    //         if (err) throw err
    //         res.json({ success: true, message: `Password updated for ${username}` })
    //     })
    // } else {
    //     res.json({ success: false, message: "password and confirm Password did not matched" })
    // }
}


// Get Logged in user Information

const loggedInUserInProfile = (req, res) => {
    let data = req.user    // Getting user
    delete data['password']   // deleting passwrod feild from the user recieved
    res.status(200).send(data)  // Sending response with updated user Information
}


// Send userpassword reset email

const sendUserPasswordResetEmail = (req, res) => {
    // const { email } = req.body
    // if (email) {
    //     pool.query(userQueries.checkEmail, [email], async (err, result) => {
    //         if (err) throw err
    //         if (result.rows.length) {
    //             const secret = result.rows[0].id + process.env.JWT_SECRET_KEY
    //             const signToken = jwt.sign({ userId: result.rows[0].id }, secret, { expiresIn: '5m' })
    //             const link = `http://127.0.0.1:3000/api/v1/users/sendUserPasswordResetEmail/${result.rows[0].id}/${signToken
    //                 }`
    //             const mailOptions = {
    //                 from: `"Divyansh kumar sharma" <${process.env.EMAIL_FROM}>`, // sender address
    //                 to: `<${result.rows[0].email}>`, // list of receivers
    //                 subject: "Divyansh - Password Reset Link", // Subject line
    //                 text: "This is your Password Reset Link", // plain text body
    //                 html: `<a href=${link}>Click Here !</a>`, // html body
    //             };
    //             transporter.sendMail(mailOptions, function (error, info) {
    //                 if (error) {
    //                     console.log(error);
    //                 } else {
    //                     console.log('Email sent: ' + info.response);
    //                     res.json({ success: true, message: "Reset mail sent please check your mail", id: result.rows[0].id, token: signToken, info: info })
    //                 }
    //             });
    //         } else {
    //             res.json({ success: false, message: "Your Email Not Found Please Register" })
    //         }
    //     })
    // } else {
    //     res.json({ success: false, message: "ALl Feilds are Required" })
    // }
}



// Get password and confirm password from reset email 

const userPasswordResetWithEmail = (req, res) => {
    // const { password, confirmPassword } = req.body
    // const { id, token } = req.params
    // pool.query(userQueries.geUserById, [id], async (err, result) => {
    //     if (err) throw err
    //     if (result.rows.length) {
    //         const secret = result.rows[0].id + process.env.JWT_SECRET_KEY
    //         try {
    //             jwt.verify(token, secret)
    //             if (password && confirmPassword) {
    //                 if (password === confirmPassword) {
    //                     const salt = await bcrypt.genSalt(10)
    //                     const hashPassword = await bcrypt.hash(password, salt)
    //                     pool.query(userQueries.updateUserPassword, [hashPassword, id], (err, result) => {
    //                         if (err) throw err
    //                         res.json({ success: true, message: `Password updated` })
    //                     })
    //                 } else {
    //                     res.json({ success: false, message: "Password and confirm Password not Matched" })
    //                 }
    //             } else {
    //                 res.json({ success: false, message: "All Feilds Required" })
    //             }
    //         } catch {
    //             res.send({ success: false, message: "Expired or Invalid Token" })
    //         }
    //     } else {
    //         res.json({ success: false, message: "Invalid! User not found" })
    //     }
    // })
}


module.exports = {
    getAllUsers,
    registerUser,
    loginUser,
    changePassword,
    loggedInUserInProfile,
    sendUserPasswordResetEmail,
    userPasswordResetWithEmail
}