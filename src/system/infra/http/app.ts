/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
import 'reflect-metadata';
import './environment';
import './bootstrap';
import 'express-async-errors';

import cors from 'cors';
import express, { Express } from 'express';
import semver from 'semver';

import helmet from 'helmet';
import http, { Server } from 'http';
import i18nextMiddleware from 'i18next-http-middleware';

// i18n import

// Config import
import { routes } from '@routes/routes';
import { corsConfig } from '@config/cors';

// Middleware import
import { i18next } from '../../i18n/index';
import { rateLimiterMiddleware } from './middlewares/rateLimiterMiddleware';
import { errorMiddleware } from './middlewares/errorMiddleware';

// Route import

// Get app version
const appinfo = require('../../../../package.json').version;

class App {
  public express: Express;

  public server: Server;

  constructor() {
    this.check();

    this.express = express();
    this.server = http.createServer(this.express);
    this.express.set('trust proxy', 1);

    this.middlewares();
    this.routes();
    this.errorHandler();
    this.fallbackHandler();
  }

  private check() {
    const requiredNodeVersion = '20.0.0';

    // Check version
    if (
      !semver.valid(appinfo)
      || !semver.valid(process.version)
      || !semver.gte(process.version, requiredNodeVersion)
    ) {
      console.clear();
      console.log(
        `❌ FATAL FAILURE: This application requires Node.js version at least ${requiredNodeVersion}. This machine is running Node.js version ${semver.clean(
          process.version,
        )}.`,
      );
      process.exit(1);
    }
  }

  private middlewares() {
    this.express.use(helmet());
    this.express.use(i18nextMiddleware.handle(i18next));
    this.express.use(cors(corsConfig));
    this.express.use(express.json());
    this.express.use(rateLimiterMiddleware);
  }

  private routes() {
    this.express.use(routes);
  }

  private errorHandler() {
    this.express.use(errorMiddleware);
  }

  private fallbackHandler() {
    this.express.use((req, res) => {
      return res.status(404).send();
    });
  }
}

export { App };
