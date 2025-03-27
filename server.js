import express from "express";
import path from "path";
import config from "./sis/config/config.js";
import { create } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
import router from './sis/routes/routes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up handlebars engine
const hbs = create({
    extname: ".hbs",
    defaultLayout: "main",
});

// Set handlebars as the view engine
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Rutas desde router
app.use(router);

// Rutas individuales
app.get("/", (req, res) => {
    res.render("home/home"); 
});

app.get("/dashboard",(req,res)=>{
    res.render("partials/qr")
})

// Start the server
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on: \nhttp://localhost:${PORT}`);
});

export default app;
