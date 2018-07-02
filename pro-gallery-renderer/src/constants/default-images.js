'use strict';

const defaultImages = [{
  metadata: {
    height: 1000,
    lastModified: 1445860855,
    name: '8b72558253b2502b401bb46e5599f22a',
    size: 1100727,
    width: 1920,
    sourceName: 'private'
  },
  orderIndex: 0,
  photoId: '8b72558253b2502b401bb46e5599f22a',
  url: '8bb438_1b73a6b067b24175bd087e86613bd00c.jpg'
}, {
  metadata: {
    height: 5600,
    lastModified: 1445857830,
    name: '2d3b675ea857dc41158bad3b28300824',
    size: 8128464,
    width: 3737
  },
  orderIndex: 1,
  photoId: '2d3b675ea857dc41158bad3b28300824',
  url: '8bb438_78ff5e32500d48cdaa22a3f446d68216.jpg'
}, {
  metadata: {
    height: 3737,
    lastModified: 1445857821,
    name: '860df034014674abd7a2e73abe0b851b',
    size: 5655675,
    width: 5600
  },
  orderIndex: 2,
  photoId: '860df034014674abd7a2e73abe0b851b',
  url: '8bb438_ff062a651e174cf5926fe5c088be1099.jpg'
}, {
  metadata: {
    height: 3737,
    lastModified: 1445857814,
    name: 'a898a24fe0d2c60a348eac9e38cae265',
    size: 11697590,
    width: 5600
  },
  orderIndex: 3,
  photoId: 'a898a24fe0d2c60a348eac9e38cae265',
  url: '8bb438_5ec836c505f445dfab711a56e67fc502.jpg'
}, {
  metadata: {
    height: 3737,
    lastModified: 1445857800,
    name: '5dd5a6e757c702b2856a3a2f4bb00154',
    size: 6528300,
    width: 5600
  },
  orderIndex: 4,
  photoId: '5dd5a6e757c702b2856a3a2f4bb00154',
  url: '8bb438_2798f080526a4d3f8cb89d93e305a0b8.jpg'
}, {
  metadata: {
    height: 3737,
    lastModified: 1445857785,
    name: 'e8b32772f67865aedb3b12115eaf19a4',
    size: 4931341,
    width: 5600
  },
  orderIndex: 5,
  photoId: 'e8b32772f67865aedb3b12115eaf19a4',
  url: '8bb438_9a335dcb8c884086b8ffdf1ea44ca7e9.jpg'
}, {
  metadata: {
    height: 3737,
    lastModified: 1445857778,
    name: '90e376fcd4b801bed0f22cb5bd7d0045',
    size: 11051393,
    width: 5600
  },
  orderIndex: 6,
  photoId: '90e376fcd4b801bed0f22cb5bd7d0045',
  url: '8bb438_6e9b65f5c9e343c6bc3344b2def0df11.jpg'
}, {
  metadata: {
    height: 3737,
    lastModified: 1445857763,
    name: '0db65a80624a2e0b8c71e553b6f4b3f6',
    size: 9294683,
    width: 5600
  },
  orderIndex: 7,
  photoId: '0db65a80624a2e0b8c71e553b6f4b3f6',
  url: '8bb438_f4f7fa31c5364557af0da7c4fd543cc9.jpg'
}, {
  metadata: {
    height: 3737,
    lastModified: 1445857751,
    name: '1f02dcba84a9b73b40d25e59280a9580',
    size: 9048422,
    width: 5600
  },
  orderIndex: 8,
  photoId: '1f02dcba84a9b73b40d25e59280a9580',
  url: '8bb438_0e26eb36903c40558d3e9a3dc088b791.jpg'
}, {
  metadata: {
    height: 3737,
    lastModified: 1445857742,
    name: '70cf2b13f9bde8f8c33768260f25050a',
    size: 6486671,
    width: 5600
  },
  orderIndex: 9,
  photoId: '70cf2b13f9bde8f8c33768260f25050a',
  url: '8bb438_1d81fe98c5cc433a9651fc24e7ce2617.jpg'
}, {
  metadata: {
    height: 3737,
    lastModified: 1445857734,
    name: '8e0bf32b6fade59dcfd7757ead8a0478',
    size: 9556027,
    width: 5600
  },
  orderIndex: 10,
  photoId: '8e0bf32b6fade59dcfd7757ead8a0478',
  url: '8bb438_2ecb6a1a9d5b4e148bd83a1ea3920860.jpg'
}];

const defaultVideos = [{
  itemId: 'd19570fa-e97f-4b3d-b8ad-4e24b3a9a3ec',
  url: '0d72ac_31569a98fd8d436f98ae9c827c216443',
  orderIndex: 1.447790730099E8,
  metadata: {
    name: '342278662.mp4',
    size: 8941842,
    lastModified: 1431352380000,
    width: 1920,
    height: 1080,
    type: 'video',
    posters: [{
      url: '0d72ac_31569a98fd8d436f98ae9c827c216443f000.jpg',
      height: 1080,
      width: 1920
    }, {
      url: '0d72ac_31569a98fd8d436f98ae9c827c216443f001.jpg',
      height: 1080,
      width: 1920
    }, {
      url: '0d72ac_31569a98fd8d436f98ae9c827c216443f002.jpg',
      height: 1080,
      width: 1920
    }, {url: '0d72ac_31569a98fd8d436f98ae9c827c216443f003.jpg', height: 1080, width: 1920}],
    duration: 14914,
    qualities: [{
      formats: ['mp4', 'webm'],
      height: 480,
      quality: '480p',
      width: 854
    }, {formats: ['mp4', 'webm'], height: 720, quality: '720p', width: 1280}, {
      formats: ['mp4', 'webm'],
      height: 1080,
      quality: '1080p',
      width: 1920
    }]
  }
}, {
  itemId: '5f51db65-4104-447b-b675-94657671a73f',
  url: '0d72ac_3e5c5b13a90749a6a02c845e8d1fa4dc',
  orderIndex: 1.447790760099E8,
  metadata: {
    name: '343014810.mp4',
    size: 23225503,
    lastModified: 1435064726000,
    width: 1920,
    height: 1080,
    type: 'video',
    posters: [{
      url: '0d72ac_3e5c5b13a90749a6a02c845e8d1fa4dcf000.jpg',
      height: 1080,
      width: 1920
    }, {
      url: '0d72ac_3e5c5b13a90749a6a02c845e8d1fa4dcf001.jpg',
      height: 1080,
      width: 1920
    }, {
      url: '0d72ac_3e5c5b13a90749a6a02c845e8d1fa4dcf002.jpg',
      height: 1080,
      width: 1920
    }, {url: '0d72ac_3e5c5b13a90749a6a02c845e8d1fa4dcf003.jpg', height: 1080, width: 1920}],
    duration: 44878,
    qualities: [{
      formats: ['mp4', 'webm'],
      height: 480,
      quality: '480p',
      width: 854
    }, {formats: ['mp4', 'webm'], height: 720, quality: '720p', width: 1280}, {
      formats: ['mp4', 'webm'],
      height: 1080,
      quality: '1080p',
      width: 1920
    }]
  }
}, {
  itemId: '98c5601c-3486-452b-933c-49cb451d676f',
  url: '0d72ac_8cebf3ded81a496cb5a1dde4d3ebf0db',
  orderIndex: 1.447790830099E8,
  metadata: {
    name: 'Loop_NightRide1 (1).mp4',
    size: 50631228,
    lastModified: 1441172756000,
    width: 1920,
    height: 1080,
    type: 'video',
    posters: [{
      url: '0d72ac_8cebf3ded81a496cb5a1dde4d3ebf0dbf000.jpg',
      height: 1080,
      width: 1920
    }, {
      url: '0d72ac_8cebf3ded81a496cb5a1dde4d3ebf0dbf001.jpg',
      height: 1080,
      width: 1920
    }, {
      url: '0d72ac_8cebf3ded81a496cb5a1dde4d3ebf0dbf002.jpg',
      height: 1080,
      width: 1920
    }, {url: '0d72ac_8cebf3ded81a496cb5a1dde4d3ebf0dbf003.jpg', height: 1080, width: 1920}],
    duration: 24290,
    qualities: [{
      formats: ['mp4', 'webm'],
      height: 480,
      quality: '480p',
      width: 854
    }, {formats: ['mp4', 'webm'], height: 720, quality: '720p', width: 1280}, {
      formats: ['mp4', 'webm'],
      height: 1080,
      quality: '1080p',
      width: 1920
    }]
  }
}];

export {defaultImages, defaultVideos};
