/*global y*/
/**
 * @module UIElements/Media
 */
import Y from './../../../../node_modules/yjs/dist/y.js';
import {
    mxConstants,
    mxGeometry
} from '../../misc/mxExport.js';
import UIMedia from '../UIMedia.js';

/**
 * The Video Player HTML 5 element
 * @classdesc <video>
 * @constructor
 * @param {mxGeometry} [geometry=new mxGeometry(0, 0, 200, 100)] the width, height, x and y of the ui element
 * @extends UIMedia
 */
class VideoPlayer extends UIMedia {
    constructor(geometry) {
        if (!geometry)
            geometry = new mxGeometry(0, 0, 200, 100);
        //style in html5stencils.xml and registered in the editor
        var style = mxConstants.STYLE_SHAPE + "=VideoPlayer;" +
            mxConstants.STYLE_FILLCOLOR + "=none;" +
            mxConstants.STYLE_STROKECOLOR + '=grey;' +
            mxConstants.STYLE_ASPECT + '=fixed;' +
            mxConstants.STYLE_EDITABLE + "=0;";

        super(geometry, style);
        this.value.setAttribute('_poster', '');
        //https://static.videezy.com/system/resources/previews/000/005/341/original/Earth_Spin_Medium.mp4
        //https://www.w3schools.com/html/mov_bbb.mp4
        this.value.setAttribute('_src', 'https://rwth-acis.github.io/CAE-WireframingEditor/resources/mov_bbb.mp4');
    }

    createShared(createdByLocalUser) {
        UIMedia.prototype.createShared.call(this, createdByLocalUser);
        if (createdByLocalUser)
            y.share.attrs.set(this.getId() + '_poster', Y.Text);
    }

    initShared() {
        UIMedia.prototype.initShared.call(this);
        this.initYText('_poster');
    }

    /**
 * The HTML node name
 * @static 
 * @default video
 * @readonly
 */
    static HTML_NODE_NAME = 'video';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default VideoPlayer
     * @readonly
     */
    static NAME = "Video Player";

}
export default VideoPlayer;