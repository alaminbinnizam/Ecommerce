import React from 'react';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CategoryProduct = () => {
    const navigate = useNavigate();
    const params = useParams()
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([])

    const getProductByCat = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.products)
            setCategory(data?.category)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (params?.slug) getProductByCat()
    }, [params.slug])
    return (
        <Layout>
            <div className="container mt-3">
                <h4 className='text-center'>Category - {category?.name}</h4>
                <h6 className='text-center'>{products?.length} result</h6>
                <div className="row">
                    <div className="col-md-9 offset-1">
                        <div className="d-flex flex-wrap">
                            {products?.map((p) => (
                                <div className="card m-2" style={{ width: '18rem' }} >
                                    <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description.substring(0, 30)}...</p>
                                        <p className="card-text"> {p.price}&#2547;</p>
                                        <button className="btn btn-primary mb-2" onClick={() => navigate(`/product/${p.slug}`)}>MORE DETAILS</button>
                                        <button className="btn btn-secondary ms-1">ADD TO CART</button>
                                    </div>
                                </div>


                            ))}
                        </div>
                        {/* <div className='m-2 p-3'>
                            {products && products.length < total && (
                                <button className='btn btn-warning' onClick={(e) => {
                                    e.preventDefault()
                                    setPage(page + 1)
                                }}>
                                    {loading ? "Loading..." : "Loadmore"}
                                </button>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct
