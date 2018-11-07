$(() => {
    let Web3 = require("web3");
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    if (typeof window.web3 !== 'undefined')
    {
        injectedProvider = window.web3.currentProvider;
        web3 = new Web3(injectedProvider);
        console.log("injected provider used: " + injectedProvider);
    }
    else
    {
        alert("no injected provider found, using localhost:8545, please ensure your local node is running " +
            "and rpc and rpccorsdomain is enabled");
    }
    let tokens /* let of type bytes32[] here */ ;
    let nameOfContract /* let of type string here */ ;
    let symbolForContract /* let of type string here */ ;
    let organiserAddr /* let of type address here */ ;
    let paymasterAddr /* let of type address here */ ;
    let recipientAddr  /* let of type address here */ ;
    let ticketproContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"expiry","type":"uint256"},{"name":"indices","type":"uint256[]"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"recipient","type":"address"}],"name":"passTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"indices","type":"uint256[]"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"expiry","type":"uint256"},{"name":"tokens","type":"uint256[]"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"recipient","type":"address"}],"name":"spawnPassTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isStormBirdContract","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"expiry","type":"uint256"},{"name":"indices","type":"uint256[]"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"trade","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"endContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"myBalance","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokens","type":"uint256[]"}],"name":"loadNewtokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getDecimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"indices","type":"uint256[]"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"tokens","type":"uint256[]"},{"name":"nameOfContract","type":"string"},{"name":"symbolForContract","type":"string"},{"name":"organiserAddr","type":"address"},{"name":"paymasterAddr","type":"address"},{"name":"recipientAddr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_indices","type":"uint256[]"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_indices","type":"uint256[]"}],"name":"TransferFrom","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"seller","type":"address"},{"indexed":false,"name":"indices","type":"uint256[]"},{"indexed":false,"name":"v","type":"uint8"},{"indexed":false,"name":"r","type":"bytes32"},{"indexed":false,"name":"s","type":"bytes32"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"indices","type":"uint256[]"},{"indexed":false,"name":"v","type":"uint8"},{"indexed":false,"name":"r","type":"bytes32"},{"indexed":false,"name":"s","type":"bytes32"},{"indexed":true,"name":"recipient","type":"address"}],"name":"PassTo","type":"event"}]);

    let tokenVal = "0x00000000000000000000000000000000EF6351E10000000000000000F7";
    let contractAddr = "";
    function initWeb3() {
        //let's assume that coinbase is our account
        web3.eth.defaultAccount = web3.eth.coinbase;
        let address = web3.eth.defaultAccount;
        organiserAddr = $("#ownerAddress").val();
        paymasterAddr = address;
        recipientAddr = $("#recipientAddress").val();
        let numberOfTokens = $("#numberOfTokens").val();
        if(numberOfTokens == "") numberOfTokens = 20; //default 20
        for(let i = 0; i < numberOfTokens; i++)
        {
            tokens.push(tokenVal);
        }
        if(organiserAddr == "") organiserAddr = address;
        if(recipientAddr == "") recipientAddr = address;
        //once initialized, deploy
        deploy();
    }


    $("#deploy").click(() => {
        let eventDate = $("#eventDate").val();
        let dateTimeEvent = new Date(eventDate);
        //set all lets
        tokens = defaultTokens;
        nameOfContract = $("#eventName").val();
        symbolForContract = $("#tokensymbol").val();
        //initialize web3 then deploy
        initWeb3();
    });

    function deploy()
    {
        $("#notice").show(); //let the user know that the contract is being deployed
        let ticketpro = ticketproContract.new(
            tokens,
            nameOfContract,
            symbolForContract,
            organiserAddr,
            paymasterAddr,
            recipientAddr,
            {
                from: web3.eth.accounts[0],
                data: '0x60806040523480156200001157600080fd5b50604051620022d8380380620022d883398101806040528101908080518201929190602001805182019291906020018051820192919060200180519060200190929190805190602001909291908051906020019092919050505084600390805190602001906200008392919062000180565b5083600490805190602001906200009c92919062000180565b5082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550856000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090805190602001906200017392919062000207565b5050505050505062000281565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620001c357805160ff1916838001178555620001f4565b82800160010185558215620001f4579182015b82811115620001f3578251825591602001919060010190620001d6565b5b50905062000203919062000259565b5090565b82805482825590600052602060002090810192821562000246579160200282015b828111156200024557825182559160200191906001019062000228565b5b50905062000255919062000259565b5090565b6200027e91905b808211156200027a57600081600090555060010162000260565b5090565b90565b61204780620002916000396000f3006080604052600436106100db576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063015a0488146100ed57806306fdde03146101a65780632b4e4e9614610236578063313ce567146102bc57806332a2c5d0146102ed5780634bd13cdd146103445780634f452b9a146103fd57806370a082311461042c5780637a230791146104c457806395d89b4114610550578063bb6e7de9146105e0578063c9116b69146105f7578063cf0b41a314610663578063f0141d84146106c9578063fe60ebdc146106f4575b3480156100e757600080fd5b50600080fd5b3480156100f957600080fd5b506101a46004803603810190808035906020019092919080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290803560ff16906020019092919080356000191690602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061079a565b005b3480156101b257600080fd5b506101bb610b22565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101fb5780820151818401526020810190506101e0565b50505050905090810190601f1680156102285780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561024257600080fd5b506102ba600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290505050610bc4565b005b3480156102c857600080fd5b506102d1610e09565b604051808260ff1660ff16815260200191505060405180910390f35b3480156102f957600080fd5b50610302610e0e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561035057600080fd5b506103fb6004803603810190808035906020019092919080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290803560ff16906020019092919080356000191690602001909291908035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e16565b005b34801561040957600080fd5b50610412610fc6565b604051808215151515815260200191505060405180910390f35b34801561043857600080fd5b5061046d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610fcf565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156104b0578082015181840152602081019050610495565b505050509050019250505060405180910390f35b61054e6004803603810190808035906020019092919080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290803560ff16906020019092919080356000191690602001909291908035600019169060200190929190505050611065565b005b34801561055c57600080fd5b506105656113d0565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156105a557808201518184015260208101905061058a565b50505050905090810190601f1680156105d25780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156105ec57600080fd5b506105f5611472565b005b34801561060357600080fd5b5061060c611509565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561064f578082015181840152602081019050610634565b505050509050019250505060405180910390f35b34801561066f57600080fd5b506106c76004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929050505061159d565b005b3480156106d557600080fd5b506106de6116bb565b6040518082815260200191505060405180910390f35b34801561070057600080fd5b50610798600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843782019150505050505091929192905050506116c6565b005b6000806000806000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156107fe57600080fd5b428b118061080c575060008b145b151561081757600080fd5b61082360008c8c61197f565b94506001858a8a8a604051600081526020016040526040518085600019166000191681526020018460ff1660ff1681526020018360001916600019168152602001826000191660001916815260200194505050505060206040516020810390808403906000865af115801561089c573d6000803e3d6000fd5b505050602060405103519350600092505b8951831015610a585789838151811015156108c457fe5b90602001906020020151915060008060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208381548110151561091d57fe5b90600052602060002001541415151561093257fe5b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208281548110151561097d57fe5b906000526020600020015490506000808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190806001815401808255809150509060018203906000526020600020016000909192909190915055506000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002082815481101515610a3d57fe5b906000526020600020016000905582806001019350506108ad565b8573ffffffffffffffffffffffffffffffffffffffff167fcf7370598f037d339864eec2202ca184ad6af5b4a0f56335d83f97ed76bafcc08b8b8b8b60405180806020018560ff1660ff16815260200184600019166000191681526020018360001916600019168152602001828103825286818151815260200191508051906020019060200280838360005b83811015610aff578082015181840152602081019050610ae4565b505050509050019550505050505060405180910390a25050505050505050505050565b606060038054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bba5780601f10610b8f57610100808354040283529160200191610bba565b820191906000526020600020905b815481529060010190602001808311610b9d57829003601f168201915b5050505050905090565b600080600091505b8251821015610d74578282815181101515610be357fe5b90602001906020020151905060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002082815481101515610c3c57fe5b906000526020600020015414151515610c5157fe5b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002082815481101515610cda57fe5b906000526020600020015490806001815401808255809150509060018203906000526020600020016000909192909190915055506000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081815481101515610d5957fe5b90600052602060002001600090558180600101925050610bcc565b8373ffffffffffffffffffffffffffffffffffffffff167fe686f544bebf771086ba37332b79700699709d579b7f72305990159c994f07dc846040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610df0578082015181840152602081019050610dd5565b505050509050019250505060405180910390a250505050565b600081565b600030905090565b600080600042891180610e295750600089145b1515610e3457600080fd5b610e4060008a8a611cb1565b9250600183888888604051600081526020016040526040518085600019166000191681526020018460ff1660ff1681526020018360001916600019168152602001826000191660001916815260200194505050505060206040516020810390808403906000865af1158015610eb9573d6000803e3d6000fd5b505050602060405103519150600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141515610f2157600080fd5b600090505b8751811015610fbb576000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208882815181101515610f7b57fe5b9060200190602002015190806001815401808255809150509060018203906000526020600020016000909192909190915055508080600101915050610f26565b505050505050505050565b60006001905090565b60606000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561105957602002820191906000526020600020905b815481526020019060010190808311611045575b50505050509050919050565b600080600080428911806110795750600089145b151561108457600080fd5b61108f348a8a61197f565b9350600184888888604051600081526020016040526040518085600019166000191681526020018460ff1660ff1681526020018360001916600019168152602001826000191660001916815260200194505050505060206040516020810390808403906000865af1158015611108573d6000803e3d6000fd5b505050602060405103519250600091505b87518210156112c157878281518110151561113057fe5b90602001906020020151905060008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208281548110151561118957fe5b90600052602060002001541415151561119e57fe5b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208281548110151561122757fe5b906000526020600020015490806001815401808255809150509060018203906000526020600020016000909192909190915055506000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020818154811015156112a657fe5b90600052602060002001600090558180600101925050611119565b8273ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f19350505050158015611307573d6000803e3d6000fd5b508273ffffffffffffffffffffffffffffffffffffffff167f951553379d49c26bc057f41de147adc24a09bda33b6b23374354bfbfb96edae88989898960405180806020018560ff1660ff16815260200184600019166000191681526020018360001916600019168152602001828103825286818151815260200191508051906020019060200280838360005b838110156113af578082015181840152602081019050611394565b505050509050019550505050505060405180910390a2505050505050505050565b606060048054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156114685780601f1061143d57610100808354040283529160200191611468565b820191906000526020600020905b81548152906001019060200180831161144b57829003601f168201915b5050505050905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156114ce57600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b60606000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561159357602002820191906000526020600020905b81548152602001906001019080831161157f575b5050505050905090565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156115fb57600080fd5b600090505b81518110156116b757600080600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020828281518110151561167757fe5b9060200190602002015190806001815401808255809150509060018203906000526020600020016000909192909190915055508080600101915050611600565b5050565b60008060ff16905090565b600080600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561172557600080fd5b600091505b82518210156118d257828281518110151561174157fe5b90602001906020020151905060008060008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208281548110151561179a57fe5b9060005260206000200154141515156117af57fe5b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208281548110151561183857fe5b906000526020600020015490806001815401808255809150509060018203906000526020600020016000909192909190915055506000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020818154811015156118b757fe5b9060005260206000200160009055818060010192505061172a565b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167f3f71f503a67da1e0976d8db0bf27a70c489cfa62b09f963c3feee3c2af0a3259856040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561196557808201518184015260208101905061194a565b505050509050019250505060405180910390a35050505050565b6000606060008060028551026054016040519080825280601f01601f1916602001820160405280156119c05781602001602082028038833980820191505090505b5092506119cb610e0e565b9150600090505b6020811015611a335780600802879060020a0260010283828151811015156119f657fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535080806001019150506119d2565b600090505b6020811015611a9c5780600802869060020a026001028360208301815181101515611a5f57fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508080600101915050611a38565b600090505b6014811015611b205780600802826c01000000000000000000000000026bffffffffffffffffffffffff19169060020a028382604001815181101515611ae357fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508080600101915050611aa1565b600090505b8451811015611c425760088582815181101515611b3e57fe5b906020019060200201519060020a90047f0100000000000000000000000000000000000000000000000000000000000000028360028302605401815181101515611b8457fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508481815181101515611bc257fe5b906020019060200201517f0100000000000000000000000000000000000000000000000000000000000000028360016002840260540101815181101515611c0557fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508080600101915050611b25565b826040518082805190602001908083835b602083101515611c785780518252602082019150602081019050602083039250611c53565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902093505050509392505050565b60006060600080600060208651026054016040519080825280601f01601f191660200182016040528015611cf45781602001602082028038833980820191505090505b509350611cff610e0e565b9250600091505b6020821015611d675781600802889060020a026001028483815181101515611d2a57fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508180600101925050611d06565b600091505b6020821015611dd05781600802879060020a026001028460208401815181101515611d9357fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508180600101925050611d6c565b600091505b6014821015611e545781600802836c01000000000000000000000000026bffffffffffffffffffffffff19169060020a028483604001815181101515611e1757fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508180600101925050611dd5565b600091505b8551821015611fab578582815181101515611e7057fe5b906020019060200201517f0100000000000000000000000000000000000000000000000000000000000000028460208402605401815181101515611eb057fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600190505b6020811015611f9e5760088683815181101515611efe57fe5b906020019060200201519060020a90048683815181101515611f1c57fe5b906020019060200201818152507f01000000000000000000000000000000000000000000000000000000000000000284826020850260540101815181101515611f6157fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508080600101915050611ee5565b8180600101925050611e59565b836040518082805190602001908083835b602083101515611fe15780518252602082019150602081019050602083039250611fbc565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902094505050505093925050505600a165627a7a72305820dd32760b24e8cfeaf2fa1022551726b4f6fcaaffd25ac7918bfe7a97fe5df7ca0029',
                gas: '4700000'
            },
            function (e, contract)
            {
                console.log(e, contract);
                if(e)
                {
                    alert(e);
                    return;
                }
                if (typeof contract.address !== 'undefined')
                {
                    contractAddr = contract.address;
                    alert('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                    //set xcontract button
                    $("#viewOnXContract").show().click(() =>
                    {
                        let url = "https://xcontract.herokuapp.com/api/" + JSON.stringify(ticketpro.abi) + "/" + contract.address;
                        window.location.href = url
                    });
                    $("#viewOnEtherscan").show().click(() => {
                        redirectToEtherscan(contract.address);
                    });
                    $("#addMoreTokens").show();
                }
            });
    }

    $("#addMoreTokensButton").click(() =>
    {
        let contract = ticketproContract.at(contractAddr);
        let tokens = $("#addMoreTokens").val();
        let tokensToAdd = [];
        for(let i = 0; i < tokens; i++)
        {
            tokensToAdd.push(tokenVal);
        }
        contract.loadNewTickets.sendTransaction(tokensToAdd, (err, data) =>
        {
            if(err)
            {
                alert(err);
            }
            else
            {
                alert("Tx submitted: " + data);
            }
        })
    });

    function redirectToEtherscan(address)
    {
        web3.version.getNetwork((err, networkId) => {
            if (networkId == 3) window.location.href = "https://ropsten.etherscan.io/address/" + address;
            else if (networkId == 4) window.location.href = "https://rinkeby.etherscan.io/address/" + address;
            else if (networkId == 42) window.location.href = "https://kovan.etherscan.io/address/" + address;
            else window.location.href = "https://etherscan.io/address/" + address;
        });
    }
});
