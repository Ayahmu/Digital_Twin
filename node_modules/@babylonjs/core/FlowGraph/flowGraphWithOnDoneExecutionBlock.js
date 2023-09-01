import { FlowGraphExecutionBlock } from "./flowGraphExecutionBlock.js";
export class FlowGraphWithOnDoneExecutionBlock extends FlowGraphExecutionBlock {
    constructor(graph) {
        super(graph);
        this.onDone = this._registerSignalOutput("onDone");
    }
}
//# sourceMappingURL=flowGraphWithOnDoneExecutionBlock.js.map