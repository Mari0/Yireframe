/**
 * @module Overlays
 */
import { mxCellOverlay, mxUtils, mxConstants, mxImage } from '../misc/mxExport.js';
import CONST from '../misc/Constants.js';

/**
 * User image overlay class for better awareness 
 * @constructor
 * @param {String} userId the user id
 * @param {string} username the name of the user
 * @param {string} imageURL the URL to the image
 * @param {*} offset the offset
 * @param {*} cursor the cursor
 * @extends mxCellOverlay
 */
class UserOverlay extends mxCellOverlay {
    constructor(userId, username, imageURL, offset, cursor) {
        super(new mxImage(imageURL || CONST.IMAGES.DEFAULT_USER, CONST.TAG.SIZE, CONST.TAG.SIZE), username, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM, offset, cursor);
        let _userId = userId;
        this.getUserId = () => _userId
    }
}

export default UserOverlay;