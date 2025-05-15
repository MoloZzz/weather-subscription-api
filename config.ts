import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
    path: path.join(process.cwd(), `.env`),
});

export default () => ({
    openApiIntegration: {
        url: process.env.OPEN_WEATHER_BASE_URL,
        apiKey: process.env.OPEN_WEATHER_API_KEY, 
        language: process.env.OPEN_WEATHER_RESPONSE_LANGUAGE,
    },
});
