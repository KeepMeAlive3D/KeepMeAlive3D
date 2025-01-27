![GitHub Release Date](https://img.shields.io/github/release-date/KeepMeAlive3D/KeepMeAlive3D)
![GitHub License](https://img.shields.io/github/license/KeepMeAlive3D/KeepMeAlive3D)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/KeepMeAlive3D/KeepMeAlive3D/backend_integration_test.yml?label=backend%20test)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/KeepMeAlive3D/KeepMeAlive3D/frontend_tests.yml?label=frontend%20test)


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

Run-configs are provided for IntelliJ, run `ApplicationKt` to start the backend and run `dev` to start the frontend.

Run `npx prettier . --write` to reformat js files.

## Credits

Icon https://www.flaticon.com/free-icon/robot-arm_936827?related_id=936827&origin=search

## Dev Ops Notes

### Mqtt set password for passwd file

- set [user]:[password]
- run when docker is running `sudo docker exec mqtt mosquitto_passwd -U /etc/mosquitto/passwd`
