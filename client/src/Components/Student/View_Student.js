import React, { useState, useEffect, Component } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import moment from 'moment';
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// start funcation
const View_Student = () => {

    const [student,setstudent] = useState({
        first_name : '',
        last_name : '',
        email_id : '',
        Department : '',
        contact_no : '',
        address : '',
        birthday : '',
        graduation_year : '',
        profile : null,
        password :''
    });

    useEffect(() => {
        load_student_data();
    },[])

    const { id } = useParams();

    const load_student_data = async () => {
        const res = await axios.get(`https://crud-yash-19.herokuapp.com/studentdata/viewstudent/${id}`)
        setstudent(res.data);
    }

    const pdf_new = id => {
        console.log("dsds",id);
        axios.get(`https://crud-yash-19.herokuapp.com/studentdata/viewstudent/${id}`)
        .then((res)=>{
            console.log("res",res.data)
            var doc = new jsPDF('p', 'pt', 'letter');
            doc.setLineWidth(5);  
            doc.text(280,40, "MY DATA");
            doc.text(280,50,"--------------")
            doc.addImage(res.data.profile,240,60,150,150);
            doc.autoTable({ html: '#my-table' })
            doc.autoTable({
                html: '#simple_table',
                startY: 220,
                styles: {  
                    halign:'center',
                    halign:'center',
                    valign:'middle',
                    fontSize:12,
                    cellPadding:10,
                    fontStyle:'bold',
                    font:'helvetica'
                },
            })
            doc.save(res.data.first_name + "_" + res.data.last_name + "_" + Date.now() +'.pdf')
        }).catch((err)=>{
            console.log("Error",err);
        })
      }   

    return (
        
            <div className="container py-4 text-dark">
                
                <div className="mx-auto shadow-lg p-5 mb-5 bg-white" style={{ borderRadius: '60px' }}>
                    <div className="col-12 text-center row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <Link className="btn btn-primary btn-lg" to={`/liststudent/${localStorage.getItem('Token_Key')}`}><i class="fas fa-chevron-left" style={{ color: 'white' }}></i> BACK PAGE</Link>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            {/* <h1 className="text-center mb-4"><b>My profile</b></h1> */}
                            <h1><b>VIEW STUDENT</b></h1>
                        </div>
                    </div>

                    <hr />
                    <div className="col-lg-12 text-center row">
                        <div className="col-lg-12 col-md-12 col-md-9 col-sm-12 col-sm-6 col-xs-6 col-xs-3">
                            <b>YOUR ID : {id}</b>
                        </div>
                    </div>
                    <hr />
                    <img style={{ width: '200px', height: '200px', borderRadius: '200px', margin: '0 0 10px 0', border: '10px double #007bff' }} src={student.profile} />

                    <table class="table table-bordered" id="simple_table">
                        <tbody style={{ fontWeight: 'bold', border: 'hidden' }}>
                            <tr><td>first name </td><td> {student.first_name}</td></tr>
                            <tr><td>Last name  </td><td>{student.last_name}</td></tr>
                            <tr><td>Email Id </td><td>{student.email_id}</td></tr>
                            <tr><td>Department </td><td>{student.Department}</td></tr>
                            <tr><td>Contact No  </td><td>{student.contact_no}</td></tr>
                            <tr><td>Address  </td><td>{student.address}</td></tr>
                            <tr><td>Birthday  </td><td>{moment(student.birthday).format('DD-MM-YYYY')}</td></tr>
                            <tr><td>graduation Year  </td><td>{student.graduation_year}</td></tr>
                            {/* <tr><td>Profile  </td><td><img width="50" height="50" src={'/uploads/' + student.profile} /></td></tr> */}
                            <tr><td>Password  </td><td>{student.password}</td></tr>
                        </tbody>
                    </table>
                    <Link style={{ border: 'none' }} className="btn btn-outline-danger" onClick={() => { if (window.confirm('Are you sure you wish to create PDF ?')) { pdf_new(student._id) } }} ><i class="far fa-file-pdf fa-3x"></i></Link>
                </div>    
            </div>
    );
}

export default View_Student;
//EOF funcation



// class start
// export default class View_Student extends Component {
//     constructor(props) {
//         super(props);
//         // this.state ={
//         //     first_name : '',
//         //     last_name : '',
//         //     email_id : '',
//         //     Department : '',
//         //     contact_no : '',
//         //     address : '',
//         //     birthday : '',
//         //     graduation_year : '',
//         //     profile : null,
//         //     password :''
//         // }
//         this.state = { students: [] }
//     }

//     componentDidMount() {
//         axios.get(`http://localhost:3100/studentdata/viewstudent/` + this.props.match.params.id)
//             .then(res => {
//                 this.setState({
//                     students: res.data
//                     //first_name : res.data.first_name,
//                     //last_name : res.data.last_name,
//                 });
//                 //console.log("res",res.data.first_name)
//             })
//             .catch((error) => {
//                 console.log(error);
//             })
//     }

//     render() {
//         return (
//             <div className="container py-4">
//                 <div className="w-80 mx-auto shadow-lg p-5 mb-5 bg-white" style={{ borderRadius: '60px' }}>
//                     <div className="row" style={{ display: 'inline-grid' }}>
//                         <h1 className="text-center mb-4"><b>VIEW STUDENT</b></h1>
//                         <Link className="btn btn-primary" to="/liststudent">BACK PAGE</Link>
//                     </div>
//                     <hr />
//                     <h1 className="display-4">User Id: {this.props.match.params.id}</h1>
//                     <hr />
//                     <img style={{ width: '200px', height: '200px', borderRadius: '200px', margin: '0 0 10px 0', border: '10px double #007bff' }} src={'/uploads/' + this.state.students.profile} />

//                     <table class="table table-bordered" >
//                         <tbody style={{ fontWeight: 'bold' }}>
//                             <tr><td>first name </td><td> {this.state.students.first_name}</td></tr>
//                             <tr><td>Last name  </td><td>{this.state.students.last_name}</td></tr>
//                             <tr><td>Email Id </td><td>{this.state.students.email_id}</td></tr>
//                             <tr><td>Department </td><td>{this.state.students.Department}</td></tr>
//                             <tr><td>Contact No  </td><td>{this.state.students.contact_no}</td></tr>
//                             <tr><td>Address  </td><td>{this.state.students.address}</td></tr>
//                             <tr><td>Birthday  </td><td>{moment(this.state.students.birthday).format('DD-MM-YYYY')}</td></tr>
//                             <tr><td>graduation Year  </td><td>{this.state.students.graduation_year}</td></tr>
//                             {/* <tr><td>Profile  </td><td><img width="50" height="50" src={'/uploads/' + this.state.students.profile} /></td></tr> */}
//                             <tr><td>Password  </td><td>{this.state.students.password}</td></tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         );
//     }
// }

// class end