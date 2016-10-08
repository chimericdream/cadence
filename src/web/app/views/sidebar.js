/* global define */
'use strict';

define(['marionette', 'text!templates/sidebar.hbs', 'json!data/sidebar-links.json'], (Marionette, SidebarTemplate, SidebarLinks) => {
    const SidebarView = Marionette.View.extend({
        'events': {},
        'template': SidebarTemplate,
        'templateContext': {
            'sidebar-links': SidebarLinks
        }
    });

    return SidebarView;
});
