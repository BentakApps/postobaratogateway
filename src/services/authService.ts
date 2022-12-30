import express from "express";
import NetworkService from "@services/networkService.js";

class AuthService {
  public static readonly isAuthenticated = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const authResponse = await NetworkService.isAuthenticated( );
    if (authResponse.status !== 200) {
      return authResponse.status;
    } else {
      try {
        return next();
      } catch (e:any) {
        return next(e.message);
      }
    }
  }
  // public static readonly isAuthenticated = (req:express.Request, res:express.Response, next:express.NextFunction) => {
  //   http.get({host:'auth', port: 8081}, (authResponse) => {
  //     if (authResponse.statusCode !== 200) {
  //       return authResponse.statusCode;
  //     } else {
  //       let rawData = '';
  //       authResponse.on('data', (chunk) => { rawData += chunk; });
  //       authResponse.on('end', () => {
  //         try {
  //           return next();
  //           const parsedData = JSON.parse(rawData);
  //           res.json(parsedData);
  //         } catch (e:any) {
  //           return next(e.message);
  //           console.error(e.message);
  //         }
  //       });
  //     }
  //   });
  // }
}

export default AuthService;