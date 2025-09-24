const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const connectDB = require("./config/DB");

const connectToDB = async () => {
  await connectDB();
};
connectToDB();

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
