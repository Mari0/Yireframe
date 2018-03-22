/**
 * @module WireframeEditor
 */
import {
    mxToolbar,
    mxGraph,
    mxConstants,
    mxEvent
} from './misc/mxExport.js';
//not working currently
//import tippy from 'tippy.js';
let tippy = require('tippy.js');

/**
 * The palette consists of all ui elments supported by the editor
 * @classdesc The palette of the wireframing editor
 * @constructor
 * @param {DOM} container the container
 * @extends mxToolbar
 */
class Palette extends mxToolbar {
    thumbBorder = 1;
    thumbWidth = 48;
    thumbHeight = 48;
    thumbPadding = 1;
    graph = null;
    constructor(container) {
        super(container);
        this.enabled = false;
        let createTemporaryGraph = (stylesheet) => {
            let graph = new mxGraph(document.createElement('div'), null, null, stylesheet);
            graph.resetViewOnRootChange = false;
            graph.setConnectable(false);
            graph.gridEnabled = false;
            graph.autoScroll = false;
            graph.setTooltips(false);
            graph.setEnabled(false);
    
            // Container must be in the DOM for correct HTML rendering
            graph.container.style.visibility = 'hidden';
            graph.container.style.position = 'absolute';
            graph.container.style.overflow = 'hidden';
            graph.container.style.height = '1px';
            graph.container.style.width = '1px';
    
            return graph;
        };    
        this.graph = createTemporaryGraph();
    }
   
    /**
     * Get a node entry to the given parent
     * @param {mxCell} cell the cell
     * @param {Boolean} showLabel  label visibility of the graph. default is false
     * @return {mxCell} the new cell 
     */
    getNodeEntry(cell, showLabel) {
        this.graph.labelsVisible = showLabel || false;
        this.graph.view.scaleAndTranslate(1, 0, 0);

        this.graph.addCell(cell);
        let bounds = this.graph.getGraphBounds();
        let s = Math.floor(Math.min((this.thumbWidth - 2 * this.thumbBorder) / bounds.width, (this.thumbHeight - 2 * this.thumbBorder) / bounds.height) * 100) / 100;
        this.graph.view.scaleAndTranslate(s, Math.floor((this.thumbWidth - bounds.width * s) / 2 / s - bounds.x), Math.floor((this.thumbHeight - bounds.height * s) / 2 / s - bounds.y));
        let node = null;

        // For supporting HTML labels in IE9 standards mode the container is cloned instead
        if (this.graph.dialect == mxConstants.DIALECT_SVG) {
            node = this.graph.view.getCanvas().ownerSVGElement.cloneNode(true);
        }
        // LATER: Check if deep clone can be used for quirks if container in DOM
        else {
            node = this.graph.container.cloneNode(false);
            node.innerHTML = this.graph.container.innerHTML;
        }

        this.graph.getModel().clear();

        node.style.position = 'relative';
        node.style.overflow = 'hidden';
        node.style.cursor = 'move';
        node.style.left = this.thumbBorder + 'px';
        node.style.top = this.thumbBorder + 'px';
        node.style.width = this.thumbWidth + 'px';
        node.style.height = this.thumbHeight + 'px';
        node.style.visibility = '';
        node.style.minWidth = '';
        node.style.minHeight = '';
        return node;
    }

    /**
     * @param {mxCell} cell the cell
     * @param {String} name the name of the item in the palette
     * @param {Boolean} showLabel true if the label should be shown else false. Default is false
     * @return {DOM} the item
     */
    createItem(cell, name, showLabel) {
        let elt = document.createElement('a');
        elt.setAttribute('href', 'javascript:void(0);');
        elt.className = 'item';
        elt.setAttribute('title', name);
        elt.style.overflow = 'hidden';
        let border = 2 * this.thumbBorder;
        elt.style.width = (this.thumbWidth + border) + 'px';
        elt.style.height = (this.thumbHeight + border) + 'px';
        elt.style.padding = this.thumbPadding + 'px';

        // Blocks default click action
        mxEvent.addListener(elt, 'click', evt => {
            mxEvent.consume(evt);
        });
        elt.appendChild(this.getNodeEntry(cell, showLabel));

        this.container.appendChild(elt);
        return elt;
    }

    createTooltips() {
        tippy('.item', {
            position: 'right',
            animation: 'scale',
            duration: 1000,
            arrow: true,
            arrowSize: 'big',
            size: 'big',
            theme: 'transparent'
        })
    }
}
export default Palette;