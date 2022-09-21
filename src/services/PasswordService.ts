import bcrypt from "bcrypt";

const PasswordSevice = { 
    hash:async function (password: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },

    compareHash : async function (password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

export default PasswordSevice;