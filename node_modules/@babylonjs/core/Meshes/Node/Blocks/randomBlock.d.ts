import { NodeGeometryBlock } from "../nodeGeometryBlock";
import type { NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint";
/**
 * Block used to get a random number
 */
export declare class RandomBlock extends NodeGeometryBlock {
    /**
     * Create a new RandomBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the min input component
     */
    get min(): NodeGeometryConnectionPoint;
    /**
     * Gets the max input component
     */
    get max(): NodeGeometryConnectionPoint;
    /**
     * Gets the geometry output component
     */
    get output(): NodeGeometryConnectionPoint;
    autoConfigure(): void;
    protected _buildBlock(): void;
}
