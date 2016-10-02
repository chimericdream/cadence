/* global define */
'use strict';

define(['routers/base'], function(BaseRouter) {
    const Router = BaseRouter.extend({
        'routes': {
            '': 'dashboard'
        }
    });

    Router.prototype.dashboard = function() {
        this.getView('views/dashboard', (DashboardView) => {
            this.render(DashboardView);
        });
    };

    return Router;
});
