import type { Scene } from "../scene";
import type { GreasedLineMaterialOptions, IGreasedLineMaterial } from "./greasedLinePluginMaterial";
import { GreasedLineMeshColorMode, GreasedLineMeshColorDistributionType } from "./greasedLinePluginMaterial";
import { ShaderMaterial } from "./shaderMaterial";
import type { Nullable } from "../types";
import { Color3 } from "../Maths/math.color";
import { Vector2 } from "../Maths/math.vector";
import "../Shaders/greasedLine.fragment";
import "../Shaders/greasedLine.vertex";
/**
 * GreasedLineSimpleMaterial
 */
export declare class GreasedLineSimpleMaterial extends ShaderMaterial implements IGreasedLineMaterial {
    /**
     * Default line color for newly created lines
     */
    static DEFAULT_COLOR: Color3;
    /**
     * Default line width when sizeAttenuation is true
     */
    static DEFAULT_WIDTH_ATTENUATED: number;
    /**
     * Defaule line width
     */
    static DEFAULT_WIDTH: number;
    private static _EmptyColorsTexture;
    private _visibility;
    private _width;
    private _useDash;
    private _dashCount;
    private _dashArray;
    private _dashRatio;
    private _dashOffset;
    private _useColors;
    private _color;
    private _colors;
    private _colorsDistributionType;
    private _colorMode;
    private _colorsSampling;
    private _resolution;
    private _sizeAttenuation;
    private _colorsTexture?;
    private _engine;
    /**
     * GreasedLineSimple material constructor
     * @param name material name
     * @param scene the scene
     * @param options material options
     */
    constructor(name: string, scene: Scene, options: GreasedLineMaterialOptions);
    /**
     * Converts boolean to number.
     * @param bool
     * @returns 1 if true, 0 if false.
     */
    private static _BooleanToNumber;
    /**
     * Converts an array of Color3 to Uint8Array
     * @param colors Arrray of Color3
     * @returns Uin8Array of colors [r, g, b, a, r, g, b, a, ...]
     */
    private static _Color3toRGBAUint8;
    /**
     * Creates a RawTexture from an RGBA color array and sets it on the plugin material instance.
     * @param name name of the texture
     * @param colors Uint8Array of colors
     */
    private _createColorsTexture;
    /**
     * Disposes the plugin material.
     */
    dispose(): void;
    private _setColorModeAndColorDistributionType;
    /**
     * Updates the material. Use when material created in lazy mode.
     */
    updateLazy(): void;
    /**
     * Returns the colors used to colorize the line
     */
    get colors(): Nullable<Color3[]>;
    /**
     * Sets the colors used to colorize the line
     */
    set colors(value: Nullable<Color3[]>);
    /**
     * Creates or updates the colors texture
     * @param colors color table RGBA
     * @param lazy if lazy, the colors are not updated
     * @param forceNewTexture force creation of a new texture
     * @returns
     */
    setColors(colors: Nullable<Color3[]>, lazy?: boolean, forceNewTexture?: boolean): void;
    /**
     * Line base width. At each point the line width is calculated by widths[pointIndex] * width
     */
    get width(): number;
    /**
     * Line base width. At each point the line width is calculated by widths[pointIndex] * width
     */
    set width(value: number);
    /**
     * Whether to use the colors option to colorize the line
     */
    get useColors(): boolean;
    set useColors(value: boolean);
    /**
     * The type of sampling of the colors texture. The values are the same when using with textures.
     */
    get colorsSampling(): number;
    /**
     * The type of sampling of the colors texture. The values are the same when using with textures.
     */
    set colorsSampling(value: number);
    /**
     * Normalized value of how much of the line will be visible
     * 0 - 0% of the line will be visible
     * 1 - 100% of the line will be visible
     */
    get visibility(): number;
    set visibility(value: number);
    /**
     * Turns on/off dash mode
     */
    get useDash(): boolean;
    /**
     * Turns on/off dash mode
     */
    set useDash(value: boolean);
    /**
     * Gets the dash offset
     */
    get dashOffset(): number;
    /**
     * Sets the dash offset
     */
    set dashOffset(value: number);
    /**
     * Length of the dash. 0 to 1. 0.5 means half empty, half drawn.
     */
    get dashRatio(): number;
    /**
     * Length of the dash. 0 to 1. 0.5 means half empty, half drawn.
     */
    set dashRatio(value: number);
    /**
     * Gets the number of dashes in the line
     */
    get dashCount(): number;
    /**
     * Sets the number of dashes in the line
     * @param value dash
     */
    set dashCount(value: number);
    /**
     * False means 1 unit in width = 1 unit on scene, true means 1 unit in width is reduced on the screen to make better looking lines
     */
    get sizeAttenuation(): boolean;
    /**
     * Turn on/off attenuation of the width option and widths array.
     * @param value false means 1 unit in width = 1 unit on scene, true means 1 unit in width is reduced on the screen to make better looking lines
     */
    set sizeAttenuation(value: boolean);
    /**
     * Gets the color of the line
     */
    get color(): Color3;
    /**
     * Sets the color of the line
     * @param value Color3
     */
    set color(value: Color3);
    /**
     * Sets the color of the line. If set the whole line will be mixed with this color according to the colorMode option.
     * The simple material always needs a color to be set. If you set it to null it will set the color to the default color (GreasedLineSimpleMaterial.DEFAULT_COLOR).
     * @param value color
     */
    setColor(value: Nullable<Color3>): void;
    /**
     * Gets the color distributiopn type
     */
    get colorsDistributionType(): GreasedLineMeshColorDistributionType;
    /**
     * Sets the color distribution type
     * @see GreasedLineMeshColorDistributionType
     * @param value color distribution type
     */
    set colorsDistributionType(value: GreasedLineMeshColorDistributionType);
    /**
     * Gets the mixing mode of the color and colors paramaters. Default value is GreasedLineMeshColorMode.SET.
     * MATERIAL_TYPE_SIMPLE mixes the color and colors of the greased line material.
     * @see GreasedLineMeshColorMode
     */
    get colorMode(): GreasedLineMeshColorMode;
    /**
     * Sets the mixing mode of the color and colors paramaters. Default value is GreasedLineMeshColorMode.SET.
     * MATERIAL_TYPE_SIMPLE mixes the color and colors of the greased line material.
     * @see GreasedLineMeshColorMode
     */
    set colorMode(value: GreasedLineMeshColorMode);
    /**
     * Gets the resolution
     */
    get resolution(): Vector2;
    /**
     * Sets the resolution
     * @param value resolution of the screen for GreasedLine
     */
    set resolution(value: Vector2);
    /**
     * Serializes this plugin material
     * @returns serializationObjec
     */
    serialize(): any;
    /**
     * Parses a serialized objects
     * @param source serialized object
     * @param scene scene
     * @param _rootUrl root url for textures
     */
    parse(source: any, scene: Scene, _rootUrl: string): void;
    /**
     * A minimum size texture for the colors sampler2D when there is no colors texture defined yet.
     * For fast switching using the useColors property without the need to use defines.
     * @param scene Scene
     */
    private static _PrepareEmptyColorsTexture;
}
