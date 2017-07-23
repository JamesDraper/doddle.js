import Renderer from './Renderer.js';

export default function () {
    let renderers = {};

    let findRenderer = (options) => {
        let key = JSON.stringify(options);
        if (renderers[key] === undefined) {
            renderers[key] = new Renderer(options);
        }

        return renderers[key];
    }

    this.fromString = (elem, src, vars, options = {}) => {
        return findRenderer(options).fromString(elem, src, vars);
    }

    this.fromTemplate = (elem, id, vars, options = {}) => {
        return findRenderer(options).fromTemplate(elem, id, vars);
    }
}
