/**
 * @module Tags
 */
import { mxUtils, mxImage } from '../misc/mxExport.js';
import AbstractTag from './AbstractTag.js';
import CONST from '../misc/Constants.js';

/**
 * @classdesc The tag indicates if the ui element supports NRTC collaborative features realized with Yjs
 * 
 * It maps the collabortive property the front end component model
 * The tag is unique that means it is only allowed once for a cell
 * @constructor
 * @param  {UIControl} cell the cell that holds the tag
 * @param  {mxPoint} offset the offset
 * @extends AbstractTag
 */
class SharedTag extends AbstractTag {
    constructor(cell, offset) {
        super(cell, new mxImage(SharedTag.IMAGE, CONST.TAG.SIZE, CONST.TAG.SIZE), 'Shared editing enabled', offset);
        this.tagObj.setAttribute('isUnique', true);
        this.tagObj.setAttribute('tagType', SharedTag.Alias);
    }

    /**
    * An alias name for the SharedTag class
    * @default Shared
    * @static
    * @readonly 
    */
    static Alias = 'Shared';

    /**
     * The URL to the image as defined in the constants-modules
     * @default CONST.IMAGES.YJS
     * @static 
     * @readonly
     */
    static IMAGE = CONST.IMAGES.YJS;
}
AbstractTag.registerCodec(SharedTag);
export default SharedTag;