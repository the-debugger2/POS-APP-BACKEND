const subscriptionMiddleware = async(
    req,
    res,
    next
) => {

    try {

        const user = req.user;

        if (!user.isActive) {

            return res.status(403).json({
                message: "Account disabled"
            });

        }

        if (
            user.subscriptionStatus !== "active"
        ) {

            return res.status(403).json({
                message: "Subscription inactive"
            });

        }

        if (
            new Date() >
            new Date(user.subscriptionExpiry)
        ) {

            return res.status(403).json({
                message: "Subscription expired"
            });

        }

        next();

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports =
    subscriptionMiddleware;