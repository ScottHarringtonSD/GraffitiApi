require("dotenv").config();
const { uploadRouter } = require("./uploadthing");
const { createRouteHandler } = require("uploadthing/express");
const connectDB = require("./dbConn");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/graffitis", require("./Routes/graffitiRoutes"));
app.use("/login", require("./Routes/loginRoutes"));
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      callbackUrl: "https://graffitiapi.onrender.com",
      /**
       * Your UploadThing app id. You can find this on the UploadThing dashboard.
       */
      uploadthingId: process.env.UPLOADTHING_APP_ID,
      /**
       * Your UploadThing API key. You can find this on the UploadThing dashboard.
       */
      uploadthingSecret: process.env.UPLOADTHING_SECRET,
      logLevel: "info",
      isDev: true,
    },
  })
);

connectDB();

const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
