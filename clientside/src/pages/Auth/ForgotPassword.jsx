import React from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import { useState } from 'react';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';
// import { useAuth } from '../../context/auth';

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");
    // const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    // const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/v1/auth/forgot-password', {
                email,
                newPassword,
                answer
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
               
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
            <Layout title={'Forgot-password'}>
                <div className="form-container">
                    {/* <h1>Register Now</h1> */}
                    <form onSubmit={handleSubmit}>
                        <h4 className="title">RESET PASSWORD</h4>

                        <div className="mb-3">
                            <input type="email" value={email} className="form-control" id="exampleInputEmail1"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email'
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input type="password" value={newPassword} className="form-control"
                                id="exampleInputPassword1"
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder='New password'
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input type="" value={answer} className="form-control"
                                id="exampleInputPassword1"
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder='Enter previous Hint'
                                required
                            />
                        </div>

                        

                        <button type="submit" className="btn btn-primary">RESET</button>




                    </form>
                </div>
            </Layout>
        </>
    )
}

export default ForgotPassword
