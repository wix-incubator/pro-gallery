/* eslint-disable */
import PropTypes from 'prop-types';
import React from 'react';

const loader = ({size, ...props}) => (
<div style={{
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    zIndex: 1000,
    objectFit: 'contain',
    animation: '.5s ease-in 2s fade 1 normal forwards',
    background: 'white'
}}>
    <style type="text/css" dangerouslySetInnerHTML={{__html:`
        .st0 {
            fill-rule: evenodd;clip-rule:evenodd;fill:url(#SVGID_1_);
        }
        @keyframes fade {
            from {opacity: 1;}
            to {opacity: 0;}
          }
    `}} />
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        viewBox="0 0 1000 1000" style={{enableBackground:'new 0 0 1000 1000'}}>
        <g>
            <g>
                <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="2654.1858" y1="690.0842" x2="2716.1858" y2="102.0842" gradientTransform="matrix(1 0 0 1 -2174 0)">
                    <stop  offset="0" style={{stopColor:'#9D25F9'}}/>
                    <stop  offset="1" style={{stopColor:'#077BF0'}}/>
                </linearGradient>
                <path className="st0" d="M436.7,630l-69.8-15.4c-4.5-1-8,4.7-8,12.7v69.1c0,8,3.5,16.3,8,18.7l69.8,36.3c6.7,3.5,12.4-1.8,12.4-12.1
                    v-88.1C449.1,641,443.5,631.5,436.7,630z M436.7,339.2l-69.8,34.7c-4.5,2.2-8,10.5-8,18.5v69.1c0,8,3.5,13.8,8,12.9l69.8-13.8
                    c6.7-1.3,12.4-10.7,12.4-21v-88.1C449.1,341.3,443.5,335.8,436.7,339.2z M615,459.9l-134.6,18.6c-8,1.1-14.3,10.6-14.3,21.2v91.7
                    c0,10.6,6.3,20.3,14.3,21.6L615,634.8c14.1,2.3,26.1-7.9,26.1-22.8V483.3C641.1,468.4,629.1,458,615,459.9z M615,250.4l-134.6,67
                    c-8,4-14.3,15.7-14.3,26.4v91.7c0,10.6,6.3,18,14.3,16.4L615,425.3c14.1-2.8,26.1-17.3,26.1-32.2V264.5
                    C641.1,249.5,629.1,243.4,615,250.4z"/>
            </g>
        </g>
    </svg>
</div>
);
loader.displayName = 'loader';
loader.propTypes = {
  size: PropTypes.string
}
export default loader;
/* eslint-enable */
