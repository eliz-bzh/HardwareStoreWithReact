import React, {Component} from 'react';
import {ButtonToolbar, Button, Table} from 'react-bootstrap';
import AddBrandModal from './AddBrands';
import EditBrandModal from './EditBrands';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';

export default class Brands extends Component{
    constructor(props){
        super(props);
        this.state={
            brands:[],
            snackBaropen: false, 
            snackBarMessage: '',
            addModalShow: false,
            editModalShow: false
        };
    }

    componentDidMount(){
        this.brandsList();
    }

    componentDidUpdate(){
        this.brandsList();
    }

    deleteProduct(id){
        if(window.confirm('Are you sure?')){
            axios.delete(`https://localhost:44365/api/Brand/delete/${id}`)
            .then(res=> {
                console.log(res.data);
            })
            .catch(error=> {
                console.log(error);
            });
        }
    }

    brandsList(){
        axios.get(`https://localhost:44365/api/Brand/getAll`)
        .then(res=> {
            this.setState({brands: res.data})
        });
    }

    snackBarClose=(event)=>{
        this.setState({snackBaropen: false});
    }


    render(){
        const{brands, Id,  Name}=this.state;
        const addModalClose=()=>this.setState({addModalShow:false});
        const editModalClose=()=>this.setState({editModalShow:false});
        return(
            <div>
                <Table className='mt-4' size='sm'>
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map(brand=>
                        <tr key={brand.id}>
                            <td>{brand.name}</td>
                            <td>
                            <ButtonToolbar>
                                <Button 
                                variant="success" 
                                onClick={()=>this.setState({
                                    editModalShow: true, 
                                    Id: brand.id,
                                    Name: brand.name
                                    })}>
                                {<EditIcon/>}
                                </Button>

                                <div className="mr-2"></div>

                                <Button className="mr-2"
                                variant="secondary" 
                                onClick={()=>this.deleteCat(brand.id)}>
                                {<DeleteIcon/>}
                                </Button>

                                <EditBrandModal
                                show={this.state.editModalShow}
                                onHide={editModalClose}
                                brandid={Id}
                                brandname={Name}/>

                            </ButtonToolbar>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

                <ButtonToolbar>
                    <Button variant="light"
                        onClick={()=>{
                            this.setState({addModalShow: true})
                        }}>
                        {<AddIcon/>}Добавить новый бренд
                    </Button>
                </ButtonToolbar>

                <AddBrandModal
                    show={this.state.addModalShow}
                    onHide={addModalClose}>
                </AddBrandModal>
            </div>
        )
    }
}