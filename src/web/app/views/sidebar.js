/* global define */
'use strict';

define(['views/base', 'text!templates/sidebar.hbs', 'json!data/sidebar-links.json'], (BaseView, SidebarTemplate, SidebarLinks) => {
    const SidebarView = BaseView.extend({
        'template': SidebarTemplate,
        'templateContext': {
            'sidebar-links': SidebarLinks
        }
    });

    return SidebarView;
});
