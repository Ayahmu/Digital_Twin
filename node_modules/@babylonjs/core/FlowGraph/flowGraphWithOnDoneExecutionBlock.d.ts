import type { FlowGraph } from "./flowGraph";
import { FlowGraphExecutionBlock } from "./flowGraphExecutionBlock";
import type { FlowGraphSignalConnection } from "./flowGraphSignalConnection";
export declare abstract class FlowGraphWithOnDoneExecutionBlock extends FlowGraphExecutionBlock {
    readonly onDone: FlowGraphSignalConnection;
    protected constructor(graph: FlowGraph);
}
