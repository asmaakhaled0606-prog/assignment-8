import userModel from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import * as dbService from "../../DB/db.service.js"



export const authentication = async (req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) {
        throw new Error("token doesn't exist", { cause: 404 })
    }

    const decoded = jwt.verify(authorization, "asmaa123")

    if (!decoded?.id) {
        throw new Error("invalid token", { cause: 400 })
    }

    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: decoded.id }
    });

    if (!user) {
        throw new Error("user doesn't exist", { cause: 400 })
    }

    req.user = user

    next()
}