import bcrypt from "bcrypt";

// module.exports = {
//   /**
//    * Hash password
//    * @param {String} password password string to hash
//    * @returns {Promise.<String>} hashed password
//    */
// //   hash: async function (password: string) {
// //     const salt = await bcrypt.genSalt(10);
// //     return await bcrypt.hash(password, salt);
// //   },
//   /**
//    * Compare hashed password with password string
//    * @param {String} password password string
//    * @param {String} hashedPassword hashed password
//    * @returns {Promise.<Boolean>} return true if hashed password match with password string else return false
//    */
// //   compareHash: async function (password: string, hashedPassword: string) {
// //     return await bcrypt.compare(password, hashedPassword);
// //   },
// };



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