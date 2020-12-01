import React, {Component} from 'react';
import {Modal, Row, Col, Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import SnackBar from '@material-ui/core/Snackbar';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import qs from 'querystring';

export default class AddTypeModal extends Component{

    constructor(props){
        super(props);
        this.state = {snackBaropen: false, snackBarMessage: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    snackBarClose=(event)=>{
        this.setState({snackBaropen: false});
    }

    handleSubmit=(event)=>{
        event.preventDefault();

        axios.post(`https://localhost:44365/api/Type/create?${qs.stringify({
            Name: event.target.name.value
        })}`)
        .then(res=> {
            console.log(res.data);
            this.setState({snackBaropen: true, snackBarMessage: 'Added successfully'});
        })
        .catch(error=> {
            console.log(error);
            this.setState({snackBaropen: true, snackBarMessage: 'Failed added'});
        });
    }

    render(){
        return(
            <div className='container'>
                <SnackBar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={this.state.snackBaropen}
                autoHideDuration={1000}
                onClose={this.snackBarClose}
        message={<span id='message-id'>{this.state.snackBarMessage}</span>}
        action={[
            <IconButton color="inherit" size="small"
                    onClick={this.snackBarClose}
                    ><CloseIcon/></IconButton>
        ]}/>
            <Modal
      {...this.props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавление новой категории
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
              <Row>
                  <Col sm={6}>
                      <Form onSubmit={this.handleSubmit}>
                      <Form.Group controlId="name">
                              <Form.Label>Название</Form.Label>
                              <Form.Control 
                                type="text"
                                name="name"
                                required
                                placeholder="Название"/>
                          </Form.Group>
                          <Form.Group>
                            <Button variant="light" type="submit">
                                Добавить категорию
                            </Button>
                          </Form.Group>
                      </Form>
                  </Col>
              </Row>
          
      </Modal.Body>
      <Modal.Footer>

        <Button variant="light" onClick={this.props.onHide}>
            Закрыть
        </Button>

      </Modal.Footer>
    </Modal>
    </div>
        );
    };
}