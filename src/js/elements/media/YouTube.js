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
 * A iframe that embbeds a YouTube-link
 * @classdesc A HTML <iframe>-element that embeds a youtube link
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 128, 128)] the width, height, x and y of the ui element
 * @extends UIControl
 */
class YouTube extends UIControl {
    constructor(geometry) {
        if (!geometry)
            geometry = new mxGeometry(0, 0, 128, 128);
        //style in html5stencils.xml and registered in the editor
        var style = mxConstants.STYLE_SHAPE + '=youtube;' +
            mxConstants.STYLE_EDITABLE + "=0;";

        super(geometry, style);
        this.setAttribute('_src', 'https://www.youtube.com/embed/rnj6cnlIjM4');
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
     * @default iframe
     * @readonly
     */
    static HTML_NODE_NAME = 'iframe';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default YouTube
     * @readonly
     */
    static NAME = "YouTube";

}

export default YouTube;