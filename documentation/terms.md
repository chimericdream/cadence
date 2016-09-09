#### Plugin
a set of APIs to interact with a given application or website.

#### Component
a discrete subset of a plugin with its own configuration. A plugin may provide zero or more components.

#### Workflow
a data process triggered by some event, such as a REST call or time-based trigger. These can perform complex interactions based on data from a number of sources. For example, an example workflow could be summarized as "When the front door to my house opens, if neither my spouse or I am at home, send us both a text message."

#### Entity
a piece of data (such as a calendar event, task, or folder) provided by a Plugin or Component

#### Relationship
a connection between two entities wherein a particular field is kept in sync between them, with one entity acting as the "primary" source

#### Shard
a piece of data not directly associated with a Plugin, Component, or Entity. A shard's value can be used in a workflow for branching (if/then) or as additional data. Shards can be updated via REST calls (such as those from IFTTT). For example, a shard could be "Joe at home", and its value would be toggled "true" or "false". Shards may also be complex structured data (i.e. JSON objects), such as a Fitbit daily activity summary or a weekly driving summary from Automatic. These are especially handy for generating graphs and other data visualizations.
