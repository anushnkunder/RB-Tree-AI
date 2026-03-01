const OperationLog = require('../models/OperationLog');
const { validateTreeType } = require('../utils/validator');
const { handleError } = require('../utils/errorHandler');

// Get operation history
const getHistory = async (req, res) => {
  try {
    const { treeType, startDate, endDate, limit = 100 } = req.query;

    const query = {};

    if (treeType) {
      query.treeType = validateTreeType(treeType);
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await OperationLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      logs,
      count: logs.length
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Clear history
const clearHistory = async (req, res) => {
  try {
    const { treeType } = req.body;

    const query = treeType ? { treeType: validateTreeType(treeType) } : {};
    const result = await OperationLog.deleteMany(query);

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} operation logs`
    });
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  getHistory,
  clearHistory
};
