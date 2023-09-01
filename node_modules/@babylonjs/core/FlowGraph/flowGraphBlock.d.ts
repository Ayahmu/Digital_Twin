import type { FlowGraph } from "./flowGraph";
import { FlowGraphDataConnection } from "./flowGraphDataConnection";
/**
 * @experimental
 * A block in a flow graph. The most basic form
 * of a block has inputs and outputs that contain
 * data.
 */
export declare class FlowGraphBlock {
    /**
     * The name of the block.
     */
    name: string;
    /**
     * The data inputs of the block.
     */
    readonly dataInputs: FlowGraphDataConnection<any>[];
    /**
     * The data outputs of the block.
     */
    readonly dataOutputs: FlowGraphDataConnection<any>[];
    /**
     * The graph that this block belongs to.
     */
    private _graph;
    protected constructor(graph: FlowGraph);
    /**
     * @internal
     */
    _updateOutputs(): void;
    protected _registerDataInput<T>(name: string, defaultValue: T): FlowGraphDataConnection<T>;
    protected _registerDataOutput<T>(name: string, defaultValue: T): FlowGraphDataConnection<T>;
}
