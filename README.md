# KeepMeAlive3D
A service that renders GLTF models in the context of manufacturing

## Dev Setup

Link gradle project in `/backend`.


Run 
```bash
cd frontend
```

```bash
npm i
```

Run-configs are provided for Intelij, run `ApplicationKt` to start the backend and run `dev` to start the frontend.

## Credits

Icon https://www.flaticon.com/free-icon/robot-arm_936827?related_id=936827&origin=search

## Dev Ops Notes

### Mqtt set password for passwd file

- set [user]:[password]
- run when docker is running `sudo docker exec mqtt mosquitto_passwd -U /etc/mosquitto/passwd`