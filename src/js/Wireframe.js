/*global y*/
/**
 * @module WireframeEditor
 */
import {
    mxGraph,
    mxEvent,
    mxGraphHandler,
    mxCodec,
    mxKeyHandler,
    mxRubberband,
    mxUtils,
    mxRectangle,
    mxGeometry,
    mxConstants,
    mxCodecRegistry
} from './misc/mxExport.js';
import Util from './misc/Util.js';
import UserOverlay from './overlays/UserOverlay.js';
import EditOverlay from './overlays/EditOverlay.js';
import EnableAwareness from './misc/Awareness.js';
import WireframeLayout from './WireframeLayout.js';
import $ from 'jquery';
import CONST from './misc/Constants.js';
import HierachyTree from './HierachyTree.js';

/**
 * Main class which visualizes a wireframe
 * @classdesc The class represents the visuale representation of the wireframe
 * @constructor
 * @param {DOM} container the div container containning the canvas
 * @param {WireframeModel} model represents the model of the wireframe
 * @extends mxGraph
 */
class Wireframe extends mxGraph {
    sharedAction = null;
    
    constructor(container, model) {
        super(container, model);

        this.defaultOverlap = 0;
        this.foldingEnabled = false;
        this.autoExtend = false;
        this.allowAutoPanning = false;
        this.collapseToPreferredSize = false;
        this.extendParentsOnAdd = false;
        this.extendParents = false;
        this.setHtmlLabels(true);
        this.setTooltips(true); //enable tooltips for overlays
        this.dropEnabled = true;

        this.maximumGraphBounds = new mxRectangle(0, 0, 500, 500);
        //enable guiding lines
        mxGraphHandler.prototype.guidesEnabled = true;
        mxGraphHandler.prototype.highlightEnabled = true;

        //enables user highlighting and overlay for cells of the wireframe
        EnableAwareness(this);

        new mxKeyHandler(this);
        new mxRubberband(this);


        /**
         * An event for the move of multiple cells
         * @param {Wireframe} wf the wireframe object
         * @param {Object} event the event-object
         * @private
         * @returns {undefined}
         */
        let SharedCellsMovedEvent = (wf, event) => {
            let properties = event.getProperties();
            let cells = properties.cells;
            let ids = [];
            for (let i = 0; i < cells.length; i++) {
                ids.push(cells[i].id);
            }
            this.sharedAction = {
                userId: y.db.userId,
                dx: properties.dx,
                dy: properties.dy,
                ids: ids
            };
        };

        /**
         * An event for the resize of multiple cells
         * @param {Wireframe} graph the wireframe object
         * @param {Object} event the event-object
         * @private
         * @returns {undefined}
         */
        let SharedCellResizedEvent = (graph, event) => {
            //Proudly stolen from the docs
            let cells = event.getProperty('cells');
            let bounds = event.getProperty('bounds');
            if (cells != null) {
                for (let i = 0; i < cells.length; i++) {
                    if (graph.getModel().getChildCount(cells[i]) > 0) {
                        let geo = graph.getCellGeometry(cells[i]);

                        if (geo != null) {
                            let children = graph.getChildCells(cells[i], true, true);
                            let bb = graph.getBoundingBoxFromGeometry(children, true);

                            geo = geo.clone();
                            geo.width = Math.max(geo.width, bb.width);
                            geo.height = Math.max(geo.height, bb.height);

                            graph.getModel().setGeometry(cells[i], geo);
                        }
                    }
                }
                this.sharedAction = {
                    userId: y.db.userId,
                    ids: [],
                    bounds: []
                };
                for (let i = 0; i < cells.length; i++) {
                    this.sharedAction.ids.push(cells[i].id);
                    this.sharedAction.bounds.push({
                        x: bounds[i].x,
                        y: bounds[i].y,
                        width: bounds[i].width,
                        height: bounds[i].height
                    });
                }
            }

        };
        this.addListener(mxEvent.CELLS_MOVED, SharedCellsMovedEvent);
        this.addListener(mxEvent.CELLS_RESIZED, SharedCellResizedEvent);
        this.addListener(mxEvent.DOUBLE_CLICK, (sender, evt) => {
            let cell = evt.getProperty('cell');
            if (cell) {
                if (cell.hasOwnProperty('get$node')) {
                    cell.get$node().css('pointer-events', 'auto');
                    cell.get$node().focus();
                }
            }
        });

        this.getSelectionModel().addListener(mxEvent.CHANGE, (sender, event) => {
            let deselected = event.getProperty('added');
            for (let i = 0; deselected && i < deselected.length; i++) {
                if (deselected[i].hasOwnProperty('get$node'))
                    deselected[i].get$node().css('pointer-events', 'none');
                mxGraph.prototype.removeCellOverlay.call(this, deselected[i], deselected[i].getEditOverlay());
            }
            let selected = event.getProperty('removed');
            if (selected) {
                for (let i = 0; selected && i < selected.length && selected[i]; i++) {
                    let editOverlay = new EditOverlay();
                    mxGraph.prototype.addCellOverlay.call(this, selected[i], editOverlay);
                    editOverlay.bindClickEvent(this);
                }
            }
        });



        //------------------------------------------------------------------------------------------------------------------------
        //--------------------------------------Begin Yjs Observer for actions----------------------------------------------------
        //------------------------------------------------------------------------------------------------------------------------
        y.share.action.observe(event => {
            switch (event.name) {
                case mxEvent.ADD_VERTEX:
                    {
                        //disable events for the remote user 

                        let doc = mxUtils.parseXml(event.value.data);
                        let codec = new mxCodec(doc);
                        let type = doc.documentElement.getAttribute('uiType');
                        let elt = doc.documentElement.childNodes[1];
                        let cells = [];
                        while (elt != null) {
                            let cell = codec.decode(elt);
                            cell.setId(event.value.id);
                            if (cell.hasOwnProperty('initDOM')) cell.initDOM();
                            cell.setType(type);
                            cells.push(cell);
                            elt = elt.nextSibling;
                        }
                        //deactivate ADD_CELLS event for the remote user during transaction
                        if (event.value.userId !== y.db.userId)
                            this.setEventsEnabled(false);
                        this.getModel().beginUpdate();
                        try {
                            if (event.value.parent)
                                this.addCells(cells, this.getModel().getCell(event.value.parent));
                            else
                                this.addCells(cells);

                        }
                        finally {
                            this.getModel().endUpdate();
                            if (!event.value.parent)
                                this.updateBounds();
                            //activate events after transaction
                            if (event.value.userId !== y.db.userId)
                                this.setEventsEnabled(true);

                        }
                        for (let i = 0; i < cells.length; i++) {
                            HierachyTree.add(cells[i]);
                            cells[i].createShared(event.value.userId === y.db.userId);
                        }
                        if (event.value.userId === y.db.userId) {
                            this.setSelectionCells(cells);
                            $('#wireframe').focus();
                        }
                        break;
                    }
                case mxEvent.MOVE:
                    {
                        let parent = this.getModel().getCell(event.value.parentId);
                        if (event.value.userId !== y.db.userId) {
                            this.getModel().beginUpdate();
                            try {
                                this.setEventsEnabled(false);
                                let cells = Util.getCellsFromIdList(this, event.value.ids);
                                if (cells.length > 0) {
                                    if (event.value.dx != 0 || event.value.dy != 0)
                                        this.moveCells(cells, event.value.dx, event.value.dy, false, parent, null, null, true);
                                }
                            }
                            finally {
                                this.getModel().endUpdate();
                                this.setEventsEnabled(true);
                            }
                        }
                        for (let i = 0; i < event.value.ids.length; i++) {
                            let cell = this.getModel().getCell(event.value.ids[i]);
                            let parent = this.getModel().getCell(event.value.parentId);
                            if (cell && parent) {
                                HierachyTree.move(event.value.ids, event.value.parentId, parent.getIndex(cell));
                            }
                        }
                        this.updateBounds();
                        break;
                    }
                case mxEvent.RESIZE:
                    {
                        let bounds = [];
                        for (let i = 0; i < event.value.bounds.length; i++) {
                            let bound = event.value.bounds[i];
                            bounds.push(new mxRectangle(bound.x, bound.y, bound.width, bound.height));
                            let cell = this.model.getCell(event.value.ids[i]);
                            if (cell && cell.hasOwnProperty('get$node')) {
                                let $node = cell.get$node();
                                $node.css('width', bound.width).css('height', bound.height);
                            }
                        }
                        if (event.value.userId !== y.db.userId) {

                            let cells = Util.getCellsFromIdList(this, event.value.ids);

                            if (cells.length > 0) {
                                this.getModel().beginUpdate();
                                try {
                                    this.setEventsEnabled(false);
                                    this.resizeCells(cells, bounds, false, true);
                                } finally {
                                    this.getModel().endUpdate();
                                    this.updateBounds();
                                    this.setEventsEnabled(true);
                                }
                            }
                        }
                        break;
                    }
                case mxEvent.ADD_OVERLAY:
                    {
                        let doc = mxUtils.parseXml(event.value.xml);
                        let codec = new mxCodec(doc);
                        codec.decode = function (node, into) {
                            let obj = null;
                            if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT) {
                                let dec = mxCodecRegistry.getCodec(node.nodeName);
                                if (dec != null) {
                                    obj = dec.decode(this, node, into);
                                } else {
                                    obj = node.cloneNode(true);
                                    obj.removeAttribute('as');
                                }
                            }
                            return obj;
                        };
                        let tag = codec.decode(doc.documentElement);

                        let cell = this.getModel().getCell(event.value.id);
                        if (cell && tag) {
                            mxGraph.prototype.addCellOverlay.apply(this, [cell, tag]);
                            cell.addTag(tag);
                            tag.setCell(cell);
                            if (tag.hasOwnProperty('initAttributes')) tag.initAttributes();
                            tag.createShared(y.db.userId === event.value.userId);
                            tag.bindClickEvent(this);
                            let ref = $('#' + cell.getId() + '_tagTree').jstree(true);
                            if (ref) {
                                ref.create_node(null, {
                                    id: tag.tagObj.getAttribute('id'),
                                    type: tag.tagObj.getAttribute('tagType'),
                                    text: tag.constructor.Alias || tag.tagObj.getAttribute('tagType'),
                                    state: {
                                        selected: false,
                                        opened: true
                                    }
                                });
                                //if (sel) ref.edit(sel);
                            }
                        }
                        break;
                    }
                case CONST.ACTIONS.MOVE_TAG:
                    {
                        if (event.value.userId !== y.db.userId) {
                            $('#' + event.value.cellId + '_tagTree').jstree(true).move_node(event.value.node, event.value.parent, event.value.position);
                        }
                        let cell = this.getModel().getCell(event.value.cellId);
                        let tag = cell.getTagById(event.value.node);
                        cell.removeTagById(tag.getId());
                        tag.tagObj.setAttribute('parent', event.value.parent);
                        if (event.value.parent !== '#') {
                            let parentTag = cell.getTagById(event.value.parent);
                            parentTag.addChildTag(tag);
                        }
                        cell.addTag(tag);
                        break;
                    }
                case CONST.ACTIONS.DELETE_TAG: {
                    let $tree = $('#' + event.value.cellId + '_tagTree');
                    if ($tree.length > 0)
                        $tree.jstree(true).delete_node(event.value.selected);
                    //delete attribute form of the tag
                    $('#propertyEditor_' + event.value.cellId).find('.tagAttribute').parent().remove();
                    let cell = this.getModel().getCell(event.value.cellId);
                    if (cell) {
                        for (let i = 0; i < event.value.selected.length; i++) {
                            let id = event.value.selected[i];
                            for (let j = 0; cell.overlays && j < cell.overlays.length; j++) {
                                let tag = cell.overlays[j];
                                if (tag.hasOwnProperty('tagObj') && tag.tagObj.getAttribute('id') === id) {
                                    this.removeCellOverlay(cell, tag);
                                    cell.removeTagById(id);
                                    let removeAllChilds = (cell, tag) => {
                                        //remove childs
                                        let childs = tag.getChildTags();
                                        for (let key in childs) {
                                            if (childs.hasOwnProperty(key)) {
                                                cell.removeTagById(key);
                                                this.removeCellOverlay(cell, childs[key]);
                                                removeAllChilds(cell, childs[key]);
                                            }
                                        }
                                    }
                                    removeAllChilds(cell, tag);
                                }
                            }
                        }
                        let k = 0;
                        let state = this.view.getState(cell);
                        if (state.overlays) {
                            for (let o in state.overlays.map) {
                                let tag = state.overlays.map[o].overlay;
                                if (tag.constructor.name !== 'UserOverlay' || tag.constructor.name !== 'EditOverlay') {
                                    tag.offset.x = -k * CONST.TAG.SIZE;
                                    k++;
                                }
                            }
                            this.cellRenderer.redraw(state);
                        }

                    }
                    break;
                }
                case CONST.ACTIONS.RENAME_TAG: {
                    //Not implemented, but maybe it might be a necessary feature in the future, but for now not required
                    break;
                }
                case CONST.ACTIONS.SHARED.APPLY_LAYOUT: {
                    let layout = new WireframeLayout(this);
                    layout.resizeVertices = false;

                    let cell;
                    if (event.value.cellId)
                        cell = this.getModel().getCell(event.value.cellId);
                    else
                        cell = this.getDefaultParent();

                    if (!event.value.recursive)
                        layout.execute(cell);
                    else {
                        let applyLayoutRecusively = parent => {
                            if (parent.children && parent.children.length < 1) return;
                            for (let i = 0; i < parent.children.length; i++) {
                                let child = parent.children[i];
                                if (child.constructor.name === 'DivContainer') {
                                    layout.execute(child);
                                    applyLayoutRecusively(child);
                                }
                            }
                        }
                        applyLayoutRecusively(cell);
                        layout.execute(cell);

                    }
                    break;
                }
            }
            if (event.value.userId === y.db.userId)
                Util.Save(this);
        });
        //------------------------------------------------------------------------------------------------------------------------
        //--------------------------------------End Yjs Observer for actions------------------------------------------------------
        //------------------------------------------------------------------------------------------------------------------------
    }
    
    
    /**
     * Overrides the moveCells-method from the parent class to make the move NRTC 
     * @param {UIObject[]} cells the cells to move
     * @param {Integer} dx the direction of the x-axis
     * @param {Integer} dy the direction of the y-axis
     * @param {Boolean} clone should the cell be cloned. default = false
     * @param {UIObject} target the parent
     * @param {*} evt never used
     * @param {*} mapping never used
     * @param {Boolean} shared indicates if its from the shared callback or not. TODO check this could be done better
     * @return {UIObject[]} the cells which were moved as an array
     * @see {@link https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraph-js.html#mxGraph.moveCells | moveCells}
     */
    moveCells(cells, dx, dy, clone, target, evt, mapping, shared) {
        let _cells = mxGraph.prototype.moveCells.apply(this, arguments);
        if (_cells.length > 0 && this.sharedAction && !shared) {
            this.sharedAction.parentId = _cells[0].parent.id;
            y.share.action.set(mxEvent.MOVE, this.sharedAction);
            this.sharedAction = null;
        }
        return _cells;
    };

    /**
     * Overrides the resizeCells-method from the parent calls mxCell to make it NRTC
     * @param {UIObjec[]} cells the cells to be resized 
     * @param {mxRectangle[]} bounds the new bounds for each cell.
     * @param {Boolean} recurse recurseveily resize the childs as well
     * @param {Boolean} shared shared indicates if its from the shared callback or not. TODO check this could be done better
     * @return {UIObject[]} the cells which were resized
     * @see {@link https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraph-js.html#mxGraph.resizeCells | resizeCells}
     */
    resizeCells(cells, bounds, recurse, shared) {
        let _cells;
        this.getModel().beginUpdate();
        try {
            _cells = mxGraph.prototype.resizeCells.apply(this, arguments);
        } finally {
            this.getModel().endUpdate();
            this.updateBounds();
        }
        if (_cells && _cells.length > 0 && this.sharedAction && !shared) {
            y.share.action.set(mxEvent.RESIZE, this.sharedAction);
            this.sharedAction = null;

        }
        return _cells;
    };

    /**
     * Overrides the addCellOverlay of the mxGraph module
     * @param {mxCell} cell the cell which will hold the overlay
     * @param {mxCellOverlay} overlay the overlay to add to the cell
     * @param {boolean} fromSyncMeta indicates if the event comes from a SyncMeta plugin callback
     * @returns {undefined}
     */
    addCellOverlay(cell, overlay, fromSyncMeta) {
        if (overlay instanceof UserOverlay || overlay instanceof EditOverlay) {
            mxGraph.prototype.addCellOverlay.apply(this, arguments);
        } else {
            y.share.action.set(mxEvent.ADD_OVERLAY, {
                userId: y.db.userId,
                id: cell.getId(),
                xml: overlay.toXML(),
                fromSyncMeta: !fromSyncMeta ? false : true
            });
        }
    };

    /**
     * Update the bounding box of the wireframing editor
     * @returns {undefined}
     */
    updateBounds() {
        let bounds = this.getBoundingBox(this.getDefaultParent().children);
        if (bounds) {
            $('#wireframeWrap').resizable('option', 'minWidth', bounds.x + bounds.width);
            $('#wireframeWrap').resizable('option', 'minHeight', bounds.y + bounds.height);
        }
    };

    /**
     * Convert a value of the cell to string which is displayed as a label
     * @param {mxCell} cell the cell
     * @returns {DOM} the dom element 
     */
    convertValueToString(cell) {
        if (mxUtils.isNode(cell.value)) {
            if (cell.hasOwnProperty('get$node')) {
                if (!cell.get$node())
                    cell.initDOM();
                return cell.get$node()[0];
            }
        }
    }
}
export default Wireframe;