import React from 'react';
import './Index.scss';
import cms from '../../cms';

export default () => {
    return cms(__filename)(
        <div className="Footer">
            <div>
                Contact: <a href="mailto:support@neufund.org">support@neufund.org</a>
            </div>
            <div>
                ©NEUFUND
            </div>
        </div>
    )
};
