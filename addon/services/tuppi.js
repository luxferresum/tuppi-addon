import Service from '@ember/service';
import slidesetsraw from 'tuppi-slides';
import unified from 'unified';
import parse from 'remark-parse';
import jsYaml from 'js-yaml';
import step from '../transform/step';

let processor = unified()
  .use(parse)
  .use(step);

const transforms = {
  markdown(yml) {
    const { type, content } = yml;

    let ast = processor.parse(content);
    let steps = [];
    const slide = {children: []};
    Object.keys(yml)
      .filter(k => k !== 'content')
      .forEach(k => slide[k] = yml[k])

    function run(source, target) {
      Object.keys(source)
        .filter(n => !['position'].includes(n))
        .forEach(k => target[k] = source[k]);
      target.children = [];

      for(let childSource of (source.children || [])) {
        const childTarget = {};
        target.children.push(childTarget);
        run(childSource, childTarget);
      }

      if(source.type === 'step') {
        steps.push(JSON.parse(JSON.stringify(slide)));
      }
    }

    run(ast, slide);
    steps.push(slide);

    function removeStepNodes(node) {
      node.children = node.children
        .filter(c => c.type !== 'step');
      node.children.forEach(c => removeStepNodes(c));
    }

    function removeEmpty(type) {
      return function removeThings(node) {
        node.children = node.children
        .filter(c => c.type !== type || c.children.length > 0);
      node.children.forEach(c => removeThings(c));
      }
    }

    steps.forEach(s => removeStepNodes(s));
    steps.forEach(s => removeEmpty('paragraph')(s));
    steps.forEach(s => removeEmpty('listItem')(s));
    steps.forEach(s => removeEmpty('list')(s));

    return {type, slide: steps.slice(-1)[0], steps};
  }
}

const slidesets = slidesetsraw.map(str => {
  return jsYaml.safeLoadAll(str.content).map(slide => {
    const {type} = slide;
    if(transforms[type]) {
      return transforms[slide.type](slide);
    }
    return {
      type,
      slide,
      steps: [slide],
    }
  });
});

export default Service.extend({
  slidesets,
  init() {
    this._super(...arguments);
    this.channel = new BroadcastChannel('tuppi');
    this.updateListeners = [];
    this.channel.addEventListener('message', ({data}) => {
      this.updateListeners.forEach(l => {
        l(data.slideset, data.slide, data.step);
      });
    });
  },
  broadcastUpdate(slideset, slide, step) {
    this.channel.postMessage({
      slideset, slide, step
    });
  },

  registerUpdateListener(listener) {
    this.updateListeners.push(listener);
  },
  unregisterUpdateListener(listener) {
    this.updateListeners = this.updateListeners.filter(l => l !== listener);
  },

  nextStep(slideset, slide, step) {
    slideset = parseInt(slideset);
    slide = parseInt(slide);
    step = parseInt(step);

    if(this.slidesets[slideset][slide].steps.length > step + 1) {
      return [slideset, slide, step + 1];
    }

    const nextSlide = this.nextSlide(slideset, slide);
    return nextSlide && [...nextSlide, 0];
  },
  previousStep(slideset, slide, step) {
    slideset = parseInt(slideset);
    slide = parseInt(slide);
    step = parseInt(step);

    if(step - 1 >= 0) {
      return [slideset, slide, step - 1];
    }

    const prev = this.previousSlide(slideset, slide);
    if(!prev) {
      return null;
    }

    const [previousSlideset, previousSlide] = prev;
    return prev && [
      previousSlideset,
      previousSlide,
      this.slidesets[previousSlideset][previousSlide].steps.length -1,
    ] || null;
  },
  previousSlide(slideset, slide) {
    slideset = parseInt(slideset);
    slide = parseInt(slide);

    if(0 <= slide - 1) {
      return [slideset, slide - 1];
    }

    if(0 <= slideset - 1) {
      return [slideset - 1, this.slidesets[slideset - 1].length -1];
    }

    return null;
  },
  nextSlide(slideset, slide) {
    slideset = parseInt(slideset);
    slide = parseInt(slide);

    if(this.slidesets[slideset].length > slide + 1) {
      return [slideset, slide + 1];
    }

    if(this.slidesets.length > slideset + 1) {
      return [slideset + 1, 0];
    }

    return null;
  },
});
