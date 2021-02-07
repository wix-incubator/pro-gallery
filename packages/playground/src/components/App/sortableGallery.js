import React from 'react';
import { GALLERY_CONSTS, ProGallery, LayoutingProGallery } from 'pro-gallery';
import { utils } from 'pro-gallery-lib';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
const GALLERY_EVENTS = GALLERY_CONSTS.events;


const strDiff = (s1, s2) => {
    let ss1 = [];
    let ss2 = [];
    let maxLen = Math.max(s1.length, s2.length);
    for (let i = 0; i < maxLen; i++) {
        ss1[i] = s1[i] === s2[i] ? '' : s1[i];
        ss2[i] = s1[i] === s2[i] ? '' : s2[i];
    }
    const str1 = ss1.join('')
    const str2 = ss2.join('');
    return [str1 !== str2, str1, str2];
}

export default class SortableGallery extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            items: props.items,
        }
    }

    eventsListener = (eventName, eventData) => {
        switch (eventName) {
            case GALLERY_EVENTS.ITEM_ACTION_TRIGGERED:
            case GALLERY_EVENTS.ITEM_LOADED:
            case GALLERY_EVENTS.HOVER_SET:
                if (eventData >= 0) {
                    console.log('Rendering Hover', eventData)
                    this.replaceTarget = eventData
                }
                break;
            case GALLERY_EVENTS.ITEM_CREATED:
                break;
            default:
                break;
        }
        if (typeof this.props.eventsListener === 'function') {
            this.props.eventsListener(eventName, eventData);
        }
    }

    onSortEnd = async ({ oldIndex, newIndex }) => {

        if (oldIndex === newIndex) {
            return;
        }

        newIndex = this.replaceTarget;

        console.log('Rendering items, Replacing ' + oldIndex + ' with ' + newIndex);

        this.setState(({items}) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    shouldComponentUpdate(nextProps, nextState) {
        const oldProps = String(JSON.stringify(this.props))
        const newProps = String(JSON.stringify(nextProps))
        const propsDiff = strDiff(oldProps, newProps);

        const oldState = String(JSON.stringify(this.state))
        const newState = String(JSON.stringify(nextState))
        const stateDiff = strDiff(oldState, newState);

        const hasDiff = (propsDiff[0] || stateDiff[0]);
        if (!hasDiff) return false;

        console.log('Rendering shouldComponentUpdate', propsDiff, this.props, nextProps, stateDiff, this.state, nextState)

        return true;

    }

    render() {
        console.log('Rendering SortableContainer')
        const Gallery = SortableContainer(ProGallery);
        return (<Gallery {...{
            ...this.props,
            items: this.state.items,
            eventsListener: this.eventsListener,
            onSortEnd: this.onSortEnd,
            key: `sortable-pro-gallery-${this.props.domId}`,
            domId: `sortable-pro-gallery-${this.props.domId}`,
            itemWrapperHOC: SortableElement,
            useBlueprints: true,
            options: {
                ...this.props.options,
                itemBorderRadius: 4,
                titlePlacement: 'SHOW_ON_HOVER',
                videoPlay: 'hover',
            }
        }} />);
    }
}
