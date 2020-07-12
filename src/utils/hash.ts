import * as bcrypt from "bcrypt";

export const Hash = (str: string) => {
    return bcrypt.hashSync(str, bcrypt.genSaltSync());
}

export const PasswordsMatch = (password: string, hashed: string) => {
    return bcrypt.compareSync(password, hashed);
}