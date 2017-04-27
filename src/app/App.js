import React from 'react';
import './App.scss';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '../ui/header/Index';
import Footer from '../ui/footer/Index';
import muiTheme from '../muiTheme';
import cms from '../cms';

export default ({children}) => {
    return cms(__filename)(
        <MuiThemeProvider muiTheme={muiTheme}>
            <div>
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <Header/>
                        {children}
                    </div>
                </div>
                <div className="row footer-wrapper">
                    <div className="col-xs-12 col-md-10 col-md-offset-1">
                        <Footer/>
                    </div>
                </div>
            </div>
        </MuiThemeProvider>
    )
};
