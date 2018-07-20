import { helper } from '@ember/component/helper';
import ember from "ember";

export function tuppiDasherize([param]/*, hash*/) {
  return ember.String.dasherize(param);
}

export default helper(tuppiDasherize);
