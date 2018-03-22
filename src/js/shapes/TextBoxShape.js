/**
 * @module Shapes
 */
import {
    mxUtils,
    mxShape,
    mxStencil
} from '../misc/mxExport.js';

/**
 * @classdesc The shape for the TextBox-element
 * @constructor
 * @extends mxShape
 * @see TextBox
 */
class TextBoxShape extends mxShape {
    constructor() {
        let str = '<shape name="textbox" h="70" w="171" aspect="1"><foreground><fontsize size="50"/><text str="TextBox" x="0" y="0"/></foreground><background><strokecolor color="grey"/><fillcolor color="white"/><rect x="0" y="0" w="171" h="70"/><fillstroke/></background></shape>';
        let xml = mxUtils.parseXml(str);
        let stencil = new mxStencil(xml.documentElement);
        super(stencil);
    }
}
export default TextBoxShape;