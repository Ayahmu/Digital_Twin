import { FlowGraphWithOnDoneExecutionBlock } from "./flowGraphWithOnDoneExecutionBlock.js";
/**
 * @experimental
 * A type of block that listens to an event observable and activates
 * its output signal ("onTriggered"), when the event is triggered.
 */
export class FlowGraphEventBlock extends FlowGraphWithOnDoneExecutionBlock {
    /**
     * @internal
     */
    _execute() {
        this.onDone._activateSignal();
    }
}
//# sourceMappingURL=flowGraphEventBlock.js.map