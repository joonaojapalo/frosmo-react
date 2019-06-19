class StateMachine {
    constructor (transitions, initialState) {
        this._transitions = transitions;

        if (!this._transitions[initialState]) {
            throw new Error('invalid initial state');
        }

        this._state = initialState;
    }

    get state() {
        return this._state;
    }

    update(token) {
        const newTransition = this._transitions[this._state];

        if (!newTransition) {
            return;
        }

        const newState = newTransition[token];

        if (!newState) {
            return;
        }

        this._state = newState;
    }
}

export default StateMachine;
