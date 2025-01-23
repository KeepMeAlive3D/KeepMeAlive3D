# Websocket communication

## Design Decisions

- Communication objects are in JSON
- The client subscribes to topics
- The server responds with data when available

## Livecycle FLow

![Lifecycle FLow](../assets/WebsocketFlowKma.svg)

## Communication

### Client Requests

- GET: topic information, encoded in url: `https://<host>/api/topic/<topic-name>`
- WS: Subscribe to topic

```json
{
  "manifest": {
    "version": 1,
    "bearerToken": "<token>",
    "msgType": "SUBSCRIBE_TOPIC"
  },
  "message": {
    "topic": "<topic-name>"
  }
}
```

- Closing the connection: the client just needs to close the connection.

### Server Responses

- GET: topic information

The server doesn't really know much about topics, most of the information about what type of event e.g. temperature, 
movement etc. should be defined in the model as a custom property. This way the server only knows the topic and passes 
the information to the client. The client then parses this information in a way that is useful.

```json
{
  "topic": "<topic-name>",
  "historyEventData": [
    {
      "timestamp": 1733406822637,  //time on the server in milis
      "data": "<data-point>"
    }
  ]
}
```

- WS: Topic Data

On Success:
```json
{
  "manifest": {
    "version": 1,
    "msgType": "TOPIC_DATAPOINT",
    "timestamp": 1733406822637 //time on the server in milis
  },
  "message": {
    "topic": "<topic-name>",
    "source": "MQTT",
    "point": 4.3
  }
}
```

On Error:

```json
{
  "manifest": {
    "version": 1,
    "msgType": "ERROR"
  },
  "message": {
    "type": "BadRequest",
    "message": "Message format invalid"
  }
}
```

```json
{
  "manifest": {
    "version": 1,
    "msgType": "ERROR"
  },
  "message": {
    "type": "Unauthorized",
    "message": "Bearer Token missing or invalid"
  }
}
```

```json
{
  "manifest": {
    "version": 1,
    "msgType": "ERROR"
  },
  "message": {
    "type": "Forbidden",
    "message": "You don't have the correct access permission to access this topic"
  }
}
```