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
    dtId: number;
    pId: number;
    id: number;
    name: string;
    initial: string | undefined;
    states: StateData[];
}