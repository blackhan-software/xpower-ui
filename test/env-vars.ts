import { join } from 'path';
// ensure environment vars
import dotenv from 'dotenv';
// try importing '.env.*' config
try {
    dotenv.config({
        path: [
            join(__dirname, '..', '.env.mainnet.local'),
            join(__dirname, '..', '.env.mainnet'),
        ],
    });
} catch (ex) {
    console.error(ex);
}
