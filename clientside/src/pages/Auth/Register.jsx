import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { useState } from 'react';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';
const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/v1/auth/register', {
                name,
                email,
                password,
                phone,
                address,
                answer
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message)
                navigate("/login");
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
                        <h4 className="title">REGISTER NOW</h4>
                        <div className="mb-3">
                            <input type="text" value={name} className="form-control" id="exampleInputEmail1"
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Name'
                                required
                            />
                        </div>
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
                            <input type="text" value={phone} className="form-control" id="exampleInputEmail1"
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder='Phone'
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input type="text" value={address} className="form-control" id="exampleInputEmail1"
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder='Address'
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input type="text" value={answer} className="form-control" id="exampleInputEmail1"
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder='Enter a unique Hint'
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">REGISTER</button>
                    </form>
                </div>
            </Layout>
        </>
    )
}

export default Register
