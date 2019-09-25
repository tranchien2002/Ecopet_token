import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Button
} from 'reactstrap';
import Token from 'constants/Token.js';
import './index.css';
class FeedPetModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currentToken: 'https://files.kyber.network/DesignAssets/tokens/eth.svg',
      name: 'ETH'
    };
  }
  handelToggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };
  changeToken = (src, name) => {
    this.setState({
      currentToken: src,
      name: name
    });
  };
  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <Row>
              <Col xs='5'>
                <Dropdown isOpen={this.state.isOpen} toggle={this.handelToggle}>
                  <DropdownToggle className='toggle'>
                    <Row>
                      <Col>
                        <img src={this.state.currentToken} width='28' alt='Token' />
                      </Col>
                      <Col>{this.state.name}</Col>
                    </Row>
                  </DropdownToggle>
                  <DropdownMenu>
                    {Token.map((item) => (
                      <DropdownItem
                        onClick={() => {
                          this.changeToken(item.src, item.name);
                        }}
                      >
                        <Row>
                          <Col>
                            <img src={item.src} width='28' alt={item.name} />
                          </Col>
                          <Col>{item.name}</Col>
                        </Row>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </Col>
              <Col xs='7'>
                <Input type='number' />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color='success' onClick={() => this.handleClick().then(this.props.toggle)}>
              Feed
            </Button>
            <Button color='danger' onClick={this.props.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default FeedPetModal;
