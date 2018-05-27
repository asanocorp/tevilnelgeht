import { ClassDefinitions } from '../class-definitions';

export const classes = {};

Object.keys(ClassDefinitions.ClassId)
  .filter(key => { const n = parseFloat(key); return isNaN(n) || !isFinite(n); })
  .map(key => ClassDefinitions.ClassId[key])
  .forEach(classId => classes[classId] = require('./' + classId));
