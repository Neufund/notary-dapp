import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import cms from '../cms';

export default ({progress}) => {
    return cms(__filename)(
        <LinearProgress mode="determinate" value={progress} style={{
            position:"absolute",
            left:0,
            right:0,
            height: "0.5em"
        }}/>
    )
};
