/**
 * @module UIElements/Basic
 */
import UIText from '../UIText.js';
import {
    mxGeometry
} from '../../misc/mxExport.js';

/**
 * A paragraph of text. <p>
 * @classdesc A HTMl paragraph element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 150, 35)] the width, height, x and y of the ui element
 * @extends UIText
 */
class Paragraph extends UIText {
    constructor(geometry) {
        var text = 'Some text for this paragraph';
        if (!geometry)
            geometry = new mxGeometry(0, 0, 150, 35);
        super(text, geometry);

        this.initDOM = function () {
            UIText.prototype.initDOM.call(this, 'textarea');
            var $node = this.get$node();
            $node.css('background-color', 'transparent')
                .css('border-style', 'initial')
                .css('overflow', 'hidden')
                .css('resize', 'none')
                .text(text);
            this.set$node($node);
        }
        return this;
    }

    /**
 * The HTML node name
 * @static 
 * @default p
 * @readonly
 */
    static HTML_NODE_NAME = 'p';

    /**
     * The Name of element in the Wireframing editor
     * @static 
     * @default Paragraph of Text
     * @readonly
     */
    static NAME = "Paragraph of Text";
}
export default Paragraph;