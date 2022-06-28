import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import Home from './components/Home';
import Catalogue from './components/Catalogue';
import Panier from './components/Panier';
import Profil from './components/Profil';
import Admin from './components/Admin';
import { useSelector} from 'react-redux'

function App() {
  return (
    <Router>
    <div>
      <Switch>
        <PrivateRoute path="/panier" component={Panier}/>
        <PrivateRoute path="/catalogue" component={Catalogue}/>
        <PrivateRoute path="/profil" component={Profil}/>
        <PrivateRoute path="/admin" component={Admin}/>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  </Router>
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  const userToken = useSelector(state => state.userToken);
  const history = useHistory()
  return (
    <Route
      {...rest}
      render={props =>
        userToken.length > 0 ? (
          <Component {...props} />
        ) : history.push('/')
      }
    />
  );
}

export default App;
