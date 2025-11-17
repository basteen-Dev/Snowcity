const express = require('express');
const router = express.Router();

const { defaultLimiter } = require('../middlewares/rateLimiter');

// If you do NOT want admin rate-limited, mount it before the limiter:
router.use('/admin', require('../admin/routes'));

// Global rate limiter for public API (applies to everything after this line)
router.use(defaultLimiter);

// Public/user routes
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./users.routes'));
router.use('/attractions', require('./attractions.routes'));
router.use('/slots', require('./slots.routes'));
router.use('/bookings', require('./bookings.routes'));
router.use('/addons', require('./addons.routes'));
router.use('/combos', require('./combos.routes'));
router.use('/coupons', require('./coupons.routes'));
router.use('/offers', require('./offers.routes'));
router.use('/banners', require('./banners.routes'));
router.use('/pages', require('./pages.routes'));
router.use('/blogs', require('./blogs.routes'));
router.use('/gallery', require('./gallery.routes'));
// Health and base
router.get('/_health', (req, res) => res.json({ api: 'SnowCity', version: '1.0.0', ok: true }));
router.get('/', (req, res) => res.json({ api: 'SnowCity', version: '1.0.0' }));

module.exports = router;
