import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        address: "",
        phone: "",
    })
    const [msg, setMsg] = useState(null);

    const navigate = useNavigate();

    const handleChange = e => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await axios.post("/auth/register", inputs);
            await axios.post("/auth/addToCustomer", inputs);

            setMsg(res.data)
            navigate("/login");
        } catch (err) {
            setMsg(err.response.data);
        }
    };

    return (
        <div className='auth'>
            <h1>Register</h1>
            <form>
                <input required type='number' placeholder='phone number' name='phone' onChange={handleChange} />
                <input required type='text' placeholder='address' name='address' onChange={handleChange} />
                <input required type='email' placeholder='email' name='email' onChange={handleChange} />
                <input required type='text' placeholder='username' name='username' onChange={handleChange} />
                <input required type='password' placeholder='password' name='password' onChange={handleChange} />
                <button onClick={handleSubmit}>Register</button>
                {msg && <p>{msg}</p>}
                <span>Already have an account? <Link to="/login">Login</Link></span>
            </form>
        </div>
    )
}

export default Register;