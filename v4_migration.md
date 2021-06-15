**BREAKING CHANGES in v4**

* oneRow is removed. [scrollDirection](https://github.com/wix/pro-gallery/blob/master/packages/lib/src/common/constants/scrollDirection.js) is the sole option to define a vertical/horizontal gallery.


ITEMS:
* All items -> "metadata" and not "metaData".

* textItem -> html field should be under metaData and should be called "html" and not "text" (was supported by 2 names:__ "html" or "text)
* textItem -> type should be "text" (type of "html"/"h" are not supported anymore).
* textItem -> backgroundColor should be under metaData.textStyles. Cannot be in the metaData root anymore.
