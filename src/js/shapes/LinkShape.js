/**
 * @module Shapes
 */
import {
    mxUtils,
    mxShape,
    mxStencil
} from '../misc/mxExport.js';

/**
 * @classdesc The shape for the Link-element
 * @constructor
 * @extends mxShape
 * @see Link
 */
class LinkShape extends mxShape {
    constructor() {
        let str = '<shape name="link" h="25" w="50" aspect="1" ><foreground><fontsize size="17"/><fontcolor color="#0000ff"/><strokecolor color="#0000ff"/><text str="Link" x="25" y="12" align="center" valign="middle"/><path><move x="8" y="20"/><line x="42" y="20"/></path><fillstroke/></foreground></shape>';
        let xml = mxUtils.parseXml(str);
        let stencil = new mxStencil(xml.documentElement);
        super(stencil);
    }
}
export default LinkShape;