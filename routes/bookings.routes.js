const express = require('express');
const router = express.Router();

// Prefer a single controllers location (adjust this to your real structure)
const ctrl = require('../user/controllers/bookings.controller'); // <-- path normalized

const { requireAuth } = require('../middlewares/authMiddleware');
const { paymentLimiter, statusLimiter } = require('../middlewares/rateLimiter');

// Simple sanity checks so you fail fast on bad imports
function must(name, fn) {
  if (typeof fn !== 'function') throw new Error(`User bookings: handler ${name} is not a function`);
}
must('listMyBookings', ctrl.listMyBookings);
must('getMyBookingById', ctrl.getMyBookingById);
must('createBooking', ctrl.createBooking);
must('initiatePayPhiPayment', ctrl.initiatePayPhiPayment);
must('checkPayPhiStatus', ctrl.checkPayPhiStatus);

// Centralized numeric ID validation
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'Invalid booking id' });
  const num = Number(id);
  if (num <= 0) return res.status(400).json({ error: 'Invalid booking id' });
  req.params.id = num;
  next();
});

// User bookings (current user context)
router.get('/', requireAuth, ctrl.listMyBookings);
router.get('/:id', requireAuth, ctrl.getMyBookingById);

// Create booking (currently auth-only per your note)
router.post('/', requireAuth, ctrl.createBooking);

// PayPhi
router.post(
  '/:id/pay/payphi/initiate',
  requireAuth,
  paymentLimiter,
  ctrl.initiatePayPhiPayment
);

// Use a lighter limiter for polling; if you don't have statusLimiter, reuse paymentLimiter
router.get(
  '/:id/pay/payphi/status',
  requireAuth,
  statusLimiter || paymentLimiter,
  ctrl.checkPayPhiStatus
);

module.exports = router;