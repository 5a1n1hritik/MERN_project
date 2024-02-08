
const express =require('express')
const User = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')
const router = express.Router();

router.post('/register', async (req, res)=>{
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
            success: false,
            message: 'Please provide all required fields (name, email, password)',
            });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a strong password (min 8 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character)'
            });
        }

    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            avatar: {
                public_id: 'Sample id',
                url: 'profilePicUigtrl'
            }
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN 
        });
        res.status(201).json({
            success: true,
            token,
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Please try to login with correct credentials'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Please try to login with correct credentials'
            });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN 
        });
        res.cookie('jwtToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', 
            maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 
        });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email 
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});


router.post('/getuser', fetchuser, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      res.json(user); 
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
});



module.exports = router
