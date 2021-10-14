# Websocket
Below is a breakdown of how to properly work with the `Websocket` component in HyperExpress. The `Websocket` component is an extended `EventEmitter` allowing you to listen for specific events throughout the connection's lifetime.

#### Getting Started
To start accepting websocket connections, you must first create a websocket route on either a `Router` or `Server` instance.
```javascript
const HyperExpress = require('hyper-express');
const Server = new HyperExpress.Server();
const Router = new HyperExpress.Router();

Router.ws('/connect', (ws) => {
    console.log(ws.ip + ' is now connected using websockets!');
    ws.on('close', () => console.log(ws.ip + ' has now disconnected!'));
});

// Websocket connections can now connect to '/ws/connect'
Server.use('/ws', Router);
```

#### Intercepting & Handling Upgrade Requests
By default, all incoming connections are automatically upgraded to a websocket connection. You may authenticate these upgrade requests by creating an `upgrade` route on either a `Router` or `Server` instance.
```javascript
// Assume this code is written in the same file as the above example
Router.upgrade('/connect', (request, response) => {
    // Do some kind of verification here
    // This handler acts the same as all other HTTP handlers
    // All global/route-specific middlewares will run on this route as it is treated like a normal HTTP route
    // You must call response.upgrade() somewhere in your logic, otherwise the upgrade request will timeout
    
    response.upgrade({
        token: request.query_parameters['token'],
        // You may specify context values in this object for later accesss using the ws.context property
    })
});
```

#### Websocket Properties
| Property  | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `raw` | `uWS.Request`  | Underlying uWS.Websocket object. |
| `ip` | `String`  | Connection IP address. |
| `context` | `Object`  | Context values that were specified from `upgrade()` method. |
| `closed` | `Boolean`  | Whether connection is closed. |
| `buffered` | `Number`  | Number of bytes buffered in backpressure. |
| `topics` | `Array`  | List of topics this websocket is subscribed to. |

#### Websocket Methods
* `atomic(Function: callback)`: Alias of `uWebsockets.Response.cork()`. This method waits for network socket to become ready before executing all network base calls inside the specified `callback`.
    * This may yield higher performance when executing multiple network heavy operations.  
* `send(String|Buffer|ArrayBuffer: message, Boolean: is_binary, Boolean: compress)`: Sends a message over the websocket connection.
    * **Returns** `Boolean`[`true`] if message was sent successfully.
    * **Returns** `Boolean`[`false`] if message could not be sent due to built up backpressure.
* `ping(String|Buffer|ArrayBuffer: message)`: Sends a ping control message.
    * **Returns** `Boolean`[`true`] if message was sent successfully.
    * **Returns** `Boolean`[`false`] if message could not be sent due to built up backpressure.
* `close(Number: code, String: message)`: Gracefully closes the connection and writes specified code and short message.
    * **Note** this method is recommended for most use-cases.
* `destroy()`: Forcefully closes the connection and immediately emits `close` event.
    * **Note** no protocol close message is sent.
    * Only recommended when disconnecting bad actors.
* `is_subscribed(String: topic)`: Returns whether this websocket is subscribed to specified topic.
    * **Returns** `Boolean`
* `subscribe(String: topic)`: Subscribes to specified topic in **MQTT syntax**.
* `unsubscribe(String: topic)`: Unsubscribes from specified topic in **MQTT syntax**.
* `publish(String: topic, String|Buffer|ArrayBuffer: message, Boolean: is_binary, Boolean: compress)`: Publishes the specified message to the specified topic in **MQTT syntax**.