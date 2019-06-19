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
        logger.error({
            error,
            info,
        });

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
