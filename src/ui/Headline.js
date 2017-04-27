import React from 'react';
import './Headline.scss';
import cms from '../cms';

export default ({text}) => {
    return cms(__filename)(
        <div className="Headline">
            {text}
        </div>
    )
};
