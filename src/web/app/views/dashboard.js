/* global define */
'use strict';

define(['chartjs', 'views/base', 'text!templates/dashboard.hbs'], (Chart, BaseView, DashboardTemplate) => {
    const DashboardView = BaseView.extend({
        'events': {
            'click #db-add-widget': 'addWidget'
        },
        'template': DashboardTemplate
    });

    DashboardView.prototype.addWidget = function(event) {
        event.preventDefault();
        event.stopPropagation();
        alert('add widget');
    };

    DashboardView.prototype.initializeChart = function() {
        const ctx = this.$el.find('#myChart')[0].getContext('2d');
        const widget = new Chart(ctx, {
            'type': 'line',
            'data': {
                'labels': ['September 25, 2016', 'September 26, 2016', 'September 27, 2016', 'September 28, 2016', 'September 29, 2016', 'September 30, 2016', 'October 1, 2016', 'October 2, 2016'],
                'datasets': [
                    {
                        'label': 'Total Steps',
                        'data': [8412, 4960, 2742, 6712, 5421, 4810, 5508, 7109],
                        'backgroundColor': 'rgba(75, 192, 192, 0.4)'
                    },
                    {
                        'label': 'Step Goal',
                        'data': [6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000],
                        'pointRadius': 0
                    }
                ]
            },
            'options': {
                'showLines': true,
                'spanGaps': true,
                'responsive': false
            }
        });
    };

    DashboardView.prototype.onRender = function() {
        this.initializeChart();
    };

    return DashboardView;
});
