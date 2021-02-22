// import React, { Component } from 'react'
//import {Redirect} from 'react-router-dom'


import React, { Component } from 'react'
import axios from 'axios'

export default class Home extends Component {

    constructor(props)
    {
        super(props)
        this.token_key_data = localStorage.getItem('Token_Key')
    }

    // componentDidMount(){
    //     axios.post("https://mahadev-19.herokuapp.com/studentdata/token_data_store/" + this.token_key_data)
    //         .then(res => {
    //             console.log("Token result",res);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         })
    // }

    render() {
        return (
            <div className="container-lg py-lg-5">
                <div className="row py-5">
                    <div className="col-lg-12 col-md-6 col-md-12 col-xs-6 col-sm-12 col-sm-6 col-12">
                        <i style={{fontSize:'150px'}} class="fab fa-react fa-10x fa-spin"></i>
                    </div>
                    <div className="col-12">
                        <h1>Welcome To Student</h1>
                    </div>
                </div>
            </div>
        )
    }
}


// export default class Home extends Component {

//     constructor(props)
//     {
//         super(props)
//         const token = localStorage.getItem('token')
//         let login_check = true

//         if(token==null){
//             login_check = false
//         }

//         this.state={login_check}
//     }

//     render() {
//         if(this.state.login_check===false)
//         {
//             return <Redirect  to="/Login"/>
//         }
//         return (
//             <div>
//                 <h1 style={{margin:'250px 0 20px 0'}}>Welcome To Student</h1>
//             </div>
//         )
//     }
// }
