import { FlowGraphConnectionType } from "./flowGraphConnection.js";
import { FlowGraphDataConnection } from "./flowGraphDataConnection.js";
/**
 * @experimental
 * A block in a flow graph. The most basic form
 * of a block has inputs and outputs that contain
 * data.
 */
export class FlowGraphBlock {
    constructor(graph) {
        /**
         * The data inputs of the block.
         */
        this.dataInputs = [];
        /**
         * The data outputs of the block.
         */
        this.dataOutputs = [];
        this._graph = graph;
        this._graph._addBlock(this);
    }
    /**
     * @internal
     */
    _updateOutputs() {
        // empty by default, overriden in data blocks
    }
    _registerDataInput(name, defaultValue) {
        const input = new FlowGraphDataConnection(name, FlowGraphConnectionType.Input, this, defaultValue);
        this.dataInputs.push(input);
        return input;
    }
    _registerDataOutput(name, defaultValue) {
        const output = new FlowGraphDataConnection(name, FlowGraphConnectionType.Output, this, defaultValue);
        this.dataOutputs.push(output);
        return output;
    }
}
//# sourceMappingURL=flowGraphBlock.js.map