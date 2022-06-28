import React, { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Home from './Home';
import axios from 'axios';
import {API_URL} from '../globals'

export default function Catalogue() {

    const [search, setSearch] = useState('');
    const [articles, setArticles] = useState(null);

    const userToken = useSelector(state => state.userToken);
    const dispatch = useDispatch();

    const getAllArticles = () => {
        axios.get(API_URL + 'all_article?begin=' + search, {'headers': {
            'Content-Type': 'application/json',
            'Authorization':  `Bearer ${userToken}`
          }})
          .then(function (response) {
            setArticles(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    useEffect(() => {
        getAllArticles();
    }, [search]);

        return (
            <div>
                <Home/>
                <div className="d-flex align-item-center justify-content-center mt-4">
                    <div className="input-group col-lg-3 mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1"><i className="fas fa-search"></i></span>
                        </div>
                        <input type="text" className="form-control lg-6" placeholder="Rechercher" onChange={(e) => setSearch(e.target.value)} aria-label="Rechercher" aria-describedby="Search"/>
                    </div>
                </div>
                    <div className="d-flex col-lg-12 justify-content-center row">
                    {articles && articles.length > 0 ? articles.map((elm, i) => {
                        return <div key={i} className="card col-lg-3 mr-5 mb-5" style={{width: "18rem", height: 'fit-content'}}>
                        <img className="card-img-top" src={elm.photoUrl} alt="Article" style={{width: '100%', height: '300px'}} />
                        <div className="card-body">
                          <h5 className="card-title">{elm.name}</h5>
                          <p className="card-text">{elm.description}</p>
                          <p className="card-text"><strong>Prix : </strong>{elm.prix} €</p>
                          <p className={elm.disponibility > 0 ? 'card-text green' : 'card-text red'}><strong>{elm.disponibility > 0 ? elm.disponibility + " articles disponible" : 'Plus disponible'}</strong></p>
                          <button className="btn" disabled={elm.disponibility > 0 ? false : true} onClick={() => {elm.quantity = 1; elm.defaultPrice = elm.prix; dispatch({'type': 'ADD_ITEM', payload: elm})}}><i className="fas fa-shopping-cart"></i></button>
                        </div>
                      </div>
                    } ): <div className="alert alert-secondary" role="alert">
                    Aucun article trouvé pour la recherche : <strong>{search}</strong>
                  </div> }
                </div>
            </div>
        )
}
