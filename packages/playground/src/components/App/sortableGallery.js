import React from 'react';
import {GALLERY_CONSTS, ProGallery, ProBlueprintsGallery} from 'pro-gallery';
import {utils} from 'pro-gallery-lib';

const GALLERY_EVENTS = GALLERY_CONSTS.events;

export class SortableGallery extends React.Component {

    constructor(props) {
        super(props)
        this.eventListener = this.eventListener.bind(this);
        this.state = {
            fullscreenIdx: -1
        }
    }

    eventListener(eventName, eventData) {
        switch (eventName) {
            case GALLERY_EVENTS.ITEM_ACTION_TRIGGERED:
                this.setState({ fullscreenIdx: eventData.idx });
                break;
            default:
                console.log({eventName, eventData});
                break;
        }
        if (typeof this.props.eventsListener === 'function') {
            this.props.eventsListener(eventName, eventData);
        }
    }

    render() {
        const Gallery = this.props.useBlueprints ? ProBlueprintsGallery : ProGallery;
        return (
            <>
                <div>SORTABLE!!!</div>
                <section>
                    <Gallery
                        {...this.props}
                        key={`pro-gallery-${this.props.domId}`}
                        domId={`pro-gallery-${this.props.domId}`}
                        eventsListener={this.eventListener}
                    />
                </section>
            </>
        );
    }
}
