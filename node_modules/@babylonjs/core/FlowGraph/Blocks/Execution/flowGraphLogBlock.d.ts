import type { FlowGraph } from "../../flowGraph";
import type { FlowGraphDataConnection } from "../../flowGraphDataConnection";
import { FlowGraphWithOnDoneExecutionBlock } from "../../flowGraphWithOnDoneExecutionBlock.js";
/**
 * @experimental
 * Block that logs a message to the console.
 */
export declare class FlowGraphLogBlock extends FlowGraphWithOnDoneExecutionBlock {
    /**
     * The message to log.
     */
    readonly message: FlowGraphDataConnection<any>;
    constructor(graph: FlowGraph);
    /**
     * @internal
     */
    _execute(): void;
}
