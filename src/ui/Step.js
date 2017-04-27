import React from 'react';
import './Step.scss'
import cms from '../cms';

export default ({children, completed}) => {
    return cms(__filename)(
        <div className="Step">
            {completed
                ? <div className="Step-indicator active"></div>
                : <div className="Step-indicator"></div>
            }
            <div className="Step-label">{children}</div>
        </div>
    )
}