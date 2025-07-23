// routes/auth.js
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../services/supabase');

const USERS_TABLE = 'users';
const SALT_ROUNDS = 10;

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const { error } = await supabase.from(USERS_TABLE).insert({ email, password: hash });

    if (error) return res.status(409).json({ message: 'User exists', error: error.message });
    return res.status(201).json({ message: 'User created' });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data: user } = await supabase
        .from(USERS_TABLE)
        .select('id, password')
        .eq('email', email)
        .single();

    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: 'Bad credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
});

module.exports = router;