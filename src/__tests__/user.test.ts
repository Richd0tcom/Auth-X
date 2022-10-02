import supertest from "supertest"
import app from "../app"
describe('user', () => { 
    describe('login route', () => { 
        describe('given the user does not exist', () => { 
            it("should return a 404 status code", async() => {
                await supertest(app).post("/login").expect(404)
                
            })
        })
     })
 })