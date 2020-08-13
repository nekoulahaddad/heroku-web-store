import React, { Component} from 'react';
import { connect } from 'react-redux';
import { addReply, addComment, addItem, getItem, deleteItem } from '../actions/itemActions';
import { addToCart } from '../actions/authActions';
import PropTypes from 'prop-types';
import { Col, Row, Button, Input, Alert } from 'reactstrap';
import ReactTimeAgo from 'react-time-ago';


class Item extends Component {

    state = {
        modal: false,
        content: '',
        id: '',
        Reply_content: '',
        show_reply: false,
        ShowAndHideReply: false,
        user_id:'',
        msg:null
    };

    static propTypes = {
        loading: PropTypes.bool,
        isAuthenticated: PropTypes.bool,
        getItem: PropTypes.func.isRequired,
        deleteItem: PropTypes.func.isRequired,
        item: PropTypes.object.isRequired,
        addComment: PropTypes.func.isRequired,
        addReply: PropTypes.func.isRequired,
        user: PropTypes.object,
        addToCart: PropTypes.func.isRequired
    };


    componentDidMount() {
        this.props.getItem(this.props.match.params.id);
        if (this.props.user && this.props.user._id){
          this.setState({user_id:this.props.user._id})
        } else if (this.props.user && this.props.user.id){
           this.setState({user_id:this.props.user.id})
        }else console.log("al wade3 9a3eb")
    };


    onDeleteClick = id => {
        this.props.deleteItem(id);
        this.props.history.push("/Dashboard")
    };

    onAddToCart = id => {  
        if (this.props.isAuthenticated) {
        this.props.addToCart(id);
    }else this.props.history.push('/SignIn')
    };


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    Comment = id => {
        if (this.props.isAuthenticated) {
        const { content } = this.state;
        this.props.addComment(id, { content });
        document.getElementById("comment").value = "";
        this.setState({content:""})
        }else this.props.history.push('/SignIn')
    }

    Reply = (id, _id) => {
        if (this.props.isAuthenticated) {
        const { Reply_content } = this.state;
        this.props.addReply(id, _id, { Reply_content });
        document.getElementById(_id + "2").value = "";
        }else this.props.history.push('/SignIn')
    }


    ShowAndHide = (id) => {
        console.log(id)
        this.setState({ show_reply: !this.state.show_reply })
        if (this.state.show_reply) {
            document.getElementById(id).className = 'd-block'
        } else document.getElementById(id).className = 'd-none'
    }

    ShowAndHideReply = (id) => {
        const Id = id + "1";
        console.log(id)
        this.setState({ show_reply: !this.state.show_reply })
        if (this.state.show_reply) {
            document.getElementById(Id).className = 'd-block'
        } else document.getElementById(Id).className = 'd-none'
    }




    //toString()

    render() {
        const item = this.props.item.product;
        const img1 = "http://localhost:5000/";
        const img4 = "https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile.jpg";
        return (
          <div>
{this.state.msg ? (
<Alert color='danger'>{this.state.msg}</Alert>
) : null}
            <div>
  {!this.props.loading ?  (
    
 <React.Fragment>

 <div className="ml-3 mr-3 mt-3">
 <Row>
 <Col md={3}>
                {!item.images ? <div> <img alt="item" className="img-thumbnail img_item" src="https://via.placeholder.com/300x300/FFFFFF/000000/?text=syriashop.com" /> </div>: 
                  <div>
                  {item.images.length === 0 ? <img alt="item" className="img-thumbnail img_item"  src="https://via.placeholder.com/300x300/FFFFFF/000000/?text=syriashop.com" />:null}
                  {item.images.map((image) => (
                    <div>
                    <img alt="item" className="img-thumbnail img_item" src={`${img1}${image}`} />
                    </div>
                  ))}
                  </div>
                }
   </Col>             
  <Col md={3}>
                  <h2 className="text-success"> 
               {item.name}
                  </h2> 
                  <div> 
               {item.description}
                  </div> 
                  <div>
                  <span className='text-danger mr-3'> Price: {item.price}$ </span> 
                  {item.price_sale ? <span className='last_price'> {item.price_sale}$ </span>:null }
                  </div>              
                  {item.date ? (<span><ReactTimeAgo date={item.date} locale="en"/></span> ):null} 
                  <span><i className="fa fa-comments  batata ml-3" aria-hidden="true">{item.comment_count}</i></span>     
                         <div>
                         <Button
                      className='fa fa-shopping-cart mt-2'
                      color='success'
                      size='sm'
                      onClick={this.onAddToCart.bind(this, item._id)}
                    >
                      <span className='ml-1'>ADD TO CART</span>                      
                    </Button> 
                    {this.props.isAuthenticated && item.writer === this.state.user_id  ?
                    <Button
                      className='fa fa-trash ml-2'
                      color='danger'
                      size='sm'
                      onClick={this.onDeleteClick.bind(this, item._id)}
                    >  
                    <span className='ml-1'>DELETE ITEM</span>  
                    </Button>
                    :null 
                    }
                    </div>    
                     </Col> 
                     </Row>
                  <Input className='mb-2 mt-2' type="text" name="content" id="comment" ref="fieldComment" onChange={this.onChange} />              
                  <Button
                      className='fa fa-comments mb-2'
                      color='primary'
                      size='sm'
                      onClick={this.Comment.bind(this,item._id)}
                    >
                      <span className='ml-1'>ADD A COMMENT</span>
                      </Button>  
                      { item.comment ? (
                        <div>
                       {item.comment.map( (comment) => ( 
                          <div className='ml-1 pb-2 border-bottom mb-2' key={comment._id}>
                          {!comment.user_image ? <img alt="user" className="image_comment rounded-circle" src={img4} />:(<span> 
                          {comment.user_image.length === 0 ? <img alt="user" className="image_comment rounded-circle" src={img4} />:null}
                            <span> <img alt="user" className="image_comment rounded-circle" src={`${img1}${comment.user_image}`} /> </span>
                            </span>)}
                           <span className="font-weight-bold">{comment.user}</span> {comment.content} 
                       <div className="small"> 
                          <span className="font-weight-light"><ReactTimeAgo date={comment.date} locale="en"/></span>
                          <span className="btn-link ml-3">{comment.reply_count} replies</span>
                          <i onClick={this.ShowAndHide.bind(this,comment._id)} className="btn-link ml-3">add reply</i>
                          <i onClick={this.ShowAndHideReply.bind(this,comment._id)} className="btn-link ml-3">show replies</i>
                       </div> 
                     <div className="d-none" id={comment._id}>  
                    <Input className='mb-2 mt-2' type="text" name="Reply_content" id={`${comment._id}2`} ref="fieldComment" onChange={this.onChange} />
                    <Button
                      color='primary'
                      size='sm'
                      onClick={this.Reply.bind(this,item._id,comment._id)}
                    >
                      <span className='ml-1'>reply</span>
                      </Button>
                    </div>
                    <div className="d-none" id={`${comment._id}1`}>
                    
                    {comment.replies ? (
                      <div className="mt-2 ml-3 smaller">
                      {comment.replies.map((reply) => (
                        <div className='ml-1 pb-1 border-bottom mb-1' key={reply._id}>
                        {!reply.user_image ? <img alt="user" className="image_comment rounded-circle" src={img4} />:(
                            <span> 
                            <span> <img alt="user" className="image_comment rounded-circle" src={`${img1}${reply.user_image}`} /> </span>
                            </span>)}                       
                           <span className="font-weight-bold">{reply.user}</span><span> {reply.content}</span>        
                            <div className="small"> 
                          <span className="font-weight-light"><ReactTimeAgo date={reply.date} locale="en"/></span>
                            </div>
                        </div>
                        ))}
                      </div>
                      ):null}
                    </div>
                          </div> ))}
                       
                       </div>
                      ):null}
</div>
</React.Fragment>
 ):null }
</div>
</div>
        )
    }


}

const mapStateToProps = state => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    loading: state.item.loading
});


export default connect(mapStateToProps, { addReply, addToCart, addComment, getItem, addItem, deleteItem })(Item)