const { rateLimit } = require('express-rate-limit');

const postLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = postLimiter