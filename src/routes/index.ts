//export { default as stations } from "./stations.js";
import cookieParser from 'cookie-parser';
import AuthService from '@services/authService.js';
import NetworkService from '@services/networkService.js';
import express, {Request, Response, NextFunction} from 'express';
import stationsRouter from './stations.js';
import fuelsRouter from './fuels.js';
import busboy from 'connect-busboy';

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

router.post('/uploadexcel', busboy({immediate:true}), async (req:Request, res:Response, next:NextFunction) => {
  if (!req.busboy) throw new Error('file binary data cannot be null');
  let fileData: Buffer | null = null;
  let token: string | null = null;
  req.busboy.on('file', (fieldName, file) => {
    file.on('data', (data) => {
      if (fileData === null) {
        fileData = data;
      } else {
        fileData = Buffer.concat([fileData, data]);
      }
    });
  });
  req.busboy.on('field', (fieldName, value) => {
    if (fieldName === 'token') {
      token = value;
    }
  });
  req.busboy.on('finish', async () =>{
    if (!fileData) next(new Error('file binary data cannot be null'));
    //if (!token) next(new Error('No security token was passed'));
    //TODO: use your parsed parameters to complete the request
    console.log(fileData);
    const response = await NetworkService.uploadExcel(fileData!);
    res.send(response.data);
  });
  //console.log(req);
  // const response = await NetworkService.uploadExcel();
  // res.send(response);
  //res.send("ok");
});

export default router;