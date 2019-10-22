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

const KYBER_NETWORK_PROXY_ADDRESS = '0x818e6fecd516ecc3849daf6845e3ec868087b755';

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
      rateUSD: '',
      approved: true,
      approving: false
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
  changeToken = async (src, name, address) => {
    this.setState({
      currentToken: src,
      name: name,
      tokenAddress: address
    });
    const allowance = await this.getAllowance(address);
    console.log('allowance', allowance);
    await this.getRate();
    if (allowance >= this.state.value * 10 ** 18) {
      this.setState({ approved: true });
    } else {
      this.setState({ approved: false });
    }
    console.log('value', this.state.value);
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
      value: Math.floor(this.props.value / rate)
    });
  };
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };
  getAllowance = async (erc20Address) => {
    let srcTokenContract = new this.props.tomo.web3.eth.Contract(ERC20ABI, erc20Address);
    let allowanceAmount = await srcTokenContract.methods
      .allowance(this.props.tomo.account, KYBER_NETWORK_PROXY_ADDRESS)
      .call();
    return allowanceAmount;
  };
  handleClick = async () => {
    const src = this.state.tokenAddress;
    const amount = parseInt(this.state.value);
    const srcAmount = new this.props.tomo.web3.utils.BN(amount.toString() + '000000000000000000');
    const dest = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    const maxDestAmount = new this.props.tomo.web3.utils.BN(Math.pow(2, 255).toString());
    const minConversionRate = new this.props.tomo.web3.utils.BN('55555');
    const kyberNetworkProxy = new this.props.tomo.web3.eth.Contract(
      KyberNetworkProxy,
      KYBER_NETWORK_PROXY_ADDRESS,
      {
        transactionConfirmationBlocks: 1
      }
    );

    if (src === dest) {
      debugger
      await this.props.petInstance.methods
        .savingMoney(this.state.value)
        .send({ from: this.props.tomo.account, value: srcAmount })
        .on('transactionHash', (hash) => {
          this.props.feedAction();
        })
        .on('receipt', (receipt) => {
          this.props.getPetInfo();
        })
        .on('error', () => {
          alert('Transaction failed');
        });
      return;
    }
    let srcTokenContract = new this.props.tomo.web3.eth.Contract(ERC20ABI, src);

    let allowanceAmount = await this.getAllowance(src);
    if (parseInt(allowanceAmount) >= amount * 10 ** 18) {
      let transactionData = kyberNetworkProxy.methods
        .trade(
          src, //ERC20 srcToken
          srcAmount, //uint srcAmount
          dest, //ERC20 destToken
          this.props.petAddress, //address destAddress
          maxDestAmount, //uint maxDestAmount
          minConversionRate, //uint minConversionRate
          0 //uint walletId
        )
        .encodeABI();
      await this.props.tomo.web3.eth
        .sendTransaction({
          from: this.props.tomo.account, //obtained from website interface Eg. Metamask, Ledger etc.
          to: KYBER_NETWORK_PROXY_ADDRESS,
          data: transactionData
        })
        .catch((error) => console.log(error));
    } else {
      let transactionData = await srcTokenContract.methods
        .approve(KYBER_NETWORK_PROXY_ADDRESS, srcAmount)
        .encodeABI();

      await this.props.tomo.web3.eth
        .sendTransaction({
          from: this.props.tomo.account, //obtained from your wallet application
          to: this.state.tokenAddress,
          data: transactionData
        })
        .on('transactionHash', (hash) => {
          this.setState({ approving: true });
        })
        .on('receipt', (reciept) => {
          this.setState({ approved: true });
        });
    }
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
            {this.state.approved ? (
              <Button color='success' onClick={() => this.handleClick().then(this.props.toggle)}>
                Feed
              </Button>
            ) : (
              <Button color='warning' onClick={() => this.handleClick().then(this.props.toggle)}>
                Approve
              </Button>
            )}
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
