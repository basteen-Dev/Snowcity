const router = require('express').Router();
const ctrl = require('../controllers/cart.controller');
const { optionalAuth, requireAuth } = require('../../middlewares/authMiddleware');
const { paymentLimiter } = require('../../middlewares/rateLimiter');

function ensureItemId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid cart item id' });
  req.params.id = id;
  next();
}

router.get('/', optionalAuth, ctrl.listCart);
router.post('/items', optionalAuth, ctrl.addItem);
router.put('/items/:id', optionalAuth, ensureItemId, ctrl.updateItem);
router.delete('/items/:id', optionalAuth, ensureItemId, ctrl.removeItem);

// PayPhi
router.post('/pay/payphi/initiate', requireAuth, paymentLimiter, ctrl.initiatePayPhi);
router.get('/pay/payphi/status', requireAuth, paymentLimiter, ctrl.checkPayPhiStatus);

// Optional: finalize after payment if webhook is delayed
router.post('/checkout/finalize', requireAuth, ctrl.finalizeCheckout);

module.exports = router;