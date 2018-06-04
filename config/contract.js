const fs = require('fs');
const Web3 = require('web3');
const NodeURL = "http://13.126.168.128:22000";
const account = '0xed9d02e382b34818e88b88a309c7fe71e65f419d';
const PrivateTo = "ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc=";
const dbUrl = require("../config/db");
const contractFolder = '../contract/';
const abiandcode = require("../config/abi");
var address = '';
const mongojs = require('mongojs');
var ContractCM;

function GetContract() {
  SetWeb3();
  ContractCM = web3.eth.contract(abiandcode.abi).at(address);
}

function SetWeb3() {
  if (typeof web3 !== 'undefined') { web3 = new Web3(web3.currentProvider); }
  else { web3 = new Web3(new Web3.providers.HttpProvider(NodeURL)); }
}

module.exports = {
  PublishDataContract: function (doc, callback) {
    SetWeb3();
    web3.eth.defaultAccount = account;
    var simpleContract = web3.eth.contract(abiandcode.abi);
    var simple = simpleContract.new(doc,{ from: web3.eth.defaultAccount, data: abiandcode.smartcontractcode, gas: 30000000, privateFor: [PrivateTo] }, function (e, contract) {
      if (e) {
        console.log("err creating contract:", e);
      } else {
        if (!contract.address) {
          var transactionHash = contract.transactionHash;
          var contractaddress = contract.address;
          console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
        } else {
          var transactionHash = contract.transactionHash;
          var contractaddress = contract.address;
          console.log("Contract mined! Address: " + contract.address);
          callback('ok', contract.address);
        }
      }
    });
  },
  saveData: function (doc,addressC,callback) {
    address = addressC;
    GetContract();
    ContractCM.SetLogisticsCompanyOneData(doc, { from: web3.eth.coinbase, gas: 60000000, privateFor: [PrivateTo] });
    callback('ok');
  },
  getData: function (CMaddress, callback) {
    address = CMaddress;
    GetContract();
    var result = ContractCM.LogisticsCompanyOneData();
        callback(result);
  },
  getMillData: function (CMaddress, callback) {
    address = CMaddress;
    GetContract();
    var result = ContractCM.MillData();
        callback(result);
  },
};

/*saveLogisticsCompanyOneData: function (doc,addressC,callback) {
  address = addressC;
  GetContract();
  ContractCM.SetLogisticsCompanyOneData(doc, { from: web3.eth.coinbase, gas: 60000000, privateFor: [PrivateTo] });
  callback('ok');
},
saveWareHouseData: function (doc,addressC, callback) {
  address = addressC;
  GetContract();
  ContractCM.SetWareHouseData(doc,{ from: web3.eth.coinbase, gas: 60000000, privateFor: [PrivateTo] });
    callback("Saved");
},
saveLogisticsCompanyTwoData: function (doc,addressC, callback) {
  address = addressC;
  GetContract();
  ContractCM.SetLogisticsCompanyTwoData(doc,{ from: web3.eth.coinbase, gas: 60000000, privateFor: [PrivateTo] });
    callback("Saved");
},
saveLogisticsCompanyThreeData: function (doc,addressC, callback) {
  address = addressC;
  GetContract();
  ContractCM.SetLogisticsCompanyThreeData(doc,{ from: web3.eth.coinbase, gas: 60000000, privateFor: [PrivateTo] });
    callback("Saved");
},
saveCustomerData: function (doc,addressC, callback) {
  address = addressC;
  GetContract();
  ContractCM.SetCustomerData(doc,{ from: web3.eth.coinbase, gas: 60000000, privateFor: [PrivateTo] });
    callback("Saved");
},
saveServiceCenterData: function (doc,addressC, callback) {
  address = addressC;
  GetContract();
  ContractCM.SetServiceCenterData(doc,{ from: web3.eth.coinbase, gas: 60000000, privateFor: [PrivateTo] });
    callback("Saved");
},
PublishDataContract: function (doc, callback) {
  SetWeb3();
  web3.eth.defaultAccount = account;
  var simpleContract = web3.eth.contract(abiandcode.abi);
  var simple = simpleContract.new(doc,{ from: web3.eth.defaultAccount, data: abiandcode.smartcontractcode, gas: 30000000, privateFor: [PrivateTo] }, function (e, contract) {
    if (e) {
      console.log("err creating contract:", e);
    } else {
      if (!contract.address) {
        var transactionHash = contract.transactionHash;
        var contractaddress = contract.address;
        console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
      } else {
        var transactionHash = contract.transactionHash;
        var contractaddress = contract.address;
        console.log("Contract mined! Address: " + contract.address);
        callback('ok', contract.address);
      }
    }
  });
},
getWareHouseData: function (CMaddress, callback) {
  address = CMaddress;
  GetContract();
  var result = ContractCM.WareHouseData();
    callback(result);
},
getLogisticsCompanyTwoData: function (CMaddress, callback) {
  address = CMaddress;
  GetContract();
  var result = ContractCM.LogisticsCompanyTwoData();
    callback(result);
},
getCustomerData: function (CMaddress, callback) {
  address = CMaddress;
  GetContract();
  var result = ContractCM.CustomerData();
    callback(result);
},
getMillData: function (CMaddress, callback) {
  address = CMaddress;
  GetContract();
  var result = ContractCM.MillData();
    callback(result);
},
getLogisticsCompanyOneData: function (CMaddress, callback) {
  address = CMaddress;
  GetContract();
  var result = ContractCM.LogisticsCompanyOneData();
      callback(result);
},
getLogisticsCompanyThreeData: function (CMaddress, callback) {
  address = CMaddress;
  GetContract();
  var result = ContractCM.LogisticsCompanyThreeData();
      callback(result);
},
getServiceCenterData: function (CMaddress, callback) {
  address = CMaddress;
  GetContract();
  var result = ContractCM.ServiceCenterData();
      callback(result);
}*/