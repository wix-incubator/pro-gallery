const path = require('path');
const { writeES5StandaloneValidateMethod } = require('pro-gallery-lib');
const typeValidatorDir = path.join(
  __dirname,
  '../src/components/gallery/typeValidator'
);
const standaloneValidateCodePath = path.join(
  typeValidatorDir,
  '/standaloneValidateCode.js'
);

writeES5StandaloneValidateMethod(standaloneValidateCodePath);
