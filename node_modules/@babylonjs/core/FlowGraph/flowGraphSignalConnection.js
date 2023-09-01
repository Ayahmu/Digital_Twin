import { FlowGraphConnection, FlowGraphConnectionType } from "./flowGraphConnection.js";
/**
 * @experimental
 * Represents a connection point for a signal.
 * When an output point is activated, it will activate the connected input point.
 * When an input point is activated, it will execute the block it belongs to.
 */
export class FlowGraphSignalConnection extends FlowGraphConnection {
    /**
     * @internal
     */
    _activateSignal() {
        var _a;
        if (this.type === FlowGraphConnectionType.Input) {
            this._ownerBlock._execute();
        }
        else {
            (_a = this._connectedPoint) === null || _a === void 0 ? void 0 : _a._activateSignal();
        }
    }
}
//# sourceMappingURL=flowGraphSignalConnection.js.map