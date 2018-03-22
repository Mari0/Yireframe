/**
 * @module UIElements/Basic
 */
import UIText from '../UIText.js';
import $ from 'jquery';
import _ from 'lodash';
import {
    mxGeometry
} from '../../misc/mxExport.js';

/**
 * A HTML checkbox with label
 * @classdesc A HTMl checkbox element
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 150, 30)] the width, height, x and y of the ui element
 * @extends UIText
 */
class CheckBox extends UIText {
    constructor(geometry) {
        var text = 'Option';
        if (!geometry)
            geometry = new mxGeometry(0, 0, 150, 30);
        super(text, geometry);
        this.value.setAttribute('_checked', false);
        this.value.setAttribute('_autofocus', false);
        this.value.setAttribute('_disabled', false);

        this.initDOM = function () {
            this.set$node(
                $('<div>')
                    .css('pointer-events', 'none')
                    .append($('<input>').attr('type', 'checkbox').attr('checked', true).attr('disabled', true))
                    .append($('<input>')
                        .attr('type', 'input')
                        .css('font-size', 15)
                        .css('width', this.geometry.width - 30)
                        .css('height', this.geometry.height - 10)
                        .css('background-color', 'transparent')
                        .css('border-style', 'initial')
                        .val(text)));
        }
    }

    bindLabel(ytext) {
        ytext.bind(this.get$node().find('input[type="input"]')[0]);
        var that = this;
        ytext.observe(_.debounce(event => {
            that.value.setAttribute('label', event.object.toString());
            $('.wfSave').click();
        }, 300));
    }

    initShared() {
        UIText.prototype.initShared.call(this);
    }

    /**
     * The Name in the wireframing editor
     * @static 
     * @default CheckBox
     * @readonly
     */
    static NAME = "Checkbox";

    /**
     * The HTML node name
     * @static 
     * @default button
     * @readonly
     */
    static HTML_NODE_NAME = 'checkbox';

}

export default CheckBox;