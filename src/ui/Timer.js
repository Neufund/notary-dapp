import React from 'react';
import moment from 'moment';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);
        let toTime = moment(props.toTime);
        let now = moment();

        this.state = {
            duration: moment.duration(toTime.diff(now)),
            toTime: moment(props.toTime)
        }
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
         clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            duration: moment.duration(this.state.toTime.diff(moment()))
        })
    };

    render  = () =>
        <span className={this.props.className}>
            <span className="unit">D </span><span className="number">{Math.floor(this.state.duration.asDays())} </span>
            <span className="unit">H </span><span className="number">{this.state.duration.hours()} </span>
            <span className="unit">M </span><span className="number">{this.state.duration.minutes()} </span>
            <span className="unit">S </span><span className="number">{this.state.duration.seconds()} </span>
        </span>
}