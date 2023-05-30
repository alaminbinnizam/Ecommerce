import React from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { useState } from 'react';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';
import { useAuth } from '../../context/auth';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/v1/auth/login', {
                email,
                password,
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                });
                localStorage.setItem('auth', JSON.stringify(res.data))
                navigate(location.state || "/");
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }


    return (
        <>
            <Layout title={'Register Aquashop'}>
                <div className="form-container">
                    {/* <h1>Register Now</h1> */}
                    <form onSubmit={handleSubmit}>
                        <h4 className="title">LOGIN NOW</h4>

                        <div className="mb-3">
                            <input type="email" value={email} className="form-control" id="exampleInputEmail1"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email'
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input type="password" value={password} className="form-control"
                                id="exampleInputPassword1"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <button type="button" className="btn btn-primary" onClick={() => {
                                navigate('/forgot-password')
                            }}>Forgot Password</button>
                        </div>

                        <button type="submit" className="btn btn-primary">LOGIN</button>

                        


                    </form>
                </div>
            </Layout>
        </>
    )
}

export default Login
