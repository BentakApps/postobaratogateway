//import AuthService, NetworkService from "";
//import NetworkService, { AuthService } from "@services/networkService.js";
import express from "express";
import AuthService from "@services/authService.js";
import NetworkService from "@services/networkService.js";

const fuelsRouter = express.Router();

//public routes
fuelsRouter.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const fuels = await NetworkService.getFuelList();
  res.json(fuels.data);
});

//authenticated routes
//fuelsRouter.use(AuthService.isAuthenticated);

export default fuelsRouter;
