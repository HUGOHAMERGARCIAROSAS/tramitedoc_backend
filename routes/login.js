const express = require('express');

const router = express.Router();
const { loginUser, authUser } = require('../controllers/login');
const checkAuth = require('../middleware/checkAuth');

router.post('/',loginUser);
router.get('/auth',checkAuth,authUser);

module.exports = router;
