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
});
