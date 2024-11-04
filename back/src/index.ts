import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors'
import * as https from "https";
dotenv.config();
https.globalAgent.maxSockets = 100;
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors())

let requestCount = 0;
app.post('/api', (req: Request, res: Response): any => {
    requestCount++;
    console.log(requestCount)
    if (requestCount > 50) {
        requestCount--
        return res.status(429).send('Too Many Requests');
    }

    const delay = Math.floor(Math.random() * 1000) + 1;
    console.log(delay)
    setTimeout(() => {
        requestCount--
        res.json({ index: req.body?.index });
    }, delay);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
