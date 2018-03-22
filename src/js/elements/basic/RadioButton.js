/*global y*/
/**
 * @module UIElements/Basic
 */
import Y from './../../../../node_modules/yjs/dist/y.js';
import UIText from '../UIText.js';
import $ from 'jquery';
import _ from 'lodash';
import {
    mxGeometry
} from '../../misc/mxExport.js';

/**
 * A radio button with label
 * @classdesc A radio button element
 * @param {mxGeometry} geometry the geometry object which holds the size and position of the element
 * @constructor
 * @extends UIText
 */
class RadioButton extends UIText {
    constructor(geometry) {
        var text = 'Option';
        if (!geometry)
            geometry = new mxGeometry(0, 0, 150, 30);
        super(text, geometry);
        this.value.setAttribute('_checked', false);
        this.value.setAttribute('_autofocus', false);
        this.value.setAttribute('_disabled', false);
        this.value.setAttribute('_name', '');

        /**
         * Intialize the DOM elements for the label
         * @returns {undefined}
         */
        this.initDOM = function () {
            this.set$node($('<div>')
                .css('pointer-events', 'none')
                .append($('<input>').attr('type', 'radio').attr('checked', true))
                .append($('<input>').attr('type', 'input')
                    .css('font-size', 15)
                    .css('width', this.geometry.width - 30)
                    .css('height', this.geometry.height - 10)
                    .css('background-color', 'transparent')
                    .css('border-style', 'initial')
                    .val(text)));
        }
    }

    /**
     * Bind the text input element for the label
     * @param {Y.Text} ytext the y-text which is used for binding
     * @returns {undefined}
     */
    bindLabel(ytext) {
        ytext.bind(this.get$node().find('input[type="input"]')[0]);
        var that = this;
        ytext.observe(_.debounce(event => {
            that.value.setAttribute('label', event.object.toString());
            $('.wfSave').click();
        }, 300));
    }

    createShared(createdByLocalUser) {
        UIText.prototype.createShared.call(this, createdByLocalUser);
        if (createdByLocalUser) {
            y.share.attrs.set(this.getId() + '_name', Y.Text);
        }
    }

    /**
     * Initialize the shared data objects
     * @returns {undefined}
     */
    initShared() {
        UIText.prototype.initShared.call(this);
        this.initYText('_name');
    }

    /**
 * The Name in the wireframing editor
 * @static 
 * @default RadioButton
 * @readonly
 */
    static NAME = "Radio Button";

    /**
     * The HTML node name
     * @static 
     * @default radio
     * @readonly
     */
    static HTML_NODE_NAME = 'radio';

}
export default RadioButton;