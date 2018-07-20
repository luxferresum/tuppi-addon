export default function() {
  this.route('tuppi-start', {  resetNamespace: true, path: '/' });
  this.route('tuppi-slides', { resetNamespace: true, path: '/slides/:slideset/:slide/:step' });
  this.route('tuppi-notes', { resetNamespace: true, path: '/notes/:slideset/:slide' });
}
