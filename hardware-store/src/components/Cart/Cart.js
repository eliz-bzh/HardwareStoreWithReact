import React, { Component } from 'react';
import { Avatar } from '@material-ui/core';
import axios from 'axios';
import qs from 'querystring';
import { ButtonToolbar, ButtonGroup, Button, Table, Alert, Form } from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { deleteCartItem, updateQuantityCartItem } from '../../redux/actions/ActionsCart';
import SnackBar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ExportCSV from '../../ExcelCheck/Check';
import ScrollTop from '../ScrollTop';
import { Carousel } from '..';

import emailjs from "emailjs-com";
import { init } from "emailjs-com";
init("user_ZNDi6J5mnaAE4KFSr9mch");

class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {}, open: false, message: '', severity: '', buttonHidden: true, fileName: 'CheckOnline', dataToCheck: []
        }
    }

    componentDidMount() {
        this.user();
    }

    componentDidUpdate() {
        this.user();
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    user() {
        const { match } = this.props;
        const { login } = match.params;
        axios.get(`https://localhost:5001/api/Client/getByLogin/` + login)
            .then(res => {
                this.setState({ user: res.data })
            })
    }

    data = () => {
        const data = [];
        this.props.items.map(item => {
            let newItem = { Название: item.name, 'Цена за единицу': item.price + ' руб.', Количество: item.quantity };
            data.push(newItem);
        });
        const total = this.props.items.reduce((accumulator, product) => {
            return accumulator + product.price * product.quantity;
        }, 0);
        data.push({ Итого: total + ' руб.' });
        this.setState({ dataToCheck: data });
    }

    requestOrder = () => {
        if (this.props.items && this.props.items.length === 0) {
            this.setState({ open: true, message: 'Список пуст', severity: 'warning', buttonHidden: true });
        } else {
            let arrOrder = [];
            this.props.items.map(item => {
                arrOrder.push({ productId: item.id, quantity: item.quantity });
            })
            const totalPrice = this.props.items.reduce((accumulator, product) => {
                return accumulator + product.price * product.quantity;
            }, 0);
            axios.post(`https://localhost:5001/api/Order/makeOrder/?${qs.stringify({
                ClientId: this.state.user.id,
                TotalPrice: totalPrice
            })}`, arrOrder)
                .then(res => {
                    this.data();
                    this.setState({ open: true, message: 'Заказ оформлен', severity: 'success', buttonHidden: false });
                    this.createLetter();
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    buttonHidden = (hidden) => {
        this.setState({ buttonHidden: hidden });
    }

    date = (dateOrder) => {
        var date = new Date(dateOrder);
        return date.toLocaleDateString();
    }

    htmlMess = (user, order, products) => {
        return (
            `<div>
                        <p>Здравствуйте, ${user.name} ${user.surname}.</p>
                        <p>Ваш заказ №<b>${order.id}</b> от ${this.date(order.date)} на сумму <b>${order.totalPrice}</b>р.</p>
                        <h3>Продукты</h3>
                        <hr>
                        ${products.map(prod => {
                return (
                    `<div>
                            <br/>
                            <img src=${prod.images[0].url} alt='Error' style='float:left; margin: 7px 7px 7px 7px' height='150px' width='150px' />
                            <h3>${prod.name}</h3>
                            <h4>Кол-во: ${prod.quantity}</h4>
                            <h4><span style='color: red'>${prod.price}</span> BYN</h4><br/>
                        </div>`
                )
            })}
                        <br/><br/><hr>
                        <p>С наилучшими пожеланиями, интернет-магазин i-Bozh shop.</p>
                    </div>`
        );
    }

    createLetter() {
        const templateId = "template_o16n64t";
        const { user } = this.state;
        let products = [];
        this.props.items.map((product, index) => {
            products.push(` ${index + 1}) ${product.name} x ${product.quantity} шт.`)
        });


        axios.get(`https://localhost:5001/api/Order/getAll`)
            .then(res => {
                const order = res.data[res.data.length - 1];
                this.sendFeedback(templateId, {
                    email: user.email,
                    html: this.htmlMess(user, order, this.props.items)
                });
            })
    }

    sendFeedback(templateId, variables) {
        const { user } = this.state;
        emailjs
            .send("service_e2uee2x", templateId, variables)
            .then((res) => {
                this.setState({ open: true, message: `Письмо отправлено на почту ${user.email}`, severity: 'success' });
                console.log("Email successfully send!");
            })
            .catch((err) =>
                console.error(
                    "Oh well, you failed. Here some thoughts on the error that occured:",
                    err
                )
            );
    }

    render() {
        const { user, open, message, severity, buttonHidden, fileName, dataToCheck } = this.state;
        return (
            <div className='container'>
                <SnackBar open={open} autoHideDuration={3000} onClose={() => { this.setState({ open: false }) }}>
                    <MuiAlert onClose={() => { this.setState({ open: false }) }} severity={severity} variant="filled">
                        <b className='snackBar-label'>{message}</b>
                    </MuiAlert>
                </SnackBar>
                <h1 className='mt-2 d-flex justify-content-left align-items-center'>
                    <Avatar className='mr-2' style={{ backgroundColor: '#FF7700' }}>{(`${user.name}`).split('')[0].toLocaleUpperCase()}</Avatar>
                    {user.name + ' ' + user.surname}
                </h1>
                <h1 className='mt-2 d-flex justify-content-center align-items-center'>Корзина</h1>
                <ButtonToolbar className='mb-2 float-right'>
                    <ButtonGroup>
                        <ExportCSV hidden={buttonHidden} csvData={dataToCheck} fileName={fileName} buttonHidden={hidden => setTimeout(this.buttonHidden, 10000, hidden)} />
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button className='mr-2' variant="outline-dark" onClick={() => this.requestOrder()}>Оформить заказ</Button>
                    </ButtonGroup>
                </ButtonToolbar>
                <h5>Товаров в корзине: {this.props.items.reduce((accumulator, product) => {
                    return accumulator + product.quantity;
                }, 0)}</h5>

                <h5>Итого: <span className='price'>{this.props.items.reduce((accumulator, product) => {
                    return accumulator + product.price * product.quantity;
                }, 0)}</span> BYN</h5>

                {(this.props.items && this.props.items.length !== 0) ? (
                    <Table className='mt-4' responsive="xl">
                        <thead>
                            <tr>
                                <th>Продукт</th>
                                <th>Название</th>
                                <th>Характеристики</th>
                                <th>Количество</th>
                                <th>Цена</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.items.map(product =>
                                <tr key={product.id}>
                                    <td><Carousel images={product.images} height='150px' width='150px' /></td>
                                    <td style={{ maxWidth: '200px' }}>{product.name}</td>
                                    <td style={{ maxWidth: '210px' }}>
                                        <div>
                                            <b>Модель: </b>{product.modal}<br />
                                            <b>Год выпуска: </b>{product.year}<br />
                                            <b>Срок гарантии: </b>{product.warranty}
                                        </div>
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            required
                                            style={{ width: '80px' }}
                                            value={product.quantity}
                                            onChange={e => {
                                                let quantity = parseInt(e.target.value, 10);
                                                if (isNaN(quantity)) return 0;
                                                if (quantity < 0) return;
                                                this.props.dispatch(updateQuantityCartItem({ id: product.id, quantity }));
                                            }} />
                                    </td>
                                    <td><b className='price product'>{product.price}</b> BYN</td>
                                    <td>
                                        <Button className="mr-2"
                                            variant="ligth"
                                            onClick={() => {
                                                this.props.dispatch(deleteCartItem(product.id));
                                            }}>
                                            {<DeleteIcon />}
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                ) : (<Alert className='mt-2 d-flex justify-content-center' variant='secondary'>Список пуст</Alert>)}
                <ScrollTop />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { items: state.cartReducer.cartItems };
};

export default withRouter(connect(mapStateToProps)(Cart));