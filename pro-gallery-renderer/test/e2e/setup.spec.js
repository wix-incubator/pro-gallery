const {spawn} = require('child_process');

let storyBook;
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

before(async () => {
  storyBook = spawn('start-storybook', ['-p', '6006']);
  await sleep(5000);
});

after(async () => {
  if (storyBook && storyBook.kill) {
    storyBook.kill();
  }

  await sleep(2000);
});
