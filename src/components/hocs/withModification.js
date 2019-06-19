import React, { Component } from 'react';
import ModificationService from '../../services/ModificationService';
import ErrorBoundary from '../error-boundary/ErrorBoundary';
import StateMachine from '../../utils/StateMachine';


const States = {
    DEFAULT: 'default',
    NULL: 'null',
    SUCCESS: 'success',
};

const Tokens = {
    FETCH_RESOLVE: 'onFetchResolve',
    ERROR: 'onError',
};

const transitions = {
    [States.DEFAULT]: {
        [Tokens.FETCH_RESOLVE]: States.SUCCESS,
        [Tokens.ERROR]: States.NULL,
    },
    [States.NULL]: {
        [Tokens.FETCH_RESOLVE]: States.SUCCESS,
    },
    [States.SUCCESS]: {
        [Tokens.ERROR]: States.DEFAULT,
    },
};


export default function withModification(WrappedComponent) {
    return class extends Component {
        constructor(props) {
            super(props);

            this.onError = this.onError.bind(this);

            if (!props.id) {
                console && console.warn && console.warn('FrosmoPlacement: "id" property missing.', props);
            }

            // manage modification state as state automata
            this.stateMachine = new StateMachine(transitions, States.DEFAULT);

            this.state = {
                state: this.stateMachine.state,
                modificationContext: null,
            };

            this._modificationContextService = new ModificationService({
                id: props.id,
                onComplete: (modificationContext) => {
                    this.stateMachine.update(Tokens.FETCH_RESOLVE);
                    this.setState({
                        modificationContext,
                        state: this.stateMachine.state,
                    });
                }
            });
        }

        componentWillUnmount() {
            this._modificationContextService.cancel();
        }

        componentDidMount() {
            this._modificationContextService.fetch();
        }

        onError(error, info) {
            this.stateMachine.update(Tokens.ERROR);
            this.setState({
                state: this.stateMachine.state,
            });
    
            if (this.props.onError) {
                this.props.onError(error, info);
            }
        }

        render() {
            switch (this.state.state) {
                case States.DEFAULT:
                    const DefaultComponent = this.props.defaultComponent;

                    if (!DefaultComponent) {
                        return null;
                    }

                    return (
                        <ErrorBoundary onError={this.onError} key="default">
                            <DefaultComponent {...this.props}/>
                        </ErrorBoundary>
                    );

                case States.SUCCESS:
                    return (
                        <ErrorBoundary onError={this.onError} key="success">
                            <WrappedComponent
                                modificationContext={this.state.modificationContext}
                                {...this.props}
                            />
                        </ErrorBoundary>
                    );

                case States.NULL:
                default:
                    return null;
            }
        }
    }
}
