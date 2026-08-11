(function ($) {
    'use strict';

    var pluginName = 'leadwerkYoastAnalysis';
    var registered = false;
    var attempts = 0;

    function renderedContent() {
        return window.leadwerkYoastAnalysis && typeof window.leadwerkYoastAnalysis.content === 'string'
            ? window.leadwerkYoastAnalysis.content
            : '';
    }

    function registerWithYoast() {
        var app = window.YoastSEO && window.YoastSEO.app;

        if (registered) {
            return true;
        }
        if (!app || typeof app.registerPlugin !== 'function' || typeof app.registerModification !== 'function') {
            return false;
        }

        app.registerPlugin(pluginName, { status: 'ready' });
        app.registerModification('content', renderedContent, pluginName, 5);
        registered = true;
        return true;
    }

    function boot() {
        if (registerWithYoast()) {
            return;
        }
        attempts += 1;
        if (attempts < 80) {
            window.setTimeout(boot, 250);
        }
    }

    $(window).on('YoastSEO:ready', boot);
    $(boot);
}(jQuery));
