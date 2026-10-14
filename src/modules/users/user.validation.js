import joi from "joi";


export const signUpSchema = {

    body: joi.object({
        fName: joi.string().alphanum().min(2).max(10).required().messages({
            "any.required": "where is fname",
            "string.min": "name is too short"
        }),
        lName: joi.string().required(),
        email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 2 }).required(),
        password: joi.string().required(),
        gender: joi.string().valid("male", "female").required(),
        cPassword: joi.string().valid(joi.ref("password")).required(),
        age: joi.number().required(),
        // flag: joi.boolean().falsy(0,"no","n").truthy(1,"yes","y").sensitive()
    }).required(),

    query: joi.object({
        flag: joi.boolean().required()
    })
}

export const signInSchema = {

    body: joi.object({
        email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 2 }).required(),
        password: joi.string().required()
    })
}