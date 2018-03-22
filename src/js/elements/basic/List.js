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
 * A HTML List element. <ul>
 * @classdesc A HTMl list element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 128, 128)] the width, height, x and y of the ui element
 * @extends UIControl
 */
class List extends UIControl {
    constructor(geometry) {
        if (!geometry)
            geometry = new mxGeometry(0, 0, 128, 128);
        var style = mxConstants.STYLE_SHAPE + '=ul;' +
            mxConstants.STYLE_EDITABLE + "=0;";
        super(geometry, style);
    }

    /**
 * The HTML node name
 * @static 
 * @default ul
 * @readonly
 */
    static HTML_NODE_NAME = 'ul';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default List
     * @readonly
     */
    static NAME = "List";

}

export default List;