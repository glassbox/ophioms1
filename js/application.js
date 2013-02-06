
var  username='ophio.dev@ophio.onmicrosoft.com';
var  password='Ophio2013';
var  CRMUrl = "https://ophio.api.crm.dynamics.com/XrmServices/2011/Organization.svc";
var  accountId ='B7DE3AA1-CE69-E211-8C05-78E3B510FDDB';
var  userId = '37176FFD-C5B8-4E3A-8CA0-7872BA83626E';
var  URNAddress;
var  STSEndPoint;
var  securityToken0;
var  securityToken1;
var  keyIdentifier ;
 var mainPooTimer;


$(document).ready(function() {


    // are we running in native app or in browser?
    window.isphone = false;


    if((document.URL.indexOf("http") == -1) && (document.URL.indexOf("file")==-1) ) {
        window.isphone = true;
    }

     onDeviceReady();
    if(window.isphone || true) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});

function onDeviceReady() {

  $.support.cors = true;
  $.mobile.allowCrossDomainPages = true;
  $.mobile.loadingMessageTextVisible = true;

  $('#doTest5').on('click', function(event,ui) {

     getGeolocation();
     event.preventDefault();
});

   init();

}


function getWsdl()
{


     $.ajax({
	     type: "GET",

	     dataType: "xml",
	     crossDomain:true,
         contentType: "application/soap+xml; charset=UTF-8",
	     url: "https://ophio.api.crm.dynamics.com/XrmServices/2011/Organization.svc?wsdl",
	     contentType: "xml",


	    // contentType: "application/soap+xml; charset=UTF-8",
	     success: function(xml){
	    // var xml = $.parseXML( result );
		 console.log(xml);
	     $(xml).find('import').each(function(){
	       WSDLImportURL=$(this).attr('location');
	       console.log(WSDLImportURL);
	       getWSDLImport(WSDLImportURL);
	     });
	   },
	   error: function() {
	     console.log("An error occurred while processing XML file.");
	   }

	   });


}



function getWSDLImport(WSDLImportURL)
{



     $.ajax({
	     type: "GET",
	     url: WSDLImportURL,
	     dataType: "xml",
	     contentType: "application/soap+xml; charset=UTF-8",
	     success: function(xml){

		 console.log(xml);

	     $(xml).find('AuthenticationPolicy').each(function(){

			 URNAddress=$(this).find('AppliesTo').text();
			 console.log(URNAddress);

	     });

	     $(xml).find('Issuer > Address').each(function(){
		   STSEndPoint = $(this).text();
		 	console.log(STSEndPoint);

	     });

              login(URNAddress,STSEndPoint);
	   },
	   error: function() {
	     console.log("An error occurred while processing XML file.");
	   }
	   });


}



function login(URNAddress,STSEndPoint)
{

	var createDate = new Date();
	var expireDate = new Date(createDate.getTime() + 5*60000);

	var createDateString = createDate.toUTCString();
	var expireDateString = expireDate.toUTCString();

    var soapMessage = '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" \n\
  					 xmlns:a="http://www.w3.org/2005/08/addressing" \n\
		                xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> \n\
		                <s:Header> \n\
			                <a:Action s:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue \n\
			                </a:Action> \n\
			                <a:MessageID>urn:uuid:paramMessageID \n\
			                </a:MessageID> \n\
			                <a:ReplyTo> \n\
				                <a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address> \n\
			                </a:ReplyTo> \n\
			                <VsDebuggerCausalityData \n\
				                xmlns="http://schemas.microsoft.com/vstudio/diagnostics/servicemodelsink">uIDPo4TBVw9fIMZFmc7ZFxBXIcYAAAAAbd1LF/fnfUOzaja8sGev0GKsBdINtR5Jt13WPsZ9dPgACQAA \n\
			                </VsDebuggerCausalityData> \n\
			                <a:To s:mustUnderstand="1">paramSTSEndPoint\n\
			                </a:To> \n\
			                <o:Security s:mustUnderstand="1" \n\
				                xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> \n\
				                <u:Timestamp u:Id="_0"> \n\
					                <u:Created>paramTimeCreated</u:Created> \n\
					                <u:Expires>paramTimeExpires</u:Expires> \n\
				                </u:Timestamp> \n\
				                <o:UsernameToken u:Id="uuid-14bed392-2320-44ae-859d-fa4ec83df57a-1"> \n\
					                <o:Username>paramUsername</o:Username> \n\
					                <o:Password \n\
						                Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">paramPassword</o:Password> \n\
				                </o:UsernameToken> \n\
			                </o:Security> \n\
		                </s:Header> \n\
		                <s:Body> \n\
			                <t:RequestSecurityToken xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust"> \n\
				                <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy"> \n\
					                <a:EndpointReference> \n\
						                <a:Address>paramURNAddress</a:Address> \n\
					                </a:EndpointReference> \n\
				                </wsp:AppliesTo> \n\
				                <t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue \n\
				                </t:RequestType> \n\
			                </t:RequestSecurityToken> \n\
		                </s:Body> \n\
	                </s:Envelope>';

            soapMessage =  soapMessage.replace('paramURNAddress',URNAddress);
		    soapMessage = soapMessage.replace('paramSTSEndPoint',STSEndPoint);
		    soapMessage = soapMessage.replace('paramUsername', username);
		    soapMessage = soapMessage.replace('paramPassword', password);
		    soapMessage = soapMessage.replace('paramTimeCreated',createDateString);
		    soapMessage = soapMessage.replace('paramTimeExpires',expireDateString);
            soapMessage = soapMessage.replace('paramMessageID',generateGuid());


           //  console.log(soapMessage);



$.ajax({
url: STSEndPoint,
type: "POST",
data: soapMessage,
complete: loiginResponse,
contentType: "application/soap+xml; charset=UTF-8"
});


}


function loiginResponse(xmlHttpRequest,status)
{




    var xml = xmlHttpRequest.responseXML;


   // console.log(xml);

   var i=0;
    $(xml).find('CipherValue').each(function(){

		if(i==0)
		{
			securityToken0 = $(this).text();

		}

		if(i==1)
		{
			securityToken1= $(this).text();
		}

	//	console.log( 'securityToken' + i +  ' : ' +  $(this).text());

   		 i++;


   	     });


   	     i=0;
   	    $(xml).find('KeyIdentifier').each(function(){

            if(i==0)
            {
			 keyIdentifier = $(this).text();
		    }



	//	   	console.log( 'KeyIdentifier' + i +  ' : ' + $(this).text());
		   	i++;

   	     });

    getUserInfo();
}
function generateGuid()
{
var result, i, j;
result = '';
for(j=0; j<32; j++)
{
if( j == 8 || j == 12|| j == 16|| j == 20)
result = result + '-';
i = Math.floor(Math.random()*16).toString(16).toUpperCase();
result = result + i;
}
return result
}




function getRecrod()
{

	var createDate = new Date();
	var expireDate = new Date(createDate.getTime() + 5*60000);

	var createDateString = createDate.toUTCString();
	var expireDateString = expireDate.toUTCString();

   createDateString='2013-01-31T19:20:00.805Z';
   expireDateString='2013-01-31T19:25:44.805Z';

   createDateString = formatDate(createDate);
   expireDateString = formatDate(expireDate);


    var soapMessage =  '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" \n\
	                 xmlns:a="http://www.w3.org/2005/08/addressing" \n\
	                 xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> \n\
	                   <s:Header> \n\
	                     <a:Action s:mustUnderstand="1"> \n\
	                     http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/paramAction</a:Action> \n\
	                     <a:MessageID> \n\
	                     urn:uuid:paramMessageID</a:MessageID> \n\
	                     <a:ReplyTo> \n\
	                       <a:Address> \n\
	                       http://www.w3.org/2005/08/addressing/anonymous</a:Address> \n\
	                     </a:ReplyTo> \n\
	                     <VsDebuggerCausalityData xmlns="http://schemas.microsoft.com/vstudio/diagnostics/servicemodelsink"> \n\
	                     uIDPozJEz+P/wJdOhoN2XNauvYcAAAAAK0Y6fOjvMEqbgs9ivCmFPaZlxcAnCJ1GiX+Rpi09nSYACQAA</VsDebuggerCausalityData> \n\
	                     <a:To s:mustUnderstand="1"> \n\
	                     paramCRMURL</a:To> \n\
	                     <o:Security s:mustUnderstand="1" \n\
	                     xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> \n\
	                       <u:Timestamp u:Id="_0"> \n\
	                         <u:Created>paramTimeCreated</u:Created> \n\
	                         <u:Expires>paramTimeExpires</u:Expires> \n\
	                       </u:Timestamp> \n\
	                       <EncryptedData Id="Assertion0" \n\
	                       Type="http://www.w3.org/2001/04/xmlenc#Element" \n\
	                       xmlns="http://www.w3.org/2001/04/xmlenc#"> \n\
	                         <EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#tripledes-cbc"> \n\
	                         </EncryptionMethod> \n\
	                         <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"> \n\
	                           <EncryptedKey> \n\
	                             <EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"> \n\
	                             </EncryptionMethod> \n\
	                             <ds:KeyInfo Id="keyinfo"> \n\
	                               <wsse:SecurityTokenReference xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> \n\
	                                 <wsse:KeyIdentifier EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" \n\
	                                 ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509SubjectKeyIdentifier"> \n\
	                                 paramKeyIdentifier</wsse:KeyIdentifier> \n\
	                               </wsse:SecurityTokenReference> \n\
	                             </ds:KeyInfo> \n\
	                             <CipherData> \n\
	                               <CipherValue>paramSecurityToken0</CipherValue></CipherData> \n\
	                           </EncryptedKey> \n\
	                         </ds:KeyInfo> \n\
	                         <CipherData> \n\
	                           <CipherValue>paramSecurityToken1</CipherValue></CipherData> \n\
	                       </EncryptedData> \n\
	                     </o:Security> \n\
	                   </s:Header> \n\
	                   <s:Body> \n\
	                     <Retrieve xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services"> \n\
	                       <entityName>systemuser</entityName> \n\
	                       <id>paramObjectID</id> \n\
	                       <columnSet xmlns:b="http://schemas.microsoft.com/xrm/2011/Contracts" \n\
	                       xmlns:i="http://www.w3.org/2001/XMLSchema-instance"> \n\
	                         <b:AllColumns>true</b:AllColumns> \n\
	                       </columnSet> \n\
	                     </Retrieve> \n\
	                   </s:Body> \n\
	                 </s:Envelope>';


	    soapMessage =  soapMessage.replace('paramCRMURL',CRMUrl);
	   	soapMessage = soapMessage.replace('paramTimeCreated',createDateString);
	  	soapMessage = soapMessage.replace('paramTimeExpires',expireDateString);
	   	soapMessage =  soapMessage.replace('paramAction','Retrieve');
	  	soapMessage = soapMessage.replace('paramKeyIdentifier',keyIdentifier);
	  	soapMessage = soapMessage.replace('paramSecurityToken0', securityToken0);
	  	soapMessage = soapMessage.replace('paramSecurityToken1', securityToken1);
	  	soapMessage = soapMessage.replace('paramMessageID',generateGuid());
	   soapMessage = soapMessage.replace('paramObjectID', userId);



$.ajax({
url: CRMUrl,
type: "POST",
data: soapMessage,
complete: getRecordResponse,
contentType: "application/soap+xml; charset=UTF-8"
});


}


function getRecordResponse(xmlHttpRequest,status)
{

    var xml = xmlHttpRequest.responseXML;
    console.log(xml);
}


function getUserInfo()
{

	var createDate = new Date();
	var expireDate = new Date(createDate.getTime() + 5*60000);

	var createDateString = createDate.toUTCString();
	var expireDateString = expireDate.toUTCString();

   createDateString='2013-01-31T19:20:00.805Z';
   expireDateString='2013-01-31T19:25:44.805Z';

   createDateString = formatDate(createDate);
   expireDateString = formatDate(expireDate);


    var soapMessage =  '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" \n\
	                 xmlns:a="http://www.w3.org/2005/08/addressing" \n\
	                 xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> \n\
	                   <s:Header> \n\
	                     <a:Action s:mustUnderstand="1"> \n\
	                     http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/paramAction</a:Action> \n\
	                     <a:MessageID> \n\
	                     urn:uuid:paramMessageID</a:MessageID> \n\
	                     <a:ReplyTo> \n\
	                       <a:Address> \n\
	                       http://www.w3.org/2005/08/addressing/anonymous</a:Address> \n\
	                     </a:ReplyTo> \n\
	                     <VsDebuggerCausalityData xmlns="http://schemas.microsoft.com/vstudio/diagnostics/servicemodelsink"> \n\
	                     uIDPozJEz+P/wJdOhoN2XNauvYcAAAAAK0Y6fOjvMEqbgs9ivCmFPaZlxcAnCJ1GiX+Rpi09nSYACQAA</VsDebuggerCausalityData> \n\
	                     <a:To s:mustUnderstand="1"> \n\
	                     paramCRMURL</a:To> \n\
	                     <o:Security s:mustUnderstand="1" \n\
	                     xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> \n\
	                       <u:Timestamp u:Id="_0"> \n\
	                         <u:Created>paramTimeCreated</u:Created> \n\
	                         <u:Expires>paramTimeExpires</u:Expires> \n\
	                       </u:Timestamp> \n\
	                       <EncryptedData Id="Assertion0" \n\
	                       Type="http://www.w3.org/2001/04/xmlenc#Element" \n\
	                       xmlns="http://www.w3.org/2001/04/xmlenc#"> \n\
	                         <EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#tripledes-cbc"> \n\
	                         </EncryptionMethod> \n\
	                         <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"> \n\
	                           <EncryptedKey> \n\
	                             <EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"> \n\
	                             </EncryptionMethod> \n\
	                             <ds:KeyInfo Id="keyinfo"> \n\
	                               <wsse:SecurityTokenReference xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> \n\
	                                 <wsse:KeyIdentifier EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" \n\
	                                 ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509SubjectKeyIdentifier"> \n\
	                                 paramKeyIdentifier</wsse:KeyIdentifier> \n\
	                               </wsse:SecurityTokenReference> \n\
	                             </ds:KeyInfo> \n\
	                             <CipherData> \n\
	                               <CipherValue>paramSecurityToken0</CipherValue></CipherData> \n\
	                           </EncryptedKey> \n\
	                         </ds:KeyInfo> \n\
	                         <CipherData> \n\
	                           <CipherValue>paramSecurityToken1</CipherValue></CipherData> \n\
	                       </EncryptedData> \n\
	                     </o:Security> \n\
	                   </s:Header> \n\
	                   <s:Body> \n ' +


	                   '<RetrieveMultiple xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services">' +
					   '<query i:type="b:QueryByAttribute" xmlns:b="http://schemas.microsoft.com/xrm/2011/Contracts" ' +
					   ' xmlns:i="http://www.w3.org/2001/XMLSchema-instance">' +
					   '<b:Attributes xmlns:c="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
					   '<c:string>domainname</c:string>' +
					   '</b:Attributes>' +
					   '<b:ColumnSet>' +
					   '<b:AllColumns>' +
					    false +
					   '</b:AllColumns>' +
					   '<b:Columns xmlns:c="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
					   '<c:string>systemuserid</c:string></b:Columns></b:ColumnSet>' +
					   '<b:EntityName>systemuser</b:EntityName><b:Orders/>' +
					   '<b:PageInfo i:nil="true"/>' +
					   '<b:Values xmlns:c="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' +
					   '<c:anyType i:type="d:string" xmlns:d="http://www.w3.org/2001/XMLSchema">' +
					   username +
					   ' </c:anyType>' +
					   '</b:Values>' +
					   '</query>' +
					   '</RetrieveMultiple> ' +

					 ' </s:Body> \n\
	                  </s:Envelope>';


	    soapMessage =  soapMessage.replace('paramCRMURL',CRMUrl);
	   	soapMessage = soapMessage.replace('paramTimeCreated',createDateString);
	  	soapMessage = soapMessage.replace('paramTimeExpires',expireDateString);
	   	soapMessage =  soapMessage.replace('paramAction','RetrieveMultiple');
	  	soapMessage = soapMessage.replace('paramKeyIdentifier',keyIdentifier);
	  	soapMessage = soapMessage.replace('paramSecurityToken0', securityToken0);
	  	soapMessage = soapMessage.replace('paramSecurityToken1', securityToken1);
	  	soapMessage = soapMessage.replace('paramMessageID',generateGuid());



$.ajax({
url: CRMUrl,
type: "POST",
data: soapMessage,
complete: getUserInfoResponse,
contentType: "application/soap+xml; charset=UTF-8"
});


}


function getUserInfoResponse(xmlHttpRequest,status)
{

    var xml = xmlHttpRequest.responseXML;
     console.log( xml);
     $(xml).find('KeyValuePairOfstringanyType').each(function(){



	      if($($(this).find('key')[0]).text() == 'systemuserid')
	      {
		 	userId=$($(this).find('value')[0]).text();
		 	console.log(' userid : ' + userId);
		}
});

  startApplication();
}



function formatDate(date)



{
	return  date.getUTCFullYear()+'-'+pad((date.getUTCMonth()+1),2)+'-'+pad(date.getUTCDate(),2)+'T'+pad(date.getUTCHours(),2)+':'+pad(date.getUTCMinutes(),2)+':'+pad(date.getUTCSeconds(),2)+'.'+pad(date.getUTCMilliseconds(),3)+'Z';
}


function pad(a,b){return(1e15+a+"").slice(-b)}




function createLocation(data)
{

	var createDate = new Date();
	var expireDate = new Date(createDate.getTime() + 5*60000);

	var createDateString = formatDate(createDate);
	var expireDateString = formatDate(expireDate);



	// Prepare values for the new contact.
	var firstname = "Imed";
	var lastname = "Yahmadi";
	var donotbulkemail = "true";
	var address1_stateorprovince = "BC";
	var address1_postalcode = "V7V3E1";
	var address1_line1 = "3185 Benbow Rd.";
	var address1_city = "Vancouver";




    var soapMessage =  '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" \n\
	                 xmlns:a="http://www.w3.org/2005/08/addressing" \n\
	                 xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> \n\
	                   <s:Header> \n\
	                     <a:Action s:mustUnderstand="1"> \n\
	                     http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/paramAction</a:Action> \n\
	                     <a:MessageID> \n\
	                     urn:uuid:paramMessageID</a:MessageID> \n\
	                     <a:ReplyTo> \n\
	                       <a:Address> \n\
	                       http://www.w3.org/2005/08/addressing/anonymous</a:Address> \n\
	                     </a:ReplyTo> \n\
	                     <VsDebuggerCausalityData xmlns="http://schemas.microsoft.com/vstudio/diagnostics/servicemodelsink"> \n\
	                     uIDPozJEz+P/wJdOhoN2XNauvYcAAAAAK0Y6fOjvMEqbgs9ivCmFPaZlxcAnCJ1GiX+Rpi09nSYACQAA</VsDebuggerCausalityData> \n\
	                     <a:To s:mustUnderstand="1"> \n\
	                     paramCRMURL</a:To> \n\
	                     <o:Security s:mustUnderstand="1" \n\
	                     xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> \n\
	                       <u:Timestamp u:Id="_0"> \n\
	                         <u:Created>paramTimeCreated</u:Created> \n\
	                         <u:Expires>paramTimeExpires</u:Expires> \n\
	                       </u:Timestamp> \n\
	                       <EncryptedData Id="Assertion0" \n\
	                       Type="http://www.w3.org/2001/04/xmlenc#Element" \n\
	                       xmlns="http://www.w3.org/2001/04/xmlenc#"> \n\
	                         <EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#tripledes-cbc"> \n\
	                         </EncryptionMethod> \n\
	                         <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"> \n\
	                           <EncryptedKey> \n\
	                             <EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"> \n\
	                             </EncryptionMethod> \n\
	                             <ds:KeyInfo Id="keyinfo"> \n\
	                               <wsse:SecurityTokenReference xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> \n\
	                                 <wsse:KeyIdentifier EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary" \n\
	                                 ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509SubjectKeyIdentifier"> \n\
	                                 paramKeyIdentifier</wsse:KeyIdentifier> \n\
	                               </wsse:SecurityTokenReference> \n\
	                             </ds:KeyInfo> \n\
	                             <CipherData> \n\
	                               <CipherValue>paramSecurityToken0</CipherValue></CipherData> \n\
	                           </EncryptedKey> \n\
	                         </ds:KeyInfo> \n\
	                         <CipherData> \n\
	                           <CipherValue>paramSecurityToken1</CipherValue></CipherData> \n\
	                       </EncryptedData> \n\
	                     </o:Security> \n\
	                   </s:Header> \n\
	                   <s:Body> \n\ ' +






					'<Create xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">' +
						'<entity xmlns:a="http://schemas.microsoft.com/xrm/2011/Contracts">' +
	   						'<a:Attributes xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic">' +
	     						'<a:KeyValuePairOfstringanyType>' +
	       							'<b:key>new_longitude</b:key>' +
	      	 						'<b:value i:type="c:double" xmlns:c="http://www.w3.org/2001/XMLSchema">' + data.Longitude + '</b:value>' +
	    	 					'</a:KeyValuePairOfstringanyType>' +
	     						'<a:KeyValuePairOfstringanyType>' +
	       							'<b:key>new_latitude</b:key>' +
	      	 						'<b:value i:type="c:double" xmlns:c="http://www.w3.org/2001/XMLSchema">' + data.Latitude+ '</b:value>' +
	    	 					'</a:KeyValuePairOfstringanyType>' +
	     						'<a:KeyValuePairOfstringanyType>' +
	       							'<b:key>new_altitude</b:key>' +
	      	 						'<b:value i:type="c:double" xmlns:c="http://www.w3.org/2001/XMLSchema">' + data.Altitude + '</b:value>' +
	    	 					'</a:KeyValuePairOfstringanyType>' +
	     						'<a:KeyValuePairOfstringanyType>' +
	       							'<b:key>new_time</b:key>' +
	      	 						'<b:value i:type="c:dateTime" xmlns:c="http://www.w3.org/2001/XMLSchema">' + formatDate(data.Time) + '</b:value>' +
	    	 					'</a:KeyValuePairOfstringanyType>' +
	     						'<a:KeyValuePairOfstringanyType>' +
	       							'<b:key>new_address</b:key>' +
	      	 						'<b:value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">' + data.Address + '</b:value>' +
	    	 					'</a:KeyValuePairOfstringanyType>' +
	     						'<a:KeyValuePairOfstringanyType>' +
	       							'<b:key>new_speed</b:key>' +
	      	 						'<b:value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">' + data.Speed + '</b:value>' +
	    	 					'</a:KeyValuePairOfstringanyType>' +
	     						'<a:KeyValuePairOfstringanyType>' +
	       							'<b:key>new_accuracy</b:key>' +
	      	 						'<b:value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">' + data.Accuracy+ '</b:value>' +
	    	 					'</a:KeyValuePairOfstringanyType>' +
	    	 					'<a:KeyValuePairOfstringanyType>' +
									'<b:key>new_name</b:key>' +
									'<b:value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">' + data.Name + '</b:value>' +
	    	 					'</a:KeyValuePairOfstringanyType>' +

	    	 				    ' <a:KeyValuePairOfstringanyType>' +
							    '  <b:key>new_user</b:key>' +
							    '  <b:value i:type="a:EntityReference">' +
							    '   <a:Id>' +
							      		userId +
							    	'</a:Id>' +
							    '   <a:LogicalName>systemuser</a:LogicalName>' +
							    '   <a:Name i:nil="true" />' +
							    '  </b:value>' +
							    ' </a:KeyValuePairOfstringanyType>' +


	   						'</a:Attributes>' +
	   						'<a:EntityState i:nil="true" />' +
	   						'<a:FormattedValues xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic" />' +
	   						'<a:Id>00000000-0000-0000-0000-000000000000</a:Id>' +
	   						'<a:LogicalName>new_geolocation</a:LogicalName>' +
	   						'<a:RelatedEntities xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic" />' +
	 						'</entity>' +
    				'</Create>' +
                 '</s:Body> \n\
	                 </s:Envelope> ';


	    soapMessage =  soapMessage.replace('paramCRMURL',CRMUrl);
	   	soapMessage = soapMessage.replace('paramTimeCreated',createDateString);
	  	soapMessage = soapMessage.replace('paramTimeExpires',expireDateString);
	   	soapMessage =  soapMessage.replace('paramAction','Create');
	  	soapMessage = soapMessage.replace('paramKeyIdentifier',keyIdentifier);
	  	soapMessage = soapMessage.replace('paramSecurityToken0', securityToken0);
	  	soapMessage = soapMessage.replace('paramSecurityToken1', securityToken1);
	  	soapMessage = soapMessage.replace('paramMessageID',generateGuid());





$.ajax({
url: CRMUrl,
type: "POST",
data: soapMessage,
complete: createLocationResponse,
contentType: "application/soap+xml; charset=UTF-8"
});


}



function createLocationResponse(xmlHttpRequest,status)
{

    var xml = xmlHttpRequest.responseXML;
    console.log(xml);
}



function getGeolocation()
{
	 navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function stopGetLocationTimer()
{
	clearInterval(geolocationTimer);
}

function startApplication()
{

}



function mainPool()
{

    getGeolocation();


}


// onSuccess Geolocation
//
function onSuccess(position) {

	try
	{
    var message =       'Latitude: '           + position.coords.latitude              + '<br />' +
                        'Longitude: '          + position.coords.longitude             + '<br />' +
                        'Altitude: '           + position.coords.altitude             + '<br />' +
                        'Accuracy: '           + position.coords.accuracy              + '<br />' +
                        'Speed: '              + position.coords.speed                 + '<br />' +
                        'Timestamp: '          + (new Date(position.timestamp)).toLocaleString() + '<br />';






	       var data = {};
           data.Name = formatDate(new Date());
	       data.Address =  '';
	       data.Longitude =  position.coords.longitude ;
	       data.Latitude = position.coords.latitude ;
	       data.Altitude=position.coords.altitude ;
	       if(data.Altitude == undefined || data.Altitude === undefined || data.Altitude == null)
	       {
			   data.Altitude  = 0;
		   }

	    //   data.Time= ( new Date(position.timestamp));
	       data.Time= ( new Date());
	       data.Speed= position.coords.speed;

	        if(data.Speed == undefined || data.Speed === undefined || data.Speed == null)
		   {
			   data.Speed  = 0;
		   }

	   	   data.Accuracy = position.coords.accuracy ;
	   	   if(data.Accuracy == undefined || data.Accuracy === undefined || data.Accuracy == null)
		   {
			   data.Accuracy  = 0;
		   }

             reverseGeoCode(data);

			 var message =           'Address: '           + data.Address             + '<br />' +
			 						'Latitude: '           + position.coords.latitude              + '<br />' +
			                        'Longitude: '          + position.coords.longitude             + '<br />' +
			                        'Altitude: '           + position.coords.altitude             + '<br />' +
			                        'Accuracy: '           + position.coords.accuracy              + '<br />' +
			                        'Speed: '              + position.coords.speed                 + '<br />' +
                        'Timestamp: '          + (new Date(position.timestamp)).toLocaleString() + '<br />';



            addLog(message);



	}
	       catch(err){
	           console.log(err);
    }


}

// onError Callback receives a PositionError object
//
function onError(error) {
	        addLog('code: '    + error.code    + '\n' +
	                'message: ' + error.message + '\n');
}


function init()
{
	getWsdl();
}
function startApplication()
{

	getGeolocation();

	mainPoolTimer= setInterval(function(){mainPool()},300*1000);

}




function reverseGeoCode(data) {


  var latlng = new google.maps.LatLng(data.Latitude, data.Longitude);

  geocoder = new google.maps.Geocoder();
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
           data.Address= results[0].formatted_address;
              addLog('Result found : ' +  data.Address );

      } else {
        addLog('No results found');
      }
    } else {
      addLog('Geocoder failed due to: ' + status);
    }

     createLocation(data);
  });
}


function addLog(message)
{

   var element = document.getElementById('log');
    element.innerHTML +=  message;
    console.log(message);

}

// Clear Log
function  clearLog()
{
   var element = document.getElementById('log');
    element.innerHTML = '';

}

// Clear Log
function  newLog(message)
{
   clearLog();
   addLog(message);

}