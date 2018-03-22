/**
 * @module UIElements/Basic
 */
import UIText from '../UIText.js';
import {
    mxGeometry, mxCodecRegistry, mxCell, mxUtils
} from '../../misc/mxExport.js';

/**
 * A text box element
 * @classdesc A HTMl <span>-element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 120, 30)] the width, height, x and y of the ui element
 * @extends UIText
 */
class TextBox extends UIText {
    constructor(geometry) {
        var text = 'Some Text...';
        if (!geometry)
            geometry = new mxGeometry(0, 0, 120, 30);
        super(text, geometry);
        this.setAttribute('_autofocus', false);
        this.setAttribute('_disabled', false);
        this.setAttribute('_autocomplete', 'off');
        this.getComboAttrMap().addComboAttr('_autocomplete', ['off', 'on']);
        this.initDOM = function () {
            UIText.prototype.initDOM.call(this);
            var $node = this.get$node()
            $node.val(text);
            this.set$node($node);
        }
        return this;
    }

    initShared() {
        UIText.prototype.initShared.call(this);
    }

    /**
     * The HTML node name
     * @static 
     * @default input
     * @readonly
     */
    static HTML_NODE_NAME = 'input';

    /**
     * The Name of element in the Wireframing editor
     * @static 
     * @default TextBox
     * @readonly
     */
    static NAME = "TextBox";

}

export default TextBox;