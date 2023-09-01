import { FlowGraphWithOnDoneExecutionBlock } from "./flowGraphWithOnDoneExecutionBlock";
/**
 * @experimental
 * A type of block that listens to an event observable and activates
 * its output signal ("onTriggered"), when the event is triggered.
 */
export declare abstract class FlowGraphEventBlock extends FlowGraphWithOnDoneExecutionBlock {
    /**
     * @internal
     */
    abstract _startListening(): void;
    /**
     * @internal
     */
    abstract _stopListening(): void;
    /**
     * @internal
     */
    _execute(): void;
}
