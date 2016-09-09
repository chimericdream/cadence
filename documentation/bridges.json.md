Logos

Logos for plugins should be saved as `{root}/src/web/assets/images/logos/plugin-name.png`. For consistency, logos should be 600px by 300px.

### Configuration JSON

The `plugins.json` file contains the primary list of plugins. Each plugin's data structure looks something like this:

```json
"plugin-name": {
    "name": "Plugin name",
    "description": "Short description of what the plugin is for, if necessary.",
    "config-file": "plugin-name.json",
    "enabled": true,
    "services": {...}
}
```

The plugin's key is used in the configuration URL and should be a lower-case alphanumeric string with hyphens for spaces.

The `config-file` property defines the location of the plugin's JSON configuration file, relative to `{root}/config/plugins/`. This will typically match the plugin's primary key, followed by ".json", but may be different if appropriate.

The `enabled` flag tells the Cadence application whether the components provided by the plugin should be made available to users when configuring tasks.

The `services` block will contain a set of "sub-plugins", which are discrete APIs which share account information with the primary plugin. For example, the **Google Plugin** for Cadence provides APIs for a wide range of Google's products, such as Gmail, Drive, Calendar, and many more. Rather than individually configuring account information for an plugin's services, they share account data with the parent plugin. Each service may be enabled or disabled individually, and some may have their own specific configuration settings.

The block for a service provided by an plugin looks something like this:

```json
"service-name": {
    "name": "Name of the service",
    "description": "Short description, if necessary",
    "config-file": "service-name.json",
    "enabled": true
}
```

For the most part, this configuration block is configured the same as a standard plugin.

As with plugins, the service's primary key is used for the configuration URL. However, it will be prepended with the plugin's key, so the resulting configuration URL would look something like this: `plugin-name/service-name`.

The `config-file` property is the path to the service's individual configuration, if applicable. The path is relative to `{root}/config/plugins/plugin-name/`. If the service does not require any special configuration, this field's value should be `null`.
