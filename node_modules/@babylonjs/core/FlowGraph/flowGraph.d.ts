import type { Scene } from "../scene";
import type { FlowGraphBlock } from "./flowGraphBlock";
/**
 * @experimental
 * Class used to represent a flow graph.
 * A flow graph is a graph of blocks that can be used to create complex logic.
 * Blocks can be added to the graph and connected to each other.
 * The graph can then be started, which will init and start all of its event blocks.
 */
export declare class FlowGraph {
    private _scene;
    private _blocks;
    private _sceneDisposeObserver;
    constructor(_scene: Scene);
    /**
     * @internal
     * @param block
     */
    _addBlock(block: FlowGraphBlock): void;
    /**
     * Finds a block by its name.
     * @param name
     * @returns
     */
    findBlockByName(name: string): FlowGraphBlock | undefined;
    /**
     * Starts the flow graph.
     */
    start(): void;
    /**
     * Disposes of the flow graph.
     */
    dispose(): void;
}
