import React from 'react';
import {
    Step,
    Stepper,
    StepLabel
} from 'material-ui/Stepper';
import cms from '../cms';

export default ({step}) => {
    return cms(__filename)(
        <Stepper activeStep={step} orientation="vertical">
            <Step>
                <StepLabel>Sign your Limited Partner Agreement</StepLabel>
            </Step>
            <Step>
                <StepLabel>Identification</StepLabel>
            </Step>
            <Step>
                <StepLabel>Bank transfer</StepLabel>
            </Step>
        </Stepper>
    )
};
