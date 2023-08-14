// import React from 'react';

// const ImageWrapperHOC = (WrappedComponent) => {
//   return function ImageWrapper(props) {
//     const { className, style, ...restProps } = props;

//     const wrapperStyle = {
//       // Define your wrapper styles here
//       border: '1px solid #ccc',
//       padding: '10px',
//       // ...other styles
//       ...style,
//     };

//     return (
//       <div className={className} style={wrapperStyle}>
//         <WrappedComponent {...restProps} />
//       </div>
//     );
//   };
// };

// export default ImageWrapperHOC;

// // import React from 'react';
// // import ImageWrapperHOC from './ImageWrapperHOC';

// // // Your image component
// // const ImageComponent = ({ src, alt }) => <img src={src} alt={alt} />;

// // // Wrap the image component with the HOC
// // const WrappedImage = ImageWrapperHOC(ImageComponent);

// // // Usage in your app
// // function App() {
// //   return (
// //     <div>
// //       <h1>Image Wrapper HOC Example</h1>
// //       <WrappedImage
// //         src="path_to_your_image.jpg"
// //         alt="A beautiful image"
// //         className="custom-image-class"
// //         style={{ maxWidth: '100%' }}
// //       />
// //     </div>
// //   );
// // }

// // export default App;
