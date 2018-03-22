/**
 * @module UIElements/Basic
 */
import UIText from '../UIText.js';
import {
    mxGeometry
} from '../../misc/mxExport.js';

/**
 * A simple element to represent text
 * @classdesc A HTMl <span>-element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 75, 30)] the width, height, x and y of the ui element
 * @extends UIText
 */
class TextNode extends UIText {
    constructor(geometry) {
        var text = 'text';
        if (!geometry)
            geometry = new mxGeometry(0, 0, 75, 30);
        super(text, geometry);

        this.initDOM = function (element) {
            UIText.prototype.initDOM.call(this, element);
            var $node = this.get$node();
            $node.css('background-color', 'transparent')
                .css('border-style', 'initial')
                .val(text);
            this.set$node($node);
        }

        return this;
    }
    /**
 * The HTML node name
 * @static 
 * @default text
 * @readonly
 */
    static HTML_NODE_NAME = 'span';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default TextNode
     * @readonly
     */
    static NAME = "Text Node";

}

export default TextNode;