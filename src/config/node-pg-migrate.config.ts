import { ENV } from "./env.config";

module.exports = {
    migrationFolder: 'migrations',
    direction: 'up',
    databaseUrl: ENV.DATABASE_URL,
};