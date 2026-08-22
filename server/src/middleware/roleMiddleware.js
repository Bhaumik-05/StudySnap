const roleMiddleware = (...allowedRole) => {
    return (req, res, next) => {
        if(!req.user )
        {
            return res.status(401).json({ message: "Authentication required", });
        }
        if(!allowedRole.includes(req.user.role)) {
        return res.status(403).json({ message: "You are not authorized to perform this action", });
        }
        next();
    };
};

export default roleMiddleware;