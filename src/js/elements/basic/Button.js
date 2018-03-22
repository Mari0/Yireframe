/**
 * @module UIElements/Basic
 */
import $ from 'jquery';
import _ from 'lodash';
import UIText from '../UIText.js';
import {
    mxGeometry
} from '../../misc/mxExport.js';

/**
 * A concrete button class representing a button ui element of the wireframe
 * @classdesc The Button html element
 * @constructor
 * @param {mxGeometry} [geometry=new mxGeometry(0, 0, 100, 50)] the width, height, x and y of the ui element
 * @extends UIText
 */
class Button extends UIText {
    constructor(geometry) {
        /**
         * The default text for the label
         * @member {String}
         * @default Button
         */
        var text = 'Button';

        if (!geometry)
            geometry = new mxGeometry(0, 0, 100, 50);

        super(text, geometry);
        this.value.setAttribute('_disabled', false);
        this.value.setAttribute('_autofocus', false);
        this.value.setAttribute('_type', 'button');
        this.getComboAttrMap().addComboAttr('_type', ['button', 'reset', 'submit']);

        /**
         * Crate the html input element for the button element
         * @return {undefined}
         * @override
         */
        this.initDOM = function () {
            var $button = $(document.createElement('button'));
            $button.attr('disabled', true)
                .css('width', this.geometry.width)
                .css('height', this.geometry.height)
                .append(
                    $(document.createElement('input')).css('text-align', 'center')
                        //.css('border-radius', '12px')
                        .css('background-color', 'transparent')
                        .css('border-style', 'unset')
                        .css('width', '100%')
                        .val(text));
            this.set$node($button);
        }

        /**
         * @override
         * @param {boolean} createdByLocalUser indicates if the the function was called by the local user or not
         * @return {undefined}
         */
        this.createShared = function (createdByLocalUser) {
            UIText.prototype.createShared.call(this, createdByLocalUser);
        };
    }

    bindLabel(ytext) {
        var that = this;
        ytext.bind(this.get$node().find('input')[0]);
        ytext.observe(_.debounce(event => {
            that.value.setAttribute('label', event.object.toString());
            $('.wfSave').click();
        }, 300));

    }

    /**
    * The HTML node name
    * @static 
    * @default button
    * @readonly
    */
    static HTML_NODE_NAME = 'button';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default Button
     * @readonly
     */
    static NAME = "Button";
}

export default Button;