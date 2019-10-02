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
import { compose } from 'redux';
import { connect } from 'react-redux';
class FeedPetModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      currentToken: '',
      nameToken: 'ETH',
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
      nameToken: 'ETH'
    });
  }
  handelDropdownToggle = () => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen
    });
  };
  changeToken = async (src, nameToken, address) => {
    this.setState({
      currentToken: src,
      nameToken: nameToken,
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
    let rate = rateList['ETH_' + this.state.nameToken].rate_eth_now;
    let rateUSD = rateList['ETH_' + this.state.nameToken].rate_usd_now;
    let changeETH = rateList['ETH_' + this.state.nameToken].change_eth_24h;
    let changeUSD = rateList['ETH_' + this.state.nameToken].change_usd_24h;
    this.setState({
      rate: rate,
      changeETH: changeETH,
      changeUSD: changeUSD,
      rateUSD: rateUSD
    });
  };
  handleChange = async (event) => {
    this.getRate();
    this.setState({
      tokenValue: event.target.value,
      value: event.target.value * this.state.rate
    });
    let ratesRequest = await fetch(
      'https://ropsten-api.kyber.network/buy_rate?id=' +
        this.state.tokenAddress +
        '&qty=' +
        event.target.value * this.state.rate
    );
    // Parsing the output
    let rates = await ratesRequest.json();
    // Getting the source quantity
    console.log(rates);
  };
  handleChangeETH = (event) => {
    this.getRate();
    this.setState({
      value: event.target.value,
      tokenValue: event.target.value / this.state.rate
    });
  };
  handleSwapTokenClick = (value) => async () => {
    const ETH_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    // How many KNC you want to buy
    const QTY = 1000;
    // Gas price of the transaction
    const GAS_PRICE = 'medium';
    // Your Ethereum wallet addr
    const USER_ACCOUNT = this.props.tomo.account;

    let tokenInfoRequest = await fetch('https://ropsten-api.kyber.network/currencies');

    let tokens = await tokenInfoRequest.json();
    // Checking to see if KNC is supported
    let supported = tokens.data.some((token) => {
      return this.state.nameToken === token.symbol;
    });
    // If not supported, return.
    if (!supported) {
      console.log('Token is not supported');
      return;
    }

    let enabledStatusesRequest = await fetch(
      'https://ropsten-api.kyber.network/users/' + USER_ACCOUNT + '/currencies'
    );
    // Parsing the output
    let enabledStatuses = await enabledStatusesRequest.json();
    // Checking to see if DAI is enabled
    let enabled = enabledStatuses.data.some((token) => {
      if (token.id == this.state.nameToken.toLowerCase()) {
        return token.enabled;
      }
    });

    if (!enabled) {
      // Querying the API /users/<user_address>/currencies/<currency_id>/enable_data?gas_price=<gas_price> endpoint
      let enableTokenDetailsRequest = await fetch(
        'https://ropsten-api.kyber.network/users/' +
          USER_ACCOUNT +
          '/currencies/' +
          this.state.nameToken +
          '/enable_data?gas_price=' +
          GAS_PRICE
      );

      // Parsing the output
      let enableTokenDetails = await enableTokenDetailsRequest.json();
      // Extract the raw transaction details
      let rawTx = enableTokenDetails.data;
      // Broadcasting the transaction
      await this.props.tomo.web3.eth.sendTransaction(rawTx).catch((error) => console.log(error));
    }

    let ratesRequest = await fetch(
      'https://ropsten-api.kyber.network/buy_rate?id=' + this.state.tokenAddress + '&qty=' + QTY
    );
    // Parsing the output
    let rates = await ratesRequest.json();
    // Getting the source quantity
    console.log(rates);
    let srcQty = rates.data[0].src_qty;
    console.log(srcQty);

    let tradeDetailsRequest = await fetch(
      'https://ropsten-api.kyber.network/trade_data?user_address=' +
        USER_ACCOUNT +
        '&src_id=' +
        ETH_TOKEN_ADDRESS +
        '&dst_id=' +
        this.state.tokenAddress +
        '&src_qty=' +
        srcQty / 0.97 +
        '&min_dst_qty=' +
        QTY +
        '&gas_price=' +
        GAS_PRICE +
        '&destAddress=0xBF1CF3939a12239829754Cf208B649b45FD1BE9e'
    );
    let tradeDetails = await tradeDetailsRequest.json();
    // Extract the raw transaction details
    let rawTx = tradeDetails.data[0];
    await this.props.tomo.web3.eth.sendTransaction(rawTx);
    console.log(rawTx);
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
                      <Col>{this.state.nameToken}</Col>
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
                  1 {this.state.nameToken} = {Math.round(this.state.rate * 1000) / 1000} ETH ={' '}
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
const mapStateToProps = (state) => {
  return {
    tomo: state.tomo
  };
};

export default compose(connect(mapStateToProps))(FeedPetModal);
