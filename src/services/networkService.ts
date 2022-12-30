import Area from "@util/interfaces/Area";
//import Station from "@util/interfaces/Station";
import http from "node:http";
import axios, { AxiosResponse } from "axios";

class NetworkService {
  // private static readonly auth = axios.create({
  //   proxy: {
  //     protocol: 'http',
  //     host: 'auth',
  //     port: 8081,
  //   }
  // });
  // private static readonly db = axios.create({
  //   proxy: {
  //     protocol: 'http',
  //     host: 'db',
  //     port: 8082,
  //   },
  // });
  private static readonly auth = axios.create({
    baseURL: 'http://auth/'
  })
  private static readonly db = axios.create({
    baseURL: 'http://db/'
  });
  private static readonly places = axios.create({
    baseURL: 'http://places/'
    // proxy: {
    //   protocol: 'http',
    //   host: 'places',
    //   port: 8083,
    // }
  });

  public static readonly getStationsFromDB = async (area:Area) => {
    return await this.db.get('/stations',
      {
        params:{
          north:area.north,
          south:area.south,
          west:area.west,
          east:area.east
          //key: readSecret('API_KEY') || process.env.API_KEY,
          //key: environment.googlemaps.api_key,
          //location: `${lat},${lng}`
        }
      }
    );
    // let result = http.get({host:'auth', port: 8081}, (authResponse) => {
    //   if (authResponse.statusCode !== 200) {
    //     return authResponse.statusCode;
    //   } else {
    //     let rawData = '';
    //     authResponse.on('data', (chunk) => { rawData += chunk; });
    //     authResponse.on('end', () => {
    //       try {
    //         const parsedData = JSON.parse(rawData);
    //         return parsedData;
    //       } catch (e:any) {
    //         console.error(e.message);
    //       }
    //     });
    //   }
    // });
  }
  public static readonly getStationsFromMap = async (area:Area) => {
    return await this.places.get('/stations', {
      params: {
        lat: (area.north + area.south) / 2,
        lng: (area.east + area.west) / 2
      }
    })
  }
  public static readonly getFuelList = async () => {
    // let response = http.get('http://db/fuels',(response)=>{
    // console.log("fuels");  
    // console.log(response);
    //   return response;
    // });
    // return response;
    // console.log("getFuelList");
    // console.log(this.db);
    // console.log(this.db.getUri({url:'/fuels'}));
    return await this.db.get('/fuels');
  }
  public static readonly getPaymentList = async () => {
    // let response = http.get('http://db/payments',(response)=>{
    //   console.log("payments");  
    // console.log(response);
    //   return response;
    // });
    // return response;
    // console.log("getPaymentList");
    // console.log(this.db);
    // console.log(this.db.getUri({url:'/payments'}));
    return await this.db.get('/payments');
  }

  public static readonly postPrice = async (priceData: any) => {
    return await this.db.post('/stations/price',priceData);
  }

  public static readonly updateStations = async () => {
    return await this.db.get('/stations/update');
  }

  public static readonly isAuthenticated = async () => {
    return await this.auth.get('/');
  }
  
  public static readonly googleAuth = async (body: any, cookie: any) => {
    return await this.auth.post('/googleauth', body, {headers:{Cookie:cookie}});
  }
  
  public static readonly refreshToken = async (cookie: string | undefined, origin: string | undefined) => {
    return await this.auth.get('/refreshtoken',{
      headers:{
        Cookie:cookie,
        origin:origin
      }
    });
  }
  public static readonly logout = async () => {
    return await this.auth.post('/logout');
  }
}

export default NetworkService;