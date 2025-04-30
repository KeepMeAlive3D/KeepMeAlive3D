# User management

## Registration

Users can be created by registering in the UI. Each user has their own models and other users cannot
cannot access them. Upon registration or login, a token is sent back to the server. This token is then
used for authentication. It has an expiry date, after which a new one must be requested by logging in.

## Directory structure

The backend will create a directory for each user in their working directory. The name is the user id.
Within this directory a new directory will be created for each uploaded model containing the .GLB file.

## Deleting a user

Users can be deleted by accessing the database directly or via the backend endpoint. In the
UI, there is currently no way to delete a user.