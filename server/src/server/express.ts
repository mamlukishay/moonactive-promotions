import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { registerAll as registerAllRoutes } from './routes';

const app = express();

// This allows all CORS requests - Not valid for production
app.use(cors());
app.use(bodyParser.json());

registerAllRoutes(app);

export { app };
