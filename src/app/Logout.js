import './Logout.scss';
import cms from '../cms';
import React from 'react';
import {Link} from 'react-router';
import Headline from '../ui/Headline';
import Image from "../images/nano2.png"

export default () => {
    return cms(__filename)(
        <div className="App-content Logout">
            <Headline text="You are logged out"/>
            <div className="row">
                <div className="col-xs-8 col-xs-offset-2">
                    <p className="Description">
                        Your Ledger Nano was disconnected! <br />
                        If you want to log in connect the Ledger again
                    </p>
                    <Link to="/login">
                        <img src={Image} alt="dummy something"/>
                        Log in again
                    </Link>
                </div>

            </div>
        </div>
    )
};
