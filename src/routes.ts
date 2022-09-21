import { Express, Request, Response } from 'express';
import { login, register} from './services/UserService';
import DevService from './services/DevService';
import validate from './middleware/validateResource';
import { registerUserHandler, userLoginHandler, userUpdateHandler } from './controllers/user.controller';
import { createUserSchema } from './schema/user.schema';



function routes(app: Express) {

    app.get('/ss', async (req: Request, res: Response) => {
        res.sendStatus(200);
    });

    //user routes
    app.post('/register', validate(createUserSchema), registerUserHandler);

    app.post('/login', userLoginHandler);

    app.put("/updateuser", userUpdateHandler);

    app.post('/logout', async (req: Request, res: Response) => {

        try {
            req.session.isAuth = false
            req.session.user = req.body.email
            req.session.destroy(()=> {
                console.log("session cleared")
                console.log(req.session)
                return res.status(200).json({
                    status: "success"
                })
            })
            

        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: "failed",
            })
        }

    })

    //dev routes
    app.post('/dev/register', async (req: Request, res: Response) => {

        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        try {
            const devService = new DevService()
            const resp = await devService.register(email, name, password)

            if(typeof resp == "string"){
                return res.status(400).json({
                    status: "failed",
                    data: resp,
                })
            }

            return res.status(200).json({
                status: "success",
                data: resp,
            })

        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: "failed",
                data: error,
            })
        }

    });


    app.post('/dev/login', async (req: Request, res: Response) => {

        const devService = new DevService()
        const email = req.body.email;
        const password = req.body.password;

        try {

            const resp = await devService.login(email, password)

            if(typeof resp == "string"){
                return res.status(400).json({
                    status: "failed",
                    data: resp,
                })
            }
            req.session.isDev = true
            req.session.devId = resp.dev_id
            console.log(req.session)
            return res.status(200).json({
                status: "success",
                data: resp,
            })

        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: "failed something went wong",
                data: error,
            })
        }

    })

    app.post('/dev/createproduct', async (req: Request, res: Response) => {

        const devService = new DevService()
        const pname = req.body.product_name;
        const dvId = req.session.devId;

        try {
            if(req.session.isDev){
                const resp = await devService.createProduct(pname, dvId as string)

                if(typeof resp == "string"){
                    return res.status(400).json({
                        status: "failed",
                        data: resp,
                    })
                }

                return res.status(200).json({
                    status: "success",
                    data: resp,
                })
            } else {
                return res.status(400).send("you are not authorized to modify this resource")
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: "failed something went wong",
                data: error,
            })
        }
        
    })
}

export default routes;