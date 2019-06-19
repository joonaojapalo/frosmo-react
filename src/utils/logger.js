/* global __DEV__ */
const ERR_SPA_UNAVALIABLE = 'frosmo.spa is not available, fallback to console.error';

function error(message) {
    if (!window || !window.frosmo || !window.frosmo.spa) {
        console.warn(ERR_SPA_UNAVALIABLE);
        console.error(message);
        return;
    }

    if (__DEV__) {
        console.error(message);
        return;
    }

    window.frosmo.spa.log.error(message, 'spa.react.placement');
}

export default {
    error,
}
