/* global define */
'use strict';

define(['routers/base'], function(BaseRouter) {
    const DashboardRouter = BaseRouter.extend({
        'routes': {
            '': 'dashboard'
        }
    });

    DashboardRouter.prototype.dashboard = function() {
        this.renderView('views/dashboard');
    };

    return DashboardRouter;
});
