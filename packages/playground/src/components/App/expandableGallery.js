import React from 'react';
import {GALLERY_CONSTS, ProGallery, ProBlueprintsGallery} from 'pro-gallery';
import {utils} from 'pro-gallery-lib';
// import CLICK_ACTIONS from '../../../common/constants/itemClick';
import CloseButton from './x';

const styles = {
    gallery: {

    }, 
    fullscreen: {
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh',
        zIndex: 9,
        background: 'white',
        opacity: 0,
        transition: 'opacity 2s ease',
        visibility: 'hidden'
    }, 
    shown: {
        visibility: 'visible',
        opacity: 1
    },
    close: {
        boxSizing: 'content-box',
        zIndex: 10,
        padding: 10,
        position: 'fixed',
        right: 20,
        top: 20,
        background: 'rgba(255,255,255,0.8)',
        borderRadius: 4,
        width: 25,
        height: 25,
        fill: 'black',
        cursor: 'pointer'
    }
} 

const GALLERY_EVENTS = GALLERY_CONSTS.events;

export default class ExpandableProGallery extends React.Component {

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
                <section style={{...styles.gallery, display: (this.state.fullscreenIdx < 0 ? 'block' : 'none')}}>
                    <Gallery
                        {...this.props}
                        key={`pro-gallery-${this.props.domId}`}
                        domId={`pro-gallery-${this.props.domId}`}
                        eventsListener={this.eventListener}
                    />
                </section>
                {this.state.fullscreenIdx < 0 ? null : <section style={{ ...styles.fullscreen, ...(this.state.fullscreenIdx >= 0 && styles.shown) }}>
                    <CloseButton style={styles.close} onClick={() => this.setState({fullscreenIdx: -1})} />
                    <Gallery
                        {...this.props}
                        key={`pro-fullscreen-${this.props.domId}`}
                        domId={`pro-fullscreen-${this.props.domId}`}
                        currentIdx={this.state.fullscreenIdx}
                        container= {{
                            width: window.innerWidth,
                            height: window.innerHeight
                        }}
                        styles={{
                            ...(this.props.options || this.props.styles),
                            galleryLayout: 5,
                            slideshowInfoSize: 0,
                            cubeType:'fit',
                            scrollSnap: true,
                            showArrows: !utils.isMobile()
                        }}
                    />
                </section>}
            </>
        );
    }
}
