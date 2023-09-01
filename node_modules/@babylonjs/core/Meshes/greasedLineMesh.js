import { Vector3 } from "../Maths/math.vector.js";
import { GreasedLinePluginMaterial } from "../Materials/greasedLinePluginMaterial.js";
import { Mesh } from "./mesh.js";
import { Buffer, VertexBuffer } from "../Buffers/buffer.js";
import { VertexData } from "./mesh.vertexData.js";
import { PickingInfo } from "../Collisions/pickingInfo.js";
import { DeepCopier } from "../Misc/deepCopier.js";
import { GreasedLineTools } from "../Misc/greasedLineTools.js";
import { GreasedLineSimpleMaterial } from "../Materials/greasedLineSimpleMaterial.js";
Mesh._GreasedLineMeshParser = (parsedMesh, scene) => {
    return GreasedLineMesh.Parse(parsedMesh, scene);
};
/**
 * GreasedLine
 */
export class GreasedLineMesh extends Mesh {
    constructor(name, scene, _options) {
        var _a, _b, _c, _d;
        super(name, scene, null, null, false, false);
        this.name = name;
        this._options = _options;
        this._lazy = false;
        this._updatable = false;
        /**
         * Treshold used to pick the mesh
         */
        this.intersectionThreshold = 0.1;
        this._lazy = (_a = _options.lazy) !== null && _a !== void 0 ? _a : false;
        this._updatable = (_b = _options.updatable) !== null && _b !== void 0 ? _b : false;
        this._vertexPositions = [];
        this._indices = [];
        this._uvs = [];
        this._points = [];
        this._colorPointers = (_c = _options.colorPointers) !== null && _c !== void 0 ? _c : [];
        this._widths = (_d = _options.widths) !== null && _d !== void 0 ? _d : new Array(_options.points.length).fill(1);
        this._previousAndSide = [];
        this._nextAndCounters = [];
        if (_options.points) {
            this.addPoints(GreasedLineMesh.ConvertPoints(_options.points));
        }
    }
    /**
     * "GreasedLineMesh"
     * @returns "GreasedLineMesh"
     */
    getClassName() {
        return "GreasedLineMesh";
    }
    /**
     * Converts GreasedLinePoints to number[][]
     * @param points GreasedLinePoints
     * @returns number[][] with x, y, z coordinates of the points, like [[x, y, z, x, y, z, ...], [x, y, z, ...]]
     */
    static ConvertPoints(points) {
        if (points.length && Array.isArray(points) && typeof points[0] === "number") {
            return [points];
        }
        else if (points.length && Array.isArray(points[0]) && typeof points[0][0] === "number") {
            return points;
        }
        else if (points.length && !Array.isArray(points[0]) && points[0] instanceof Vector3) {
            const positions = [];
            for (let j = 0; j < points.length; j++) {
                const p = points[j];
                positions.push(p.x, p.y, p.z);
            }
            return [positions];
        }
        else if (points.length > 0 && Array.isArray(points[0]) && points[0].length > 0 && points[0][0] instanceof Vector3) {
            const positions = [];
            const vectorPoints = points;
            vectorPoints.forEach((p) => {
                positions.push(p.flatMap((p2) => [p2.x, p2.y, p2.z]));
            });
            return positions;
        }
        else if (points instanceof Float32Array) {
            return [Array.from(points)];
        }
        else if (points.length && points[0] instanceof Float32Array) {
            const positions = [];
            points.forEach((p) => {
                positions.push(Array.from(p));
            });
            return positions;
        }
        return [];
    }
    /**
     * Updated a lazy line. Rerenders the line and updates boundinfo as well.
     */
    updateLazy() {
        var _a;
        this._setPoints(this._points);
        if (!this._options.colorPointers) {
            this._updateColorPointers();
        }
        this._createVertexBuffers();
        this.refreshBoundingInfo();
        (_a = this.greasedLineMaterial) === null || _a === void 0 ? void 0 : _a.updateLazy();
    }
    /**
     * Dispose the line and it's resources
     */
    dispose() {
        super.dispose();
    }
    /**
     *
     * @returns true if the mesh was created in lazy mode
     */
    isLazy() {
        return this._lazy;
    }
    /**
     * Return the the points offsets
     */
    get offsets() {
        return this._offsets;
    }
    /**
     * Sets point offests
     * @param offsets offset table [x,y,z, x,y,z, ....]
     */
    set offsets(offsets) {
        this._offsets = offsets;
        if (!this._offsetsBuffer) {
            this._createOffsetsBuffer(offsets);
        }
        else {
            this._offsetsBuffer && this._offsetsBuffer.update(offsets);
        }
    }
    /**
     * Gets widths at each line point like [widthLower, widthUpper, widthLower, widthUpper, ...]
     */
    get widths() {
        return this._widths;
    }
    /**
     * Sets widths at each line point
     * @param widths width table [widthLower, widthUpper, widthLower, widthUpper ...]
     */
    set widths(widths) {
        this._widths = widths;
        if (!this._lazy) {
            this._widthsBuffer && this._widthsBuffer.update(widths);
        }
    }
    /**
     * Gets the color pointer. Each vertex need a color pointer. These color pointers points to the colors in the color table @see colors
     */
    get colorPointers() {
        return this._colorPointers;
    }
    /**
     * Sets the color pointer
     * @param colorPointers array of color pointer in the colors array. One pointer for every vertex is needed.
     */
    set colorPointers(colorPointers) {
        this._colorPointers = colorPointers;
        if (!this._lazy) {
            this._colorPointersBuffer && this._colorPointersBuffer.update(colorPointers);
        }
    }
    /**
     * Gets the pluginMaterial associated with line
     */
    get greasedLineMaterial() {
        var _a, _b;
        if (this.material && this.material instanceof GreasedLineSimpleMaterial) {
            return this.material;
        }
        const materialPlugin = (_b = (_a = this.material) === null || _a === void 0 ? void 0 : _a.pluginManager) === null || _b === void 0 ? void 0 : _b.getPlugin(GreasedLinePluginMaterial.GREASED_LINE_MATERIAL_NAME);
        if (materialPlugin) {
            return materialPlugin;
        }
        return;
    }
    /**
     * Return copy the points.
     */
    get points() {
        const pointsCopy = [];
        DeepCopier.DeepCopy(this._points, pointsCopy);
        return pointsCopy;
    }
    /**
     * Adds new points to the line. It doesn't rerenders the line if in lazy mode.
     * @param points points table
     */
    addPoints(points) {
        for (const p of points) {
            this._points.push(p);
        }
        if (!this._lazy) {
            this.setPoints(this._points);
        }
    }
    _updateColorPointers() {
        let colorPointer = 0;
        this._colorPointers = [];
        this._points.forEach((p) => {
            for (let jj = 0; jj < p.length; jj += 3) {
                this._colorPointers.push(colorPointer);
                this._colorPointers.push(colorPointer++);
            }
        });
    }
    _updateWidths() {
        let pointCount = 0;
        for (const points of this._points) {
            pointCount += points.length;
        }
        const countDiff = (pointCount / 3) * 2 - this._widths.length;
        for (let i = 0; i < countDiff; i++) {
            this._widths.push(1);
        }
    }
    /**
     * Sets line points and rerenders the line.
     * @param points points table
     */
    setPoints(points) {
        this._points = points;
        this._updateWidths();
        this._updateColorPointers();
        this._setPoints(points);
    }
    _setPoints(points) {
        this._points = points;
        this._options.points = points;
        this._initGreasedLine();
        let indiceOffset = 0;
        points.forEach((p) => {
            var _a;
            const counters = [];
            const positions = [];
            const indices = [];
            const totalLength = GreasedLineTools.GetLineLength(p);
            for (let j = 0, jj = 0; jj < p.length; j++, jj += 3) {
                const partialLine = p.slice(0, jj + 3);
                const partialLineLength = GreasedLineTools.GetLineLength(partialLine);
                const c = partialLineLength / totalLength;
                positions.push(p[jj], p[jj + 1], p[jj + 2]);
                positions.push(p[jj], p[jj + 1], p[jj + 2]);
                counters.push(c);
                counters.push(c);
                if (jj < p.length - 3) {
                    const n = j * 2 + indiceOffset;
                    indices.push(n, n + 1, n + 2);
                    indices.push(n + 2, n + 1, n + 3);
                }
            }
            indiceOffset += (p.length / 3) * 2;
            const previous = [];
            const next = [];
            const side = [];
            let uvs = [];
            this._preprocess(positions, previous, next, side, uvs);
            for (const vp of positions) {
                this._vertexPositions.push(vp);
            }
            for (const i of indices) {
                this._indices.push(i);
            }
            for (let i = 0; i < side.length; i++) {
                this._previousAndSide.push(previous[i * 3], previous[i * 3 + 1], previous[i * 3 + 2], side[i]);
                this._nextAndCounters.push(next[i * 3], next[i * 3 + 1], next[i * 3 + 2], counters[i]);
            }
            uvs = (_a = this._options.uvs) !== null && _a !== void 0 ? _a : uvs;
            for (const uv of uvs) {
                this._uvs.push(uv);
            }
        });
        if (!this._lazy) {
            if (!this._options.colorPointers) {
                this._updateColorPointers();
            }
            this._createVertexBuffers();
            this.refreshBoundingInfo();
        }
    }
    _createLineOptions() {
        const lineOptions = {
            points: this._points,
            colorPointers: this._colorPointers,
            lazy: this._lazy,
            updatable: this._updatable,
            uvs: this._uvs,
            widths: this._widths,
        };
        return lineOptions;
    }
    /**
     * Clones the GreasedLineMesh.
     * @param name new line name
     * @param newParent new parent node
     * @returns cloned line
     */
    clone(name = `${this.name}-cloned`, newParent) {
        const lineOptions = this._createLineOptions();
        const deepCopiedLineOptions = {};
        DeepCopier.DeepCopy(lineOptions, deepCopiedLineOptions, ["instance"]);
        const cloned = new GreasedLineMesh(name, this._scene, deepCopiedLineOptions);
        if (newParent) {
            cloned.parent = newParent;
        }
        cloned.material = this.material;
        return cloned;
    }
    /**
     * Serializes this GreasedLineMesh
     * @param serializationObject object to write serialization to
     */
    serialize(serializationObject) {
        super.serialize(serializationObject);
        serializationObject.type = this.getClassName();
        serializationObject.lineOptions = this._createLineOptions();
    }
    /**
     * Parses a serialized GreasedLineMesh
     * @param parsedMesh the serialized GreasedLineMesh
     * @param scene the scene to create the GreasedLineMesh in
     * @returns the created GreasedLineMesh
     */
    static Parse(parsedMesh, scene) {
        const lineOptions = parsedMesh.lineOptions;
        const name = parsedMesh.name;
        const result = new GreasedLineMesh(name, scene, lineOptions);
        return result;
    }
    /**
     * Checks whether a ray is intersecting this GreasedLineMesh
     * @param ray ray to check the intersection of this mesh with
     * @param fastCheck not supported
     * @param trianglePredicate not supported
     * @param onlyBoundingInfo defines a boolean indicating if picking should only happen using bounding info (false by default)
     * @param worldToUse not supported
     * @param skipBoundingInfo a boolean indicating if we should skip the bounding info check
     * @returns the picking info
     */
    intersects(ray, fastCheck, trianglePredicate, onlyBoundingInfo = false, worldToUse, skipBoundingInfo = false) {
        const pickingInfo = new PickingInfo();
        const intersections = this.findAllIntersections(ray, fastCheck, trianglePredicate, onlyBoundingInfo, worldToUse, skipBoundingInfo, true);
        if ((intersections === null || intersections === void 0 ? void 0 : intersections.length) === 1) {
            const intersection = intersections[0];
            pickingInfo.hit = true;
            pickingInfo.distance = intersection.distance;
            pickingInfo.ray = ray;
            pickingInfo.pickedMesh = this;
            pickingInfo.pickedPoint = intersection.point;
        }
        return pickingInfo;
    }
    /**
     * Gets all intersections of a ray and the line
     * @param ray Ray to check the intersection of this mesh with
     * @param _fastCheck not supported
     * @param _trianglePredicate not supported
     * @param onlyBoundingInfo defines a boolean indicating if picking should only happen using bounding info (false by default)
     * @param _worldToUse not supported
     * @param skipBoundingInfo a boolean indicating if we should skip the bounding info check
     * @param firstOnly If true, the first and only intersection is immediatelly returned if found
     * @returns intersection(s)
     */
    findAllIntersections(ray, _fastCheck, _trianglePredicate, onlyBoundingInfo = false, _worldToUse, skipBoundingInfo = false, firstOnly = false) {
        var _a, _b;
        if (onlyBoundingInfo && !skipBoundingInfo && ray.intersectsSphere(this._boundingSphere, this.intersectionThreshold) === false) {
            return;
        }
        const indices = this.getIndices();
        const positions = this.getVerticesData(VertexBuffer.PositionKind);
        const widths = this._widths;
        const lineWidth = (_b = (_a = this.greasedLineMaterial) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 1;
        const intersects = [];
        if (indices && positions && widths) {
            let i = 0, l = 0;
            for (i = 0, l = indices.length - 1; i < l; i += 3) {
                const a = indices[i];
                const b = indices[i + 1];
                GreasedLineMesh._V_START.fromArray(positions, a * 3);
                GreasedLineMesh._V_END.fromArray(positions, b * 3);
                if (this._offsets) {
                    GreasedLineMesh._V_OFFSET_START.fromArray(this._offsets, a * 3);
                    GreasedLineMesh._V_OFFSET_END.fromArray(this._offsets, b * 3);
                    GreasedLineMesh._V_START.addInPlace(GreasedLineMesh._V_OFFSET_START);
                    GreasedLineMesh._V_END.addInPlace(GreasedLineMesh._V_OFFSET_END);
                }
                const iFloored = Math.floor(i / 3);
                const width = widths[iFloored] !== undefined ? widths[iFloored] : 1;
                const precision = (this.intersectionThreshold * (lineWidth * width)) / 2;
                const distance = ray.intersectionSegment(GreasedLineMesh._V_START, GreasedLineMesh._V_END, precision);
                if (distance !== -1) {
                    intersects.push({
                        distance: distance,
                        point: ray.direction.normalize().multiplyByFloats(distance, distance, distance).add(ray.origin),
                    });
                    if (firstOnly) {
                        return intersects;
                    }
                }
            }
            i = l;
        }
        return intersects;
    }
    _initGreasedLine() {
        this._vertexPositions = [];
        this._previousAndSide = [];
        this._nextAndCounters = [];
        this._indices = [];
        this._uvs = [];
    }
    get _boundingSphere() {
        return this.getBoundingInfo().boundingSphere;
    }
    static _CompareV3(positionIdx1, positionIdx2, positions) {
        const arrayIdx1 = positionIdx1 * 6;
        const arrayIdx2 = positionIdx2 * 6;
        return positions[arrayIdx1] === positions[arrayIdx2] && positions[arrayIdx1 + 1] === positions[arrayIdx2 + 1] && positions[arrayIdx1 + 2] === positions[arrayIdx2 + 2];
    }
    static _CopyV3(positionIdx, positions) {
        const arrayIdx = positionIdx * 6;
        return [positions[arrayIdx], positions[arrayIdx + 1], positions[arrayIdx + 2]];
    }
    _preprocess(positions, previous, next, side, uvs) {
        const l = positions.length / 6;
        let v = [];
        if (GreasedLineMesh._CompareV3(0, l - 1, positions)) {
            v = GreasedLineMesh._CopyV3(l - 2, positions);
        }
        else {
            v = GreasedLineMesh._CopyV3(0, positions);
        }
        previous.push(v[0], v[1], v[2]);
        previous.push(v[0], v[1], v[2]);
        for (let j = 0; j < l; j++) {
            side.push(1);
            side.push(-1);
            // uvs
            if (!this._options.uvs) {
                uvs.push(j / (l - 1), 0);
                uvs.push(j / (l - 1), 1);
            }
            if (j < l - 1) {
                v = GreasedLineMesh._CopyV3(j, positions);
                previous.push(v[0], v[1], v[2]);
                previous.push(v[0], v[1], v[2]);
            }
            if (j > 0) {
                v = GreasedLineMesh._CopyV3(j, positions);
                next.push(v[0], v[1], v[2]);
                next.push(v[0], v[1], v[2]);
            }
        }
        if (GreasedLineMesh._CompareV3(l - 1, 0, positions)) {
            v = GreasedLineMesh._CopyV3(1, positions);
        }
        else {
            v = GreasedLineMesh._CopyV3(l - 1, positions);
        }
        next.push(v[0], v[1], v[2]);
        next.push(v[0], v[1], v[2]);
        return {
            previous,
            next,
            uvs,
            side,
        };
    }
    _createVertexBuffers() {
        const vertexData = new VertexData();
        vertexData.positions = this._vertexPositions;
        vertexData.indices = this._indices;
        vertexData.uvs = this._uvs;
        vertexData.applyToMesh(this, this._options.updatable);
        const engine = this._scene.getEngine();
        const previousAndSideBuffer = new Buffer(engine, this._previousAndSide, false, 4);
        this.setVerticesBuffer(previousAndSideBuffer.createVertexBuffer("grl_previousAndSide", 0, 4));
        const nextAndCountersBuffer = new Buffer(engine, this._nextAndCounters, false, 4);
        this.setVerticesBuffer(nextAndCountersBuffer.createVertexBuffer("grl_nextAndCounters", 0, 4));
        const widthBuffer = new Buffer(engine, this._widths, this._updatable, 1);
        this.setVerticesBuffer(widthBuffer.createVertexBuffer("grl_widths", 0, 1));
        this._widthsBuffer = widthBuffer;
        const colorPointersBuffer = new Buffer(engine, this._colorPointers, this._updatable, 1);
        this.setVerticesBuffer(colorPointersBuffer.createVertexBuffer("grl_colorPointers", 0, 1));
        this._colorPointersBuffer = colorPointersBuffer;
    }
    _createOffsetsBuffer(offsets) {
        const engine = this._scene.getEngine();
        const offsetBuffer = new Buffer(engine, offsets, this._updatable, 3);
        this.setVerticesBuffer(offsetBuffer.createVertexBuffer("grl_offsets", 0, 3));
        this._offsetsBuffer = offsetBuffer;
    }
}
GreasedLineMesh._V_START = new Vector3();
GreasedLineMesh._V_END = new Vector3();
GreasedLineMesh._V_OFFSET_START = new Vector3();
GreasedLineMesh._V_OFFSET_END = new Vector3();
//# sourceMappingURL=greasedLineMesh.js.map