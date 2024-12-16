const jwt = require('jsonwebtoken');
const Buffer = require('buffer').Buffer;
const User = require('./user.model'); 
require('dotenv').config();

const secret = process.env.JWT_SECRET;

exports.registerUser = async (req, res) => {
    const { username, email, password, role, plan } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    try {
        
        console.log(password);
        const encodedPassword = Buffer.from(password, 'utf-8').toString('base64');

  
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        
        const newUser = new User({
            username,
            email,
            password: encodedPassword,  
            role: role || 'customer',
            plan: plan || 'Free',
        });
        console.log(password);
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const fs = require('fs');
const path = require('path');

exports.login = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Email not found' });
        }
        const decodedPassword = Buffer.from(user.password, 'base64').toString('utf-8');
        if (password !== decodedPassword) {
            return res.status(401).json({ message: 'Unauthorized: Incorrect password' });
        }

        const uploadsDir = path.join(__dirname, './uploads');

        fs.readdir(uploadsDir, (err, files) => {
            if (err) {
                console.error('Unable to scan upload folder:', err);
            } else {
                files.forEach((file) => {
                    const filePath = path.join(uploadsDir, file);
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error(`Error deleting file: ${filePath}`, unlinkErr);
                        } else {
                            console.log(`Deleted file: ${filePath}`);
                        }
                    });
                });
            }
        });

        const token = jwt.sign(
            { username: user.username, email: user.email, role: user.role, plan: user.plan },
            secret,
            { expiresIn: '24h' }
        );

        return res.json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.isLoggedIn = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user = decoded; 
        next();
    });
};

exports.updatePlan = async (req, res) => {
    const { plan } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!plan) {
        return res.status(400).json({ message: 'Plan is required' });
    }

    try {
    
        const decoded = jwt.verify(token, secret);

        const user = await User.findOneAndUpdate(
            { email: decoded.email },
            { plan },
            { new: true } 
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'Plan updated successfully', user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};