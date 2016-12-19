# patron_rest
A RESTful API for Patron UI.

## API

1. GET ``/users``: Get all users, each user has an ID and a name.
2. GET ``/<USER_ID>``: Get the ``metadata.json`` for a user ``<USER_ID>``.
3. GET ``/<USER_ID>/<POLICY_NAME>``: Get the ``<POLICY_NAME>.json`` for a user ``<USER_ID>``.
4. POST ``/<USER_ID>``: Set the ``metadata.json`` for a user ``<USER_ID>``.
5. POST ``/<USER_ID>/<POLICY_NAME>``: Set the ``<POLICY_NAME>.json`` for a user ``<USER_ID>``.
6. GET ``/reset``: Reset all data to the initial state.

## Examples

1. http://osvt.net:3000/users
2. http://osvt.net:3000/users/85c8848b1dd64c7ebb2c5baeb12e25c3
3. http://osvt.net:3000/users/85c8848b1dd64c7ebb2c5baeb12e25c3/custom-policy
