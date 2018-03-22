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
 * An ordered list. <ol>
 * @classdesc A HTMl ordered list
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 128, 128)] the width, height, x and y of the ui element
 * @extends UIControl
 */
class OrderedList extends UIControl {
    constructor(geometry) {
        if (!geometry)
            geometry = new mxGeometry(0, 0, 128, 128);
        var style = mxConstants.STYLE_SHAPE + '=ol;' +
            mxConstants.STYLE_EDITABLE + "=0;";
        super(geometry, style);
    }
    /**
     * The HTML node name
     * @static 
     * @default ol
     * @readonly
     */
    static HTML_NODE_NAME = 'ol';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default OrderedList
     * @readonly
     */
    static NAME = "Ordered List";

}
export default OrderedList;