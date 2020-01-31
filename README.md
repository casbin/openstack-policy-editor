# This project is deprecated, please see instead: https://github.com/casbin/casbin-dashboard

# Casbin Web UI
A portal & RESTful API for Casbin: https://logstack.org/

## API

1. GET ``/tenants``: Get all tenants, each tenant has an ID and a name.
2. GET ``/tenants/<TENANT_NAME>``: Get the ``metadata.json`` for a tenant ``<TENANT_NAME>``.
3. GET ``/tenants/<TENANT_NAME>/policies/<POLICY_NAME>``: Get the ``xxx.csv`` policy for a tenant ``<TENANT_NAME>``.
4. POST ``/tenants/<TENANT_NAME>``: Set the ``metadata.json`` for a tenant ``<TENANT_NAME>``.
5. POST ``/tenants/<TENANT_NAME>/policies/<POLICY_NAME>``: Set the ``<POLICY_NAME>.json`` for a tenant ``<TENANT_NAME>``.
6. GET ``/tenants/<TENANT_NAME>/users``: Get all users for a tenant ``<TENANT_NAME>``.
7. GET ``/tenants/<TENANT_NAME>/users/<USER_NAME>/commands``: Get all commands that can be run by the user ``<USER_NAME>`` of tenant ``<TENANT_NAME>``.
8. GET ``/tenants/<TENANT_NAME>/users/<USER_NAME>/commands/<COMMAND>``: Run command ``<COMMAND>`` as the user ``<USER_NAME>`` of tenant ``<TENANT_NAME>``.
9. GET ``/reset``: Reset all data to the initial state.

## Examples

#### Policy

1. http://logstack.org/tenants
2. http://logstack.org/tenants/tenant1
3. http://logstack.org/tenants/tenant1/policies/custom-policy.csv

#### Model

1. http://logstack.org/models/enable_model.conf
2. http://logstack.org/models/restrict_model.conf
3. http://logstack.org/models/custom_model.conf

#### User

1. http://logstack.org/tenants/admin/users
2. http://logstack.org/tenants/tenant1/users

#### Command

1. http://logstack.org/tenants/admin/users/admin/commands
2. http://logstack.org/tenants/admin/users/admin/commands/nova%20service-list
3. http://logstack.org/tenants/tenant1/users/user1/commands/nova%20service-list
4. http://logstack.org/tenants/tenant1/users/user1/commands/nova%20list
5. http://logstack.org/tenants/tenant1/users/user2/commands/nova%20list
