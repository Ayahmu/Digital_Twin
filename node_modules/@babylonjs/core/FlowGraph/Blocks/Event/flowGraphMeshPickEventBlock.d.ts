import type { AbstractMesh } from "../../../Meshes/abstractMesh";
import type { FlowGraph } from "../../flowGraph";
import { FlowGraphEventBlock } from "../../flowGraphEventBlock";
/**
 * @experimental
 * A block that activates when a mesh is picked.
 */
export declare class FlowGraphMeshPickEventBlock extends FlowGraphEventBlock {
    private _meshToPick;
    private _meshPickObserver;
    private _meshDisposeObserver;
    constructor(graph: FlowGraph, meshToPick: AbstractMesh);
    set meshToPick(mesh: AbstractMesh);
    get meshToPick(): AbstractMesh;
    /**
     * @internal
     */
    _startListening(): void;
    /**
     * @internal
     */
    _stopListening(): void;
}
