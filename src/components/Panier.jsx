import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import Home from './Home'
import axios from 'axios';
import { API_URL } from '../globals'
import { useHistory } from 'react-router-dom';

export default function Panier() {
    const [priceTotal, setPriceTotal] = useState(0);
    const [commandeInfo, setCommandeInfo] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();

    let allItem = useSelector(state => state.allShop);
    const userToken = useSelector(state => state.userToken);
    const addressCommand = useSelector(state => state.addressShop);

    const getTotalPrice = () => {
        let total = 0;
        allItem.map((elm) => {
            total += elm.prix;
        })
        setPriceTotal(total);
    }

    const validCommand = () => {
        let newObject = [];
        allItem.map((elm) => newObject.push({'id': elm.id, 'prix': elm.prix, 'quantity': elm.quantity}))
        axios.post(API_URL + 'commande',
            newObject,
           {'headers': {
            'Content-Type': ' application/json',
            'Authorization':  `Bearer ${userToken}`
          }})
          .then(function () {
            setCommandeInfo('Votre commande a été validé');
            dispatch({type: 'EMPTY_SHOP'})
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    useEffect(() => {
        if(allItem.length > 0)
            getTotalPrice();
    }, [allItem, userToken])

    const renderTableData = () => {
        return allItem.map((elm, index) => {
           const { photoUrl, name, disponibility, description, quantity, defaultPrice } = elm //destructuring
           return (
              <tr key={index}>
                 <td><img src={photoUrl} alt="Article" style={{width: '150px', height: '150px'}}/></td>
                 <td>{name}</td>
                 <td>{description}</td>
                 <td>{defaultPrice * quantity} €</td>
                 <td><input type="number" min="1" value={quantity} max={disponibility} onChange={() => dispatch({type:'UPDATE_SHOP', payload:elm})}/>
                 <button className="btn btn-success" onClick={() => dispatch({type:'UPDATE_SHOP', payload:elm})}>+</button> <button className="btn btn-danger" onClick={() => dispatch({type:'UPDATE_SHOP_DOWN', payload:elm})}>-</button></td>
              </tr>
           )
        })
     }

        return (
            <div>
                <Home/>
                <div className="d-flex align-items-center flex-column">
                {commandeInfo.length > 0 && 
                <div className="alert alert-success" role="alert">
                    {commandeInfo}
                </div>}
                    <h1 className="text-center">Panier</h1>
                    <table>
                        <tbody>
                            <tr>
                                <th>Image</th>
                                <th>Nom du produit</th>
                                <th>Description</th>
                                <th>Prix</th>
                                <th>Quantité</th>
                            </tr>
                            
                                { allItem.length > 0 && renderTableData()
                                }
                        </tbody>
                    </table>
                    {
                        allItem.length > 0 ?
                    <div className="d-flex flex-column align-items-center" style={{width: '100%'}}>
                        <p className="mt-3">Total de la commande : <strong>{priceTotal} €</strong></p>
                        {addressCommand ? 
                        <div className="text-center">
                            <p>Adresse de la commande : <strong>{addressCommand.road + " " + addressCommand.city + " " + addressCommand.postalCode + " " + addressCommand.country}</strong></p>
                            <a onClick={() => history.push('/profil')} className={'text-info'}>Changer l'adresse</a>
                        </div> :
                        <div className="text-center">
                            <p>Aucune adresse renseignée</p>
                            <a onClick={() => history.push('/profil')} className={'text-info'}>Ajouter une adresse</a>
                        </div>
                        }
                        <button className="btn btn-success" style={{width: '25%'}} onClick={() => validCommand()}>Valider la commande</button>
                    </div>
                    : <div className="alert alert-secondary" role="alert">
                    Aucun article dans votre panier.
                    </div>
                    }
                   
                </div>
            </div>
        )
}
