/*global y*/
/**
 * @module UIElements/Basic
 */
import Y from './../../../../node_modules/yjs/dist/y.js';
import UIText from '../UIText.js';
import {
    mxGeometry
} from '../../misc/mxExport.js';

/**
 * A HTML text area
 * @classdesc A HTMl <textarea>-element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 200, 55)] the width, height, x and y of the ui element
 * @extends UIText
 */
class TextArea extends UIText {
    constructor(geometry) {
        var text = 'Multi-Line text input area';
        // var text = 'hallo';
        if (!geometry)
            geometry = new mxGeometry(0, 0, 200, 55);

        super(text, geometry);
        this.value.setAttribute('_placeholder', '');
        this.value.setAttribute('_autofocus', false);
        this.value.setAttribute('_maxlength', '');
        this.value.setAttribute('_readonly', false);
        this.value.setAttribute('_disabled', false);
        this.value.setAttribute('_cols', '');
        this.value.setAttribute('_rows', '');
        this.initDOM = function () {
            UIText.prototype.initDOM.call(this, 'textarea');
            var $node = this.get$node()
            $node.css('overflow', 'hidden')
                .css('resize', 'none')
                .text(text);
            this.set$node($node);
        }
        return this;
    }

    createShared(createdByLocalUser) {
        UIText.prototype.createShared.call(this, createdByLocalUser);
        if (createdByLocalUser) {
            y.share.attrs.set(this.getId() + '_placeholder', Y.Text);
            y.share.attrs.set(this.getId() + '_maxlength', Y.Text);
            y.share.attrs.set(this.getId() + '_cols', Y.Text);
            y.share.attrs.set(this.getId() + '_rows', Y.Text);
        }
    }

    initShared() {
        UIText.prototype.initShared.call(this);
        this.initYText('_placeholder');
        this.initYText('_maxlength');
        this.initYText('_cols');
        this.initYText('_rows');
    }

    /**
    * The HTML node name
    * @static 
    * @default textarea
    * @readonly
    */
    static HTML_NODE_NAME = 'textarea';

    /**
     * The Name of element in the Wireframing editor
     * @static 
     * @default Multi-Line Text Area
     * @readonly
     */
    static NAME = "Multi-Line Text Area";
}

export default TextArea;