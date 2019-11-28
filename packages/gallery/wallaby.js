module.exports = function(wallaby) {
    return Object.assign({}, require('yoshi/config/wallaby-jest')(wallaby), {
      // set to undefined to let Wallaby decide the number of processes based on the system's capacity
      workers: undefined,
      files: [
        'src/**/*.js',
        'tests/drivers/**/*.js',
        // is the same as
        { pattern: 'src/**/*.js', instrument: true, load: true, ignore: false }
      ],
  
      tests: [
        'tests/**/*spec.js',
        { pattern: 'tests/**/*.e2e.spec.js', instrument: false, load: false, ignore: true }
      ]
    });
  };

// module.exports = function (wallaby) {
//   return {
//     workers: undefined,
//     files: [
//       { pattern: 'tests/e2e/styleParams/*.e2e.spec.js', ignore: true, load: false, instrument: false }
//     ],
//     tests: [
//       { pattern: 'tests/e2e/styleParams*.e2e.spec.js', ignore: true, load: false, instrument: false },
//     ]
//   }
// };