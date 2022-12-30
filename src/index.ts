import express from "express";
import router  from "./routes/index.js";

const app = express();
const port = (process.env.PORT || 80) as number;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use("/", router);
app.listen(port, () => {
  console.log(`Gateway running at port ${port}`);
});