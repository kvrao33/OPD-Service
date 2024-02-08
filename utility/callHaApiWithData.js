import axios from 'axios'
import knexInstance from '../dbconfig.js';
import logger from '../gcpLogger.js';

function getCurrentTimestamp() {
    const currentTimestamp = new Date();
    currentTimestamp.setHours(currentTimestamp.getHours() + 12);
    currentTimestamp.setMinutes(currentTimestamp.getMinutes() + 30);
    
    const year = currentTimestamp.getFullYear();
    const month = String(currentTimestamp.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentTimestamp.getDate()).padStart(2, '0');
    const hours = String(currentTimestamp.getHours()).padStart(2, '0');
    const minutes = String(currentTimestamp.getMinutes()).padStart(2, '0');
    const seconds = String(currentTimestamp.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentTimestamp.getMilliseconds()).padStart(6, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  function changeRelationName(insuredData){
    insuredData.forEach((val=>{
        if(val.insured_rel){
            switch (val.insured_rel.toLowerCase()) {
                case "wife":
                    val.insured_rel="WIFE";
                    break;
                case "spouse":
                    if(val.insured_gender.toUpperCase()==="F"||val.insured_gender.toUpperCase()==="FEMALE")
                    val.insured_rel="WIFE";
                    else
                    val.insured_rel="HUSBAND";
                        break;
                case "husband":
                    val.insured_rel="HUSBAND";
                    break;
                case "son":
                case "dependent son":
                    val.insured_rel="SON";
                    break;
                case "daughter":
                case "dependent daughter":
                    val.insured_rel="DAUGHTER";
                    break;
                case "father":    
                case "dependent father":
                    val.insured_rel="FATHER";
                    break;
                case "mother":
                case "dependent mother":
                    val.insured_rel="MOTHER";
                    break;
                case "father in law":
                case "dependent father-in-law":
                case "dependent father in law":
                    val.insured_rel="FATHER-IN-LAW";
                    break;
                case "mother in law":
                case "dependent mother-in-law":
                case "dependent mother in law":
                    val.insured_rel="MOTHER-IN-LAW";
                    break;
                case "sister":
                    val.insured_rel="SISTER";
                    break;
                case "brother":
                    val.insured_rel="BROTHER";
                    break;  
                default:
                    val.insured_rel="OTHER";
                    break;
            }
        }
    }))
    return insuredData
}

function removeDuplicatesByKey(arr, key) {
    var uniqueData = [];
    var seen = {};
  
    arr.forEach(function (item) {
      var keyValue = item[key];
  
      if (!seen[keyValue]) {
        seen[keyValue] = true;
        uniqueData.push(item);
      }
    });
  
    return uniqueData;
  }

async function callHaAPI(input) {
    const authApiUrl = 'https://live.healthassure.in/webapi/apiv2/client/authorize';
    const registerApiUrl = 'https://live.healthassure.in/webapi/apiv2/Client/RetailOPDCustomerRegistration';
    const authApiHeaders = {
        'X-Client-Id': 'HDFCERGO0101',
        'X-Client-Secret': 'ERGOOKAYHDFC2399' // example additional header
    };
    let isError=false;

    var successData = {
        created_by: "Application Integration",
        partner_code: input.partner_code,
        policy_number: input.policy_number,
        registration_status: "N",
        proposal_number: input.proposal_number,
        created_dt: getCurrentTimestamp(),
        updated_dt: getCurrentTimestamp()
    };

    let errorData={
        partner_code: input.partner_code,
        created_by: "Node js microservice",
        policy_number: input.policy_number,
        proposal_number: input.proposal_number,
        created_dt: getCurrentTimestamp(),
        updated_dt: getCurrentTimestamp()
    };
    var insured_details
    try {
        
        var insured_details=JSON.parse(input.insured_details);
    } catch (error) {
        var insured_details=input.insured_details;
    }

    try {
        const authenticationResponse = await axios.get(authApiUrl, { headers:authApiHeaders});
        console.log("Authentication");
        if(authenticationResponse.data.status){
            var selfInsuredDetails = insured_details[0];
            if(input.policy_type && input.policy_type.toLowerCase() !== "individual"){
                var data=insured_details.find(item => {
                    if(item.insured_rel && item.insured_rel.toLowerCase() === "self")
                    return true;
                    return false;
                    })
               selfInsuredDetails =data ? data : selfInsuredDetails;
            }
    
                // Prepare API input
                var apiInput = {
                    PolicyNo: input.policy_number,
                    MemberID: selfInsuredDetails.insured_member_id,
                    CustomerName: selfInsuredDetails.insured_name,
                    CustomerEmail: input.cust_email,
                    CustomerMobile: input.cust_mobile,
                    PolicyExpiryDate: input.risk_end_date,
                    DoB: selfInsuredDetails.insured_dob ? selfInsuredDetails.insured_dob.split('/').reverse().join('-') : null,
                    Gender: selfInsuredDetails.insured_gender,
                    RiskStartDate: input.risk_start_date,
                    FirstPolicyInceptionDate: selfInsuredDetails.firstpolicyinceptiondate ? selfInsuredDetails.firstpolicyinceptiondate.split('/').reverse().join('-') : null,
                    BusinessType: input.business_type,
                    PremiumwithoutGST: input.total_prem_withoust_gst,
                    PlanCode: input.plan_code,
                };
                apiInput.UserAddress = {
                     Address: input.city_district,
                     PinCode: input.cust_pincode,
                    State: input.cust_state,
                    AddressType: "Home",
                };
            
             // Include additional insured members if it's not an individual policy
                if (input.policy_type && input.policy_type.toLowerCase() !== "individual") {
                    var nonSelfInsuredDetails = insured_details.filter(item => {
                    if(item.insured_rel && item.insured_rel.toLowerCase() !== "self") // self data is not needed in list
                    return true;
                    return false;
                    });
                        nonSelfInsuredDetails = changeRelationName(removeDuplicatesByKey(nonSelfInsuredDetails,'insured_member_id'));
                    apiInput.RelationList = nonSelfInsuredDetails.map(data =>{return {
                        Name: data.insured_name,
                        Gender: data.insured_gender,
                        MemberID:data.insured_member_id,
                        DoB: data.insured_dob ? data.insured_dob.split('/').reverse().join('-') : null,
                        RelationName: data.insured_rel.toUpperCase() === "SPOUSE" ? (data.insured_gender.toUpperCase() === "M" ? "HUSBAND" : "WIFE") : data.insured_rel.toUpperCase(),
                    }});
                }
                try {
                  const registerApiResponse =  await axios.post(registerApiUrl,apiInput,{headers:{authorization:"Bearer "+authenticationResponse.data.Results.Table[0].token}});
                  if (registerApiResponse.status===200 && registerApiResponse.data.status) {
                    successData.registration_status="Y";
                    successData.partner_username=registerApiResponse.data.Results.Table[0].UserName;
                    logger.info(successData)
                  }else{
                    errorData.error_dtls=`Status ${registerApiResponse.status} from Registration API , ResponseBody : ${JSON.stringify(registerApiResponse.data)}`
                    logger.error(JSON.stringify(errorData))
                    isError=true
                  }
                } catch (error) {
                    errorData.error_dtls=`Status ${error.response.status} from Auth Registration API , ResponseBody : ${JSON.stringify(error)}`
                    logger.error(JSON.stringify(errorData))
                    isError=true
                }
    
        }else{
            errorData.error_dtls=`Status ${authenticationResponse.status} from Auth API , ResponseBody : ${JSON.stringify(authenticationResponse.data)}`;
            logger.error(JSON.stringify(errorData));
            isError=true
        }
    } catch (error) {
        errorData.error_dtls=`Status ${error.response.status} from Auth API , ResponseBody : ${JSON.stringify(error)}`
        logger.error(errorData)
        isError=true
    } finally{

        if(isError){
            await knexInstance("opd.opd_policy_partner_err_dtls").insert(errorData);
            console.log("inserting Error data");
        }
        await knexInstance("opd.opd_policy_partner_details").insert(successData);
        console.log("inserting success data");
        await knexInstance.destroy()
        return true 
    }

   
}

export default callHaAPI;