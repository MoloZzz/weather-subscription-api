import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
    path: path.join(process.cwd(), `.env`),
});

export default () => ({
    db: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASS,
        database: process.env.POSTGRES_DB_NAME,
    },
    openApiIntegration: {
        url: process.env.OPEN_WEATHER_BASE_URL,
        apiKey: process.env.OPEN_WEATHER_API_KEY, 
        language: process.env.OPEN_WEATHER_RESPONSE_LANGUAGE,
    },
});
