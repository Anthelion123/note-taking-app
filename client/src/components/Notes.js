import * as React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Documents from './Documents'
import Projects from './Projects'
// import Creat from './projects/Create'
import Header from './projects/Header'

export default function Notes({setIsLogin}) {
    return (
        <Router>
        <div className="notes-page">
            <Header setIsLogin={setIsLogin} />
            <section>
                <Route path="/" component={Projects} exact />
                {/* <Route path="/create" component={Creat} exact /> */}
                <Route path="/edit/:id" component={Documents} exact />
            </section>
          
        </div>
        </Router>
    )
}