The `adapters.json` file contains the primary list of adapters. Each adapter's data structure looks something like this:

```json
"adapter-name": {
    "name": "Adapter name",
    "description": "Short description of what the adapter is for, if necessary.",
    "config-file": "adapter-name.json",
    "enabled": true,
    "services": {...}
}
```

The adapter's key is used in the configuration URL and should be a lower-case alphanumeric string with hyphens for spaces.

The `config-file` property defines the location of the adapter's JSON configuration file, relative to `{root}/config/adapters/`. This will typically match the adapter's primary key, followed by ".json", but may be different if appropriate.

The `enabled` flag tells the NCL application whether the components provided by the adapter should be made available to users when configuring tasks.

The `services` block will contain a set of "sub-adapters", which are discrete APIs which share account information with the primary adapter. For example, the **Google Adapter** for NCL provides APIs for a wide range of Google's products, such as Gmail, Drive, Calendar, and many more. Rather than individually configuring account information for an adapter's services, they share account data with the parent adapter. Each service may be enabled or disabled individually, and some may have their own specific configuration settings.

The block for a service provided by an adapter looks something like this:

```json
"service-name": {
    "name": "Name of the service",
    "description": "Short description, if necessary",
    "config-file": "service-name.json",
    "enabled": true
}
```

For the most part, this configuration block is configured the same as a standard adapter.

As with adapters, the service's primary key is used for the configuration URL. However, it will be prepended with the adapter's key, so the resulting configuration URL would look something like this: `adapter-name/service-name`.

The `config-file` property is the path to the service's individual configuration, if applicable. The path is relative to `{root}/config/adapters/adapter-name/`. If the service does not require any special configuration, this field's value should be `null`.
