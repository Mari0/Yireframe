/*global y*/
/**
 * @module UIElements
 */
import Y from './../../../node_modules/yjs/dist/y.js';
import UIControl from './UIControl.js';

/**
 * An abstract class representing HTML 5 media elements
 * @classdesc Base class for all UI media componets of the editor
 * @constructor
 * @abstract
 * @param {mxGeometry} geometry the width, height, x and y of the ui element
 * @param {String} style the style as a string
 * @extends UIControl
 */
class UIMedia extends UIControl{
    constructor(geometry, style) {
        super(geometry, style);
        this.value.setAttribute('_src', '');
        this.value.setAttribute('_controls', true);
        this.value.setAttribute('_autoplay', false);
        this.value.setAttribute('_muted', false);
        this.value.setAttribute('_loop', false);
        this.value.setAttribute('_preload', 'auto');
        this.getComboAttrMap().addComboAttr('_preload',  ['auto', 'metadata', 'none']);
    }

    createShared(createdByLocalUser) {
        UIControl.prototype.createShared.call(this, createdByLocalUser);
        if(createdByLocalUser)
            y.share.attrs.set(this.getId()+'_src', Y.Text);
    }

    initShared() {
        UIControl.prototype.initShared.call(this);
        this.initYText('_src');
    }
}

UIMedia.registerCodec = ctor => {
    UIControl.registerCodec(ctor);
}
export default UIMedia;