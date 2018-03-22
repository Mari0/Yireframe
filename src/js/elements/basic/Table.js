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
 * A HTML table
 * @classdesc A HTMl <table>-element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 128, 128)] the width, height, x and y of the ui element
 * @extends UIControl
 */
class Table extends UIControl {
    constructor(geometry) {
        if (!geometry)
            geometry = new mxGeometry(0, 0, 128, 128);
        var style = mxConstants.STYLE_SHAPE + '=table;' +
            mxConstants.STYLE_EDITABLE + "=0;";
        super(geometry, style);
    }

    /**
    * The HTML node name
    * @static 
    * @default table
    * @readonly
    */
    static HTML_NODE_NAME = 'table';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default Table
     * @readonly
     */
    static NAME = "Table";

}
export default Table;