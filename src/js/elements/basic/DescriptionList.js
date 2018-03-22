/**
 * @module UIElements/Basic
 */
import {
    mxConstants,
    mxGeometry,
    mxUtils, mxCell, mxCodecRegistry
} from '../../misc/mxExport.js';
import UIControl from '../UIControl.js';

/**
 * A HTML description list
 * @classdesc A HTMl description list
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 128, 128)] the width, height, x and y of the ui element
 * @extends UIControl
 */
class DescriptionList extends UIControl {
    constructor(geometry) {
        if (!geometry)
            geometry = new mxGeometry(0, 0, 128, 128);
        var style = mxConstants.STYLE_SHAPE + '=dl;' +
            mxConstants.STYLE_EDITABLE + "=0;";
        super(geometry, style);
    }

    /**
 * The HTML node name
 * @static 
 * @default dl
 * @readonly
 */
    static HTML_NODE_NAME = 'dl';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default DescriptionList
     * @readonly
     */
    static NAME = "Description List";
}

export default DescriptionList;