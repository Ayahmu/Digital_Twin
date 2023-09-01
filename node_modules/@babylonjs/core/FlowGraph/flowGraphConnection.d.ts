import type { Nullable } from "../types";
/**
 * @experimental
 * The type of a connection point - inpput or output.
 */
export declare enum FlowGraphConnectionType {
    Input = 0,
    Output = 1
}
/**
 * @experimental
 */
export interface IConnectable {
    _connectedPoint: Nullable<IConnectable>;
    _type: FlowGraphConnectionType;
    connectTo(point: IConnectable): void;
}
/**
 * @experimental
 * The base connection class.
 */
export declare class FlowGraphConnection<BlockT, ConnectedToT extends IConnectable> implements IConnectable {
    name: string;
    _type: FlowGraphConnectionType;
    protected _ownerBlock: BlockT;
    /** @internal */
    _connectedPoint: Nullable<ConnectedToT>;
    constructor(name: string, /** @internal */ _type: FlowGraphConnectionType, _ownerBlock: BlockT);
    /**
     * The type of the connection
     */
    get type(): FlowGraphConnectionType;
    /**
     * Connects two points together.
     * @param point
     */
    connectTo(point: ConnectedToT): void;
}
