pragma solidity ^0.4.0;
contract ConsignmentData{
        string public MillData;
        string public LogisticsCompanyOneData;
		string public WareHouseData;
		string public LogisticsCompanyTwoData;
		string public LogisticsCompanyThreeData;
		string public ServiceCenterData;
		string public CustomerData;
		uint public blockNumber;
    

	//Add data, hash to Block Chain
	function ConsignmentData(string Mill_Data) public {
        MillData = Mill_Data;
        LogisticsCompanyOneData = '';
		WareHouseData = '';
		CustomerData = '';
		LogisticsCompanyTwoData = '';
		LogisticsCompanyThreeData = '';
		ServiceCenterData = '';
		blockNumber = block.number;
        
    }
     function SetLogisticsCompanyOneData(string LogisticsCompanyOne_Data)
     {LogisticsCompanyOneData = LogisticsCompanyOne_Data;}
     
     function SetWareHouseData(string WareHouse_Data)
     {WareHouseData = WareHouse_Data;}
     
     function SetLogisticsCompanyTwoData(string LogisticsCompanyTwo_Data)
     {LogisticsCompanyTwoData = LogisticsCompanyTwo_Data;}
     
     function SetCustomerData(string Customer_Data)
     {CustomerData = Customer_Data;}
     
     function SetLogisticsCompanyThreeData(string LogisticsCompanyThree_Data)
     {LogisticsCompanyThreeData = LogisticsCompanyThree_Data;}
     
     function SetServiceCenterData(string ServiceCenter_Data)
     {ServiceCenterData = ServiceCenter_Data;}
} 