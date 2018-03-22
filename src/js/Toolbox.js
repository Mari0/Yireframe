/*global y*/
/**
 * @module WireframeEditor
 */
import {
    mxDefaultToolbar,
    mxEvent,
    mxCodec,
    mxClipboard,
    mxUtils,
    mxRectangle,
    mxLog
} from './misc/mxExport.js';
import $ from 'jquery';
import Util from './misc/Util.js';
import CONST from './misc/Constants.js';
import HierachyTree from './HierachyTree.js';

/**
 * Defines the (shared) actions for copy & paste, undo & redo and grouping & ungrouping 
 * @classdesc The toolbar of the editor
 * @constructor
 * @param {DOM} container the div container in the DOM 
 * @param {mxEditor} editor the editor instance of the wireframing application
 * @extends mxDefaultToolbar
 * @requires HierachyTree
 */
class Toolbox extends mxDefaultToolbar {
    constructor(container, editor) {
        super(container, editor);

        this._editor = editor;
        let that = this;

        /*eslint-disable no-unused-lets*/
        editor.addAction(CONST.ACTIONS.SHARED.PASTE, (editor, cell) => {
            let codec = new mxCodec();
            let result = codec.encode(mxClipboard.getCells());
            let xml = mxUtils.getXml(result);
            y.share.action.set(CONST.ACTIONS.SHARED.PASTE, {
                userId: y.db.userId,
                xml: xml
            });
        });

        editor.addAction(CONST.ACTIONS.SHARED.DELETE, (editor, cell) => {
            let children = {};
            let cells = that._editor.graph.getSelectionCells();
            function helper(cell) {
                let childrenArr = [];
                for (let i = 0; cell.children && i < cell.children.length; i++) {
                    let child = cell.children[i];
                    childrenArr.push(child.getId());
                    helper(child);
                }
                children[cell.getId()] = childrenArr;
            }
            for (let i = 0; i < cells.length; i++) {
                helper(cells[i]);
            }

            y.share.action.set(mxEvent.REMOVE, {
                userId: y.db.userId,
                cells: Util.getIdsOfSelectedCells(that._editor.graph),
                children: children
            });
        });

        /*eslint-disable no-unused-lets*/
        editor.addAction(CONST.ACTIONS.SHOW_USER_LIST, (editor, cell) => {
            let $window = $('#userList').parents('.mxWindow').parents('.mxWindow');
            if ($window.is(':visible'))
                $window.hide();
            else $window.show();
        });

        /*eslint-disable no-unused-lets*/
        editor.addAction(CONST.ACTIONS.SHARED.UNDO, (editor, cell) => {
            y.share.action.set(mxEvent.UNDO, y.db.userId);
        });

        /*eslint-disable no-unused-lets*/
        editor.addAction(CONST.ACTIONS.SHARED.REDO, (editor, cell) => {
            y.share.action.set(mxEvent.REDO, y.db.userId);
        });

        /*eslint-disable no-unused-lets*/
        editor.addAction(CONST.ACTIONS.SHARED.GROUP, (editor, cell) => {
            y.share.action.set(mxEvent.GROUP_CELLS, {
                userId: y.db.userId,
                groupId: Util.GUID(),
                ids: Util.getIdsOfSelectedCells(that._editor.graph)
            });
        });

        /*eslint-disable no-unused-lets*/
        editor.addAction(CONST.ACTIONS.SHARED.UNGROUP, (editor, cell) => {
            y.share.action.set(mxEvent.UNGROUP_CELLS, {
                userId: y.db.userId,
                ids: Util.getIdsOfSelectedCells(that._editor.graph)
            });
        });

        editor.addAction(CONST.ACTIONS.EXPORT, () => {
            let link = document.createElement('a');
            link.download = "wireframe.xml";
            link.href = 'data:,' + encodeURI(y.share.data.get('wireframe'));
            link.click();
        });

        editor.addAction(CONST.ACTIONS.SHOW_CONSOLE, () => {
            if (mxLog.isVisible())
                mxLog.hide();
            else
                mxLog.show();
        });

        editor.addAction(CONST.ACTIONS.IMPORT, editor => {
            let input = document.createElement('input');
            input.type = 'file';

            //$(input).change(function(){});
            //input.addEventListener('change', function(){});
            input.onchange = function () {
                let fileReader, files, file;
                fileReader = new FileReader();
                fileReader.onload = e => {
                    let data = e.target.result;
                    try {
                        let json = JSON.parse(data);
                        //transform model to wireframe
                        let wirefarme = ModelToWireframe(json, editor);
                        //apply layout
                        y.share.data.set('wireframe', wirefarme);
                        y.share.action.set('reload', true);
                    } catch (e) {
                        console.error(e);
                        try {
                            $.parseXML(data);
                            y.share.data.set('wireframe', data);
                            y.share.action.set('reload', true);
                        } catch (e) {
                            console.error('no valid wireframe model or front end component model');
                        }
                    }
                    //TODO improve import

                };
                files = this.files;
                if (!files || files.length === 0) return;
                file = files[0];
                fileReader.readAsText(file);
            };
            input.click();
        });

        editor.addAction(CONST.ACTIONS.SAVE, () => {
            Util.Save(editor.graph);
        })



        editor.addAction(CONST.ACTIONS.HIERACHY_TREE, editor => {
            if (HierachyTree.isVisible())
                HierachyTree.hide();
            else
                HierachyTree.show();
        })

        y.share.action.observe(event => {
            switch (event.name) {
                case mxEvent.UNDO:
                    //that._editor.execute("undo");
                    if (event.value !== y.db.userId) {
                        var cells = that._editor.graph.getSelectionCells();
                        that._editor.undo();
                        that._editor.graph.setSelectionCells(cells);
                    } else
                        that._editor.undo();
                    Util.Save(that._editor.graph);
                    break;
                case mxEvent.REDO:
                    if (event.value !== y.db.userId) {
                        var cells = that._editor.graph.getSelectionCells();
                        that._editor.redo();
                        that._editor.graph.setSelectionCells(cells);
                    } else
                        that._editor.redo();
                    Util.Save(that._editor.graph);
                    break;
                case mxEvent.REMOVE:
                    that._editor.graph.setSelectionCells(Util.getCellsFromIdList(that._editor.graph, event.value.cells));
                    that._editor.execute("delete");
                    that._editor.graph.updateBounds();
                    HierachyTree.remove(event.value.cells);
                    if (y.db.userId === event.value.userId)
                        Util.Save(that._editor.graph);
                    break;
                case mxEvent.GROUP_CELLS:
                    var cells = Util.getCellsFromIdList(that._editor.graph, event.value.ids);

                    if (event.value.userId !== y.db.userId) that._editor.graph.setEventsEnabled(false);
                    let group = that._editor.graph.createGroupCell();
                    group.setId(event.value.groupId);
                    that._editor.graph.groupCells(group, 30, cells);
                    if (event.value.userId !== y.db.userId) that._editor.graph.setEventsEnabled(true);

                    if (y.db.userId === event.value.userId) {
                        //that._editor.graph.setSelectionCells(group);
                        that._editor.graph.getSelectionModel().setCell(group);
                        group.createShared(true);
                    }
                    that._editor.graph.updateBounds();
                    HierachyTree.group(group, cells);
                    break;
                case mxEvent.UNGROUP_CELLS:
                    var cells = Util.getCellsFromIdList(that._editor.graph, event.value.ids);
                    let ungroupable = [];
                    for (let i = 0; i < cells.length; i++) {
                        if (cells[i].constructor.name === 'DivContainer')
                            ungroupable.push(cells[i]);
                    }
                    //Note: important to call Hierachy.ungroup() before graph.ungroupCells, otherwise parent and child information is lost
                    HierachyTree.ungroup(ungroupable);
                    that._editor.graph.ungroupCells(ungroupable);
                    if (y.db.userId === event.value.userId)
                        that._editor.graph.setSelectionCells(cells);
                    that._editor.graph.updateBounds();
                    break;
                case CONST.ACTIONS.SHARED.PASTE:
                    let selectedCells = that._editor.graph.getSelectionCells();

                    let doc = mxUtils.parseXml(event.value.xml);
                    let elt = doc.documentElement.firstChild.childNodes[1];
                    var cells = [];
                    while (elt != null) {
                        let codec = new mxCodec();
                        let cell = codec.decode(elt);
                        cells.push(cell);
                        elt = elt.nextSibling;
                    }
                    mxClipboard.setCells(cells);
                    let pastedCells = mxClipboard.paste(that._editor.graph);

                    if (event.value.userId !== y.db.userId) {
                        that._editor.graph.setSelectionCells(selectedCells);
                    } else {
                        for (let i = 0; i < pastedCells.length; i++)
                            if (pastedCells[i].hasOwnProperty('createShared'))
                                pastedCells[i].createShared(true);
                    }
                    break;
                case CONST.ACTIONS.SHARED.GRAPH_RESIZE: //event triggerd in index.html
                    if (y.db.userId !== event.value.userId) {
                        //let size = $('#wireframeWrap').css(["width", "height"]);
                        $('#wireframeWrap').css("width", event.value.width).css("height", event.value.height);
                        $('#wireframe').css("width", event.value.width).css("height", event.value.height);
                        $('#draggingBar').css("width", event.value.width);
                    }
                    let prevBounds = that._editor.graph.maximumGraphBounds;
                    that._editor.graph.maximumGraphBounds = new mxRectangle(0, 0, event.value.width, event.value.height);
                    break;
                case 'reload':
                    window.location.reload();
                    break;
            }
        });

        this.addSeparator = function (icon) {
            //The first two lines are from the addSeperator(icon) of mxDefaultToolbar
            icon = icon || CONST.IMAGES.SEPERATOR;
            let item = this.toolbar.addSeparator(icon);
            $(item).addClass("mxSeparator");
            return item;
        }

        //this.addSeparator();
        let item = this.addItem('Save', CONST.IMAGES.SAVE, CONST.ACTIONS.SAVE);
        $(item).addClass('wfSave');
        //this.addSeparator();
        this.addItem("Copy", CONST.IMAGES.COPY, CONST.ACTIONS.COPY);
        this.addItem("Paste", CONST.IMAGES.PASTE, CONST.ACTIONS.SHARED.PASTE);
        //  this.addSeparator();
        this.addItem("Delete", CONST.IMAGES.DELETE, CONST.ACTIONS.SHARED.DELETE);
        //this.addSeparator();
        //this.addItem("Cut", "images/toolbox/cut.gif", "shared_cut");
        this.addItem("Undo", CONST.IMAGES.UNDO, CONST.ACTIONS.SHARED.UNDO);
        this.addItem("Redo", CONST.IMAGES.REDO, CONST.ACTIONS.SHARED.REDO);
        //this.addSeparator();
        this.addItem("Group", CONST.IMAGES.GROUP, CONST.ACTIONS.SHARED.GROUP);
        this.addItem("Ungroup", CONST.IMAGES.UNGROUP, CONST.ACTIONS.SHARED.UNGROUP);
        //this.addSeparator();
        this.addItem("Import", CONST.IMAGES.IMPORT, CONST.ACTIONS.IMPORT);
        this.addItem("Export", CONST.IMAGES.EXPORT, CONST.ACTIONS.EXPORT);
        //this.addSeparator();
        this.addItem("User List", CONST.IMAGES.USER_LIST, CONST.ACTIONS.SHOW_USER_LIST);
        //this.addSeparator();

    }
}
export default Toolbox;