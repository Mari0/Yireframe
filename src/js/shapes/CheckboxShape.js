/**
 * @module Shapes
 */
import {
    mxUtils,
    mxShape,
    mxStencil
} from '../misc/mxExport.js';

/**
 * @classdesc The shape for the Checkbox-element
 * @constructor
 * @extends mxShape
 * @see Checkbox
 */
class CheckboxShape extends mxShape {
    constructor() {
        let str = '<shape name="checkbox" w="100" h="30" aspect="1"><foreground><fontsize size="25"/><text str="Checkbox" x="25" y="25"/><fillstroke/><strokewidth width="5"/><path><move x="8" y="45"/><line x="12" y="50"/><line x="20" y="30"/></path><fillstroke/></foreground><background><strokecolor color="black"/><fillcolor color="#e3e3e4"/><rect x="0" y="25" w="25" h="30"/><fillstroke/></background></shape>';
        let xml = mxUtils.parseXml(str);
        let stencil = new mxStencil(xml.documentElement);
        super(stencil);
    }
}
export default CheckboxShape;