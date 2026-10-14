import userModel from "../../DB/models/user.model.js"
import * as dbService from "../../DB/db.service.js"
import { Decrypt, Encrypt } from "../../common/security/encrypt.js";
import { Compare, Hash } from "../../common/security/hash.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import { ProviderEnum } from "../../common/enum/user.enum.js";
const client = new OAuth2Client();
import joi from "joi";


export const signUp = async (req, res, next) => {

    const signUpSchema = joi.object({
        fName: joi.string().required(),
        lName: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
    }).required()

    const { error } = signUpSchema.validate(req.body, { abortEarly: false })
    if (error) {
        return res.status(400).json({ message: "validation error", error })
    }

    // const { fName, lName, email, password, age, gender, phone } = req.body;

    // if (await userModel.findOne({ email: email.toLowerCase() })) {
    //     throw new Error("email already exists")
    // }

    // const user = await dbService.create({
    //     model: userModel,
    //     data: { fName, lName, email, password: await Hash(password), age, gender, phone: Encrypt(phone) }
    // })

    return res.status(201).json({ message: "user created" })
}


export const signUpWithGmail = async (req, res, next) => {

    const { idToken } = req.body;

    const decoded = await client.verifyIdToken({
        idToken,
        audience: "886829864656-4bufqr0kgejpiapl510v1a9k60fmoo72.apps.googleusercontent.com",
    });

    const { family_name, given_name, picture, email_verified, email } = decoded.getPayload();

    let user = await userModel.findOne({ email: email.toLowerCase() })

    if (!user) {
        user = await userModel.create({
            fName: given_name,
            lName: family_name,
            email: email,
            profileImage: picture,
            isConfirmed: email_verified,
            provider: ProviderEnum.google
        })
    }

    if (user.provider == ProviderEnum.system) {
        throw new Error("login with system only", { cause: 400 })
    }

    const access_token = jwt.sign({ id: user._id, email: user.email }, "asmaa123", {
        expiresIn: 60 * 5,
    })

    const refresh_token = jwt.sign({ id: user._id, email: user.email }, "khaled123")

    return res.status(200).json({ message: "done", tokens: { access_token, refresh_token } })
}



export const signIn = async (req, res, next) => {

    const { email, password } = req.body;

    const user = await dbService.findOne({
        model: userModel,
        filter: { email: email.toLowerCase(), provider: ProviderEnum.system }
    });
    if (!user) {
        throw new Error("email doesn't exist or you can login where you signed up", { cause: 400 })
    }

    if (!await Compare(password, user.password)) {
        throw new Error("inValid password")
    }

    const access_token = jwt.sign({ id: user._id, email: user.email }, "asmaa123", {
        expiresIn: 60 * 5,
        audience: "http://localhost:4000",
        issuer: "http://localhost:3000",
        notBefore: 30,
        noTimestamp: true
    })
    const refresh_token = jwt.sign({ id: user._id, email: user.email }, "khaled123")


    return res.status(200).json({ message: "done", tokens: { access_token, refresh_token } })
}


export const getProfile = async (req, res, next) => {

    return res.status(200).json({ message: "done", user: req.user })
}




