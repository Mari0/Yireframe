/**
 * @module UIElements/Graphics
 */
import {
    mxConstants,
    mxGeometry,
    mxUtils, mxCell, mxCodecRegistry
} from '../../misc/mxExport.js';
import UIControl from '../UIControl.js';

/**
 * Represent a scalable vector graphic
 * @classdesc A <svg>-element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 128, 128)] the width, height, x and y of the ui element
 * @extends UIControl
 */
class SVGElement extends UIControl {
    constructor(geometry) {
        if (!geometry)
            geometry = new mxGeometry(0, 0, 128, 128);
        var style = mxConstants.STYLE_SHAPE + '=svg;' +
            mxConstants.STYLE_EDITABLE + "=0;";
       super(geometry, style);
    }

    /**
     * The HTML node name
     * @static 
     * @default svg
     * @readonly
     */
    static HTML_NODE_NAME = 'svg';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default SVG
     * @readonly
     */
    static NAME = "SVG";

}

export default SVGElement;