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
      isDropdownOpen: false,
      currentToken: '',
      name: 'ETH',
      tokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      value: 1,
      tokenValue: 0,
      rate: 0,
      changeETH: 0,
      changeUSD: 0,
      rateUSD: 0
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      value: props.value,
      currentToken: 'https://files.kyber.network/DesignAssets/tokens/eth.svg',
      name: 'ETH'
    });
  }
  handelDropdownToggle = () => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen
    });
  };
  changeToken = async (src, name, address) => {
    this.setState({
      currentToken: src,
      name: name,
      tokenAddress: address
    });
    await this.getRate();
    this.setState({
      value: this.state.tokenValue * this.state.rate
    });
  };
  getRate = async () => {
    let ratesRequest = await fetch('https://api.kyber.network/change24h');
    let rateList = await ratesRequest.json();
    let rate = rateList['ETH_' + this.state.name].rate_eth_now;
    let rateUSD = rateList['ETH_' + this.state.name].rate_usd_now;
    let changeETH = rateList['ETH_' + this.state.name].change_eth_24h;
    let changeUSD = rateList['ETH_' + this.state.name].change_usd_24h;
    this.setState({
      rate: rate,
      changeETH: changeETH,
      changeUSD: changeUSD,
      rateUSD: rateUSD
    });
  };
  handleChange = (event) => {
    this.getRate();
    this.setState({
      tokenValue: event.target.value,
      value: event.target.value * this.state.rate
    });
  };
  handleChangeETH = (event) => {
    this.getRate();
    this.setState({
      value: event.target.value,
      tokenValue: event.target.value / this.state.rate
    });
  };
  handleSwapTokenClick = (value) => () => {
    //TODO: swap token
    this.props.toggle();
  };
  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <b>From:</b>
              </Col>
              <Col></Col>
              <Col>
                <b>To: </b>
              </Col>
              <Col></Col>
            </Row>
            <Row>
              <Col xs='3'>
                <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.handelDropdownToggle}>
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
                        key={item.name}
                        onClick={() => {
                          this.changeToken(item.src, item.name, item.address);
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
              <Col xs='3'>
                <Row>
                  <Input type='number' value={this.state.tokenValue} onChange={this.handleChange} />
                </Row>
              </Col>
              <Col xs='3'>
                <Dropdown>
                  <DropdownToggle className='toggle'>
                    <Row>
                      <Col>
                        <img
                          src='https://files.kyber.network/DesignAssets/tokens/eth.svg'
                          width='28'
                          alt='Token'
                        />
                      </Col>
                      <Col>ETH</Col>
                    </Row>
                  </DropdownToggle>
                </Dropdown>
              </Col>
              <Col xs='3'>
                <Row>
                  <Input type='number' value={this.state.value} onChange={this.handleChangeETH} />
                </Row>
              </Col>
            </Row>
            <Row>
              <Col></Col>
              <Col>
                <div className='rate'>
                  1 {this.state.name} = {Math.round(this.state.rate * 1000) / 1000} ETH ={' '}
                  {Math.round(this.state.rateUSD * 1000) / 1000} USD
                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Col>
              <p
                style={{
                  color: this.state.changeETH >= 0 ? 'green' : 'red'
                }}
              >
                ETH: {Math.round(this.state.changeETH * 1000) / 1000} %
              </p>
            </Col>
            <Col>
              <p
                style={{
                  color: this.state.changeUSD >= 0 ? 'green' : 'red'
                }}
              >
                USD: {Math.round(this.state.changeUSD * 1000) / 1000} %
              </p>
            </Col>
            <Button color='success' onClick={this.handleSwapTokenClick(this.state.value)}>
              Swap
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
