/*global y*/
import { mxCodec, mxUtils, mxForm, mxGraph } from './mxExport.js';
import $ from 'jquery';

/**
 * @module Misc
 */

/**
 * Some utilty functions to initilaize the wireframe from XML or save the wireframe to XML
 * @classdesc A set of helper functions used by various modules and classes
 * @constructor
 */
class Util {

    /**
     * Returns the Ids for cells currently selected in the graph
     * @param {Wireframe} graph the wireframe
     * @return{array} array of ids
     */
    static getIdsOfSelectedCells = graph => {
        let cells = graph.getSelectionCells();
        let ids = [];
        for (let i = 0; i < cells.length; i++) {
            ids.push(cells[i].id);
        }
        return ids;
    }

    /**
     * Returns the cells for the given ids
     * @param {Wireframe} graph the wireframe
     * @param {array} ids the ids as string to look for 
     * @return {UIControl[]} an array of ui elements
     */
    static getCellsFromIdList = (graph, ids) => {
        let cells = [];
        for (let i = 0; i < ids.length; i++) {
            cells.push(graph.getModel().getCell(ids[i]));
        }
        return cells;
    }

    /**
     * Generates a GUID string.
     * @returns {String} The generated GUID.
     * @example af8a84166e18a307bd9cf2c947bbb3aa
     * @author Slavik Meltser (slavik@meltser.info).
     * @link http://slavik.meltser.info/?p=142
     */
    static GUID = () => {
        function _p8(s) {
            let p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? p.substr(0, 4) + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    static formatNumber = number => {
        if (number.indexOf('.') != -1)
            return number.substr(0, number.indexOf('.'));
        else return number;
    }

    /**
     * Serializes the current wireframe to XML and stores it in y.share.data.wireframe
     * @param {Wireframe} graph the wireframe
     * @return  {undefined}
     */
    static Save = graph => {
        let encoder = new mxCodec();
        //encoder.encodeDefaults = true;
        let result = encoder.encode(graph.getModel());
        let meta = graph.getModel().getMeta();
        if (meta.hasChildNodes())
            meta.replaceChild(result, meta.getElementsByTagName('WireframeModel')[0]);
        else
            meta.appendChild(result);
        let xml = mxUtils.getXml(meta);
        y.share.data.set('wireframe', xml);
        let $save = $('.wfSave');
        $save.css('opacity', 1.0);

        /*new Noty({
            type: 'success',
            layout : 'topRight',
            text: 'Saved Wireframe Model',
            timeout: 750
        }).show();*/
        setTimeout(() => {
            $save.css('opacity', 0.5);
        }, 750);

    }

    static initSharedData = (parent, graph) => {
        let uiControl;
        if (!parent.children) return;
        for (let i = 0; i < parent.children.length; i++) {
            uiControl = parent.children[i];
            uiControl.initShared();
            let tags = uiControl.createTags();
            for (let key in tags) {
                if (tags.hasOwnProperty(key)) {
                    let tag = tags[key];
                    mxGraph.prototype.addCellOverlay.apply(graph, [uiControl, tag]);
                    tag.initShared();
                    tag.bindClickEvent(graph);
                }
            }
            if (uiControl.constructor.name === 'DivContainer') {
                this.initSharedData(uiControl, graph);
            }
        }
    }

    static createFormFromCellAttributes = (className, obj, entity) => {
        let form = new mxForm(className);
        let attrs = obj.attributes;
        let attr;
        for (let i = 0; i < attrs.length; i++) {
            attr = attrs[i];
            if (attr.name[0] !== '_') continue; //skip non-html-element attributes
            if (attr.value.indexOf('true') != -1 || attr.value.indexOf('false') != -1) //a boolean value
                form.addCheckbox(attr.name.substr(1), attr.value.indexOf('true') != -1 ? true : false);
            else {
                let values = entity.getComboAttrMap().getComboAttr(attr.name);
                if (values) {
                    let combo = form.addCombo(attr.name.substr(1));
                    for (let j = 0; j < values.length; j++) {
                        form.addOption(combo, values[j], values[j], attr.value === values[j]);
                    }
                } else
                    form.addText(attr.name.substr(1), attr.value);
            }
        }
        return form;
    }

    static bindSharedAttributes = (entity, form) => {
        let id = entity ? entity.getId() : 'meta';
        $(form.body).find('tr').map((i, elem) => {
            let name = $(elem).find('td:first').text();
            let $input = $(elem).find('input');
            if ($input.length > 0) {
                if ($input.attr('type') === 'text') {
                    let ytext = y.share.attrs.get(id + '_' + name);
                    if (ytext) {
                        if (entity.hasOwnProperty('value')) {
                            let val = entity.value.getAttribute('_' + name);
                            ytext.bind($input[0]);
                            if (val.length > 0) {
                                if (ytext.toString().length > 0)
                                    ytext.delete(0, ytext.toString().length);
                                ytext.insert(0, val);
                            }
                        }
                        else
                            ytext.bind($input[0]);
                        //let caeYText = CAELiveMapper.getSharedWidgetAttr('_'+name);
                        //if(caeYText != undefined)
                        //    caeYText.bind($input[0]);
                        if (!entity && name === 'name')
                            ytext.bind($('#draggingBar')[0]);
                    }
                    //else //should actually not happen but add something to mxLog if ytext does not exists for whatever reason
                } else if ($input.attr('type') === 'checkbox') {
                    $input.change(function () {
                        y.share.attrs.set(id + '_' + name, this.checked);
                    });
                }
            } else {
                $(elem).find('select').change(function () {
                    //let optionSelected = $("option:selected", this);
                    y.share.attrs.set(id + '_' + name, this.value);
                });
            }
        });
    }

    static GetValueFormAttributes = (node, name) => {
        for (let key in node.attributes) {
            if (node.attributes.hasOwnProperty(key) && node.attributes[key].name === name) {
                return node.attributes[key].value.value;
            }
        }
        return undefined;
    }
}
export default Util;