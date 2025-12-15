const Technician = require('../technician/technician.model');
const UserAccount = require('../../userAccount/userAccount.model');
const UserService = require('../../user/userService/userService.model');

exports.dashboardCharts = async (req, res, next) => {
    try {
        const technicianCounts = await Technician.countDocuments();
        const userAccountCounts = await UserAccount.countDocuments({ accountVerification: 'verified' });
        const userServiceCounts = await UserService.countDocuments();
        res.status(200).json({
            technicianCounts: technicianCounts,
            userAccountCounts: userAccountCounts,
            userServiceCounts: userServiceCounts
        })
    } catch (err) {
        next(err)
    }
}