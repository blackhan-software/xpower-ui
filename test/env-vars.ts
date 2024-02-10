import { join } from 'path';
// ensure environment vars
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, 'env-vars-fuji') });
// try importing '.env' config
try {
    dotenv.config({ path: join(__dirname, '..', '.env') });
} catch (ex) {
    console.error(ex);
}
