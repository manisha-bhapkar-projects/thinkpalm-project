import React, { useState } from 'react';
import { object, string } from 'prop-types';
import './ImageLoader.css'

const ImageLoader = ({ src, alt, className }) => {
    const [state, setState] = useState(false);
    const onLoad = () => {
        setState(true);
    };
    return (
        <div className="imageLoader" data-test="imageLoader" >
            <img
              src={src}
              alt={alt}
              className={`${className} ${!state && 'loading'}`}
              style={{
                display: state ? 'block' : 'none'
              }}
              onLoad={onLoad}
              data-test='imgDiv'
            />
            {!state && (
                <div className={`${className} ${!className && 'applySkeleton'} loading`} />
            )}
        </div>
    );
};

ImageLoader.propTypes = {
    src: string.isRequired,
    alt: string,
    className: object,
};
export default ImageLoader;
