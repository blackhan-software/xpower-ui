import { Express } from 'express';
import fs from 'fs';

export const register = (app: Express): Express => {
    return app.engine('pig', (file_path, options, callback) => {
        fs.readFile(file_path, (e, content) => {
            if (e) {
                return callback(e);
            }
            let text = content.toString();
            for (const [key, value] of Object.entries(options)) {
                if (typeof value === 'object') {
                    text = text.replace(
                        new RegExp(`{{${key}}}`, 'g'), JSON.stringify(value)
                    );
                } else {
                    text = text.replace(
                        new RegExp(`{{${key}}}`, 'g'), value
                    );
                }
            }
            return callback(null, text);
        });
    });
}
export default register;
