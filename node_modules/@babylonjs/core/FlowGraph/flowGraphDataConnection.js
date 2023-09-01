import { FlowGraphConnection, FlowGraphConnectionType } from "./flowGraphConnection.js";
/**
 * @experimental
 * Represents a connection point for data.
 * An unconnected input point can have a default value.
 * An output point will only have a value if it is connected to an input point. Furthermore,
 * if the point belongs to a "function" node, the node will run its function to update the value.
 */
export class FlowGraphDataConnection extends FlowGraphConnection {
    constructor(name, type, ownerBlock, _value) {
        super(name, type, ownerBlock);
        this._value = _value;
    }
    set value(value) {
        this._value = value;
    }
    get value() {
        if (this.type === FlowGraphConnectionType.Output) {
            this._ownerBlock._updateOutputs();
            return this._value;
        }
        if (!this._connectedPoint) {
            return this._value;
        }
        else {
            return this._connectedPoint.value;
        }
    }
}
//# sourceMappingURL=flowGraphDataConnection.js.map