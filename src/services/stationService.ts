import Area from '@util/interfaces/Area';
import NetworkService from '@services/networkService.js'

class StationService {
  public static readonly getStations = async (north:number, south:number, east:number, west:number) => {
    const area:Area = {north:north, south:south, east:east, west:west};
    //get stations from db
    let stationsResult = await NetworkService.getStationsFromDB(area);
    //if no stations found, search on map
    if(stationsResult.data.length == 0) {
      stationsResult = await  NetworkService.getStationsFromMap(area);//await findNearbyStation(area);
    }
    return stationsResult.data;
  }
  public static readonly postPrice = async (priceData:any) => {
    priceData.user = 0;
    try {
      const response = await NetworkService.postPrice(priceData);
      return response.data;
    } catch(e) {
      console.log(e);
    }
  }
}

export default StationService;  
