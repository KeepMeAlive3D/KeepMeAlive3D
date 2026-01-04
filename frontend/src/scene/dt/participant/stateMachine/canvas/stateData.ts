export type StateData = {
    id: string
    stateType: StateType
    isFinal: boolean
    isFirst: boolean
    posX: number
    width: number
    absX: number
    posY: number
    height: number
    absY: number
    isActive: boolean
    details: StateInfoDetails
    childStates: StateData[]
    connectedTo: string[]
}

export enum StateType {
    PARALLEL = "PARALLEL",
    SEQUENTIAL = "SEQUENTIAL",
    ATOMIC = "ATOMIC"
}

export type StateInfoDetails = {
    onEntry?: boolean
    onExit?: boolean
    transitions: StateTransitionsDetails[]
}


export type StateTransitionsDetails = {
    toState: string | undefined
    event: string | undefined
    condition: string | undefined
}

export type StateMachine = {
    name: string
    initial: string | undefined
    states: StateData[]
}

export const sampleStateData: StateMachine = {
    name: "calc",
    initial: "off",
    states: [
        {
            id: "off",
            absX: 0,
            absY: 200,
            posX: 0,
            posY: 200,
            width: 30,
            height: 30,
            details: {
                transitions: [
                    {
                        event: "turn.on",
                        toState: "on",
                        condition: undefined,
                    }
                ]
            },
            isFinal: false,
            isFirst: true,
            isActive: false,
            stateType: StateType.ATOMIC,
            childStates: [],
            connectedTo: []
        },
        {
            id: "on",
            stateType: StateType.SEQUENTIAL,
            isFinal: false,
            isFirst: false,
            isActive: false,
            posX: 25,
            width: 400,
            posY: 50,
            height: 200,
            absX: 25,
            absY: 50,
            details: {
                onEntry: false,
                onExit: false,
                transitions: []
            },
            connectedTo: [],
            childStates: [
                {
                    id: "idle",
                    stateType: StateType.ATOMIC,
                    isFinal: false,
                    isFirst: false,
                    isActive: true,
                    posX: 100,
                    width: 500,
                    posY: 125,
                    height: 200,
                    details: {
                        onEntry: false,
                        onExit: false,
                        transitions: []
                    },
                    childStates: [],
                    connectedTo: ["off"],
                    absX: 100,
                    absY: 125
                },
                {
                    id: "cooking",
                    stateType: StateType.ATOMIC,
                    isFinal: false,
                    isFirst: false,
                    isActive: false,
                    posX: 250,
                    width: 200,
                    posY: 125,
                    height: 100,
                    details: {
                        onEntry: false,
                        onExit: false,
                        transitions: []
                    },
                    childStates: [],
                    connectedTo: [],
                    absX: 250,
                    absY: 125
                }
            ]
        }
    ]
}