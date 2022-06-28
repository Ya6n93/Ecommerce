import React, { useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-modal'
import axios from 'axios'
import {  useHistory } from 'react-router-dom'
import {API_URL} from '../globals'

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      border                : '1px solid black',
      transform             : 'translate(-50%, -50%)'
    }
  };

export default function Home() {
    const dispatch = useDispatch()
    const history = useHistory()

    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const [loginName, setLoginName] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
    const [errorLogin, setErrorLogin] = useState('');
    const [errorRegister, setErrorRegister] = useState('');
    const [successRegister, setSuccessRegister] = useState('');
    const [successLogin, setSuccessLogin] = useState('');
    const [info, setInfo] = useState(false);
    const [number, setNumber] = useState(0);
    
    const user = useSelector(state => state.userToken);
    const shopNumber = useSelector(state => state.allShop);

    useEffect(() => {
      if(user.length > 0) {
        getUser(user);
        setNumber(shopNumber.length)
      }
    }, [user, shopNumber]);

    const getUser = (user) => {
      axios.get(API_URL + 'me', {'headers': {
          'Content-Type': ' application/json',
          'Authorization':  `Bearer ${user}`
        }})
        .then(function (response) {
          response.data.role === 'ROLE_ADMIN' ? setInfo(true) : setInfo(false);
          dispatch({ type: 'INFO_USER', payload: response.data})
        })
        .catch(function (error) {
          console.log(error);
        });
  }

    const callLogin = () => {
        axios.post(API_URL + 'authenticate', {
            username: loginName,
            password: loginPassword
          })
          .then(async function (response) {
            setErrorLogin("");
            dispatch({ type: 'NEW_USER' , payload: response.data.token})
            setLogin(false);
                history.push('/catalogue')
          })
          .catch(function (error) {
            console.log(error);
            setErrorLogin('Le mot de passe et le nom d\'utilisateur ne correspondent pas')
          });
    }

    const verification = () => {
        if(registerPassword !== registerPasswordConfirm) {
            setErrorRegister("Les mots de passe sont différents")
            return false;
        }
        return true;
    }

    const clearRegister = () => {
        setRegisterName('');
        setRegisterPassword('');
        setRegisterPasswordConfirm('');
        setErrorRegister('');
        setSuccessRegister('');
    }

    const clearLogin = () => {
        setLoginName('');
        setLoginPassword('');
        setErrorLogin('');
        setSuccessLogin('');
    }

    const callRegister = () => {
        if(verification()) {
        axios.post(API_URL + 'register', {
            username: registerName,
            password: registerPassword
          })
          .then(function (response) {
            setErrorRegister('');
            setSuccessRegister('Félicitation, vous êtes inscris !')
          })
          .catch(function (error) {
            console.log(error);
            setErrorRegister("L'utilisateur existe déjà ")
          });
        }
    }

        return (
            <div>
                <div className="navbar navbar-expand-lg">
                    {
                        user.length < 1 ?
                        <div className="mr-auto ml-25" style={{width: '100%', display:'flex', alignItems: 'center'}}>
                          
                          <a onClick={() => history.push('/catalogue')} className="mr-auto text-light">Catalogue</a>
                            <button className="btn btn-success" onClick={() => setLogin(true)}>Se connecter</button>
                            <button className="btn btn-dark" onClick={() => setRegister(true)}>S'inscrire</button>
                        </div> : <div className="mr-auto ml-25" style={{width: '100%', display:'flex', alignItems: 'center'}}>
                            <a onClick={() => history.push('/panier')} className="mr-25 text-light"><strong>Mon panier ({number})</strong></a>
                            <a onClick={() => history.push('/catalogue')} className="mr-25 text-light">Catalogue</a>
                            <a onClick={() => history.push('/profil')} className={info ? 'mr-25 text-light' : "mr-auto text-light" }>Mon profil</a>
                            {info && <a onClick={() => history.push('/admin')} className="mr-auto text-light"><strong>Administration</strong></a>}
                            <button className="btn btn-danger float-right" onClick={() => {dispatch({ type: 'LOGOUT' }); history.push('/')}}>Se déconnecter</button>
                        </div>
                    }
                </div>

                    <Modal
                    ariaHideApp={false}
                    isOpen={login}
                    onRequestClose={() => { setLogin(false); clearLogin()}}
                    style={customStyles}
                    contentLabel="Connexion"
                  >
           
                    <h2>Connexion</h2>
                    
                    {errorLogin.length > 0 && <div className="alert alert-danger" role="alert">{errorLogin}</div>}
                    {successLogin.length > 0 && <div className="alert alert-success" role="alert">{successLogin}</div>}
                    <input type="text" className="form-control" placeholder="Pseudo" value={loginName} onChange={(e) => setLoginName(e.target.value)}/>
                    <input type="password" className="form-control" placeholder="Mot de passe" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}/>
                    
                    <button className="btn btn-success" onClick={() => callLogin()}>Connexion</button>
                    <button className="btn  btn-secondary" onClick={() => { setLogin(false); clearLogin()}}>Fermer</button>
                    <button className="btn btn-link" onClick={() => {setLogin(false); setRegister(true)}}>Pas encore inscris ?</button>
                  </Modal>
                <Modal
                    ariaHideApp={false}
                    isOpen={register}
                    onRequestClose={() => {setRegister(false); clearRegister();}}
                    style={customStyles}
                    contentLabel="Inscription"
                  >
                    <h2 className="modal-title">Inscription</h2>
                    {errorRegister.length > 0 && <div className="alert alert-danger" role="alert">{errorRegister}</div>}
                    {successRegister.length > 0 && <div className="alert alert-success" role="alert">{successRegister}</div>}
                <div className="modal-body">
                    <input type="text" className="form-control" placeholder="Pseudo" value={registerName} onChange={(e) => setRegisterName(e.target.value)}/>
                    <input type="password" className="form-control" placeholder="Mot de passe" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)}/>
                    <input type="password" className="form-control" placeholder="Confirmation mot de passe" value={registerPasswordConfirm} onChange={(e) => setRegisterPasswordConfirm(e.target.value)}/>
                </div>
                    <button className="btn btn-link" onClick={() => {setRegister(false); setLogin(true)}}>Déjà inscris ?</button>
                    <button className="btn btn-success" onClick={() => callRegister()}>Valider</button>
                    <button className="btn  btn-secondary" onClick={() => {setRegister(false); clearRegister();}}>Fermer</button>
                    
                  </Modal>
            </div>
        )
}
