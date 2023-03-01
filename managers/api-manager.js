const ActionManager = require('./action-manager');
const DB = require('../db');

const TRIGGER_PREFIX = 'run';
const MAX_DEPTH = 20;

let pages = [];
let listeners = [];
let fragments = [];

DB.getPages().then((page_objs) => {
    for (let i = 0; i < page_objs.length; i++) {
        let page = page_objs.find((p) => p.ind === i); // put them in correct indexes
        if (!page) {
            page = {
                ind: i,
                listeners: [],
                fragments: [],
            };
        }
        pages.push(page);
    }
    loadPages();
});

const loadPages = () => {
    for (let i = 0; i < pages.length; i++) {
        if (pages[i] === undefined) {
            pages[i] = { ind: i, listeners: [], fragments: [] };
        }
    }
    listeners = [];
    fragments = [];
    pages.forEach((page) => {
        page.listeners.forEach((listener) => listeners.push(listener));
        page.fragments.forEach((fragment) => fragments.push(fragment));
    });
};

module.exports.runFragment = async (id, payload, depth) => {
    if (!payload) payload = {};
    if (!depth) depth = 0;
    if (depth > MAX_DEPTH) {
        console.log(
            `Blocked fragment ${id}: max trigger call stack size reached - is there an infinite loop?`
        );
        return;
    }

    const frag = fragments.find((f) => f.id == id);

    for (const info of frag.routine) {
        const action = ActionManager.getAction(
            info.action.head,
            info.action.name
        );

        const triggers = {};
        action.triggers.forEach((trigger_name) => {
            triggers[TRIGGER_PREFIX + trigger_name] = () => {
                const payload_copy = { ...payload };
                const gotoID = info.triggers[trigger_name];
                if (gotoID) {
                    this.runFragment(gotoID, payload_copy, depth + 1);
                }
            };
        });

        await action.run(triggers, payload, info.params);
    }

    // frag.routine.forEach((info) => {
};

module.exports.getPage = (ind) => {
    if (pages.length - 1 < ind) return {};
    return pages[ind];
};

module.exports.addPage = (page, ind) => {
    pages.splice(ind, 0, page);
    loadPages();
    DB.setPages(pages);
};

module.exports.deletePage = (ind) => {
    pages.splice(ind, 1);
    loadPages();
    DB.setPages(pages);
};

module.exports.updatePage = (ind, page) => {
    page.ind = ind;
    pages[ind] = page;
    loadPages();
    DB.setPages(pages);
};

module.exports.getListeners = () => {
    return listeners;
};

module.exports.getFragments = () => {
    return fragments;
};
