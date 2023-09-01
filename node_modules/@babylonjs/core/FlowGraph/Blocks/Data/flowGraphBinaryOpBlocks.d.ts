import type { FlowGraph } from "../../flowGraph";
import { FlowGraphBlock } from "../../flowGraphBlock";
import type { FlowGraphDataConnection } from "../../flowGraphDataConnection";
/**
 * @experimental
 */
declare class FlowGraphBinaryOpBaseBlock<LeftT, RightT, OutputT> extends FlowGraphBlock {
    /**
     * The left input of the binary operation.
     */
    readonly left: FlowGraphDataConnection<LeftT>;
    /**
     * The right input of the binary operation.
     */
    readonly right: FlowGraphDataConnection<RightT>;
    /**
     * The output of the binary operation.
     */
    readonly output: FlowGraphDataConnection<OutputT>;
    private readonly _binOp;
    constructor(graph: FlowGraph, defaultLeftValue: LeftT, defaultRightValue: RightT, binOp: (left: LeftT, right: RightT) => OutputT);
    /**
     * @internal
     */
    _updateOutputs(): void;
}
/**
 * @experimental
 * Block that adds two numbers.
 */
export declare class FlowGraphAddNumberBlock extends FlowGraphBinaryOpBaseBlock<number, number, number> {
    constructor(graph: FlowGraph);
}
export {};
