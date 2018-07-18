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
    const root = {children: []};

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
        steps.push(JSON.parse(JSON.stringify(root)));
      }
    }
    const slide = run(ast, root);
    steps.push(slide);
    return {type, slide, steps};
  }
}

const slidesets = slidesetsraw.map(str => {
  jsYaml.safeLoadAll(str.content).map(slide => {
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
