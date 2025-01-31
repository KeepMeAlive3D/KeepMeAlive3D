# KeepMeAlive3D

A service that renders GLTF models in the context of manufacturing. Exemplary, the Fischer factory is used.

## Components

The project consists of three components:

![Components](./assets/Components.svg)

First, the frontend. This is the user interface and all the user's actions go through here.

Second, the backend, which processes the request. It is also responsible for login/registration and model management.
MQTT events from the IoT infrastructure are processed here and translated into websocket events. These are sent to the
UI.

Finally, the infrastructure. This includes the database for the server and the MQTT broker where the IoT data is
published.

## General flow

The following diagram describes the general workflow:

![General Flow](./assets/flow.svg)

Events are generated in the Fischer factory or any other real object. Through an interface provided by DBIS for the
project, the events are published and processed in the backend.

The backend supports login and registration from the frontend. After successful login, models can be uploaded and
downloaded. Events are sent to the frontend where they can be used to display graphs or animations. The mapping between
the events and the parts of the models is done by custom properties in the model. These can be set in Blender, for
example.

## Credits

Icon https://www.flaticon.com/free-icon/robot-arm_936827?related_id=936827&origin=search
