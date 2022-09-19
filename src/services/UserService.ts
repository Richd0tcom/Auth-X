import PasswordSevice from "./PasswordService";
import User from "../models/user.model"

const register = async function(reqEmail: string, reqName: string, reqPassword: string){
    const exists = await User.findAll({
        where:{
            email: reqEmail,
        }
    });
    console.log('exists', exists);
    if (exists.length > 0) return "User already exists";

    const hashedPassword = await PasswordSevice.hash(reqPassword);

    const newUser = await User.create({
        name: reqName,
        email: reqEmail,
        password: hashedPassword
    });
    console.log("new user", newUser);
    return newUser;
}

const login = async function(email: string, password: string){
    
    const exists = await User.findAll({
        where:{
            email: email,
        }
    });

    if(exists.length < 1) return "user does not exist" 

    const pword  = exists[0].getDataValue("password")
    const decoded = await PasswordSevice.compareHash(password, pword)

    if (!decoded) return "email or password mismatch"

    const name = exists[0].getDataValue("name");
    const eemail = exists[0].getDataValue("email")
    const bio = exists[0].getDataValue("bio")
    const photo = exists[0].getDataValue("photo_url")

    return {
        name: name,
        email: eemail,
        bio: bio,
        photo: photo
    }


}

const getSingleUser = async (userId: string) => {

    try {
        const exists = await User.findAll({
            where:{
                email: userId,
            }
        });
    
        if(exists.length < 1) return "user does not exist" 
        
        const name = exists[0].getDataValue("name");
        const eemail = exists[0].getDataValue("email")
        // const bio = exists[0].getDataValue("bio")
        const photo = exists[0].getDataValue("photo_url")
    
        return {
            name: name,
            email: eemail,
            // bio: bio,
            photo: photo
        }
    } catch (error) {
        console.log(error)
    }
    
}

export { login, register, getSingleUser }