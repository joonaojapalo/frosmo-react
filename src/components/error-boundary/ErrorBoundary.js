import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logger from '../../utils/logger';

export default class ErrorBoundary extends Component {
    constructor () {
        super();

        this.state = {
            isError: false,
        };
    }

    componentDidCatch (error, info) {
        if (typeof error === 'object') {
            const { message, stack } = error;
            if (message || stack) {
                logger.error(message, stack);
            }
        }

        const { onError } = this.props;

        if (onError) {
            onError(error, info);
        }
    }

    static getDerivedStateFromError() {
        return {
            isError: true,
        }
    }

    render() {
        return this.state.isError ? null : this.props.children;
    }
}

ErrorBoundary.propTypes = {
    onError: PropTypes.func,
}
