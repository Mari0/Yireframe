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
 * A HTML5 canvas element
 * @classdesc A HTMl5 canvas element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 128, 128)] the width, height, x and y of the ui element
 * @extends UIControl
 */
class HTML5Canvas extends UIControl {
    constructor(geometry) {
        if (!geometry)
            geometry = new mxGeometry(0, 0, 128, 128);
        var style = mxConstants.STYLE_SHAPE + '=html5canvas;' +
            mxConstants.STYLE_EDITABLE + "=0;";
        super(geometry, style);
    }

    /**
     * The HTML node name
     * @static 
     * @default canvas
     * @readonly
     */
    static HTML_NODE_NAME = 'canvas';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default Canvas
     * @readonly
     */
    static NAME = "HTML5 Canvas";
}
export default HTML5Canvas;