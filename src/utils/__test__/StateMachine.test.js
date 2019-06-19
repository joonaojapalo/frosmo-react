import StateMachine from '../StateMachine';

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


describe('StateMachine', () => {
    it('should initialize with initialState', () => {
        const stateMachine = new StateMachine(transitions, States.DEFAULT);
        expect(stateMachine.state).toBe(States.DEFAULT);
    });

    describe('.update()', () => {
        it('should update state', () => {
            const stateMachine = new StateMachine(transitions, States.DEFAULT);
            stateMachine.update(Tokens.FETCH_RESOLVE);
            expect(stateMachine.state).toBe(States.SUCCESS);

            stateMachine.update(Tokens.ERROR);
            expect(stateMachine.state).toBe(States.DEFAULT);

            stateMachine.update(Tokens.ERROR);
            expect(stateMachine.state).toBe(States.NULL);

            stateMachine.update(Tokens.FETCH_RESOLVE);
            expect(stateMachine.state).toBe(States.SUCCESS);
        });

        it('should throw error on invalid initialState', () => {
            expect(() => {
                new StateMachine(transitions, 'invalid');
            }).toThrow();
        });

        it('should not update state on invalid transition', () => {
            const stateMachine = new StateMachine(transitions, States.DEFAULT);
            stateMachine.update('not-exists');
            expect(stateMachine.state).toBe(States.DEFAULT);
        });
    });
});
