import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
/**
 * @experimental
 * Block that triggers when a scene is ready.
 */
export class FlowGraphSceneReadyEventBlock extends FlowGraphEventBlock {
    constructor(graph, scene) {
        super(graph);
        this._scene = scene;
    }
    /**
     * @internal
     */
    _startListening() {
        if (!this._sceneReadyObserver) {
            this._sceneReadyObserver = this._scene.onReadyObservable.add(() => {
                this._execute();
            });
        }
    }
    /**
     * @internal
     */
    _stopListening() {
        this._scene.onReadyObservable.remove(this._sceneReadyObserver);
        this._sceneReadyObserver = null;
    }
}
//# sourceMappingURL=flowGraphSceneReadyEventBlock.js.map