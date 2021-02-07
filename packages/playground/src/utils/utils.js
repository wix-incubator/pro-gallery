import cloneDeep from 'lodash.clonedeep';

export function formatValue(val) {
  if (!isNaN(Number(val))) {
    return Number(val);
  } else if (val === 'true') {
    return true;
  } else if (val === 'false') {
    return false;
  }
  if (val === 'undefined') {
    return undefined;
  } else {
    return String(val);
  }
}

export function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16) || 0;
    return c === 'x' ? r.toString(16) : c;
  });
}

export function mixAndSlice(array, length, startIdx = 0, customMetadata = {}) {
  let result = [];
  if (array.length > 0) {
    const rnd = (num) => Math.floor(Math.random() * num);
    while (result.length < length) {
      const idx = rnd(array.length);
      const itemIdx = startIdx + result.length + 1;
      let item = cloneDeep(array[idx]);
      // Object.assign(item, array[idx]);
      item.itemId = generateUUID();
      item.metadata.title = (
        customMetadata.customTitle || `Item ${itemIdx}`
      ).replace('#', itemIdx);
      item.metadata.description = customMetadata.loremDescription
        ? createLoremIpsum(rnd(80) + 20)
        : (customMetadata.customDescription || '').replace('#', itemIdx); //`Description #${result.length + 1}: ${createLoremIpsum(rnd(80) + 20)}`;
      // console.log('ITEM CREATED', item, array[idx]);
      result.push(item);
    }
  }
  return result;
}

export const debounce = (callback, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this, args);
    }, wait);
  };
};

export const throttle = (callback, limit) => {
  let wait = false;
  let callAfterWait = false;
  return (...args) => {
    if (!wait) {
      callAfterWait = false;
      callback.apply(this, args);
      wait = true;
      setTimeout(() => {
        callAfterWait && callback.apply(this, args);
        wait = false;
      }, limit);
    } else {
      callAfterWait = true;
    }
  };
};
export const isTestingEnvironment = (url) => {
  return url.indexOf('isTestEnvironment=true') > -1;
};

export const getTotalItemsCountFromUrl = (url) => {
  const urlParams = new URLSearchParams(url);
  const totalItemsCount = urlParams.get('totalItemsCount');

  return totalItemsCount;
};

export const createLoremIpsum = (numOfWords) => {
  const rnd = (num) => Math.floor(Math.random() * num);
  const lorem = `Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Integer quis auctor elit sed vulputate In est ante in nibh Tortor pretium viverra suspendisse potenti nullam ac Elementum pulvinar etiam non quam lacus suspendisse faucibus interdum A iaculis at erat pellentesque adipiscing commodo elit at imperdiet Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque sit Integer eget aliquet nibh praesent tristique magna At tellus at urna condimentum mattis Sit amet nulla facilisi morbi tempus iaculis urna id volutpat Amet tellus cras adipiscing enim eu turpis egestas pretium Consectetur lorem donec massa sapien faucibus Egestas quis ipsum suspendisse ultrices gravida dictum Sed velit dignissim sodales ut eu sem integer vitae Quam lacus suspendisse faucibus interdum posuere Arcu vitae elementum curabitur vitae Felis bibendum ut tristique et egestas quis ipsum suspendisse ultrices Gravida quis blandit turpis cursus Nibh nisl condimentum id venenatis a condimentum vitae sapien pellentesque Arcu cursus vitae congue mauris Elementum eu facilisis sed odio morbi quis commodo odio Massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada Nunc id cursus metus aliquam eleifend mi in Commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit Lectus urna duis convallis convallis tellus id interdum velit laoreet Purus viverra accumsan in nisl nisi scelerisque eu Morbi leo urna molestie at elementum eu facilisis sed odio Bibendum ut tristique et egestas quis Nam libero justo laoreet sit amet cursus sit Scelerisque in dictum non consectetur a erat nam at Blandit turpis cursus in hac habitasse platea dictumst quisque sagittis Tincidunt id aliquet risus feugiat in ante metus dictum at Leo vel fringilla est ullamcorper eget nulla Mauris augue neque gravida in fermentum et sollicitudin ac orci Integer quis auctor elit sed vulputate mi sit amet mauris Semper quis lectus nulla at volutpat Massa sed elementum tempus egestas sed sed Pharetra et ultrices neque ornare aenean euismod elementum nisi Quis varius quam quisque id diam vel quam elementum pulvinar Neque vitae tempus quam pellentesque nec nam aliquam sem At volutpat diam ut venenatis tellus in metus Nisl nisi scelerisque eu ultrices vitae auctor Nunc lobortis mattis aliquam faucibus Ultricies integer quis auctor elit sed vulputate mi sit amet Mattis rhoncus urna neque viverra justo nec ultrices dui sapien Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies Nulla porttitor massa id neque aliquam vestibulum Vitae turpis massa sed elementum tempus Senectus et netus et malesuada Amet volutpat consequat mauris nunc congue nisi vitae suscipit Facilisis sed odio morbi quis commodo odio Sed blandit libero volutpat sed cras ornare arcu dui vivamus Odio ut enim blandit volutpat maecenas volutpat blandit aliquam etiam Dui accumsan sit amet nulla Et molestie ac feugiat sed lectus vestibulum mattis ullamcorper Ut sem nulla pharetra diam sit amet nisl suscipit adipiscing Velit scelerisque in dictum non Ornare aenean euismod elementum nisi quis eleifend quam adipiscing vitae Aliquet eget sit amet tellus cras adipiscing enim Euismod nisi porta lorem mollis aliquam ut Elit ullamcorper dignissim cras tincidunt lobortis feugiat Id cursus metus aliquam eleifend mi in nulla Faucibus vitae aliquet nec ullamcorper sit amet risus Cras semper auctor neque vitae tempus Vitae congue mauris rhoncus aenean vel elit scelerisque Est ante in nibh mauris cursus mattis molestie a Morbi leo urna molestie at elementum eu facilisis sed odio Turpis egestas sed tempus urna et pharetra pharetra massa massa Velit sed ullamcorper morbi tincidunt ornare massa eget Ac placerat vestibulum lectus mauris ultrices eros in cursus turpis Eu mi bibendum neque egestas congue quisque Egestas diam in arcu cursus euismod quis viverra Id aliquet risus feugiat in ante`;
  const words = lorem.toLowerCase().split(' ');
  const totalWords = words.length;

  const start = rnd(totalWords - numOfWords - 1);
  const end = start + numOfWords;
  return words.slice(start, end).join(' ');
};
