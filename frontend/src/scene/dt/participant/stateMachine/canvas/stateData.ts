export type StateData = {
    id: string
    stateType: StateType,
    isFinal: boolean,
    isFirst: boolean,
    posX: number,
    width: number
    posY: number
    height: number,
    details: StateInfoDetails
    childStates: StateData[]
}

export enum StateType {
    PARALLEL = "parallel",
    SEQUENTIAL = "sequential",
    ATOMIC = "atomic"
}

export type StateInfoDetails = {
    onEntry: boolean,
    onExit: boolean,
    transitions: StateTransitionsDetails[]
}


export type StateTransitionsDetails = {
    toState: string | undefined,
    event: string | undefined,
    condition: string | undefined
}

export type StateMachine = {
    name: string,
    initial: string | undefined,
    states: StateData[]
}

export const sampleStateData: StateMachine = {
    name: "calc",
    initial: "on",
    states: [
        {
            id: "wrapper",
            stateType: StateType.SEQUENTIAL,
            isFinal: false,
            isFirst: false,
            posX: 10,
            width: 100,
            posY: 10,
            height: 30,
            details: {
                onEntry: false,
                onExit: false,
                transitions: []
            },
            childStates: [
                {
                    id: "on",
                    stateType: StateType.ATOMIC,
                    isFinal: false,
                    isFirst: false,
                    posX: 500,
                    width: 200,
                    posY: 50,
                    height: 100,
                    details: {
                        onEntry: false,
                        onExit: false,
                        transitions: []
                    },
                    childStates: []
                }
            ]
        }
    ]
}