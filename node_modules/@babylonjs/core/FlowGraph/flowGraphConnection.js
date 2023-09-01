/**
 * @experimental
 * The type of a connection point - inpput or output.
 */
export var FlowGraphConnectionType;
(function (FlowGraphConnectionType) {
    FlowGraphConnectionType[FlowGraphConnectionType["Input"] = 0] = "Input";
    FlowGraphConnectionType[FlowGraphConnectionType["Output"] = 1] = "Output";
})(FlowGraphConnectionType || (FlowGraphConnectionType = {}));
/**
 * @experimental
 * The base connection class.
 */
export class FlowGraphConnection {
    constructor(name, /** @internal */ _type, _ownerBlock) {
        this.name = name;
        this._type = _type;
        this._ownerBlock = _ownerBlock;
        /** @internal */
        this._connectedPoint = null;
    }
    /**
     * The type of the connection
     */
    get type() {
        return this._type;
    }
    /**
     * Connects two points together.
     * @param point
     */
    connectTo(point) {
        if (this._type === point._type) {
            throw new Error(`Cannot connect two points of type ${this.type}`);
        }
        this._connectedPoint = point;
        point._connectedPoint = this;
    }
}
//# sourceMappingURL=flowGraphConnection.js.map