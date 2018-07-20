import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import tuppiRouteDefinition from 'tuppi-addon/route-definition'

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('tuppi-default-route-definition', { path: '/' }, tuppiRouteDefinition);
});

export default Router;
