The `adapter-name.json` file is the core configuration for each adapter. The basic structure looks like this:

```json
{
    "account-template": {
        "fields": {...},
        "data": {...}
    },
    "accounts": {...}
}
```

The `account-template` block defines the configurable portions of an account (e.g. username, API key, and so on). The `accounts` section contains individual user accounts that have been configured in the application.

**`account-template.fields`**: Each configurable field for an account is listed here. Valid types are `boolean`, `checkbox`, `radio`, `select`, `text`, and `textarea`. An example of each type's configuration is listed below. A field's JSON key is used as the form element name.

`boolean`

The `options` hash is optional. The values for `true` and `false` will be used as the form labels. If omitted, they will default to the strings "true" and "false".

```json
    "field-slug": {
        "name": "My yes/no field",
        "type": "boolean",
        "options": {
            "true": "Yes",
            "false": "No"
        }
    }
```

`checkbox`

Options are listed as a hash containing a `name` and `value`. The `name` will be the field label, and `value` will be the actual stored value.

```json
    "field-slug": {
        "name": "Select categories",
        "type": "checkbox",
        "options": [
            {"name": "Option 1", "value": "opt1"},
            {"name": "Option 2", "value": "opt2"},
            {"name": "Option 3", "value": "opt3"},
            ...
        ]
    }
```

`radio`

The `options` array functions identically to the `checkbox` field type.

```json
    "field-slug": {
        "name": "Select type for the thing",
        "type": "radio",
        "options": [
            {"name": "Option 1", "value": "opt1"},
            {"name": "Option 2", "value": "opt2"},
            {"name": "Option 3", "value": "opt3"},
            ...
        ]
    }
```

`select`

The `selection` key can be either _single_ or _multiple_. The `options` array functions identically to the `checkbox` field type.

```json
    "field-slug": {
        "name": "My select box",
        "type": "select",
        "selection": "single",
        "options": [
            {"name": "Option 1", "value": "opt1"},
            {"name": "Option 2", "value": "opt2"},
            {"name": "Option 3", "value": "opt3"},
            ...
        ]
    }
```

`text`

This represents a basic text input.

```json
    "field-slug": {
        "name": "My text field",
        "type": "text"
    }
```

`textarea`

This represents a basic textarea. Useful for anything requiring large amounts of text.

```json
    "field-slug": {
        "name": "My textarea field",
        "type": "textarea"
    }
```
