import React, {Component} from 'react';
import {ButtonToolbar, Button, Table, Alert} from 'react-bootstrap';
import AddSupplierModal from './AddSupplier';
import EditSupplierModal from './EditSupplier';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';

export default class Suppliers extends Component{
    constructor(props){
        super(props);
        this.state={
            suppliers:[],
            snackBaropen: false, 
            snackBarMessage: '',
            addModalShow: false,
            editModalShow: false
        };
    }

    componentDidMount(){
        this.suppliersList();
    }

    componentDidUpdate(){
        this.suppliersList();
    }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    deleteSupplier(id){
        if(window.confirm('Are you sure?')){
            axios.delete(`https://localhost:44365/api/Supplier/delete/${id}`)
            .then(res=> {
                console.log(res.data);
            })
            .catch(error=> {
                console.log(error);
            });
        }
    }

    suppliersList(){
        axios.get(`https://localhost:44365/api/Supplier/getAll`)
        .then(res=> {
            this.setState({suppliers: res.data})
        });
    }

    snackBarClose=(event)=>{
        this.setState({snackBaropen: false});
    }


    render(){
        const{suppliers, Id, Name, Number, Adress}=this.state;
        const addModalClose=()=>this.setState({addModalShow:false});
        const editModalClose=()=>this.setState({editModalShow:false});
        return(
            <div>
                {(suppliers && suppliers.length !== 0) ? (
                        <Table className='mt-4' size='sm'>
                    <thead>
                        <tr>
                            <th>Организация</th>
                            <th>Контакты</th>
                            <th>Адрес офиса</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map(supplier=>
                            <tr key={supplier.id}>
                                <td>{supplier.nameOrganization}</td>
                                <td>{supplier.number}</td>
                                <td>{supplier.adress}</td>
                                <td>
                                <ButtonToolbar>
                                    <Button 
                                    variant="light" 
                                    onClick={()=>this.setState({
                                        editModalShow: true, 
                                        Id: supplier.id,
                                        Name: supplier.nameOrganization,
                                        Number: supplier.number,
                                        Adress: supplier.adress
                                        })}>
                                    {<EditIcon/>}
                                    </Button>

                                    <div className="mr-2"></div>

                                    <Button className="mr-2"
                                    variant="light" 
                                    onClick={()=>this.deleteSupplier(supplier.id)}>
                                    {<DeleteIcon/>}
                                    </Button>

                                    <EditSupplierModal
                                    show={this.state.editModalShow}
                                    onHide={editModalClose}
                                    supplierid={Id}
                                    supplierOrg={Name}
                                    supplierNum={Number}
                                    supplierAdr={Adress}/>

                                </ButtonToolbar>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                ):(<Alert className='mt-2 d-flex justify-content-center' variant='secondary'>Список пуст</Alert>)}

                <ButtonToolbar>
                    <Button variant="light"
                        onClick={()=>{
                            this.setState({addModalShow: true})
                        }}>
                        {<AddIcon/>}Добавить нового поставщика
                    </Button>
                </ButtonToolbar>

                <AddSupplierModal
                    show={this.state.addModalShow}
                    onHide={addModalClose}>
                </AddSupplierModal>
            </div>
        )
    }
}