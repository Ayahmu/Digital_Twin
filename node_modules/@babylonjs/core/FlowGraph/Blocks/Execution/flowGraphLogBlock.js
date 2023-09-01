import { FlowGraphWithOnDoneExecutionBlock } from "../../flowGraphWithOnDoneExecutionBlock.js";
/**
 * @experimental
 * Block that logs a message to the console.
 */
export class FlowGraphLogBlock extends FlowGraphWithOnDoneExecutionBlock {
    constructor(graph) {
        super(graph);
        this.message = this._registerDataInput("message", "Hello world");
    }
    /**
     * @internal
     */
    _execute() {
        const messageValue = this.message.value;
        console.log(messageValue);
        // activate the output flow block
        this.onDone._activateSignal();
    }
}
//# sourceMappingURL=flowGraphLogBlock.js.map