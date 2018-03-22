/*global y*/
/**
 * @module UIElements/Media
 */
import Y from './../../../../node_modules/yjs/dist/y.js';
import {
    mxConstants,
    mxGeometry,
    mxUtils, mxCell, mxCodecRegistry
} from '../../misc/mxExport.js';
import UIControl from '../UIControl.js';

/**
 * Represent a image
 * @classdesc A HTMl <img>-element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 128, 128)] the width, height, x and y of the ui element
 * @extends UIControl
 */
class Image extends UIControl {
    constructor(geometry) {
        if (!geometry)
            geometry = new mxGeometry(0, 0, 128, 128);
        //style in html5stencils.xml and registered in the editor
        var style = mxConstants.STYLE_SHAPE + '=image;' +
            mxConstants.STYLE_EDITABLE + "=0;";

        super(geometry, style);
        this.setAttribute('_src', 'https://rwth-acis.github.io/CAE-WireframingEditor/resources/image-placeholder.jpg');
    }

    createShared(createdByLocalUser) {
        UIControl.prototype.createShared.call(this, createdByLocalUser);
        if (createdByLocalUser) {
            y.share.attrs.set(this.getId() + '_src', Y.Text);
        }
    }

    initShared() {
        UIControl.prototype.initShared.call(this);
        this.initYText('_src');
    }

    /**
 * The HTML node name
 * @static 
 * @default img
 * @readonly
 */
    static HTML_NODE_NAME = 'img';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default Image
     * @readonly
     */
    static NAME = "Image";

}
export default Image;