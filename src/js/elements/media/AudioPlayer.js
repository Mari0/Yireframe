/**
 * @module UIElements/Media
 */
import {
    mxConstants,
    mxGeometry
} from '../../misc/mxExport.js';
import UIMedia from '../UIMedia.js';

/**
 * The Audio Player HTML 5 element
 * @classdesc <audio>
 * @constructor
 * @param {mxGeometry} [geometry= new mxGeometry(0, 0, 200, 30)] the width, height, x and y of the ui element
 * @extends UIMedia
 */
class AudioPlayer extends UIMedia {
    constructor(geometry) {
        if (!geometry)
            geometry = new mxGeometry(0, 0, 200, 30);
        //style in html5stencils.xml and registered in the editor
        var style = mxConstants.STYLE_SHAPE + "=AudioPlayer;" +
            mxConstants.STYLE_FILLCOLOR + "=none;" +
            mxConstants.STYLE_STROKECOLOR + '=grey;' +
            mxConstants.STYLE_ASPECT + '=fixed;' +
            mxConstants.STYLE_EDITABLE + "=0;";

        super(geometry, style);
        this.value.setAttribute('_src', 'https://rwth-acis.github.io/CAE-WireframingEditor/resources/horse.mp3');
    }

    /**
    * The HTML node name
    * @static 
    * @default audio
    * @readonly
    */
    static HTML_NODE_NAME = 'audio';

    /**
     * The Name in the wireframing editor
     * @static 
     * @default AudioPlayer
     * @readonly
     */
    static NAME = "Audio Player";

}
export default AudioPlayer;