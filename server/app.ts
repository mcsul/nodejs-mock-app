/**
 * This module involves the creation and starting of the RESTful server
 *
 * It also tests a connection to Inworld
 *
 * @module
 */

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { config } from './config';
import { Router } from './router';
import { RouterService } from './services/router.service';

/**
 * The main server application that creates and starts the web service.
 *
 * It also runs a test to connect to the Inworld server.
 */
export class App {

  private _router: Router;
  private _server: express.Application;
  private _service: RouterService;

  constructor() {

    this._server = express();
    this._server.use(cors());
    this._server.use(express.json());

    this._server.use(
      morgan('tiny', {
        skip(req) {
          if (req.url === '/status' || req.url.startsWith('/events')) {
            return true
          }
          return false
        }
      })
    )

    this._service = new RouterService();
    this._router = new Router({service: this._service, server: this._server});

  }

  /**
   * Starts the RESTful API Server
   *
   * @returns {Promise<void>} Promise representing the starting of the server
   *
   */
  async start(): Promise<void> {
    const port: number = config.SERVER.PORT;
    this._server.listen(port, () => {
      console.log(`✔️ Server Running On Port: ${port}`);
    });
  }

  /**
   * Test if a connection can be made to Inworlds
   *
   * @returns {Promise<void>} Promise representing the successful Inworld connection test
   *
   */
  async testConnection(): Promise<void> {
    await this._service.testConnection();
  }

}
