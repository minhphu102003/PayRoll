import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import http from 'http';
import { WebSocketServer,WebSocket } from 'ws'; 

import indexRoutes from "./routes/index.routes.js";
import productRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";


import kafkaRoutes from "./routes/kafka.routes.js";
import setupKafkaConsumers from "./service/comsumer.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server }); 

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});


app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


setupKafkaConsumers(wss);


const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Routes
app.use("/api", indexRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/kafka", kafkaRoutes);
export default app;
