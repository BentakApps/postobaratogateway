//export { default as stations } from "./stations.js";
import cookieParser from 'cookie-parser';
import AuthService from '@services/authService.js';
import NetworkService from '@services/networkService.js';
import express, {Request, Response, NextFunction} from 'express';
import stationsRouter from './stations.js';
import fuelsRouter from './fuels.js';


const router = express.Router();

//sub-routes
router.use('/stations', stationsRouter);
router.use('/fuels', fuelsRouter);

//public routes
router.get('/payments', async (req: Request, res: Response, next: NextFunction) => {
  const payments = await NetworkService.getPaymentList();
  res.json(payments.data);
});

router.use(cookieParser());

router.post('/googleauth', async (req: Request, res: Response, next: NextFunction) => {
  const response = await NetworkService.googleAuth(req.body, req.headers?.cookie);
  res.header('set-cookie', response.headers['set-cookie']);
  res.json(response.data);
});

router.get('/refreshtoken', async (req: Request, res: Response, next: NextFunction) => {
  // console.log("HOST:", req.get('host'));

  // console.log("HOST0:", req.get('X-Forwarded-Host'));
  // console.log(req.headers);
  NetworkService.refreshToken(req.headers?.cookie,req.get('origin'))
    .then(response => {
      res.header('set-cookie', response.headers['set-cookie']);
      res.json(response.data);
    })
    .catch(error => {
      res.status(error.response.status).end();
    });
});
//authenticated routes
//router.use(AuthService.isAuthenticated);

router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  NetworkService.logout()
    .then(response => {  
      res.header('set-cookie', response.headers['set-cookie']);
      res.end();
    })
    .catch(error => {
      res.status(error.response.status).end();
    });
});

export default router;