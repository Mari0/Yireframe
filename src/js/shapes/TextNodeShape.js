/**
 * @module Shapes
 */
import {
    mxUtils,
    mxShape,
    mxStencil
} from '../misc/mxExport.js';

/**
 * @classdesc The shape for the TextNode-element
 * @constructor
 * @extends mxShape
 * @see TextNode
 */
class TextNodeShape extends mxShape {
    constructor() {
        let str = '<shape name="textnode" h="25" w="171" aspect="1"><foreground><fontsize size="50"/><fontstyle style="1"/><text str="Text" x="85" y="10" align="center" valign="middle"/></foreground></shape>';
        let xml = mxUtils.parseXml(str);
        let stencil = new mxStencil(xml.documentElement);
        super(stencil);
    }
}
export default TextNodeShape;