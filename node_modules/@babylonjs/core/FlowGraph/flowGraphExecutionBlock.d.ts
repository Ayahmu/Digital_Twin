import type { FlowGraph } from "./flowGraph";
import { FlowGraphBlock } from "./flowGraphBlock";
import { FlowGraphSignalConnection } from "./flowGraphSignalConnection";
/**
 * @experimental
 * A block that executes some action. Always has an input signal.
 * Can have one or more output signals.
 */
export declare abstract class FlowGraphExecutionBlock extends FlowGraphBlock {
    /**
     * The input signal of the block.
     */
    readonly onStart: FlowGraphSignalConnection;
    private readonly _signalInputs;
    private readonly _signalOutputs;
    protected constructor(graph: FlowGraph);
    /**
     * @internal
     * Executes the flow graph execution block.
     */
    abstract _execute(): void;
    protected _registerSignalInput(name: string): FlowGraphSignalConnection;
    protected _registerSignalOutput(name: string): FlowGraphSignalConnection;
}
