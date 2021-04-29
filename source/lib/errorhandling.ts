import _ from "lodash";

function formatJoiValErrors(errors: any): any {
  errors = errors.details;
  errors.forEach(e => {
    e.key = _.get(e, 'context.key', '')
  });
  return _(errors)
    .groupBy('key')
    .mapValues(group => _.map(group, 'message'));
}

export { formatJoiValErrors };
