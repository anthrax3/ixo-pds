import {Router} from 'express';
import {AbstractRouter} from './AbstractRouter';
import {QueryHandler} from '../handlers/QueryHandler'

declare var Promise: any;

export class QueryRouter extends AbstractRouter{

    setup() {
        let config = {};
    
        const handler = new QueryHandler();
        this.register(config, "queryTransactions", handler.queryTransactions);
        this.register(config, "queryConfigs", handler.queryConfigs);
        this.register(config, "queryCapabilities", handler.queryCapabilities);
        console.log('query router configured');
        return config;
      }
}

// Create the Router, and export its configured Express.Router
//export default new QueryRouter().router;