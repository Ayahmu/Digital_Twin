import type { Scene } from "../../../scene";
import type { FlowGraph } from "../../flowGraph";
import { FlowGraphEventBlock } from "../../flowGraphEventBlock";
/**
 * @experimental
 * Block that triggers when a scene is ready.
 */
export declare class FlowGraphSceneReadyEventBlock extends FlowGraphEventBlock {
    private _scene;
    private _sceneReadyObserver;
    constructor(graph: FlowGraph, scene: Scene);
    /**
     * @internal
     */
    _startListening(): void;
    /**
     * @internal
     */
    _stopListening(): void;
}
