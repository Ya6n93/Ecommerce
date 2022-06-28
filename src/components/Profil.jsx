import React, { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-modal'
import axios from 'axios'
import {API_URL} from '../globals'
import Home from './Home';

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

export default function Profil() {
    const infoUser = useSelector(state => state.infoUser);

    const [userID, setuserID] = useState(null)
    const [allUsers, setAllUsers] = useState(false);
    const [users, setUsers] = useState(null);
    const [lastname, setLastname] = useState(infoUser.lastname !== null ? infoUser.lastname : '');
    const [firstname, setFirstname] = useState(infoUser.firstname !== null ? infoUser.firstname : '');
    const [success, setSuccess] = useState(false);
    const [address, setAddress] = useState(null);
    const [addressName, setAddressName] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [modalAddress, setModalAddress] = useState(false);
    const [update, setUpdate] = useState(false);
    const [addressID, setAddressID] = useState(null);
    const [allCommand, setAllCommand] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const userToken = useSelector(state => state.userToken);
    const dispatch = useDispatch();

    const getUser = () => {
        axios.get(API_URL + 'me', {'headers': {
            'Content-Type': ' application/json',
            'Authorization':  `Bearer ${userToken}`
          }})
          .then(function (response) {
              setuserID(response.data.id)
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    const updateUser = () => {
      axios.put(API_URL + 'update_user?id=' + infoUser.id, {
        lastname: lastname,
        firstname: firstname
      },{'headers': {
          'Content-Type': ' application/json',
          'Authorization':  `Bearer ${userToken}`
        }})
        .then(function (response) {
            setSuccess(true)
        })
        .catch(function (error) {
          setSuccess(false)
          console.log(error);
        });
  }

  const clearAddress = () => {
    setUpdate(false);
    setAddressName('');
    setPostalCode('');
    setCity('');
    setCountry('');
  }

  const getInfo = (elm) => {
    setModalAddress(true);
    setUpdate(true);
    setAddressName(elm.road);
    setPostalCode(elm.postalCode);
    setCity(elm.city);
    setCountry(elm.country);
    setAddressID(elm.id);
  }

  const getCommand = () => {
    axios.get(API_URL + 'commande', {'headers': {
        'Content-Type': ' application/json',
        'Authorization':  `Bearer ${userToken}`
      }})
      .then(function (response) {
          setAllCommand(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
}

  const updateAddress = (id) => {
    axios.put(API_URL + 'address/' + addressID,{
      road: addressName,
      postalCode: postalCode,
      city: city,
      country: country
    }, {'headers': {
      'Content-Type': ' application/json',
      'Authorization':  `Bearer ${userToken}`
    }})
    .then(function (response) {
        getAddress();
        setModalAddress(false);
        setUpdate(false);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  const createAddress = () => {
    axios.post(API_URL + 'address',{
      road: addressName,
      postalCode: postalCode,
      city: city,
      country: country,
    }, {'headers': {
      'Content-Type': ' application/json',
      'Authorization':  `Bearer ${userToken}`
    }})
    .then(function (response) {
        getAddress();
        setModalAddress(false);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const deleteAddress = (id) => {
    axios.delete(API_URL + 'address/'+ id, {headers: {
      'Content-Type': ' application/json',
      'Authorization':  `Bearer ${userToken}`
    }})
    .then(function (response) {
        getAddress();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

    const getAddress = () => {
      axios.get(API_URL + 'address', {'headers': {
        'Content-Type': ' application/json',
        'Authorization':  `Bearer ${userToken}`
      }})
      .then(function (response) {
          setAddress(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  
    useEffect(() => {
        getUser();
        getAddress();
        getCommand();
    }, [userToken])

    const deleteUser = (id) => {
        axios.delete(API_URL + 'delete_user?id='+ id, {headers: {
            'Content-Type': ' application/json',
            'Authorization':  `Bearer ${userToken}`
          }})
          .then(function (response) {
              getAllUsers();
          })
          .catch(function (error) {
            console.log(error);
          });

    }

    const getAllUsers = () => {
        axios.get(API_URL + 'all_user', {'headers': {
            'Content-Type': ' application/json',
            'Authorization':  `Bearer ${userToken}`
          }})
          .then(function (response) {
              setAllUsers(true);
              setUsers(response.data)
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return (
        <div>
            <Home/>
        <div className="d-flex justify-content-center align-item-center mt-5">
          <div className="d-flex flex-column" style={{width: '25%'}}>
          {success && <div className="alert alert-success" role="alert">Votre profil a été mis à jour !</div>}
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Nom de famille</span>
              </div>
              <input type="text" className="form-control" value={lastname} placeholder="Nom de famille"  aria-label="Nom de famille" aria-describedby="basic-addon1" onChange={(e) => setLastname(e.target.value)}/>
            </div>
            <div className="input-group mb-3">  
            <div className="input-group-append">
                <span className="input-group-text" id="basic-addon2">Prénom</span>
              </div>
              <input type="text" className="form-control" value={firstname} placeholder="Prénom" aria-label="Prénom" aria-describedby="basic-addon2" onChange={(e) => setFirstname(e.target.value)}/>
            
            
            </div>
            <button className="btn btn-success" onClick={() => updateUser()}>Valider mes informations</button>
            {infoUser.role === 'ROLE_ADMIN' && <button className="btn btn-info" onClick={() => getAllUsers()}>Voir la liste de tous les utilisateurs</button>}
            <button className="btn btn-danger" onClick={() => deleteUser(userID)}>Supprimer mon compte</button>
            </div>
            
                <Modal
                ariaHideApp={false}
                isOpen={allUsers}
                onRequestClose={() => { setAllUsers(false)}}
                style={customStyles}
                contentLabel="Liste des utilisateurs"
              >
       
                <h2>Liste des utilisateurs</h2>
                <ul className="list-group ">
                {users && users.map((elm, i) => 
                   <li key={i} className="list-group-item">ID: {elm.id} : {elm.username} <button className="btn btn-danger" onClick={() => deleteUser(elm.id)}>Supprimer</button></li> 
                )}
                </ul>
              </Modal>
          </div>
          <div className="mt-5">
            <h1 className="text-center">Mes adresses</h1>
          <div className="container">
            <div className="d-flex row justify-content-center">
              {(address && address.length > 0) ? address.map((elm, i) => 
              {
                i < 1 && dispatch({type: 'STOCK_ADDRESS', payload: elm});
                return   <div key={i} className="col-sm-4 mb-4 ">
                <div className="card pointer" onClick={() => {
                  dispatch({'type': 'STOCK_ADDRESS', payload: elm});
                  }}>
                  <div className="card-body">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="card-title">{elm.road} </h5>
                    <small className="text-muted"><i className="fas fa-trash mr-3" onClick={() => deleteAddress(elm.id)}></i><i className="fas fa-pen" onClick={() => getInfo(elm)}></i></small>
                    </div>
                    <p className="card-text">Pays : {elm.country} <br/> Ville : {elm.city} <br/> Code postal : {elm.postalCode}</p>
                  </div>
                </div>
              </div>
              }):<div className="alert alert-secondary" role="alert">
              Aucune adresse renseigné pour le moment 
            </div>}
  </div>
            <div className="d-flex justify-content-center"><button type="button" className="btn btn-info" onClick={() => {setModalAddress(true); clearAddress()}}>Ajouter une adresse</button></div>
            <Modal
                ariaHideApp={false}
                isOpen={modalAddress}
                onRequestClose={() => { setModalAddress(false)}}
                style={customStyles}
                contentLabel="Ajouter une adresse"
              >
       
                <h2>{update ? "Update une adresse " : "Ajouter une adresse"}</h2>
                <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Adresse</span>
              </div>
              <input type="text" className="form-control" value={addressName} placeholder="Adresse"  aria-label="Adresse" aria-describedby="basic-addon1" onChange={(e) => setAddressName(e.target.value)}/>
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Code postal</span>
              </div>
              <input type="text" className="form-control" value={postalCode} placeholder="Code postal"  aria-label="Code postal" aria-describedby="basic-addon1" onChange={(e) => setPostalCode(e.target.value)}/>
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Ville</span>
              </div>
              <input type="text" className="form-control" value={city} placeholder="Ville"  aria-label="Ville" aria-describedby="basic-addon1" onChange={(e) => setCity(e.target.value)}/>
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">Pays</span>
              </div>
              <input type="text" className="form-control" value={country} placeholder="Pays"  aria-label="Pays" aria-describedby="basic-addon1" onChange={(e) => setCountry(e.target.value)}/>
            </div>
            <button className="btn btn-success" style={{width: '100%'}} onClick={() => update ? updateAddress() : createAddress()}> {update ? "Modifier" : "Créer"}</button>
              </Modal>
</div>
</div>
<div className="container">
  <h1 className="text-center">Mes commandes</h1>
  
            <div className="d-flex justify-content-center"><button className="btn btn-info " onClick={() => setShowDetails(!showDetails) }>Détails</button></div>
            <div className="d-flex row justify-content-center">
              {allCommand && allCommand.length > 0 ? allCommand.map((elm, i) => 
              {
                return   <div key={i} className="col-sm-4 mb-4 ">
                <div className="card">
                  <div className="card-body">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="card-title">{elm.road} </h5>
                    <small className="text-muted"></small>
                    </div>
                    <p className="card-text">Commande :<strong> Prix total : {elm.total_prix} € </strong></p>
                    
                    {showDetails && <p>{elm.commande_string}</p>}
                  </div>
                </div>
              </div>
              }):<div className="alert alert-secondary" role="alert">
              Aucune commande pour le moment 
            </div>}
  </div>
  </div>
        </div>
    )


}