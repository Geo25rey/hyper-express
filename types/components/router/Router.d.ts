import { ReadableOptions } from 'stream';
import { Request } from '../http/Request';
import { Response } from '../http/Response';
import { Websocket } from '../ws/Websocket';
import { MiddlewareHandler } from '../middleware/MiddlewareHandler';

// Define types for HTTP Route Creators
export type UserRouteHandler = (request: Request, response: Response) => void;
export interface UserRouteOptions {
    middlewares?: Array<MiddlewareHandler>;
    stream_options?: ReadableOptions;
    max_body_length?: number;
}

// Define types for Websocket Route Creator
export type WSRouteHandler<TUserData = unknown> = (websocket: Websocket<TUserData>) => void;
export interface WSRouteOptions {
    message_type?: 'String' | 'Buffer' | 'ArrayBuffer';
    idle_timeout?: number;
    max_backpressure?: number;
    max_payload_length?: number;
}

// Define types for internal route/middleware records
export interface RouteRecord {
    method: string;
    pattern: string;
    options: UserRouteOptions | WSRouteOptions;
    handler: UserRouteHandler;
}

// Defines the type for internal middleware records
export interface MiddlewareRecord {
    pattern: string;
    middleware: MiddlewareHandler;
}

type UsableSpreadableArguments = (string | Router | MiddlewareHandler | MiddlewareHandler[])[];
type RouteSpreadableArguments = (
    | string
    | UserRouteOptions
    // | UserRouteHandler - Temporarily disabled because Typescript cannot do "UserRouteHandler | MiddlewareHandler" due to the next parameter confusing it
    | MiddlewareHandler
    | MiddlewareHandler[]
)[];

export class Router {
    constructor();

    /**
     * Returns a chainable Router instance which can be used to bind multiple method routes or middlewares on the same path easily.
     * Example: `Router.route('/api/v1').get(getHandler).post(postHandler).delete(destroyHandler)`
     * Example: `Router.route('/api/v1').use(middleware).user(middleware2)`
     * @param {String} pattern
     * @returns {Router} A chainable Router instance with a context pattern set to this router's pattern.
     */
    route(pattern: string): Router;

    /**
     * Registers middlewares and router instances on the specified pattern if specified.
     * If no pattern is specified, the middleware/router instance will be mounted on the '/' root path by default of this instance.
     *
     * @param {...(String|MiddlewareHandler|Router)} args (request, response, next) => {} OR (request, response) => new Promise((resolve, reject) => {})
     */
    use(...args: UsableSpreadableArguments): Router;

    /**
     * Creates an HTTP route that handles any HTTP method requests.
     * Note! ANY routes do not support route specific middlewares.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    any(...args: RouteSpreadableArguments): Router;

    /**
     * Alias of any() method.
     * Creates an HTTP route that handles any HTTP method requests.
     * Note! ANY routes do not support route specific middlewares.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    all(...args: RouteSpreadableArguments): Router;

    /**
     * Creates an HTTP route that handles GET method requests.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    get(...args: RouteSpreadableArguments): Router;

    /**
     * Creates an HTTP route that handles POST method requests.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    post(...args: RouteSpreadableArguments): Router;

    /**
     * Creates an HTTP route that handles PUT method requests.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    put(...args: RouteSpreadableArguments): Router;

    /**
     * Creates an HTTP route that handles DELETE method requests.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    delete(...args: RouteSpreadableArguments): Router;

    /**
     * Creates an HTTP route that handles HEAD method requests.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    head(...args: RouteSpreadableArguments): Router;

    /**
     * Creates an HTTP route that handles OPTIONS method requests.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    options(...args: RouteSpreadableArguments): Router;

    /**
     * Creates an HTTP route that handles PATCH method requests.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    patch(...args: RouteSpreadableArguments): Router;

    /**
     * Creates an HTTP route that handles TRACE method requests.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    trace(...args: RouteSpreadableArguments): Router;

    /**
     * Creates an HTTP route that handles CONNECT method requests.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    connect(...args: RouteSpreadableArguments): Router;

    /**
     * Intercepts and handles upgrade requests for incoming websocket connections.
     * Note! You must call response.upgrade(data) at some point in this route to open a websocket connection.
     *
     * @param {String} pattern
     * @param {...(RouteOptions|MiddlewareHandler)} args
     */
    upgrade(...args: RouteSpreadableArguments): Router;

    /**
     * @param {String} pattern
     * @param {WSRouteOptions|WSRouteHandler} options
     * @param {WSRouteHandler} handler
     */
    ws<TUserData = unknown>(pattern: string, handler: WSRouteHandler<TUserData>): Router;
    ws<TUserData = unknown>(pattern: string, options: WSRouteOptions, handler: WSRouteHandler<TUserData>): Router;

    /**
     * Returns All routes in this router in the order they were registered.
     * @returns {Array}
     */
    get routes(): Array<RouteRecord>;

    /**
     * Returns all middlewares in this router in the order they were registered.
     * @returns {Array}
     */
    get middlewares(): Array<MiddlewareRecord>;
}
