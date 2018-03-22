/*global y*/
/**
 * @module UIElements/Custom
 */
import Y from './../../../../node_modules/yjs/dist/y.js';
import {
    mxConstants,
    mxGeometry,
    mxUtils, mxCell, mxCodecRegistry
} from '../../misc/mxExport.js';
import UIControl from '../UIControl.js';

/**
 * Represent a polymer element
 * @classdesc A Polymer element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 128, 128)] the width, height, x and y of the ui element
 * @extends UIControl
 */
class PoylmerElement extends UIControl {
    constructor(geometry) {
        if (!geometry)
            geometry = new mxGeometry(0, 0, 128, 128);
        //style in html5stencils.xml and registered in the editor
        var style = mxConstants.STYLE_SHAPE + '=polymer;' +
            mxConstants.STYLE_EDITABLE + "=0;";

        super(geometry, style);
        this.setAttribute('_link', '');
        this.setAttribute('_name', '');
    }

    createShared(createdByLocalUser) {
        UIControl.prototype.createShared.call(this, createdByLocalUser);
        if (createdByLocalUser) {
            y.share.attrs.set(this.getId() + '_link', Y.Text);
            y.share.attrs.set(this.getId() + '_name', Y.Text);
        }
    }

    initShared() {
        UIControl.prototype.initShared.call(this);
        this.initYText('_link');
        this.initYText('_name');
    }

    /**
 * The HTML node name
 * @static 
 * @default CUSTOM
 * @readonly
 */
    static HTML_NODE_NAME = 'CUSTOM';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default Polymer
     * @readonly
     */
    static NAME = "Polymer";
}

export default PoylmerElement;