/* global define */
'use strict';

define(['routers/base'], function(BaseRouter) {
    const DashboardRouter = BaseRouter.extend({
        'routes': {
            '': 'dashboard'
        }
    });

    DashboardRouter.prototype.dashboard = function() {
        this.getView('views/dashboard', (DashboardView) => {
            this.render(DashboardView);
        });
    };

    return DashboardRouter;
});
