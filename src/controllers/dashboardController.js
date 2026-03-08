const dashboardService = require("../services/dashboardService");

exports.getOverview = async (req, res, next) => {
  try {
    const stats = await dashboardService.getOverviewStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
