/* global __DEV__ */
const ERR_SPA_UNAVALIABLE = 'frosmo.spa is not available, fallback to console.error';

function error(message, trace) {
    if (!window || !window.frosmo || !window.frosmo.spa) {
        console.warn(ERR_SPA_UNAVALIABLE);
        console.error(message);
        return;
    }

    if (__DEV__) {
        console.error(message);
        return;
    }

    if (typeof message !== 'string') {
        message = JSON.stringify(message);
    }

    window.frosmo.spa.log.error(message, 'spa.react.placement', {
        trace: trace || '',
    });
}

export default {
    error,
}
