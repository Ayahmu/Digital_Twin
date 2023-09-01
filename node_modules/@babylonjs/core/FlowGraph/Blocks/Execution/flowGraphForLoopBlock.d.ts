import type { FlowGraph } from "../../flowGraph";
import type { FlowGraphSignalConnection } from "../../flowGraphSignalConnection";
import type { FlowGraphDataConnection } from "../../flowGraphDataConnection";
import { FlowGraphWithOnDoneExecutionBlock } from "../../flowGraphWithOnDoneExecutionBlock.js";
/**
 * @experimental
 * Block that executes a loop.
 */
export declare class FlowGraphForLoopBlock extends FlowGraphWithOnDoneExecutionBlock {
    /**
     * The start index of the loop.
     */
    readonly startIndex: FlowGraphDataConnection<number>;
    /**
     * The end index of the loop.
     */
    readonly endIndex: FlowGraphDataConnection<number>;
    /**
     * The step of the loop.
     */
    readonly step: FlowGraphDataConnection<number>;
    /**
     * The current index of the loop.
     */
    readonly index: FlowGraphDataConnection<number>;
    /**
     * The signal that is activated when the loop body is executed.
     */
    readonly onLoop: FlowGraphSignalConnection;
    /**
     * The signal that is activated when the loop is done.
     */
    readonly onDone: FlowGraphSignalConnection;
    private _currentIndex;
    private _cachedEndIndex;
    private _cachedStep;
    constructor(graph: FlowGraph);
    private _executeLoop;
    /**
     * @internal
     */
    _execute(): void;
}
