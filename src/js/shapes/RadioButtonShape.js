/**
 * @module Shapes
 */
import {
    mxUtils,
    mxShape,
    mxStencil
} from '../misc/mxExport.js';

/**
 * @classdesc The shape for the Radio-element
 * @constructor
 * @extends mxShape
 * @see UIObject
 */
class RadioButtonShape extends mxShape {
    constructor() {
        let str = '<shape name="radio" w="100" h="30" aspect="1"><foreground><fontsize size="25"/><text str="RadioBtn" x="21" y="23"/><strokecolor color="black"/><fillcolor color="black"/><ellipse x="5" y="32" w="10" h="10" /><fillstroke/></foreground><background><strokecolor color="black"/><fillcolor color="#e3e3e4"/><ellipse x="0" y="25" w="20" h="25" /><fillstroke/></background></shape>';
        let xml = mxUtils.parseXml(str);
        let stencil = new mxStencil(xml.documentElement);
        super(stencil);
    }
}
export default RadioButtonShape;