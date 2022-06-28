import React, { useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {API_URL} from '../globals'
import Home from './Home';


export default function Admin() {

    const userToken = useSelector(state => state.userToken);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [picture, setPicture] = useState('');
    const [articles, setArticles] = useState(null);
    const [updateArticles, setUpdateArticles] = useState(true);
    const [stock, setStock] = useState('');
    const [id, setID] = useState(null);

    const getAllArticles = () => {
        axios.get(API_URL + 'all_article?begin=', {'headers': {
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

    const updateArticle = (item) => {
        setUpdateArticles(false)
        setName(item.name);
        setPrice(item.prix);
        setPicture(item.photoUrl);
        setID(item.id);
        setDescription(item.description);
        setStock(item.disponibility)
    }

    const clearInput = () => {
        setName('');
        setPrice('');
        setPicture('');
        setDescription('');
        setStock('');
    }

    const valideUpdate = () => {
        axios.put(API_URL + 'update_article?id=' + id,{
            name: name,
            description: description,
            prix: price,
            disponibility: stock,
            photoUrl: picture
          }, {'headers': {
            'Content-Type': ' application/json',
            'Authorization':  `Bearer ${userToken}`
          }})
          .then(function (response) {
              getAllArticles();
              clearInput();
              setUpdateArticles(true);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    const deleteArticle = (id) => {
        axios.delete(API_URL + 'delete_article?id='+ id, {headers: {
            'Content-Type': ' application/json',
            'Authorization':  `Bearer ${userToken}`
          }})
          .then(function (response) {
              getAllArticles();
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    const createArticle = () => {
        axios.post(API_URL + 'create_article',{
            name: name,
            description: description,
            prix: price,
            disponibility: stock,
            photoUrl: picture
          }, {'headers': {
            'Content-Type': ' application/json',
            'Authorization':  `Bearer ${userToken}`
          }})
          .then(function (response) {
              getAllArticles();
          })
          .catch(function (error) {
            console.log(error);
          });
        }

        useEffect(() => {
            getAllArticles();
        }, [])

    return (
        <div>
            <Home/>
            <div className="d-flex main col-lg-12 mt-3">
                <div className="col-lg-6 d-flex align-item-center flex-column">
                <h1 className="text-center">{updateArticles ? 'Création d\'un article' : 'Update d\'un article'}</h1>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Nom du produit</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Nom du produit" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Stock</span>
                    </div>
                    <input type="number" className="form-control" aria-label="Stock" value={stock} onChange={(e) => setStock(e.target.value)}/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">€</span>
                    </div>
                    <input type="number" className="form-control" aria-label="Prix" value={price} onChange={(e) => setPrice(e.target.value)}/>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Photo</span>
                    </div>
                    <input type="text" className="form-control" aria-label="Photo" value={picture} onChange={(e) => setPicture(e.target.value)}/>
                </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Description du produit</span>
                        </div>
                        <textarea className="form-control" aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    {updateArticles ? <button className="btn btn-success" onClick={() => createArticle()}>Créer l'article</button> :
                    <button className="btn btn-info" disabled={updateArticles} onClick={() => valideUpdate()}>Update un article</button> }
                </div>
                <div className="border-left d-sm-none d-md-block" style={{width: '0px'}}></div>
                <div className="col-lg-6">
                <h1 className="text-center">Liste des articles</h1>
                    <div>
                        {
                            articles && articles.map((elm, i) => {
                                return <div key={i} className="list-group-item list-group-item-action flex-column align-items-start">
                                <div className="d-flex w-100 justify-content-between">
                                  <h5 className="mb-1">Nom du produit : {elm.name}</h5>
                                  <small className="text-muted"><i className="fas fa-trash mr-3" onClick={() => deleteArticle(elm.id)}></i><i className="fas fa-pen" onClick={() => updateArticle(elm)}></i></small>
                                </div>
                                <p className="mb-1">Description : {elm.description}</p>
                                <small className="text-muted">Prix : {elm.prix} € - </small>
                                <small className="text-muted">Stock : {elm.disponibility}</small>
                              </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )


}