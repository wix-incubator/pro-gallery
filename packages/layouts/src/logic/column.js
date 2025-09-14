export class Column {
  constructor(idx, width, left, cubedHeight, infoWidth) {
    // todo test
    this.idx = idx;
    this.groups = [];
    this.height = 0;
    this.width = width;
    this.left = left;
    this.cubedHeight = cubedHeight; //v5 I think this is not used, not even a possible value to use if its rotating ratios or a function for crop ratio
    this.infoWidth = infoWidth || 0;
  }

  addGroup(group) {
    this.addGroups([group]);
  }

  addGroups(groups) {
    this.groups = this.groups.concat(groups);
    groups.forEach((group) => {
      group.columnIdx = this.idx;
      group.Column = this;
    });
  }

  get totalWidth() {
    return this.width + this.infoWidth;
  }

  get scheme() {
    return {
      idx: this.idx,
      groups: this.groups.map((group) => group.scheme),
      width: this.width,
      height: this.height,
    };
  }
}
