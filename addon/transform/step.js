export default function step(/* options */) {
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  /* Add an inline tokenizer (defined in the following example). */
  tokenizers.tokenizeStep = tokenizeStep;

  Parser.prototype.inlineMethods = [
    'tokenizeStep',
    ...methods,
  ];
  // /* Run it just before `text`. */
  // methods.splice(methods.indexOf('text'), 0, 'mention');
}

function tokenizeStep(eat, value, silent) {
  const match = /^=>\w*/.exec(value);
  if(match) {
    if(silent) {
      return true;
    }

    return eat(match[0])({
      type: 'step'
    })
  }
}

tokenizeStep.locator = function(value, fromIndex) {
  return value.indexOf('=>', fromIndex);
}
