import fs from 'fs';
import path from 'path';

import { assert } from 'chai';

import { blueprints } from '../src/index';

const opts = { encoding: 'utf-8' };
function readJsonFromDir(name) {
  const text = fs.readFileSync(path.join(__dirname, name), opts);
  const args = JSON.parse(text.trim());
  return args;
}

it('createblueprint should be fast', () => {
  const args = readJsonFromDir('slowArgs.json');
  const result = blueprints.createBlueprint(args);
  /* assert.deepEqual(result, getExpected()) */
  assert.equal(JSON.stringify(result), JSON.stringify(getExpected()));
});

function getExpected() {
  return {
    blueprint: {
      options: {
        layoutParams: {
          cropRatio: 1,
          repeatingGroupTypes: '',
          structure: {
            galleryLayout: 0,
            itemSpacing: 10,
            scrollDirection: 'VERTICAL',
            layoutOrientation: 'HORIZONTAL',
            numberOfColumns: 3,
            responsiveMode: 'FIT_TO_SCREEN',
            scatter: {
              randomScatter: 0,
              manualScatter: '',
            },
            numberOfGridRows: 1,
            enableStreching: true,
            groupsOrder: 'BY_HEIGHT',
            columnRatios: [],
          },
          crop: {
            enable: false,
            enableSmartCrop: false,
            cropOnlyFill: false,
            ratios: [1],
            method: 'FILL',
            alignment: 'CENTER',
          },
          targetItemSize: {
            minimum: 120,
            unit: 'SMART',
            value: 30,
          },
          groups: {
            density: 0.8,
            groupByOrientation: true,
            groupSize: 3,
            allowedGroupTypes: ['1', '2h', '2v', '3t', '3b', '3l', '3r'],
            numberOfGroupsPerRow: 0,
            repeatingGroupTypes: [],
          },
          thumbnails: {
            enable: false,
            spacing: 0,
            size: 120,
            alignment: 'BOTTOM',
          },
          navigationArrows: {
            enable: true,
            padding: 23,
            verticalAlignment: 'ITEM_CENTER',
            size: 23,
            position: 'ON_GALLERY',
          },
          info: {
            layout: 'NO_BACKGROUND',
            spacing: 10,
            border: {
              width: 0,
              radius: 0,
            },
            height: 0,
            placement: 'OVERLAY',
            sizeUnits: 'PERCENT',
            width: 50,
          },
          gallerySpacing: 0,
        },
        groupTypes: '1,2h,2v,3t,3b,3l,3r',
        numberOfImagesPerRow: 3,
        isAutoSlideshow: false,
        autoSlideshowType: 'interval',
        itemShadowOpacityAndColor: {
          value: 'rgba(0,0,0,0.2)',
          themeName: 'color_15',
        },
        arrowsColor: {
          themeName: 'color_11',
          value: 'rgba(255,255,255,1)',
        },
        textBoxBorderColor: {
          themeName: 'color_15',
          value: 'rgba(0,0,0,1)',
        },
        gotStyleParams: true,
        selectedLayout: 0,
        allowSocial: true,
        allowDownload: false,
        allowTitle: true,
        allowDescription: false,
        loveButton: true,
        loveCounter: true,
        showVideoPlayButton: true,
        gallerySliderImageRatio: 1.7777777777777777,
        galleryImageRatio: 2,
        collageAmount: 0.8,
        floatingImages: 0,
        viewMode: 'preview',
        galleryHorizontalAlign: 'center',
        galleryVerticalAlign: 'center',
        mobilePanorama: false,
        imageLoadingWithColorMode: 'PICKED_COLOR',
        imageRatioType: 'FIXED',
        numberOfDisplayedItems: 3,
        expandAnimation: 'NO_EFFECT',
        itemBorderColor: {
          themeName: 'color_15',
          value: 'rgba(0,0,0,1)',
        },
        titleDescriptionSpace: 6,
        textsVerticalPadding: 0,
        textsHorizontalPadding: 0,
        textBoxFillColor: {
          themeName: 'color_12',
          value: 'rgba(232,230,230,1)',
        },
        alwaysShowHover: false,
        previewHover: false,
        calculateTextBoxHeightMode: 'MANUAL',
        jsonStyleParams: '',
        designedPresetId: -1,
        galleryLayoutType: 'custom',
        allowOverlayGradient: false,
        overlayGradientDegrees: 180,
        slideDuration: 400,
        overlayType: 0,
        useCustomButton: false,
        customButtonText: 'Click here',
        isStoreGallery: false,
        isInAdi: false,
        itemOpacity: {
          themeName: 'color_15',
          value: 'rgba(0,0,0,0.6)',
        },
        itemFont: {
          family: 'proxima-n-w01-reg',
          displayName: 'Heading 5',
          style: {
            bold: false,
            italic: false,
            underline: false,
          },
          size: 22,
          preset: 'Custom',
          editorKey: 'font_5',
          fontStyleParam: true,
          value:
            'font:normal normal normal 22px/27px proxima-n-w01-reg,sans-serif;',
        },
        itemFontSlideshow: {
          family: 'proxima-n-w01-reg',
          displayName: 'Heading 5',
          style: {
            bold: false,
            italic: false,
            underline: false,
          },
          size: 22,
          preset: 'Custom',
          editorKey: 'font_5',
          fontStyleParam: true,
          value:
            'font:normal normal normal 22px/27px proxima-n-w01-reg,sans-serif;',
        },
        itemDescriptionFontSlideshow: {
          family: 'proxima-n-w01-reg',
          displayName: 'Paragraph 2',
          style: {
            bold: false,
            italic: false,
            underline: false,
          },
          size: 15,
          preset: 'Custom',
          editorKey: 'font_8',
          fontStyleParam: true,
          value:
            'font:normal normal normal 15px/18px proxima-n-w01-reg,sans-serif;',
        },
        itemDescriptionFont: {
          family: 'proxima-n-w01-reg',
          displayName: 'Paragraph 2',
          style: {
            bold: false,
            italic: false,
            underline: false,
          },
          size: 15,
          preset: 'Custom',
          editorKey: 'font_8',
          fontStyleParam: true,
          value:
            'font:normal normal normal 15px/18px proxima-n-w01-reg,sans-serif;',
        },
        itemFontColor: {
          themeName: 'color_11',
          value: 'rgba(255,255,255,1)',
        },
        itemFontColorSlideshow: {
          themeName: 'color_15',
          value: 'rgba(0,0,0,1)',
        },
        itemDescriptionFontColor: {
          themeName: 'color_11',
          value: 'rgba(255,255,255,1)',
        },
        itemDescriptionFontColorSlideshow: {
          themeName: 'color_15',
          value: 'rgba(0,0,0,1)',
        },
        loadMoreButtonFont: {
          family: 'proxima-n-w01-reg,sans-serif',
          displayName: 'Paragraph 2',
          style: {
            bold: false,
            italic: false,
            underline: false,
          },
          size: 15,
          preset: 'Body-M',
          editorKey: 'font_8',
          fontStyleParam: true,
          value:
            'font:normal normal normal 15px/1.4em proxima-n-w01-reg,sans-serif;',
        },
        loadMoreButtonFontColor: {
          themeName: 'color_15',
          value: 'rgba(0,0,0,1)',
        },
        loadMoreButtonColor: {
          themeName: 'color_11',
          value: 'rgba(255,255,255,1)',
        },
        loadMoreButtonBorderColor: {
          themeName: 'color_15',
          value: 'rgba(0,0,0,1)',
        },
        customButtonFontForHover: {
          family: 'proxima-n-w01-reg',
          displayName: 'Paragraph 2',
          style: {
            bold: false,
            italic: false,
            underline: false,
          },
          size: 15,
          preset: 'Custom',
          editorKey: 'font_8',
          fontStyleParam: true,
          value:
            'font:normal normal normal 15px/18px proxima-n-w01-reg,sans-serif;',
        },
        customButtonFontColorForHover: {
          themeName: 'color_15',
          value: 'rgba(0,0,0,1)',
        },
        externalCustomButtonColor: {
          themeName: 'color_18',
          value: 'rgba(56,74,211,0)',
        },
        externalCustomButtonBorderColor: {
          themeName: 'color_15',
          value: 'rgba(0,0,0,1)',
        },
        customButtonFont: {
          family: 'proxima-n-w01-reg',
          displayName: 'Paragraph 2',
          style: {
            bold: false,
            italic: false,
            underline: false,
          },
          size: 15,
          preset: 'Custom',
          editorKey: 'font_8',
          fontStyleParam: true,
          value:
            'font:normal normal normal 15px/18px proxima-n-w01-reg,sans-serif;',
        },
        customButtonFontColor: {
          themeName: 'color_11',
          value: 'rgba(255,255,255,1)',
        },
        customButtonColor: {
          themeName: 'color_11',
          value: 'rgba(255,255,255,0)',
        },
        customButtonBorderColor: {
          themeName: 'color_11',
          value: 'rgba(255,255,255,1)',
        },
        sharpParams: {
          quality: 90,
          usm: {},
        },
        oneColorAnimationColor: {
          themeName: 'color_11',
          value: 'rgba(255,255,255,1)',
        },
        responsive: false,
        targetItemSize: 650,
        cubeRatio: 1,
        externalInfoHeight: 0,
        externalInfoWidth: 0,
        isRTL: false,
        isVertical: false,
        minItemSize: 120,
        groupSize: 3,
        chooseBestGroup: true,
        cubeImages: false,
        cubeType: 'fill',
        smartCrop: false,
        fullscreen: true,
        videoLoop: true,
        videoSound: false,
        videoPlay: 'hover',
        videoSpeed: 1,
        collageDensity: 0.8,
        galleryTextAlign: 'center',
        imageMargin: 10,
        showArrows: true,
        hasThumbnails: false,
        galleryThumbnailsAlignment: 'bottom',
        gridStyle: 0,
        titlePlacement: 'SHOW_ON_HOVER',
        hoveringBehaviour: 'APPEARS',
        slideshowLoop: false,
        playButtonForAutoSlideShow: false,
        pauseAutoSlideshowOnHover: true,
        allowSlideshowCounter: false,
        autoSlideshowInterval: 4,
        arrowsSize: 23,
        slideshowInfoSize: 200,
        imageLoadingMode: 'COLOR',
        scrollAnimation: 'NO_EFFECT',
        overlayAnimation: 'NO_EFFECT',
        imageHoverAnimation: 'NO_EFFECT',
        itemBorderWidth: 0,
        itemBorderRadius: 0,
        itemEnableShadow: false,
        itemShadowBlur: 20,
        loadMoreAmount: 'all',
        itemShadowDirection: 135,
        itemShadowSize: 10,
        imageInfoType: 'NO_BACKGROUND',
        textBoxBorderRadius: 0,
        textBoxBorderWidth: 0,
        textBoxHeight: 0,
        textImageSpace: 10,
        scrollDirection: 0,
        slideAnimation: 'SCROLL',
        autoSlideshowContinuousSpeed: 50,
        galleryLayout: 0,
        gallerySizeType: 'smart',
        allowContextMenu: false,
        hidePlay: false,
        gallerySize: 30,
        cropOnlyFill: false,
        numberOfImagesPerCol: 1,
        groupsPerStrip: 0,
        scatter: 0,
        rotatingScatter: '',
        enableInfiniteScroll: true,
        thumbnailSpacings: 0,
        enableScroll: true,
        scrollSnap: false,
        itemClick: 'expand',
        scrollDuration: 400,
        arrowsPosition: 0,
        arrowsVerticalPosition: 'ITEM_CENTER',
        arrowsPadding: 23,
        thumbnailSize: 120,
        magicLayoutSeed: 1,
        imagePlacementAnimation: 'NO_EFFECT',
        calculateTextBoxWidthMode: 'PERCENT',
        textBoxWidth: 200,
        textBoxWidthPercent: 50,
        loadMoreButtonText: '',
        showVideoControls: false,
        shouldIndexDirectShareLinkInSEO: false,
        slideTransition: 'cubic-bezier(0.46,0.1,0.25,1)',
        useMaxDimensions: false,
        enableVideoPlaceholder: true,
        overlayPosition: 'LEFT',
        overlaySize: 100,
        overlaySizeType: 'PERCENT',
        overlayPadding: 0,
        cubeFitPosition: 'MIDDLE',
        magnificationLevel: 2,
        rotatingGroupTypes: '',
        fixedColumns: 0,
        behaviourParams: {
          item: {
            content: {
              magnificationValue: 2,
              hoverAnimation: 'NO_EFFECT',
              loader: 'COLOR',
              placementAnimation: 'NO_EFFECT',
            },
            video: {
              loop: true,
              playTrigger: 'HOVER',
              volume: 0,
              speed: 1,
              enableControls: false,
              enablePlaceholder: true,
              enablePlayButton: true,
            },
            overlay: {
              hoverAnimation: 'NO_EFFECT',
              position: 'LEFT',
              size: 100,
              sizeUnits: 'PERCENT',
              padding: 0,
              hoveringBehaviour: 'APPEARS',
            },
            clickAction: 'ACTION',
          },
          gallery: {
            scrollAnimation: 'NO_EFFECT',
            enableIndexingShareLinks: false,
            horizontal: {
              slideAnimation: 'SCROLL',
              slideTransition: 'cubic-bezier(0.46,0.1,0.25,1)',
              loop: false,
              autoSlide: {
                interval: 4,
                pauseOnHover: true,
                speed: 50,
                behaviour: 'OFF',
              },
              slideshowInfo: {
                enableCounter: false,
                enablePlayButton: false,
                buttonsAlignment: 'CENTER',
              },
              blockScroll: false,
              enableScrollSnap: false,
              navigationDuration: 400,
            },
            vertical: {
              loadMore: {
                enable: false,
                amount: 'ALL',
                text: '',
              },
            },
            blockContextMenu: true,
            layoutDirection: 'LEFT_TO_RIGHT',
          },
        },
        rotatingCropRatios: '',
        stylingParams: {
          itemShadowBlur: 20,
          itemShadowDirection: 135,
          itemShadowSize: 10,
          itemEnableShadow: false,
          itemBorderRadius: 0,
          itemBorderWidth: 0,
        },
        gallerySizePx: 0,
        gallerySizeRatio: 0,
        columnWidths: '',
        placeGroupsLtr: false,
      },
      items: [
        {
          id: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
          width: 1920,
          height: 1080,
          itemId: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
          isSecure: false,
          orderIndex: 1624273580.378,
          metaData: {
            link: {
              type: 'none',
              target: '_blank',
            },
            type: 'video',
            customPoster: '',
            isExternal: true,
            height: 1080,
            width: 1920,
            name: 'cvW-est579E',
            posters: [
              {
                height: 720,
                width: 1280,
                url: '497ebd_76c8a25031f9493b8f4ae33e66ed9127~mv2.jpg',
              },
            ],
            qualities: [],
            duration: 0,
            source: 'youtube',
            videoUrl: 'https://www.youtube.com/watch?v=cvW-est579E',
            videoId: 'cvW-est579E',
          },
          mediaUrl: '497ebd_76c8a25031f9493b8f4ae33e66ed9127~mv2.jpg',
          directLink: {},
          directShareLink: null,
          isVisitedLoveData: true,
        },
      ],
      container: {
        avoidGallerySelfMeasure: true,
        width: 980,
        height: 550.5910390848428,
        screen: {
          width: 1920,
          height: 1080,
        },
        mobilePreviewFrame: {
          width: 1920,
          height: 1080,
        },
        isPrerenderContainer: true,
        galleryWidth: 990,
        galleryHeight: 550.5910390848428,
        scrollBase: 0,
      },
      structure: {
        items: [
          {
            id: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
            idx: 0,
            inGroupIdx: 1,
            dto: {
              id: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
              width: 1920,
              height: 1080,
              itemId: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
              isSecure: false,
              orderIndex: 1624273580.378,
              metaData: {
                link: {
                  type: 'none',
                  target: '_blank',
                },
                type: 'video',
                customPoster: '',
                isExternal: true,
                height: 1080,
                width: 1920,
                name: 'cvW-est579E',
                posters: [
                  {
                    height: 720,
                    width: 1280,
                    url: '497ebd_76c8a25031f9493b8f4ae33e66ed9127~mv2.jpg',
                  },
                ],
                qualities: [],
                duration: 0,
                source: 'youtube',
                videoUrl: 'https://www.youtube.com/watch?v=cvW-est579E',
                videoId: 'cvW-est579E',
              },
              mediaUrl: '497ebd_76c8a25031f9493b8f4ae33e66ed9127~mv2.jpg',
              directLink: {},
              directShareLink: null,
              isVisitedLoveData: true,
            },
            style: {
              width: 980,
              orgWidth: 980,
              cubedWidth: 980,
              innerWidth: 980,
              height: 551,
              orgHeight: 551,
              cubedHeight: 551,
              innerHeight: 551,
              top: 0,
              bottom: 'auto',
              left: 0,
              right: 'auto',
            },
            roundedStyle: {
              width: 980,
              orgWidth: 980,
              cubedWidth: 980,
              innerWidth: 980,
              height: 551,
              orgHeight: 551,
              cubedHeight: 551,
              innerHeight: 551,
              top: 0,
              bottom: 'auto',
              left: 0,
              right: 'auto',
            },
            width: 980,
            maxWidth: 1920,
            outerWidth: 990,
            infoWidth: 0,
            margins: 5,
            ratio: 1.7777777777777777,
            dimensions: {
              fixTop: 0,
              fixLeft: 0,
              fixRight: 0,
              fixBottom: 0,
            },
            cropRatio: 1,
            isCropped: false,
            cropType: 'fill',
            height: 551,
            maxHeight: 1080,
            outerHeight: 561,
            infoHeight: 0,
            group: {
              top: 0,
              left: 0,
              width: 990,
              height: 561,
            },
            offset: {
              top: 0,
              left: 0,
              innerTop: 0,
              innerLeft: 0,
              innerRight: 0,
              innerBottom: 0,
              right: 980,
              bottom: 551,
            },
            groupOffset: {
              top: 0,
              left: 0,
              right: 988.8285139286095,
              bottom: 560.5910390848428,
            },
            orientation: 'landscape',
            isPortrait: false,
            isLandscape: true,
            visibility: {},
          },
        ],
        groups: [
          {
            id: 'g0_86da8f41-d5f1-41cd-8ea9-87b81eed316f',
            idx: 0,
            stripIdx: 1,
            inStripIdx: 1,
            isLastGroup: true,
            items: [
              {
                id: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
                idx: 0,
                inGroupIdx: 1,
                dto: {
                  id: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
                  width: 1920,
                  height: 1080,
                  itemId: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
                  isSecure: false,
                  orderIndex: 1624273580.378,
                  metaData: {
                    link: {
                      type: 'none',
                      target: '_blank',
                    },
                    type: 'video',
                    customPoster: '',
                    isExternal: true,
                    height: 1080,
                    width: 1920,
                    name: 'cvW-est579E',
                    posters: [
                      {
                        height: 720,
                        width: 1280,
                        url: '497ebd_76c8a25031f9493b8f4ae33e66ed9127~mv2.jpg',
                      },
                    ],
                    qualities: [],
                    duration: 0,
                    source: 'youtube',
                    videoUrl: 'https://www.youtube.com/watch?v=cvW-est579E',
                    videoId: 'cvW-est579E',
                  },
                  mediaUrl: '497ebd_76c8a25031f9493b8f4ae33e66ed9127~mv2.jpg',
                  directLink: {},
                  directShareLink: null,
                  isVisitedLoveData: true,
                },
                style: {
                  width: 980,
                  orgWidth: 980,
                  cubedWidth: 980,
                  innerWidth: 980,
                  height: 551,
                  orgHeight: 551,
                  cubedHeight: 551,
                  innerHeight: 551,
                  top: 0,
                  bottom: 'auto',
                  left: 0,
                  right: 'auto',
                },
                roundedStyle: {
                  width: 980,
                  orgWidth: 980,
                  cubedWidth: 980,
                  innerWidth: 980,
                  height: 551,
                  orgHeight: 551,
                  cubedHeight: 551,
                  innerHeight: 551,
                  top: 0,
                  bottom: 'auto',
                  left: 0,
                  right: 'auto',
                },
                width: 980,
                maxWidth: 1920,
                outerWidth: 990,
                infoWidth: 0,
                margins: 5,
                ratio: 1.7777777777777777,
                dimensions: {
                  fixTop: 0,
                  fixLeft: 0,
                  fixRight: 0,
                  fixBottom: 0,
                },
                cropRatio: 1,
                isCropped: false,
                cropType: 'fill',
                height: 551,
                maxHeight: 1080,
                outerHeight: 561,
                infoHeight: 0,
                group: {
                  top: 0,
                  left: 0,
                  width: 990,
                  height: 561,
                },
                offset: {
                  top: 0,
                  left: 0,
                  innerTop: 0,
                  innerLeft: 0,
                  innerRight: 0,
                  innerBottom: 0,
                  right: 980,
                  bottom: 551,
                },
                groupOffset: {
                  top: 0,
                  left: 0,
                  right: 988.8285139286095,
                  bottom: 560.5910390848428,
                },
                orientation: 'landscape',
                isPortrait: false,
                isLandscape: true,
                visibility: {},
              },
            ],
            type: '1',
            width: 990,
            height: 561,
            infoHeight: 0,
            infoWidth: 0,
            ratio: 1.7647058823529411,
            top: 0,
            left: 0,
            right: 990,
            bottom: 561,
            visible: true,
            rendered: true,
            required: true,
          },
        ],
        strips: [
          {
            idx: 1,
            groups: [
              {
                id: 'g0_86da8f41-d5f1-41cd-8ea9-87b81eed316f',
                idx: 0,
                stripIdx: 1,
                inStripIdx: 1,
                isLastGroup: true,
                items: [
                  {
                    id: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
                    idx: 0,
                    inGroupIdx: 1,
                    dto: {
                      id: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
                      width: 1920,
                      height: 1080,
                      itemId: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
                      isSecure: false,
                      orderIndex: 1624273580.378,
                      metaData: {
                        link: {
                          type: 'none',
                          target: '_blank',
                        },
                        type: 'video',
                        customPoster: '',
                        isExternal: true,
                        height: 1080,
                        width: 1920,
                        name: 'cvW-est579E',
                        posters: [
                          {
                            height: 720,
                            width: 1280,
                            url: '497ebd_76c8a25031f9493b8f4ae33e66ed9127~mv2.jpg',
                          },
                        ],
                        qualities: [],
                        duration: 0,
                        source: 'youtube',
                        videoUrl: 'https://www.youtube.com/watch?v=cvW-est579E',
                        videoId: 'cvW-est579E',
                      },
                      mediaUrl:
                        '497ebd_76c8a25031f9493b8f4ae33e66ed9127~mv2.jpg',
                      directLink: {},
                      directShareLink: null,
                      isVisitedLoveData: true,
                    },
                    style: {
                      width: 980,
                      orgWidth: 980,
                      cubedWidth: 980,
                      innerWidth: 980,
                      height: 551,
                      orgHeight: 551,
                      cubedHeight: 551,
                      innerHeight: 551,
                      top: 0,
                      bottom: 'auto',
                      left: 0,
                      right: 'auto',
                    },
                    roundedStyle: {
                      width: 980,
                      orgWidth: 980,
                      cubedWidth: 980,
                      innerWidth: 980,
                      height: 551,
                      orgHeight: 551,
                      cubedHeight: 551,
                      innerHeight: 551,
                      top: 0,
                      bottom: 'auto',
                      left: 0,
                      right: 'auto',
                    },
                    width: 980,
                    maxWidth: 1920,
                    outerWidth: 990,
                    infoWidth: 0,
                    margins: 5,
                    ratio: 1.7777777777777777,
                    dimensions: {
                      fixTop: 0,
                      fixLeft: 0,
                      fixRight: 0,
                      fixBottom: 0,
                    },
                    cropRatio: 1,
                    isCropped: false,
                    cropType: 'fill',
                    height: 551,
                    maxHeight: 1080,
                    outerHeight: 561,
                    infoHeight: 0,
                    group: {
                      top: 0,
                      left: 0,
                      width: 990,
                      height: 561,
                    },
                    offset: {
                      top: 0,
                      left: 0,
                      innerTop: 0,
                      innerLeft: 0,
                      innerRight: 0,
                      innerBottom: 0,
                      right: 980,
                      bottom: 551,
                    },
                    groupOffset: {
                      top: 0,
                      left: 0,
                      right: 988.8285139286095,
                      bottom: 560.5910390848428,
                    },
                    orientation: 'landscape',
                    isPortrait: false,
                    isLandscape: true,
                    visibility: {},
                  },
                ],
                type: '1',
                width: 990,
                height: 561,
                infoHeight: 0,
                infoWidth: 0,
                ratio: 1.7647058823529411,
                top: 0,
                left: 0,
                right: 990,
                bottom: 561,
                visible: true,
                rendered: true,
                required: true,
              },
            ],
            width: 990,
            height: 560.5910390848428,
            ratio: 1.7659932659932658,
            isFullWidth: true,
          },
        ],
        columns: [
          {
            idx: 0,
            groups: [
              {
                id: 'g0_86da8f41-d5f1-41cd-8ea9-87b81eed316f',
                idx: 0,
                stripIdx: 1,
                inStripIdx: 1,
                isLastGroup: true,
                items: [
                  {
                    id: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
                    idx: 0,
                    inGroupIdx: 1,
                    dto: {
                      id: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
                      width: 1920,
                      height: 1080,
                      itemId: '86da8f41-d5f1-41cd-8ea9-87b81eed316f',
                      isSecure: false,
                      orderIndex: 1624273580.378,
                      metaData: {
                        link: {
                          type: 'none',
                          target: '_blank',
                        },
                        type: 'video',
                        customPoster: '',
                        isExternal: true,
                        height: 1080,
                        width: 1920,
                        name: 'cvW-est579E',
                        posters: [
                          {
                            height: 720,
                            width: 1280,
                            url: '497ebd_76c8a25031f9493b8f4ae33e66ed9127~mv2.jpg',
                          },
                        ],
                        qualities: [],
                        duration: 0,
                        source: 'youtube',
                        videoUrl: 'https://www.youtube.com/watch?v=cvW-est579E',
                        videoId: 'cvW-est579E',
                      },
                      mediaUrl:
                        '497ebd_76c8a25031f9493b8f4ae33e66ed9127~mv2.jpg',
                      directLink: {},
                      directShareLink: null,
                      isVisitedLoveData: true,
                    },
                    style: {
                      width: 980,
                      orgWidth: 980,
                      cubedWidth: 980,
                      innerWidth: 980,
                      height: 551,
                      orgHeight: 551,
                      cubedHeight: 551,
                      innerHeight: 551,
                      top: 0,
                      bottom: 'auto',
                      left: 0,
                      right: 'auto',
                    },
                    roundedStyle: {
                      width: 980,
                      orgWidth: 980,
                      cubedWidth: 980,
                      innerWidth: 980,
                      height: 551,
                      orgHeight: 551,
                      cubedHeight: 551,
                      innerHeight: 551,
                      top: 0,
                      bottom: 'auto',
                      left: 0,
                      right: 'auto',
                    },
                    width: 980,
                    maxWidth: 1920,
                    outerWidth: 990,
                    infoWidth: 0,
                    margins: 5,
                    ratio: 1.7777777777777777,
                    dimensions: {
                      fixTop: 0,
                      fixLeft: 0,
                      fixRight: 0,
                      fixBottom: 0,
                    },
                    cropRatio: 1,
                    isCropped: false,
                    cropType: 'fill',
                    height: 551,
                    maxHeight: 1080,
                    outerHeight: 561,
                    infoHeight: 0,
                    group: {
                      top: 0,
                      left: 0,
                      width: 990,
                      height: 561,
                    },
                    offset: {
                      top: 0,
                      left: 0,
                      innerTop: 0,
                      innerLeft: 0,
                      innerRight: 0,
                      innerBottom: 0,
                      right: 980,
                      bottom: 551,
                    },
                    groupOffset: {
                      top: 0,
                      left: 0,
                      right: 988.8285139286095,
                      bottom: 560.5910390848428,
                    },
                    orientation: 'landscape',
                    isPortrait: false,
                    isLandscape: true,
                    visibility: {},
                  },
                ],
                type: '1',
                width: 990,
                height: 561,
                infoHeight: 0,
                infoWidth: 0,
                ratio: 1.7647058823529411,
                top: 0,
                left: 0,
                right: 990,
                bottom: 561,
                visible: true,
                rendered: true,
                required: true,
              },
            ],
            width: 990,
            height: 0,
          },
        ],
        height: 550.5910390848428,
        width: 990,
      },
    },
    changedParams: {
      itemsChanged: true,
      optionsChanged: true,
      containerChanged: true,
    },
    blueprintManagerId: "pgStore comp-ko6zmnby's blueprintsManager",
  };
}
