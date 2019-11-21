import React from 'react';
import ProGallery from './proGallery';
import GALLERY_EVENTS from '../../common/constants';
import CloseButton from '../svgs/components/x';

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
        background: 'white'
    }, 
    close: {
        boxSizing: 'content-box',
        zIndex: 10,
        padding: 10,
        position: 'fixed',
        right: 10,
        top: 10,
        background: 'rgba(255,255,255,0.8)',
        borderRadius: 4,
        width: 25,
        height: 25,
        fill: 'black',
    }
} 

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
                // console.log({eventName, eventData});
                break;
        }
        if (typeof this.props.eventsListener === 'function') {
            this.props.eventsListener(eventName, eventData);
        }
    }

    render() {
        return (
            <>
                <section style={{...styles.gallery, display: (this.state.fullscreenIdx < 0 ? 'block' : 'none')}}>
                    <ProGallery
                        key={`pro-gallery-${this.props.domId}`}
                        {...this.props}
                        eventsListener={this.eventListener}
                    />
                </section>
                {this.state.fullscreenIdx >= 0 && <section style={{ ...styles.fullscreen, display: (this.state.fullscreenIdx >= 0 ? 'block' : 'none') }}>
                    <CloseButton style={styles.close} onClick={() => this.setState({fullscreenIdx: -1})} />
                    <ProGallery
                        {...this.props}
                        currentIdx={this.state.fullscreenIdx}
                        container= {{
                            width: window.innerWidth,
                            height: window.innerHeight - 100
                        }}
                        styles={{
                            ...(this.props.options || this.props.styles),
                            galleryLayout: 5,
                            slideshowInfoSize: 100,
                            cubeType:'fit',
                            scrollSnap: true
                        }}
                    />
                </section>
                }
            </>
        );
    }
}
