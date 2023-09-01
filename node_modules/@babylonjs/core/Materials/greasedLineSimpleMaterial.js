import { Engine } from "../Engines/engine.js";
import { RawTexture } from "./Textures/rawTexture.js";
import { GreasedLineMeshColorMode, GreasedLineMeshColorDistributionType } from "./greasedLinePluginMaterial.js";
import { ShaderMaterial } from "./shaderMaterial.js";
import { Color3 } from "../Maths/math.color.js";
import { Vector2 } from "../Maths/math.vector.js";
import "../Shaders/greasedLine.fragment.js";
import "../Shaders/greasedLine.vertex.js";
/**
 * GreasedLineSimpleMaterial
 */
export class GreasedLineSimpleMaterial extends ShaderMaterial {
    /**
     * GreasedLineSimple material constructor
     * @param name material name
     * @param scene the scene
     * @param options material options
     */
    constructor(name, scene, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        super(name, scene, {
            vertex: "greasedLine",
            fragment: "greasedLine",
        }, {
            attributes: ["position", "normal", "grl_previousAndSide", "grl_nextAndCounters", "grl_widths", "grl_offsets", "grl_colorPointers"],
            uniforms: [
                "worldViewProjection",
                "projection",
                "grlColorsWidth",
                "grlUseColors",
                "grlWidth",
                "grlColor",
                "grl_colorModeAndColorDistributionType",
                "grlResolution",
                "grlAspect",
                "grlAizeAttenuation",
                "grlDashArray",
                "grlDashOffset",
                "grlDashRatio",
                "grlUseDash",
                "grlVisibility",
            ],
            samplers: ["grlColors"],
            defines: scene.useRightHandedSystem ? ["GREASED_LNE_RIGHT_HANDED_COORDINATE_SYSTEM"] : [],
        });
        this._color = Color3.White();
        this._colorsDistributionType = GreasedLineMeshColorDistributionType.COLOR_DISTRIBUTION_TYPE_SEGMENT;
        options = options || {
            color: GreasedLineSimpleMaterial.DEFAULT_COLOR,
        };
        this._engine = scene.getEngine();
        this.visibility = (_a = options.visibility) !== null && _a !== void 0 ? _a : 1;
        this.useDash = (_b = options.useDash) !== null && _b !== void 0 ? _b : false;
        this.dashRatio = (_c = options.dashRatio) !== null && _c !== void 0 ? _c : 0.5;
        this.dashOffset = (_d = options.dashOffset) !== null && _d !== void 0 ? _d : 0;
        this.dashCount = (_e = options.dashCount) !== null && _e !== void 0 ? _e : 1; // calculate the _dashArray value, call the setter
        this.width = options.width ? options.width : options.sizeAttenuation ? GreasedLineSimpleMaterial.DEFAULT_WIDTH_ATTENUATED : GreasedLineSimpleMaterial.DEFAULT_WIDTH;
        this.sizeAttenuation = (_f = options.sizeAttenuation) !== null && _f !== void 0 ? _f : false;
        this.color = (_g = options.color) !== null && _g !== void 0 ? _g : Color3.White();
        this.useColors = (_h = options.useColors) !== null && _h !== void 0 ? _h : false;
        this.colorsDistributionType = (_j = options.colorDistributionType) !== null && _j !== void 0 ? _j : GreasedLineMeshColorDistributionType.COLOR_DISTRIBUTION_TYPE_SEGMENT;
        this.colorsSampling = (_k = options.colorsSampling) !== null && _k !== void 0 ? _k : RawTexture.NEAREST_NEAREST;
        this.colorMode = (_l = options.colorMode) !== null && _l !== void 0 ? _l : GreasedLineMeshColorMode.COLOR_MODE_SET;
        this._colors = (_m = options.colors) !== null && _m !== void 0 ? _m : null;
        this.resolution = (_o = options.resolution) !== null && _o !== void 0 ? _o : new Vector2(this._engine.getRenderWidth(), this._engine.getRenderHeight()); // calculate aspect call the setter
        if (this._colors) {
            this.setColors(this._colors);
        }
        this._engine.onDisposeObservable.add(() => {
            var _a;
            (_a = GreasedLineSimpleMaterial._EmptyColorsTexture) === null || _a === void 0 ? void 0 : _a.dispose();
        });
    }
    /**
     * Converts boolean to number.
     * @param bool
     * @returns 1 if true, 0 if false.
     */
    static _BooleanToNumber(bool) {
        return bool ? 1 : 0;
    }
    /**
     * Converts an array of Color3 to Uint8Array
     * @param colors Arrray of Color3
     * @returns Uin8Array of colors [r, g, b, a, r, g, b, a, ...]
     */
    static _Color3toRGBAUint8(colors) {
        const colorTable = new Uint8Array(colors.length * 4);
        for (let i = 0, j = 0; i < colors.length; i++) {
            colorTable[j++] = colors[i].r * 255;
            colorTable[j++] = colors[i].g * 255;
            colorTable[j++] = colors[i].b * 255;
            colorTable[j++] = 255;
        }
        return colorTable;
    }
    /**
     * Creates a RawTexture from an RGBA color array and sets it on the plugin material instance.
     * @param name name of the texture
     * @param colors Uint8Array of colors
     */
    _createColorsTexture(name, colors) {
        const colorsArray = GreasedLineSimpleMaterial._Color3toRGBAUint8(colors);
        this._colorsTexture = new RawTexture(colorsArray, colors.length, 1, Engine.TEXTUREFORMAT_RGBA, this.getScene(), false, true, this._colorsSampling);
        this._colorsTexture.name = name;
    }
    /**
     * Disposes the plugin material.
     */
    dispose() {
        var _a;
        (_a = this._colorsTexture) === null || _a === void 0 ? void 0 : _a.dispose();
        super.dispose();
    }
    _setColorModeAndColorDistributionType() {
        this.setVector2("grl_colorModeAndColorDistributionType", new Vector2(this._colorMode, this._colorsDistributionType));
    }
    /**
     * Updates the material. Use when material created in lazy mode.
     */
    updateLazy() {
        if (this._colors) {
            this.setColors(this._colors, false, true);
        }
    }
    /**
     * Returns the colors used to colorize the line
     */
    get colors() {
        return this._colors;
    }
    /**
     * Sets the colors used to colorize the line
     */
    set colors(value) {
        this.setColors(value);
    }
    /**
     * Creates or updates the colors texture
     * @param colors color table RGBA
     * @param lazy if lazy, the colors are not updated
     * @param forceNewTexture force creation of a new texture
     * @returns
     */
    setColors(colors, lazy = false, forceNewTexture = false) {
        var _a, _b, _c, _d;
        const origColorsCount = (_b = (_a = this._colors) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        this._colors = colors;
        if (colors === null || colors.length === 0) {
            (_c = this._colorsTexture) === null || _c === void 0 ? void 0 : _c.dispose();
            return;
        }
        if (lazy && !forceNewTexture) {
            return;
        }
        if (this._colorsTexture && origColorsCount === colors.length && !forceNewTexture) {
            const colorArray = GreasedLineSimpleMaterial._Color3toRGBAUint8(colors);
            this._colorsTexture.update(colorArray);
        }
        else {
            (_d = this._colorsTexture) === null || _d === void 0 ? void 0 : _d.dispose();
            this._createColorsTexture(`${this.name}-colors-texture`, colors);
        }
        if (this._colorsTexture) {
            this.setFloat("grlColorsWidth", this._colorsTexture.getSize().width);
            this.setTexture("grlColors", this._colorsTexture);
        }
    }
    /**
     * Line base width. At each point the line width is calculated by widths[pointIndex] * width
     */
    get width() {
        return this._width;
    }
    /**
     * Line base width. At each point the line width is calculated by widths[pointIndex] * width
     */
    set width(value) {
        this._width = value;
        this.setFloat("grlWidth", value);
    }
    /**
     * Whether to use the colors option to colorize the line
     */
    get useColors() {
        return this._useColors;
    }
    set useColors(value) {
        this._useColors = value;
        this.setFloat("grlUseColors", GreasedLineSimpleMaterial._BooleanToNumber(value));
    }
    /**
     * The type of sampling of the colors texture. The values are the same when using with textures.
     */
    get colorsSampling() {
        return this._colorsSampling;
    }
    /**
     * The type of sampling of the colors texture. The values are the same when using with textures.
     */
    set colorsSampling(value) {
        this._colorsSampling = value;
    }
    /**
     * Normalized value of how much of the line will be visible
     * 0 - 0% of the line will be visible
     * 1 - 100% of the line will be visible
     */
    get visibility() {
        return this._visibility;
    }
    set visibility(value) {
        this._visibility = value;
        this.setFloat("grlVisibility", value);
    }
    /**
     * Turns on/off dash mode
     */
    get useDash() {
        return this._useDash;
    }
    /**
     * Turns on/off dash mode
     */
    set useDash(value) {
        this._useDash = value;
        this.setFloat("grlUseDash", GreasedLineSimpleMaterial._BooleanToNumber(value));
    }
    /**
     * Gets the dash offset
     */
    get dashOffset() {
        return this._dashOffset;
    }
    /**
     * Sets the dash offset
     */
    set dashOffset(value) {
        this._dashOffset = value;
        this.setFloat("grlDashOffset", value);
    }
    /**
     * Length of the dash. 0 to 1. 0.5 means half empty, half drawn.
     */
    get dashRatio() {
        return this._dashRatio;
    }
    /**
     * Length of the dash. 0 to 1. 0.5 means half empty, half drawn.
     */
    set dashRatio(value) {
        this._dashRatio = value;
        this.setFloat("grlDashRatio", value);
    }
    /**
     * Gets the number of dashes in the line
     */
    get dashCount() {
        return this._dashCount;
    }
    /**
     * Sets the number of dashes in the line
     * @param value dash
     */
    set dashCount(value) {
        this._dashCount = value;
        this._dashArray = 1 / value;
        this.setFloat("grlDashArray", this._dashArray);
    }
    /**
     * False means 1 unit in width = 1 unit on scene, true means 1 unit in width is reduced on the screen to make better looking lines
     */
    get sizeAttenuation() {
        return this._sizeAttenuation;
    }
    /**
     * Turn on/off attenuation of the width option and widths array.
     * @param value false means 1 unit in width = 1 unit on scene, true means 1 unit in width is reduced on the screen to make better looking lines
     */
    set sizeAttenuation(value) {
        this._sizeAttenuation = value;
        this.setFloat("grlSizeAttenuation", GreasedLineSimpleMaterial._BooleanToNumber(value));
    }
    /**
     * Gets the color of the line
     */
    get color() {
        return this.color;
    }
    /**
     * Sets the color of the line
     * @param value Color3
     */
    set color(value) {
        this.setColor(value);
    }
    /**
     * Sets the color of the line. If set the whole line will be mixed with this color according to the colorMode option.
     * The simple material always needs a color to be set. If you set it to null it will set the color to the default color (GreasedLineSimpleMaterial.DEFAULT_COLOR).
     * @param value color
     */
    setColor(value) {
        value = value !== null && value !== void 0 ? value : GreasedLineSimpleMaterial.DEFAULT_COLOR;
        this._color = value;
        this.setColor3("grlColor", value);
    }
    /**
     * Gets the color distributiopn type
     */
    get colorsDistributionType() {
        return this._colorsDistributionType;
    }
    /**
     * Sets the color distribution type
     * @see GreasedLineMeshColorDistributionType
     * @param value color distribution type
     */
    set colorsDistributionType(value) {
        this._colorsDistributionType = value;
        this._setColorModeAndColorDistributionType();
    }
    /**
     * Gets the mixing mode of the color and colors paramaters. Default value is GreasedLineMeshColorMode.SET.
     * MATERIAL_TYPE_SIMPLE mixes the color and colors of the greased line material.
     * @see GreasedLineMeshColorMode
     */
    get colorMode() {
        return this._colorMode;
    }
    /**
     * Sets the mixing mode of the color and colors paramaters. Default value is GreasedLineMeshColorMode.SET.
     * MATERIAL_TYPE_SIMPLE mixes the color and colors of the greased line material.
     * @see GreasedLineMeshColorMode
     */
    set colorMode(value) {
        this._colorMode = value;
        this._setColorModeAndColorDistributionType();
    }
    /**
     * Gets the resolution
     */
    get resolution() {
        return this._resolution;
    }
    /**
     * Sets the resolution
     * @param value resolution of the screen for GreasedLine
     */
    set resolution(value) {
        this._resolution = value;
        this.setVector2("grlResolution", value);
        this.setFloat("grlAspect", value.x / value.y);
    }
    /**
     * Serializes this plugin material
     * @returns serializationObjec
     */
    serialize() {
        const serializationObject = super.serialize();
        const greasedLineMaterialOptions = {
            colorDistributionType: this._colorsDistributionType,
            colorsSampling: this._colorsSampling,
            colorMode: this._colorMode,
            color: this._color,
            dashCount: this._dashCount,
            dashOffset: this._dashOffset,
            dashRatio: this._dashRatio,
            resolution: this._resolution,
            sizeAttenuation: this._sizeAttenuation,
            useColors: this._useColors,
            useDash: this._useDash,
            visibility: this._visibility,
            width: this._width,
        };
        this._colors && (greasedLineMaterialOptions.colors = this._colors);
        serializationObject.greasedLineMaterialOptions = greasedLineMaterialOptions;
        return serializationObject;
    }
    /**
     * Parses a serialized objects
     * @param source serialized object
     * @param scene scene
     * @param _rootUrl root url for textures
     */
    parse(source, scene, _rootUrl) {
        var _a;
        // TODO: super.parse?
        const greasedLineMaterialOptions = source.greasedLineMaterialOptions;
        (_a = this._colorsTexture) === null || _a === void 0 ? void 0 : _a.dispose();
        if (greasedLineMaterialOptions.colors) {
            this._createColorsTexture(`${this.name}-colors-texture`, greasedLineMaterialOptions.colors);
        }
        else {
            GreasedLineSimpleMaterial._PrepareEmptyColorsTexture(scene);
        }
        greasedLineMaterialOptions.color && (this.color = greasedLineMaterialOptions.color);
        greasedLineMaterialOptions.colorDistributionType && (this.colorsDistributionType = greasedLineMaterialOptions.colorDistributionType);
        greasedLineMaterialOptions.colorsSampling && (this.colorsSampling = greasedLineMaterialOptions.colorsSampling);
        greasedLineMaterialOptions.colorMode && (this.colorMode = greasedLineMaterialOptions.colorMode);
        greasedLineMaterialOptions.useColors && (this.useColors = greasedLineMaterialOptions.useColors);
        greasedLineMaterialOptions.visibility && (this.visibility = greasedLineMaterialOptions.visibility);
        greasedLineMaterialOptions.useDash && (this.useDash = greasedLineMaterialOptions.useDash);
        greasedLineMaterialOptions.dashCount && (this.dashCount = greasedLineMaterialOptions.dashCount);
        greasedLineMaterialOptions.dashRatio && (this.dashRatio = greasedLineMaterialOptions.dashRatio);
        greasedLineMaterialOptions.dashOffset && (this.dashOffset = greasedLineMaterialOptions.dashOffset);
        greasedLineMaterialOptions.width && (this.width = greasedLineMaterialOptions.width);
        greasedLineMaterialOptions.sizeAttenuation && (this.sizeAttenuation = greasedLineMaterialOptions.sizeAttenuation);
        greasedLineMaterialOptions.resolution && (this.resolution = greasedLineMaterialOptions.resolution);
    }
    /**
     * A minimum size texture for the colors sampler2D when there is no colors texture defined yet.
     * For fast switching using the useColors property without the need to use defines.
     * @param scene Scene
     */
    static _PrepareEmptyColorsTexture(scene) {
        if (!this._EmptyColorsTexture) {
            const colorsArray = new Uint8Array(4);
            GreasedLineSimpleMaterial._EmptyColorsTexture = new RawTexture(colorsArray, 1, 1, Engine.TEXTUREFORMAT_RGBA, scene, false, false, RawTexture.NEAREST_NEAREST);
            GreasedLineSimpleMaterial._EmptyColorsTexture.name = "grlEmptyColorsTexture";
        }
    }
}
/**
 * Default line color for newly created lines
 */
GreasedLineSimpleMaterial.DEFAULT_COLOR = Color3.White();
/**
 * Default line width when sizeAttenuation is true
 */
GreasedLineSimpleMaterial.DEFAULT_WIDTH_ATTENUATED = 1;
/**
 * Defaule line width
 */
GreasedLineSimpleMaterial.DEFAULT_WIDTH = 0.1;
//# sourceMappingURL=greasedLineSimpleMaterial.js.map