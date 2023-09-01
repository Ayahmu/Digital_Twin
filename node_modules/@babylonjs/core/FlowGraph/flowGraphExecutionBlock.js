import { FlowGraphBlock } from "./flowGraphBlock.js";
import { FlowGraphConnectionType } from "./flowGraphConnection.js";
import { FlowGraphSignalConnection } from "./flowGraphSignalConnection.js";
/**
 * @experimental
 * A block that executes some action. Always has an input signal.
 * Can have one or more output signals.
 */
export class FlowGraphExecutionBlock extends FlowGraphBlock {
    constructor(graph) {
        super(graph);
        this._signalInputs = [];
        this._signalOutputs = [];
        this.onStart = this._registerSignalInput("onStart");
    }
    _registerSignalInput(name) {
        const input = new FlowGraphSignalConnection(name, FlowGraphConnectionType.Input, this);
        this._signalInputs.push(input);
        return input;
    }
    _registerSignalOutput(name) {
        const output = new FlowGraphSignalConnection(name, FlowGraphConnectionType.Output, this);
        this._signalOutputs.push(output);
        return output;
    }
}
//# sourceMappingURL=flowGraphExecutionBlock.js.map