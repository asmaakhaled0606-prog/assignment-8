import { compareSync, hashSync } from "bcrypt"


export const Hash = async (plainText, SALT_ROUNDS = 12) => {
    return hashSync(plainText, SALT_ROUNDS);
}

export const Compare = async (plainText, cipherText = 12) => {
    return compareSync(plainText, cipherText);
}

