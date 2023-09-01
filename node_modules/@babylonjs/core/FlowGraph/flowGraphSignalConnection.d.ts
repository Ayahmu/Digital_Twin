import type { FlowGraphExecutionBlock } from "./flowGraphExecutionBlock";
import { FlowGraphConnection } from "./flowGraphConnection";
/**
 * @experimental
 * Represents a connection point for a signal.
 * When an output point is activated, it will activate the connected input point.
 * When an input point is activated, it will execute the block it belongs to.
 */
export declare class FlowGraphSignalConnection extends FlowGraphConnection<FlowGraphExecutionBlock, FlowGraphSignalConnection> {
    /**
     * @internal
     */
    _activateSignal(): void;
}
