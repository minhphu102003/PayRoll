import { config } from "dotenv";
config();

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/apicompany";
export const PORT = process.env.PORT || 4000;
export const SECRET = "yoursecretkey";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@localhost";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

// ! Cấu hình cho kafka
export const CLIENTID = process.env.CLIENTID || "sip-app";
export const BROKERS = process.env.BROKERS || "tobi:9092";
export const TOPICHR = process.env.TOPICHR || "hrtest1";
export const TOPICMIDDLEWARE = process.env.TOPICMIDDLEWARE || "middlewaretest";
export const TOPICSIP = process.env.TOPICSIP || "test";
export const GROUPID = process.env.GROUPID || "test-group1";
