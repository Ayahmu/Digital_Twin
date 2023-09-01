import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { PointerEventTypes } from "../../../Events/pointerEvents.js";
/**
 * @experimental
 * A block that activates when a mesh is picked.
 */
export class FlowGraphMeshPickEventBlock extends FlowGraphEventBlock {
    constructor(graph, meshToPick) {
        super(graph);
        this._meshToPick = meshToPick;
    }
    set meshToPick(mesh) {
        if (this._meshToPick !== mesh) {
            const wasListening = !!this._meshPickObserver;
            if (wasListening) {
                this._stopListening();
            }
            this._meshToPick = mesh;
            if (wasListening) {
                this._startListening();
            }
        }
    }
    get meshToPick() {
        return this._meshToPick;
    }
    /**
     * @internal
     */
    _startListening() {
        if (!this._meshPickObserver) {
            this._meshPickObserver = this._meshToPick.getScene().onPointerObservable.add((pointerInfo) => {
                var _a;
                if (pointerInfo.type === PointerEventTypes.POINTERPICK && ((_a = pointerInfo.pickInfo) === null || _a === void 0 ? void 0 : _a.pickedMesh) === this._meshToPick) {
                    this._execute();
                }
            });
            this._meshDisposeObserver = this._meshToPick.onDisposeObservable.add(() => this._stopListening());
        }
    }
    /**
     * @internal
     */
    _stopListening() {
        this._meshToPick.getScene().onPointerObservable.remove(this._meshPickObserver);
        this._meshPickObserver = null;
        this._meshToPick.onDisposeObservable.remove(this._meshDisposeObserver);
        this._meshDisposeObserver = null;
    }
}
//# sourceMappingURL=flowGraphMeshPickEventBlock.js.map