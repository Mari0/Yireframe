/**
 * @module Tags
 */
import { mxUtils, mxImage } from '../misc/mxExport.js';
import AbstractTag from './AbstractTag.js';
import CONST from '../misc/Constants.js';

/**
 * @classdesc The tag indicates if the ui element is dynamic
 * 
 * It maps the collabortive property the front end component model
 * The tag is unique that means it is only allowed once for a cell
 * @constructor
 * @param  {UIControl} cell the cell that holds the tag
 * @param  {mxPoint} offset the offset
 * @extends AbstractTag
 */
class DynamicTag extends AbstractTag {
    constructor(cell, offset) {
        super(cell, new mxImage(DynamicTag.IMAGE, CONST.TAG.SIZE, CONST.TAG.SIZE), 'Shared editing enabled', offset);
        this.tagObj.setAttribute('isUnique', true);
        this.tagObj.setAttribute('tagType', DynamicTag.Alias);
    }

    /**
    * An alias name for the DynamicTag class
    * @default Dynamic
    * @static
    * @readonly 
    */
    static Alias = 'Dynamic';

    /**
     * The URL to the image as defined in the constants-modules
     * @default CONST.IMAGES.YJS
     * @static 
     * @readonly
     */
    static IMAGE = CONST.IMAGES.DYNAMIC;


}

AbstractTag.registerCodec(DynamicTag);
export default DynamicTag;