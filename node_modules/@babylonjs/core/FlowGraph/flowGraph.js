import { FlowGraphEventBlock } from "./flowGraphEventBlock.js";
/**
 * @experimental
 * Class used to represent a flow graph.
 * A flow graph is a graph of blocks that can be used to create complex logic.
 * Blocks can be added to the graph and connected to each other.
 * The graph can then be started, which will init and start all of its event blocks.
 */
export class FlowGraph {
    constructor(_scene) {
        this._scene = _scene;
        this._blocks = [];
        this._sceneDisposeObserver = this._scene.onDisposeObservable.add(this.dispose.bind(this));
    }
    /**
     * @internal
     * @param block
     */
    _addBlock(block) {
        this._blocks.push(block);
    }
    /**
     * Finds a block by its name.
     * @param name
     * @returns
     */
    findBlockByName(name) {
        return this._blocks.find((block) => block.name === name);
    }
    /**
     * Starts the flow graph.
     */
    start() {
        for (const block of this._blocks) {
            if (block instanceof FlowGraphEventBlock) {
                block._startListening();
            }
        }
    }
    /**
     * Disposes of the flow graph.
     */
    dispose() {
        for (const block of this._blocks) {
            if (block instanceof FlowGraphEventBlock) {
                block._stopListening();
            }
        }
        this._blocks.length = 0;
        this._scene.onDisposeObservable.remove(this._sceneDisposeObserver);
        this._sceneDisposeObserver = null;
    }
}
//# sourceMappingURL=flowGraph.js.map