Logos

Logos for bridges should be saved as `{root}/src/web/assets/images/logos/bridge-name.png`. For consistency, logos should be 600px by 300px.

### Configuration JSON

The `bridges.json` file contains the primary list of bridges. Each bridge's data structure looks something like this:

```json
"bridge-name": {
    "name": "Bridge name",
    "description": "Short description of what the bridge is for, if necessary.",
    "config-file": "bridge-name.json",
    "enabled": true,
    "services": {...}
}
```

The bridge's key is used in the configuration URL and should be a lower-case alphanumeric string with hyphens for spaces.

The `config-file` property defines the location of the bridge's JSON configuration file, relative to `{root}/config/bridges/`. This will typically match the bridge's primary key, followed by ".json", but may be different if appropriate.

The `enabled` flag tells the Cadence application whether the components provided by the bridge should be made available to users when configuring tasks.

The `services` block will contain a set of "sub-bridges", which are discrete APIs which share account information with the primary bridge. For example, the **Google Bridge** for Cadence provides APIs for a wide range of Google's products, such as Gmail, Drive, Calendar, and many more. Rather than individually configuring account information for an bridge's services, they share account data with the parent bridge. Each service may be enabled or disabled individually, and some may have their own specific configuration settings.

The block for a service provided by an bridge looks something like this:

```json
"service-name": {
    "name": "Name of the service",
    "description": "Short description, if necessary",
    "config-file": "service-name.json",
    "enabled": true
}
```

For the most part, this configuration block is configured the same as a standard bridge.

As with bridges, the service's primary key is used for the configuration URL. However, it will be prepended with the bridge's key, so the resulting configuration URL would look something like this: `bridge-name/service-name`.

The `config-file` property is the path to the service's individual configuration, if applicable. The path is relative to `{root}/config/bridges/bridge-name/`. If the service does not require any special configuration, this field's value should be `null`.
