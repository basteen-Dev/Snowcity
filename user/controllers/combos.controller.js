const comboService = require('../../services/comboService');
const comboSlotService = require('../../services/comboSlotService');

// GET /api/combos
exports.listCombos = async (req, res, next) => {
  try {
    const active = req.query.active === undefined ? null : String(req.query.active).toLowerCase() === 'true';
    const data = await comboService.list({ active });
    res.json({ data, meta: { count: data.length } });
  } catch (err) {
    next(err);
  }
};

// GET /api/combos/:id
exports.getComboById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const row = await comboService.getById(id);
    res.json(row);
  } catch (err) {
    next(err);
  }
};

// GET /api/combos/:id/slots
exports.listComboSlots = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid combo id' });
    }

    const { date = null, start_date = null, end_date = null } = req.query || {};
    const data = await comboSlotService.list({ combo_id: id, date, start_date, end_date });
    res.json({ data, meta: { count: data.length } });
  } catch (err) {
    next(err);
  }
};