import React, {Component} from 'react';
import {Card, CardGroup, Row, Col} from 'react-bootstrap';
import {ButtonToolbar, Button, ButtonGroup, FormControl, Form, FormGroup} from 'react-bootstrap';
import AddProductModal from './AddProduct';
import EditProductModal from './EditProduct';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import CheckBox from '../CheckBox';
import RadioBox from '../RadioBox';


export default class Products extends Component{
    constructor(props){
        super(props);
        this.state={
            products: [],
            productsFilters: [],
            brands:[],
            types:[],
            addModalShow: false,
            editModalShow: false, 
            search: '',
            newFiltersBrands: [],
            newFiltersTypes: [],
            items: [
                {id: 1, label: 'Любой', checked: true},
                {id: 2, label: 'От большего к меньшему', checked: false},
                {id: 3, label: 'От меньшего к большему', checked: false}
            ],
            sortBy: ''
        };
    }

    componentDidMount(){
        this.brandsList();
        this.typesList();
        this.productsList();
    }

    componentDidUpdate(){
        this.productsList();
    }

    deleteProduct(id){
        if(window.confirm('Are you sure?')){
            axios.delete(`https://localhost:44365/api/Product/delete/${id}`)
            .then(res=> {
                console.log(res.data);
            })
            .catch(error=> {
                console.log(error);
            });
        }
    }

    productsList(){
        axios.get('https://localhost:44365/api/Product/getAll')
        .then(res=>{
            let list = res.data;
            let newList = list;
            if((this.state.newFiltersBrands && this.state.newFiltersBrands.length) || (this.state.newFiltersTypes && this.state.newFiltersTypes.length)){
                //if states not empty
                if(this.state.newFiltersBrands && this.state.newFiltersBrands.length){
                    newList = list.filter(a=>this.state.newFiltersBrands.indexOf(a.brandId) > -1);
                }
                if(this.state.newFiltersTypes && this.state.newFiltersTypes.length){
                    newList = newList.filter(a=>this.state.newFiltersTypes.indexOf(a.typeId) > -1);
                }
            }else{
                newList = res.data;
            }
            if(this.state.sortBy !== ''){
                this.sortList(newList, this.state.sortBy);
            }
            
            this.setState({products: res.data, productsFilters: newList});
        })
    }

    brandsList(){
        axios.get(`https://localhost:44365/api/Brand/getAll`)
        .then(res=> {
            this.setState({brands: res.data})
        });
    }

    typesList(){
        axios.get(`https://localhost:44365/api/Type/getAll`)
        .then(res=> {
            this.setState({types: res.data})
        });
    }

    searchPanel(rows){
        return rows.filter((row)=>row.name.toLowerCase().indexOf(this.state.search.toLocaleLowerCase()) > -1);
    }

    sortList(list, sortType){
        let oldList = list;
        if (sortType === 'От большего к меньшему' || sortType === 'От меньшего к большему') {
            if (sortType === 'От меньшего к большему') {
                return list.sort((a, b)=>(a.price > b.price) ? 1 : -1);
            }else if(sortType === 'От большего к меньшему'){
                return list.sort((a, b)=>(a.price < b.price) ? 1 : -1);
            }
        }else{
            list = oldList;
            return list;
        }
    }

    handleFiltersBrands=(filters)=>{
        var newFilters = [...filters];
        this.setState({newFiltersBrands: newFilters});
    }

    handleFiltersTypes=(filters)=>{
        var newFilters = [...filters];
        this.setState({newFiltersTypes: newFilters});
    }

    handleSortPrice = (sortType) => {
        
        console.log(sortType);
        this.setState({sortBy: sortType});
        //this.setState({productsFilters: this.sortList(this.state.productsFilters, this.state.sortBy)});
    }

    render(){
        const{productsFilters, brands, types, Id,  Name, Year, Brand, Type, Modal, Warranty, Amount, Supply, Price, Image, search, items, sortBy}=this.state;
        const addModalClose=()=>this.setState({addModalShow:false});
        const editModalClose=()=>this.setState({editModalShow:false});
        //const productsSorting = this.sortList(productsFilters, sortBy);
        const productsSearch = this.searchPanel(productsFilters);
        return(
            <div>
                <ButtonToolbar className='float-right'>
                    <ButtonGroup className='vertical'>
                        <RadioBox list={items} handleSort={sort=>this.handleSortPrice(sort)}/>
                        <Button variant="light"
                        onClick={()=>{
                            this.setState({addModalShow: true})
                        }}>
                        {<AddIcon/>}Добавить новый товар
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>

                <ButtonToolbar className='mt-2'>
                    <ButtonGroup className='vertical'>
                        {/*Filter by brands*/}
                        <CheckBox items={brands} sortBy='Бренды' handleFilters={filters=>this.handleFiltersBrands(filters)}/>
                        <div className="mr-2"></div>
                        {/*Filter by category(types)*/}
                        <CheckBox items={types} sortBy='Категории' handleFilters={filters=>this.handleFiltersTypes(filters)}/>
                    </ButtonGroup>
                </ButtonToolbar>

                <AddProductModal
                    show={this.state.addModalShow}
                    onHide={addModalClose}>
                </AddProductModal>
                <div className="mt-2"></div>
                {/*Search Panel*/}
                <Form>
                    <FormGroup>
                        <FormControl type="text" value={search} placeholder="Search" className="mr-sm-2"
                        onChange={(e)=>this.setState({search: e.target.value})}/>
                    </FormGroup>
                </Form>

                <CardGroup className='justify-content-md-center'>
                {productsSearch.map(product=>
                    <Row key={product.id}>
                    <Col>
                        <Card className='mr-2 mt-2' key={product.id} style={{ width: '16.5rem'}}>
                            <Card.Img variant='top' src={product.image} height='200px' alt='Error, sorry...'/>
                            <Card.Header style={{textAlign: 'center' }}>{product.name}</Card.Header>
                            <Card.Body style={{textAlign: 'left' }}>
                                <Card.Text>
                                Категория: {types.map(type=>{if(type.id === product.typeId){return type.name}})}<br/>
                                Бренд: {brands.map(brand=>{if(brand.id === product.brandId){return brand.name}})}<br/>
                                Модель: {product.modal}<br/>
                                Год выпуска: {product.year}<br/>
                                Срок гарантии: {product.warranty}<br/>
                                Количество на складе: {product.amount}<br/>
                                Поставщик(надо подумать): {product.supplyId}<br/>
                                Цена: <b>{product.price} руб.</b>
                                </Card.Text>
                                
                            </Card.Body>
                            <Card.Footer>
                                <ButtonToolbar>
                                    <Button variant="light"
                                        onClick={()=>{
                                            this.setState({
                                                editModalShow: true,
                                                Id: product.id,
                                                Name: product.name,
                                                Year: product.year,
                                                Brand: product.brandId,
                                                Type: product.typeId,
                                                Modal: product.modal,
                                                Warranty: product.warranty,
                                                Amount: product.amount,
                                                Supply: product.supplyId,
                                                Price: product.price,
                                                Image: product.image
                                            })
                                        }}>
                                        {<EditIcon/>}
                                    </Button>

                                    <div className="mr-2"></div>

                                    <Button variant="light"
                                        onClick={()=>this.deleteProduct(product.id)}>
                                        {<DeleteIcon/>}
                                    </Button>

                                    <EditProductModal
                                        show={this.state.editModalShow}
                                        onHide={editModalClose}
                                        id={Id}
                                        name={Name}
                                        year={Year}
                                        brand={Brand}
                                        type={Type}
                                        modal={Modal}
                                        warranty={Warranty}
                                        amount={Amount}
                                        supply={Supply}
                                        price={Price}
                                        image={Image}
                                        />

                                </ButtonToolbar>
                            </Card.Footer>
                        </Card>
                    </Col>
                    </Row>
                    )}
                </CardGroup>
            </div>
        )
    }
}