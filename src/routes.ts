import { Express, Request, Response } from 'express';
import { login, register} from './services/UserService'

function routes(app: Express) {

    app.get('/ss', async (req: Request, res: Response) => {
        res.sendStatus(200);
    });

    //register
    app.post('/register', async (req: Request, res: Response) => {

        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        try {
            const resp = await register(email, name, password)

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

    app.post('/login', async (req: Request, res: Response) => {

        const email = req.body.email;
        const password = req.body.password;

        try {
            
            const resp = await login(email, password)

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

    })
}

export default routes;