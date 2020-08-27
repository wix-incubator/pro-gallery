export class Column {
  constructor(idx, width, left, cubedHeight, infoWidth) {
    this.idx = idx;
    this.groups = [];
    this.items = [];
    this.height = 0;
    this.width = width;
    this.left = left;
    this.cubedHeight = cubedHeight;
    this.infoWidth = infoWidth || 0;
    console.log('Im local');
  }

  addGroup(group) {
    this.addGroups([group]);
  }

  addGroups(groups) {
    this.groups = this.groups.concat(groups);
    groups.forEach(group => {
      group.columnIdx = this.idx;
      group.Column = this;
    });
  }

  get totalWidth() {
    return this.width + this.infoWidth;
  }

  get scheme() {
    console.log('this.groups: ', this.groups);
    return {
      idx: this.idx,
      items: this.groups.map(group => {
        console.log('group: ', group);
        return group.items.map(item => {
          console.log('item: ', item);
          return item.scheme
        })
      }).flat(),
      groups: this.groups.map(group => group.scheme),
      width: this.width,
      height: this.height,
    };
  }
}
