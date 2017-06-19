# patron_rest
A RESTful API for Patron UI.

## API

1. GET ``/tenants``: Get all tenants, each tenant has an ID and a name.
2. GET ``/tenants/<TENANT_NAME>``: Get the ``metadata.json`` for a tenant ``<TENANT_NAME>``.
3. GET ``/tenants/<TENANT_NAME>/policies/<POLICY_NAME>``: Get the ``<POLICY_NAME>.json`` for a tenant ``<TENANT_NAME>``.
4. POST ``/tenants/<TENANT_NAME>``: Set the ``metadata.json`` for a tenant ``<TENANT_NAME>``.
5. POST ``/tenants/<TENANT_NAME>/policies/<POLICY_NAME>``: Set the ``<POLICY_NAME>.json`` for a tenant ``<TENANT_NAME>``.
6. GET ``/tenants/<TENANT_NAME>/users``: Get all users for a tenant ``<TENANT_NAME>``.
7. GET ``/tenants/<TENANT_NAME>/users/<USER_NAME>/commands``: Get all commands that can be run by the user ``<USER_NAME>`` of tenant ``<TENANT_NAME>``.
8. GET ``/tenants/<TENANT_NAME>/users/<USER_NAME>/commands/<COMMAND>``: Run command ``<COMMAND>`` as the user ``<USER_NAME>`` of tenant ``<TENANT_NAME>``.
9. GET ``/reset``: Reset all data to the initial state.

## Examples

1. http://osvt.net:3000/tenants
2. http://osvt.net:3000/tenants/tenant1
3. http://osvt.net:3000/tenants/tenant1/policies/custom-policy
4. http://osvt.net:3000/tenants/admin/users
4. http://osvt.net:3000/tenants/tenant1/users
5. http://osvt.net:3000/tenants/admin/users/admin/commands
6. http://osvt.net:3000/tenants/admin/users/admin/commands/nova%20service-list
6. http://osvt.net:3000/tenants/tenant1/users/user1/commands/nova%20service-list
6. http://osvt.net:3000/tenants/tenant1/users/user1/commands/nova%20list
6. http://osvt.net:3000/tenants/tenant1/users/user2/commands/nova%20list
