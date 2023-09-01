import type { Scene } from "../scene";
import type { Matrix } from "../Maths/math.vector";
import { Vector3 } from "../Maths/math.vector";
import type { IGreasedLineMaterial } from "../Materials/greasedLinePluginMaterial";
import { Mesh } from "./mesh";
import type { Ray, TrianglePickingPredicate } from "../Culling/ray";
import { PickingInfo } from "../Collisions/pickingInfo";
import type { Nullable } from "../types";
import type { Node } from "../node";
export type GreasedLinePoints = Vector3[] | Vector3[][] | Float32Array | Float32Array[] | number[][] | number[];
/**
 * Options for creating a GreasedLineMesh
 */
export interface GreasedLineMeshOptions {
    /**
     * Points of the line.
     */
    points: GreasedLinePoints;
    /**
     * Each line segmment (from point to point) can have it's width multiplier. Final width = widths[segmentIdx] * width.
     * Defaults to empty array.
     */
    widths?: number[];
    /**
     * If instance is specified, lines are added to the specified instance.
     * Defaults to undefined.
     */
    instance?: GreasedLineMesh;
    /**
     * You can manually set the color pointers so you can control which segment/part
     * will use which color from the colors material option
     */
    colorPointers?: number[];
    /**
     * UVs for the mesh
     */
    uvs?: number[];
    /**
     * If true, offsets and widths are updatable.
     * Defaults to false.
     */
    updatable?: boolean;
    /**
     * Use when @see instance is specified.
     * If true, the line will be rendered only after calling instance.updateLazy(). If false, line will be rerendered after every call to @see CreateGreasedLine
     * Defaults to false.
     */
    lazy?: boolean;
}
/**
 * GreasedLine
 */
export declare class GreasedLineMesh extends Mesh {
    readonly name: string;
    private _options;
    private _vertexPositions;
    private _previousAndSide;
    private _nextAndCounters;
    private _indices;
    private _uvs;
    private _points;
    private _offsets;
    private _colorPointers;
    private _widths;
    private _offsetsBuffer?;
    private _widthsBuffer?;
    private _colorPointersBuffer?;
    private _lazy;
    private _updatable;
    private static _V_START;
    private static _V_END;
    private static _V_OFFSET_START;
    private static _V_OFFSET_END;
    /**
     * Treshold used to pick the mesh
     */
    intersectionThreshold: number;
    constructor(name: string, scene: Scene, _options: GreasedLineMeshOptions);
    /**
     * "GreasedLineMesh"
     * @returns "GreasedLineMesh"
     */
    getClassName(): string;
    /**
     * Converts GreasedLinePoints to number[][]
     * @param points GreasedLinePoints
     * @returns number[][] with x, y, z coordinates of the points, like [[x, y, z, x, y, z, ...], [x, y, z, ...]]
     */
    static ConvertPoints(points: GreasedLinePoints): number[][];
    /**
     * Updated a lazy line. Rerenders the line and updates boundinfo as well.
     */
    updateLazy(): void;
    /**
     * Dispose the line and it's resources
     */
    dispose(): void;
    /**
     *
     * @returns true if the mesh was created in lazy mode
     */
    isLazy(): boolean;
    /**
     * Return the the points offsets
     */
    get offsets(): number[];
    /**
     * Sets point offests
     * @param offsets offset table [x,y,z, x,y,z, ....]
     */
    set offsets(offsets: number[]);
    /**
     * Gets widths at each line point like [widthLower, widthUpper, widthLower, widthUpper, ...]
     */
    get widths(): number[];
    /**
     * Sets widths at each line point
     * @param widths width table [widthLower, widthUpper, widthLower, widthUpper ...]
     */
    set widths(widths: number[]);
    /**
     * Gets the color pointer. Each vertex need a color pointer. These color pointers points to the colors in the color table @see colors
     */
    get colorPointers(): number[];
    /**
     * Sets the color pointer
     * @param colorPointers array of color pointer in the colors array. One pointer for every vertex is needed.
     */
    set colorPointers(colorPointers: number[]);
    /**
     * Gets the pluginMaterial associated with line
     */
    get greasedLineMaterial(): IGreasedLineMaterial | undefined;
    /**
     * Return copy the points.
     */
    get points(): number[][];
    /**
     * Adds new points to the line. It doesn't rerenders the line if in lazy mode.
     * @param points points table
     */
    addPoints(points: number[][]): void;
    private _updateColorPointers;
    private _updateWidths;
    /**
     * Sets line points and rerenders the line.
     * @param points points table
     */
    setPoints(points: number[][]): void;
    private _setPoints;
    private _createLineOptions;
    /**
     * Clones the GreasedLineMesh.
     * @param name new line name
     * @param newParent new parent node
     * @returns cloned line
     */
    clone(name?: string, newParent?: Nullable<Node>): GreasedLineMesh;
    /**
     * Serializes this GreasedLineMesh
     * @param serializationObject object to write serialization to
     */
    serialize(serializationObject: any): void;
    /**
     * Parses a serialized GreasedLineMesh
     * @param parsedMesh the serialized GreasedLineMesh
     * @param scene the scene to create the GreasedLineMesh in
     * @returns the created GreasedLineMesh
     */
    static Parse(parsedMesh: any, scene: Scene): Mesh;
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
    intersects(ray: Ray, fastCheck?: boolean, trianglePredicate?: TrianglePickingPredicate, onlyBoundingInfo?: boolean, worldToUse?: Matrix, skipBoundingInfo?: boolean): PickingInfo;
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
    findAllIntersections(ray: Ray, _fastCheck?: boolean, _trianglePredicate?: TrianglePickingPredicate, onlyBoundingInfo?: boolean, _worldToUse?: Matrix, skipBoundingInfo?: boolean, firstOnly?: boolean): {
        distance: number;
        point: Vector3;
    }[] | undefined;
    private _initGreasedLine;
    private get _boundingSphere();
    private static _CompareV3;
    private static _CopyV3;
    private _preprocess;
    private _createVertexBuffers;
    private _createOffsetsBuffer;
}
