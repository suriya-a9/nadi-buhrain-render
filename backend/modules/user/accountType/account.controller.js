const Account = require("./account.model");

exports.addAccountType = async (req, res, next) => {
  const { name, type } = req.body;
  try {
    const accountTypeData = await Account.create({ name, type });
    res.status(201).json({
      message: "Account type created",
      data: accountTypeData,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAccountType = async (req, res, next) => {
  const { id, ...updateFields } = req.body;
  try {
    const updateAccount = await Account.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    )
    res.status(200).json({
      message: 'Updated successfully',
      data: updateAccount
    })
  } catch (err) {
    next(err);
  }
}

exports.listAccountType = async (req, res, next) => {
  try {
    const accountTypeList = await Account.find();
    res.status(200).json({
      data: accountTypeList
    })
  } catch (err) {
    next(err);
  }
}

exports.deleteAccountType = async (req, res, next) => {
  const { id } = req.body;
  try {
    await Account.findByIdAndDelete(id);
    res.status(200).json({
      message: 'Deleted successfully'
    })
  } catch (err) {
    next(err);
  }
}