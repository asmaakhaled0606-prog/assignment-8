import userModel from "../../DB/models/user.model.js"
import * as dbService from "../../DB/db.service.js"
import { Decrypt, Encrypt } from "../../common/security/encrypt.js";
import { Compare, Hash } from "../../common/security/hash.js";


export const signUp = async (req, res, next) => {

    const { fName, lName, email, password, age, gender, phone } = req.body;

    if (await userModel.findOne({ email: email.toLowerCase() })) {
        throw new Error("email already exists")
    }
    const user = await dbService.create({
        model: userModel,
        data: { fName, lName, email, password: await Hash(password), age, gender, phone: Encrypt(phone) }
    })
    return res.status(201).json({ message: "user created", user })
}


export const signIn = async (req, res, next) => {

    const { email, password } = req.body;

    const user = await dbService.findOne({
        model: userModel,
        filter: { email: email.toLowerCase(), provider: "system" }
    });
    if (!user) {
        throw new Error("email doesn't exist or you can login where you signed up", { cause: 400 })
    }

    // if (user.isConfirmed !== true ){
    //    return res.status(404).json({ message:"email not confirmed" })
    // }

    if (!await Compare(password, user.password)) {
        throw new Error("inValid password")
    }
    return res.status(200).json({ message: "done", user: { ...user._doc, phone: Decrypt(user.phone) } })
}

