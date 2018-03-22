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
 * A HTML <link>
 * @classdesc A HTML link element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 50, 30)] the width, height, x and y of the ui element
 * @extends UIMedia
 */
class Link extends UIText {
    constructor(geometry) {
        var text = 'Link';
        if (!geometry)
            geometry = new mxGeometry(0, 0, 50, 30)
        super(text, geometry);
        this.value.setAttribute('_href', '');

        /**
         * Initialize the DOM element of the shape
         * @return {undefined}
         */
        this.initDOM = function () {
            UIText.prototype.initDOM.call(this);
            var $input = this.get$node();
            $input.css('color', 'blue')
                .css('background-color', 'transparent')
                .css('border-style', 'initial')
                .css('text-decoration', 'underline')
                .val(text);
            this.set$node($input);
        }
        return this;
    }

    /**
     * Create the ytext-types for the attributes of the Link
     * @param {boolean} createdByLocalUser only the local user is allowed to create the y-text object
     * @return {undefined} 
     */
    createShared(createdByLocalUser) {
        UIText.prototype.createShared.call(this, createdByLocalUser);
        if (createdByLocalUser) {
            y.share.attrs.set(this.getId() + '_href', Y.Text);
        }
    }

    /**
     * Intialize the y-text elements for the attributes
     * @return {undefined}
     */
    initShared() {
        UIText.prototype.initShared.call(this);
        this.initYText('_href');
    }

    /**
    * The HTML node name
    * @static 
    * @default a
    * @readonly
    */
    static HTML_NODE_NAME = 'a';

    /**
     * The Name of element in the Wireframing editor
     * @static 
     * @default Link
     * @readonly
     */
    static NAME = "Link";
}

export default Link;