import React, { Component} from 'react';
import { connect } from 'react-redux';
import { addItem } from '../actions/itemActions';
import PropTypes from 'prop-types';
import { CustomInput, Col, Row,  Button, Form, FormGroup, Label, Input, Alert,UncontrolledAlert } from 'reactstrap';
import axios from 'axios';
import Progress from './Progress';



class Items extends Component {

    state = {
        name: '',
        price: '',
        price_sale: '',
        category: '',
        description: '',
        modal: false,
        content: '',
        id: '',
        selectedFile: null,
        Images: [],
        uploadPercentage: 0,
        validation:"is invalid"
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        addItem: PropTypes.func.isRequired,
        item: PropTypes.object.isRequired
    };



    onChangeHandler = event => {
        console.log(event.target.files[0])
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
        document.getElementById('image-preview').src = window.URL.createObjectURL(event.target.files[0])
    };

    onClickHandler = () => {
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        const config = {
            header: { 'content-type': 'multipart/form-data' },
            onUploadProgress: progressEvent => {
                this.setState({
                    uploadPercentage: parseInt(
                        Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    )
                });

                // Clear percentage
                setTimeout(() => this.setState({ uploadPercentage: 0 }), 10000);
            }
        }
        axios.post('/items/uploadImage', data, config)
            .then(response => {

                if (response.data.success) {
                    this.setState(prevState => ({
                        Images: [...prevState.Images, response.data.image]
                    }))
                    console.log("hi")

                } else {
                    console.log('Failed to save the Image in Server')

                }
            })
    }

//is-valid form-control
    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
            //validation:"is-valid" // if i need to change the class i must add to the input className={this.state.validation}
        });
    };


    onSubmit = e => {
        e.preventDefault();
        console.log(this.props.user._id,this.props.user.id)
        const newItem = {
            writer:this.props.user._id || this.props.user.id,
            name: this.state.name,
            price: this.state.price,
            price_sale: this.state.price_sale,
            images: this.state.Images,
            category: this.state.category,
            description: this.state.description,
            user:PropTypes.object.isRequired
        };

        // Add item via addItem action
        this.props.addItem(newItem);
        document.getElementById("create-item-form").reset();
        document.getElementById("image-preview").src = "https://via.placeholder.com/300x300";
        this.setState({
            selectedFile: null,
            Images: []
        })
    };


    //toString()

    render() {
        return (
            <div>
            {this.state.msg ? (
<Alert color='danger'>{this.state.msg}</Alert>
) : null}
            <div>
  { this.props.isAuthenticated ?  (
    <React.Fragment>
<Form className="navor" onSubmit={this.onSubmit} id="create-item-form">
        <FormGroup>
           <Col className="mb-2" md={4}>
           <CustomInput type="file" name="file" onChange={this.onChangeHandler} id="create-file-form"/>
           </Col>
           <Col className="mb-2" md={4}>
           <Progress percentage={this.state.uploadPercentage} />
           </Col>
           <Col md={4}>
           <img alt="item" className="img-fluid" src="https://via.placeholder.com/300x300" id="image-preview" />  
           </Col>
           <br/>        
           <Button type="button" className="mr-3 ml-3" onClick={this.onClickHandler}>Upload Image</Button> 
        </FormGroup> 
        <Row> 
        <Col md={4}>
        <FormGroup className="mr-3 ml-3">
           <Label for="Name" className="mr-sm-2">Product Name</Label>
          <Input  required type="text" name="name" id="name" onChange={this.onChange} />
        </FormGroup>
        </Col>
        <Col md={4}>
        <FormGroup className="mr-3 ml-3">
          <Label for="Price" className="mr-sm-2">Price</Label>
          <Input required type="number" name="price" id="price" onChange={this.onChange} />
        </FormGroup>
        </Col>
        <Col md={4}>
        <FormGroup className="mr-3 ml-3">
          <Label for="price_sale" className="mr-sm-2">Price without sale</Label>
          <Input  type="number" name="price_sale" id="price_sale" onChange={this.onChange} />
        </FormGroup>
        </Col>
      
        </Row> 
        <Row>
          <Col className="mr-3 ml-3" >
            <Label for="Category">Category</Label>
            <Input required type="select" name="category" onChange={this.onChange} >
            <option>Books</option>
            <option>Clothes, shoes and accessories</option>
            <option>Electronics</option>
            <option>Health and beauty</option>
            <option>Sport</option>
            <option>Pharmacy</option>
            </Input>
          </Col>
          <Col className="mr-3 ml-3" >
            <Label for="description">Description</Label>
            <Input required type="textarea" name="description" onChange={this.onChange} />
          </Col>
        </Row> 
        <Button className="mt-2 mr-3 ml-3">Submit</Button>
 </Form> 
    </React.Fragment>
 
 ):(<div className="mt-3"><UncontrolledAlert color="info">Please! Log in to continue</UncontrolledAlert></div>)}
</div>
</div>
        )
    }


}

const mapStateToProps = state => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated,
    user:state.auth.user
});


export default connect(mapStateToProps, {addItem})(Items)