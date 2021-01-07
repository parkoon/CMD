import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import Quiz01 from './components/01/Q01'
import Quiz02 from './components/02/Q02'
import Quiz03 from './components/03/Q03'
import Quiz04 from './components/04/Q04'
import Quiz05 from './components/05/Q05'
import Quiz06 from './components/06/Q06'
import Quiz07 from './components/07/Q07'
import Quiz08 from './components/08/Q08'
import Quiz09 from './components/09/Q09'

function Nav() {
  return (
    <nav>
      <ul className="nav">
        <li>
          <Link to="/">01</Link>
        </li>
        <li>
          <Link to="/quiz02">02</Link>
        </li>
        <li>
          <Link to="/quiz03">03</Link>
        </li>
        <li>
          <Link to="/quiz04">04</Link>
        </li>
        <li>
          <Link to="/quiz05">05</Link>
        </li>
        <li>
          <Link to="/quiz06">06</Link>
        </li>
        <li>
          <Link to="/quiz07">07</Link>
        </li>
        <li>
          <Link to="/quiz08">08</Link>
        </li>
        <li>
          <Link to="/quiz09">09</Link>
        </li>
      </ul>
    </nav>
  )
}

function Root() {
  return (
    <>
      {Nav()}
      <Switch>
        <div className="container">
          <Route path="/" exact>
            <Quiz01 />
          </Route>
          <Route path="/quiz02">
            <Quiz02 />
          </Route>
          <Route path="/quiz03">
            <Quiz03 />
          </Route>
          <Route path="/quiz04">
            <Quiz04 />
          </Route>
          <Route path="/quiz05">
            <Quiz05 />
          </Route>
          <Route path="/quiz06">
            <Quiz06 />
          </Route>
          <Route path="/quiz07">
            <Quiz07 />
          </Route>
          <Route path="/quiz08">
            <Quiz08 />
          </Route>
          <Route path="/quiz09">
            <Quiz09 />
          </Route>
        </div>
      </Switch>
    </>
  )
}

export default Root
