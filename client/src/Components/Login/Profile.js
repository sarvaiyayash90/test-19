import React, { useState, useEffect, Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


// start funcation
const Profile = () => {

    const [login_data,set_login] = useState({
        username : '',
        email_id : '',
        password : '',
        profile_img : null
    });

    useEffect(() => {
        load_login_profile_data();
    },[])

    const id = localStorage.getItem('Token_Key')
    //console.log("id",id);
    //console.log("http://localhost:3100/logindata/viewloginprofile/"+id);

    const load_login_profile_data = async () => {
        const res = await axios.get(`https://crud-yash-19.herokuapp.com/logindata/viewloginprofile/${id}`)
        set_login(res.data);
    }

    return (
        <div className="container py-4 text-dark">
                <div className="mx-auto shadow-lg p-5 mb-5 bg-white" style={{borderRadius:'60px'}}>

                    <div className="col-12 text-center row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <Link className="btn btn-primary btn-lg" to="/home"><i class="fas fa-chevron-left" style={{ color: 'white'}}></i> BACK PAGE</Link>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            {/* <h1 className="text-center mb-4"><b>My profile</b></h1> */}
                            <h1><b>MY PROFILE</b></h1>
                        </div>
                    </div>
                
                    <hr/>
                        <div className="col-lg-12 text-center row">
                            <div className="col-lg-12 col-md-12 col-md-9 col-sm-12 col-sm-6 col-xs-6 col-xs-3">
                                <b>YOUR ID : {id}</b>
                            </div>
                        </div>
                    <hr/>
                    
                    <img  style={{width:'200px',height:'200px',borderRadius:'200px',margin:'0 0 10px 0',border:'10px double #007bff'}} src={'/admin/' + login_data.profile_img} />

                    <div className="col-lg-12 col-md-12 col-xs-6 col-sm-6 text-center row">
                        <table class="table table-bordered" >
                            <tbody style={{fontWeight:'bold'}}>
                                <tr><td>Username </td><td> {login_data.username}</td></tr>
                                <tr><td>Email Id </td><td>{login_data.email_id}</td></tr>
                            </tbody>
                        </table>
                    </div>

                </div>
        </div>
    );
}

export default Profile;
//EOF funcation

