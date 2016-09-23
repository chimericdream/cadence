'use strict';

define('routers/home', ['routers/base'], function(BaseRouter) {
    const Router = BaseRouter.extend({
        'routes': {
            '': 'home'
        }
    });

    Router.prototype.home = function() {
        this.getView('views/base', (HomeView) => {
            this.render(HomeView);
        });
    };

    return Router;
});
