import AuthService from "@services/authService.js";
import NetworkService from "@services/networkService.js";
import StationService from "@services/stationService.js";
import express from "express";

const stationsRouter = express.Router();

//public routes
stationsRouter.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const stations = await StationService.getStations(
    +req.query.north!,
    +req.query.south!,
    +req.query.east!,
    +req.query.west!
  )
  res.json(stations);
});

//authenticated routes
//stationsRouter.use(AuthService.isAuthenticated);

stationsRouter.post("/price", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const response = await StationService.postPrice(req.body);
  res.json(response.data);
});

stationsRouter.post("/update", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const results = await NetworkService.updateStations();
  res.json(results.data);
});

export default stationsRouter;
