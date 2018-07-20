import Route from '@ember/routing/route';

export default Route.extend({
  redirect() {
    this.replaceWith('tuppi-slides', '0', '0', '0');
  }
});
