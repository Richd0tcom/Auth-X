
import supertest from "supertest"
import app from "../app";
import UserService from "../services/UserService";


describe('user', () => {
    
    describe('login route', () => { 
        describe('given the user does not exist', () => { 
            it("should return a 404 status code", async() => {
                await supertest(app).post("/login").expect(404)
                
            })
        })
    });
    describe("register route", ()=> {
        
        const service = new UserService();
        const userInput = {
            name: "John Doe",
            email: "ligmaballs@gmail.com",
            password: "abacus123"
        }
        const passwordhash = 3
        const userResponse = {
            name: "John Doe",
            email: "ligmaballs@gmail.com",
        }
        describe("given the inputs are valid", ()=>{
            test("should return a user payload", async()=>{
                
                // const mockCreateUser = jest.spyOn(service, "register")
                // //@ts-ignore
                // .mockReturnValueOnce(userResponse)

                // const { statusCode, body } =  await supertest(app).post("/api/v1/users/register").send(userInput);
                // expect(statusCode).toBe(200);
                // expect(body.data).toContain("John Doe");
                // expect(body).toContain("ligmaballs@gmail.com");
                // expect(mockCreateUser).toHaveBeenCalledWith(userInput);
            })
        })
    })
 })