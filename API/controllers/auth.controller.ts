const getUserData = async (req, res, next) => {
  try {
    res.status(200).json({
        message:"User data retrieved",
        user:req.user,
    });
  } catch (error) {
    next(error);
  }
};
const getAdminData = async (req, res, next) => {
  try {
    res.status(200).json({
        message:"Admin data retrieved",
        user:req.payload,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {getUserData,getAdminData}