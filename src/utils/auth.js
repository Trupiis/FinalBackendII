import bcrypt from "bcrypt"

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword = (pass, hash) => {
    return bcrypt.compareSync(pass, hash)}