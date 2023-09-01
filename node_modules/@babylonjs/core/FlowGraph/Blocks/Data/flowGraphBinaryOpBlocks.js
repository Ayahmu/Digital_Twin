import { FlowGraphBlock } from "../../flowGraphBlock.js";
/**
 * @experimental
 */
class FlowGraphBinaryOpBaseBlock extends FlowGraphBlock {
    constructor(graph, defaultLeftValue, defaultRightValue, binOp) {
        super(graph);
        this._binOp = binOp;
        this.left = this._registerDataInput("left", defaultLeftValue);
        this.right = this._registerDataInput("right", defaultRightValue);
        this.output = this._registerDataOutput("output", binOp(defaultLeftValue, defaultRightValue));
    }
    /**
     * @internal
     */
    _updateOutputs() {
        this.output.value = this._binOp(this.left.value, this.right.value);
    }
}
/**
 * @experimental
 * Block that adds two numbers.
 */
export class FlowGraphAddNumberBlock extends FlowGraphBinaryOpBaseBlock {
    constructor(graph) {
        super(graph, 0, 0, (left, right) => left + right);
    }
}
//# sourceMappingURL=flowGraphBinaryOpBlocks.js.map