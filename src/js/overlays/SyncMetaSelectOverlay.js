/**
 * @module Overlays
 */
import { mxCellOverlay, mxUtils, mxConstants, mxImage } from '../misc/mxExport.js';
import CONST from '../misc/Constants.js';

/**
 * The overlay to display if the node was selected in Syncmeta
 * @constructor
 * @param {string} imageURL the url to the image of overlay
 * @param {mxPoint} offset the offset of the overlay 
 * @param {*} cursor the cursor
 * @extends mxCellOverlay
 */
class SyncMetaSelectOverlay extends mxCellOverlay {
    constructor(imageURL, offset, cursor) {
        super(new mxImage(CONST.IMAGES.SYNCMETA || imageURL, CONST.TAG.SIZE, CONST.TAG.SIZE), 'Currently Selected in the Syncmeta Canvas', mxConstants.ALIGN_LEFT, mxConstants.ALIGN_BOTTOM, offset, cursor);
    }
}

export default SyncMetaSelectOverlay;