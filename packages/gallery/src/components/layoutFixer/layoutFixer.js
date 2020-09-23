import React from 'react';
import { isPrerenderMode } from 'pro-gallery-lib';

const logString = `[LAYOUT FIXER] SSR script (log string)`;

export const LayoutFixer = (props) => {
    // console.log('[LAYOUT FIXER] rendering', isPrerenderMode(), props);
    return (isPrerenderMode) ? (
        <>
            <script dangerouslySetInnerHTML={{__html: `console.log("${logString}")`}}></script>
            <script src={props.layoutFixerBundleUrl}></script>
            <layout-fixer 
                parentId={props.parentId}
                items={JSON.stringify(props.items)}
                styles={JSON.stringify(props.styles)}
            ></layout-fixer>
        </>
    ) : null;}