const fs = require('fs');
const path = require('path');
const { writeES5StandaloneValidateMethod } = require('pro-gallery-lib');

function start() {
  const galleryPath = path.join(__dirname, 'components/gallery');

  const standaloneValidateCodePath = path.join(
    __dirname,
    galleryPath,
    'typeValidator/standaloneValidateCode.js'
  );

  const galleryTypesPath = path.join(galleryPath, 'galleryTypes.ts');
  console.log(writeES5StandaloneValidateMethod);

  console.log(`direxist: ${fs.existsSync(galleryPath)}`);
  console.log(`existsSync: ${fs.existsSync(galleryTypesPath)}`);
  console.log(`direxist: ${fs.existsSync(standaloneValidateCodePath)}`);
}

start();
