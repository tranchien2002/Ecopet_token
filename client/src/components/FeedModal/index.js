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
import KyberNetworkProxy from 'constants/KyberNetworkProxy.json';
import ERC20ABI from 'constants/ERC20ABI.json';

class FeedPetModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currentToken: 'https://files.kyber.network/DesignAssets/tokens/eth.svg',
      name: 'ETH',
      tokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      value: props.value,
      rate: '',
      changeETH: '',
      changeUSD: '',
      rateUSD: ''
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      value: props.value,
      currentToken: 'https://files.kyber.network/DesignAssets/tokens/eth.svg',
      name: 'ETH'
    });
  }
  handelToggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };
  changeToken = (src, name, address) => {
    this.setState({
      currentToken: src,
      name: name,
      tokenAddress: address
    });
    this.getRate();
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
      rateUSD: rateUSD,
      value: this.props.value / rate
    });
    console.log(rateList['ETH_KNC'].change_usd_24h);
  };
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };
  handleClick = async () => {
    // console.log(this.props.tomo);
    // const ETH_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    // // KNC contract address on Ropsten
    // const KNC_TOKEN_ADDRESS = '0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6';
    // // How many KNC you want to buy
    // const QTY = 300;
    // // Gas price of the transaction
    // const GAS_PRICE = 'medium';
    // // Your Ethereum wallet addr
    // const USER_ACCOUNT = this.props.tomo.account;
    // let tokenInfoRequest = await fetch('https://ropsten-api.kyber.network/currencies');
    // let tokens = await tokenInfoRequest.json();
    // // Checking to see if KNC is supported
    // let supported = tokens.data.some((token) => {
    //   return 'KNC' == token.symbol;
    // });
    // // If not supported, return.
    // if (!supported) {
    //   console.log('Token is not supported');
    //   return;
    // }
    // let ratesRequest = await fetch(
    //   'https://ropsten-api.kyber.network/buy_rate?id=' + KNC_TOKEN_ADDRESS + '&qty=' + QTY
    // );
    // // Parsing the output
    // let rates = await ratesRequest.json();
    // // Getting the source quantity
    // let srcQty = rates.data[0].src_qty;
    // console.log(srcQty);
    // let tradeDetailsRequest = await fetch(
    //   'https://ropsten-api.kyber.network/trade_data?user_address=' +
    //     USER_ACCOUNT +
    //     '&src_id=' +
    //     ETH_TOKEN_ADDRESS +
    //     '&dst_id=' +
    //     KNC_TOKEN_ADDRESS +
    //     '&src_qty=' +
    //     srcQty / 0.97 +
    //     '&min_dst_qty=' +
    //     QTY +
    //     '&gas_price=' +
    //     GAS_PRICE +
    //     '&destAddress=0xBF1CF3939a12239829754Cf208B649b45FD1BE9e'
    // );
    // let tradeDetails = await tradeDetailsRequest.json();
    // Extract the raw transaction details
    // let rawTx = tradeDetails.data[0];
    // await this.props.tomo.web3.eth.sendTransaction(rawTx);
    // console.log(rawTx);
    // const src = '0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6'; // KNC
    // const srcAmount = new this.props.tomo.web3.utils.BN('10000000000');
    // const dest = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'; // ETH
    // const destAddress = '0xBF1CF3939a12239829754Cf208B649b45FD1BE9e';
    // const maxDestAmount = new this.props.tomo.web3.utils.BN(Math.pow(2, 255).toString);
    // const minConversionRate = new this.props.tomo.web3.utils.BN('357838186229160000000');
    // const walletId = '0x0000000000000000000000000000000000000000';
    // const kyberNetworkProxy = new this.props.tomo.web3.eth.Contract(
    //   KyberNetworkProxy,
    //   '0x818e6fecd516ecc3849daf6845e3ec868087b755',
    //   {
    //     transactionConfirmationBlocks: 1
    //   }
    // );
    // let transactionData = kyberNetworkProxy.methods
    //   .trade(src, srcAmount, dest, destAddress, maxDestAmount, minConversionRate, walletId)
    //   .encodeABI();
    // await this.props.tomo.web3.eth.sendTransaction({
    //   from: '0x00e77B93a2f36385c9A7e924d3448f56CC448Ff2', //obtained from web3 interface
    //   to: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
    //   data: transactionData,
    //   value: 0
    // });
    // let srcTokenContract = new this.props.tomo.web3.eth.Contract(
    //   ERC20ABI,
    //   '0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6'
    // );
    // let transactionData = srcTokenContract.methods
    //   .approve('0x818e6fecd516ecc3849daf6845e3ec868087b755', '100000000000')
    //   .encodeABI();
    // let getAllowance = await srcTokenContract.methods
    //   .allowance(
    //     '0x00e77B93a2f36385c9A7e924d3448f56CC448Ff2',
    //     '0x818e6fecd516ecc3849daf6845e3ec868087b755'
    //   )
    //   .call({ from: '0x00e77B93a2f36385c9A7e924d3448f56CC448Ff2' });
    // let dataAllowance = await this.props.tomo.web3.eth.sendTransaction({
    //   from: '0x00e77B93a2f36385c9A7e924d3448f56CC448Ff2',
    //   to: '0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6',
    //   data: getAllowance
    // });
    // await this.props.tomo.web3.eth
    //   .sendTransaction({
    //     from: '0x00e77B93a2f36385c9A7e924d3448f56CC448Ff2', //obtained from website interface Eg. Metamask, Ledger etc.
    //     to: '0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6',
    //     data: transactionData
    //   })
    //   .catch((error) => console.log(error));
    // let transactionData = kyberNetworkProxy.methods
    //   .trade(
    //     '0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6', //ERC20 srcToken
    //     '1000000000', //uint srcAmount
    //     '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', //ERC20 destToken
    //     '0xBF1CF3939a12239829754Cf208B649b45FD1BE9e', //address destAddress
    //     '57896044618658097711785492504343953926634992332820282019728792003956564819968', //uint maxDestAmount
    //     '357838186229160000000', //uint minConversionRate
    //     0 //uint walletId
    //   )
    //   .encodeABI();
    // await this.props.tomo.web3.eth
    //   .sendTransaction({
    //     from: '0x00e77B93a2f36385c9A7e924d3448f56CC448Ff2', //obtained from website interface Eg. Metamask, Ledger etc.
    //     to: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
    //     data: transactionData
    //   })
    //   .catch((error) => console.log(error));
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
              <Col xs='7'>
                <Row>
                  <Input type='text' value={this.state.value} onChange={this.handleChange} />
                </Row>
                <Row>
                  <div className='rate'>
                    {this.state.name} = {Math.round(this.state.rate * 1000) / 1000} ETH ={' '}
                    {Math.round(this.state.rateUSD * 1000) / 1000} USD
                  </div>
                </Row>
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

const mapStateToProps = (state) => {
  return {
    tomo: state.tomo
  };
};

export default compose(connect(mapStateToProps))(FeedPetModal);
