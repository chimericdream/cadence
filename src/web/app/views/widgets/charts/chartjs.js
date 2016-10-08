/* global define */
'use strict';

define(['chartjs', 'views/base', 'text!templates/widgets/charts/chartjs.hbs'], (Chart, BaseView, ChartJsTemplate) => {
    const ChartJsView = BaseView.extend({
        'template': ChartJsTemplate
    });

    ChartJsView.prototype.onRender = function() {
        this.initializeChart();
    };

    return ChartJsView;
});
