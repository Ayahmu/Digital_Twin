import { FlowGraphWithOnDoneExecutionBlock } from "../../flowGraphWithOnDoneExecutionBlock.js";
/**
 * @experimental
 * Block that executes a loop.
 */
export class FlowGraphForLoopBlock extends FlowGraphWithOnDoneExecutionBlock {
    constructor(graph) {
        super(graph);
        this._currentIndex = 0;
        this._cachedEndIndex = 0;
        this._cachedStep = 0;
        this.startIndex = this._registerDataInput("startIndex", 0);
        this.endIndex = this._registerDataInput("endIndex", 0);
        this.step = this._registerDataInput("step", 1);
        this.index = this._registerDataOutput("index", 0);
        this.onLoop = this._registerSignalOutput("onLoop");
        this.onDone = this._registerSignalOutput("onDone");
    }
    _executeLoop() {
        if (this._currentIndex < this._cachedEndIndex) {
            this.index.value = this._currentIndex;
            this.onLoop._activateSignal();
            this._currentIndex += this._cachedStep;
            this._executeLoop();
        }
        else {
            this.onDone._activateSignal();
        }
    }
    /**
     * @internal
     */
    _execute() {
        this._currentIndex = this.startIndex.value;
        this._cachedEndIndex = this.endIndex.value;
        this._cachedStep = this.step.value;
        this._executeLoop();
    }
}
//# sourceMappingURL=flowGraphForLoopBlock.js.map