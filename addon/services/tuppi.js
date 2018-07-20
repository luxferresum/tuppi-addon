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
  markdown({ type, content }) {
    let ast = processor.parse(content);
    let steps = [];
    const slide = {children: []};

    function run(source, target) {
      target.type = source.type;
      target.value = source.value;
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

    function removeEmptyParagraphs(node) {
      node.children = node.children
        .filter(c => c.type !== 'paragraph' || c.children.length > 0);
      node.children.forEach(c => removeEmptyParagraphs(c));
    }

    steps.forEach(s => removeStepNodes(s));
    steps.forEach(s => removeEmptyParagraphs(s));

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

    if(0 <= step -1) {
      return [slideset, slide, step - 1];
    }

    const prev = this.previousSlide(slideset, slide);
    if(!prev) {
      return null;
    }

    const [previousSlideset, previousSlide] = prev;
    return previousSlide && [
      previousSlideset,
      previousSlide,
      this.slidesets[previousSlideset][previousSlide].steps.length -1,
    ];
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
