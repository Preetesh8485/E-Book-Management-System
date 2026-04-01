import ErrorHandler from "./errorMiddlewear.js";

export const validateBody = (req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method)) {

        // 🔥 If body is missing or empty → set default {}
        if (!req.body || Object.keys(req.body).length === 0) {
            req.body = {}; // ✅ force empty object
        }
    }

    next();
};