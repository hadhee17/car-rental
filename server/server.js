const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const connectDB = require("./config/DB");

const connectToDB = async () => {
  await connectDB();
};
connectToDB();

app.use("/", (req, res) => {
  res.send("API is running....");
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
