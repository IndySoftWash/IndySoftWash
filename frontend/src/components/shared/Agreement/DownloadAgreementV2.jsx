
import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { short_list_month } from '../../../utils/frequencyDigitConverter'
import { getSumOfTotalCostYearly, getPerCleaningCost, getOverallCost } from '../../../utils/ArithematicCalculation';

const EmailTemplate = ({ serviceData, propertyData, customerData }) => {

    const [totalSqft, setTotalSqft] = useState(null)
    const [totalCost, setTotalCost] = useState(null)

    // const short_list_month = {
    //     'January' : 'Jan',
    //     'February' : 'Feb',
    //     'March' : 'March',
    //     'April' : 'April',
    //     'May' : 'May',
    //     'June' : 'June',
    //     'July' : 'July', 
    //     'August' : 'Aug',
    //     'September' : 'Sept',
    //     'October' : 'Oct',
    //     'November' : 'Nov',
    //     'December' : 'Dec'
    // }

    useEffect(() => {    
        if (Array.isArray(serviceData)) {
            // Calculate totalSqft by summing up the sqft values of all objects in the serviceData array
            const totalSqft = serviceData.reduce(
                (acc, curr) => acc + (parseFloat(curr.sqft) || 0),
                0 // Initialize the accumulator as 0
            );
            setTotalSqft(totalSqft);
            setTotalCost(getSumOfTotalCostYearly(serviceData))
        }
    }, [serviceData]);

    function extractYear(dateString) {
        const date = new Date(dateString);
        return date.getUTCFullYear(); // Use getUTCFullYear() for UTC dates
    }

    function extractPrice(service, type) {
        const {activePlan, frequency} = service
        const price = frequency.find(value => value.name === activePlan)?.[type]
        return price
    }

    return (
        <div>
        <style>
            {`
            @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700");
            .dark-mode .bg-f5f6fa {
                background-color: #f5f6fa !important;
            }
            .dark-mode .bg-fffffe {
                background-color: #fffffe !important;
            }
            .dark-mode .color-202224 {
                color: #202224 !important;
            }
            .dark-mode .color-000001 {
                color: #000001 !important;
            }
            .dark-mode .bg-00b69b {
                background-color: #00b69b !important;
            }
            .dark-mode .color-979797 {
                color: #979797 !important;
            }
            .dark-mode .bg-388cff {
                background-color: #388cff !important;
            }
            .dark-mode .color-fffffe {
                color: #fffffe !important;
            }
            .dark-mode .color-f5f6fa {
                color: #f5f6fa !important;
            }
            @media (prefers-color-scheme: dark) {
                html:not(.light-mode) .bg-f5f6fa {
                background-color: #f5f6fa !important;
                }
                html:not(.light-mode) .bg-fffffe {
                background-color: #fffffe !important;
                }
                html:not(.light-mode) .color-202224 {
                color: #202224 !important;
                }
                html:not(.light-mode) .color-000001 {
                color: #000001 !important;
                }
                html:not(.light-mode) .bg-00b69b {
                background-color: #00b69b !important;
                }
                html:not(.light-mode) .color-979797 {
                color: #979797 !important;
                }
                html:not(.light-mode) .bg-388cff {
                background-color: #388cff !important;
                }
                html:not(.light-mode) .color-fffffe {
                color: #fffffe !important;
                }
                html:not(.light-mode) .color-f5f6fa {
                color: #f5f6fa !important;
                }
            }
            `}
        </style>

        <div style={{ margin: 0, padding: 0 }}>
            <div style={{ fontSize: '0px', lineHeight: '1px', display: 'none', maxWidth: '0px', maxHeight: '0px', opacity: 0, overflow: 'hidden' }}></div>
            <center style={{ width: '100%', tableLayout: 'fixed', WebkitTextSizeAdjust: '100%', msTextSizeAdjust: '100%' }}>
            <table cellPadding="0" cellSpacing="0" border="0" role="presentation"  width="595" style={{  width: '595px', borderSpacing: 0, fontFamily: "'DM Sans', Tahoma, sans-serif", minWidth: '595px' }}>
                <tr>
                <td valign="top" width="100%" style={{ paddingTop: '24px', paddingBottom: '95px', paddingLeft: '8px', paddingRight: '8px', verticalAlign: 'top' }}>
                    <table className="bg-fffffe" cellPadding="0" cellSpacing="0" border="0" role="presentation" bgcolor="white" width="579" style={{ borderRadius: '5.83px', boxShadow: '2.5px 2.5px 22.48px rgba(0, 0, 0, 0.05)', backgroundColor: 'white', width: '579px', borderSpacing: 0, borderCollapse: 'separate' }}>
                    <tr>
                        <td valign="top" width="100%" style={{ paddingTop: '19px', paddingBottom: '42px', verticalAlign: 'top' }}>
                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                            <tr>
                            <td align="left" style={{ paddingBottom: '5.5px', paddingLeft: '18px' }}>
                                <table cellPadding=" 0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                <tr>
                                    <td valign="top" width="297" style={{ verticalAlign: 'top' }}>
                                    <Logo />
                                    </td>
                                    <td valign="top" width="256" style={{ paddingLeft: '8px', verticalAlign: 'top' }}>
                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                        <tr>
                                        <td style={{ paddingBottom: '4.5px' }}>
                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>Contract #</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td style={{ paddingTop: '4.5px', paddingBottom: '3px' }}>
                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>
                                            <span>Start Date: </span><span style={{ fontSize: '12.35px', fontWeight: 400 }}>MM/DD/YY</span>
                                            </p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td style={{ paddingTop: '3px' }}>
                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>
                                            <span>Expire Date: </span><span style={{ fontSize: '12.35px', fontWeight: 400 }}>MM/DD/YY</span>
                                            </p>
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                            <tr>
                            <td align="left" style={{ paddingTop: '5.5px', paddingBottom: '13.29px', paddingLeft: '17px' }}>
                                <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                <tr>
                                    <td valign="top" width="306" style={{ verticalAlign: 'top' }}>
                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                        <tr>
                                        <td>
                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>To:</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td>
                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>{propertyData?.propertyName}</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td valign="top" height="30.5" style={{ verticalAlign: 'top' }}>
                                            <p className="color-202224" style={{ fontSize: '13px', fontWeight: 400, color: '#202224', margin: 0, padding: 0, lineHeight: '17px' }}>{propertyData?.billingAddress}</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td style={{ paddingTop: '12.5px' }}>
                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>From:</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td>
                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>Indy Soft Wash, LLC</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td>
                                            <p className="color-202224" style={{ fontSize: '13px', fontWeight: 400, textAlign: 'left', color: '#202224', margin: 0, padding: 0 }}>
                                            8070 Caslteon Road, Unit 8065<br />Indianapolis, IN, 46250
                                            </p>
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                    <td valign="top" width="256" style={{ verticalAlign: 'top' }}>
                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                        <tr>
                                        <td>
                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>Job Location:</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td>
                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>Contact Name / Property Name</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td valign="top" height="30.5" style={{ verticalAlign: 'top' }}>
                                            <p className="color-202224" style={{ fontSize: '13px', fontWeight: 400, color: '#202224', margin: 0, padding: 0, lineHeight: '17px' }}>Service Address</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td style={{ paddingTop: '12.5px' }}>
                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>Contact Info:</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td valign="top" height="20" style={{ verticalAlign: 'top' }}>
                                            <p className="color-202224" style={{ fontSize: '13px', fontWeight: 400, color: '#202224', margin: 0, padding: 0, lineHeight: '17px' }}>Email: service@lndyswcom</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td style={{ paddingTop: '2px' }}>
                                            <p className="color-202224" style={{ fontSize: '13px', fontWeight: 400, color: '#202224', margin: 0, padding: 0, lineHeight: '17px' }}>Phone: (317)-835-9274</p>
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                            <tr>
                            <td style={{ paddingTop: '13.29px', paddingBottom: '11.21px', paddingLeft: '12.79px', paddingRight: '12.79px' }}>
                                <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                <tr>
                                    <td width="552" style={{ width: '552px' }}>
                                    <table background="assets/image_975818e9.png" cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" height="361" style={{ background: "url('assets/image_54189c88.png') 50% / 100% no-repeat", width: '100%', height: '361px', borderSpacing: 0 }}>
                                        <tr>
                                        <td valign="top" width="100%" height="351.58" style={{ paddingTop: '9.42px', width: '100%', verticalAlign: 'top', height: '351.58px' }}>
                                            <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                {
                                                    serviceData?.length >= 1 && 
                                                    serviceData?.map((value, index) => {
                                                        const price = extractPrice(value, 'price')
                                                        const digit = extractPrice(value, 'frequencyDigit')
                                                        const perCleanCost = getPerCleaningCost(price, value.sqft, value.quantity)
                                                        const annualCost = getOverallCost(perCleanCost, digit)
                                                        const unitPerMonth = ((perCleanCost) * (digit) / 12 /propertyData?.units).toFixed(2);

                                                        return (
                                                            <tr>
                                                                <td style={{paddingTop: '20px'}}>
                                                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0, paddingTop: '10px' }}>
                                                                    <tr>
                                                                        <td align="left" valign="top" height="24" style={{ paddingLeft: '56px', height: '24px', verticalAlign: 'top', backgroundColor: '#F1F4F9' , border: '1px solid rgb(0 0 0 / 20%)'}}>
                                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                                            <tr>
                                                                            <td valign="top" width="122" style={{ verticalAlign: 'top', borderRight: '1px solid rgb(0 0 0 / 20%)', paddingTop: '6px' }}>
                                                                                <p className="color-202224" style={{ fontSize: '10px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '13px' }}>Service Item</p>
                                                                            </td>
                                                                            <td valign="top" width="66" style={{ verticalAlign: 'top', borderRight: '1px solid rgb(0 0 0 / 20%)', paddingTop: '6px' }}>
                                                                                <p className="color-202224" style={{ fontSize: '10px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '13px', paddingLeft: '5px' }}>Quantity</p>
                                                                            </td>
                                                                            {/* <td valign="top" width="66" style={{ paddingTop: '1px', paddingLeft: '8px', verticalAlign: 'top', borderRight: '1px solid rgb(0 0 0 / 20%)', paddingTop: '6px' }}>
                                                                                <p className="color-202224" style={{ fontSize: '10px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '13px', display: 'inline-block' }}>Quantity</p>
                                                                            </td> */}
                                                                            <td valign="top" width="31.47" style={{ paddingLeft: '8px', paddingRight: '36.03px', verticalAlign: 'top', borderRight: '1px solid rgb(0 0 0 / 20%)', paddingTop: '6px' }}>
                                                                                <p className="color-202224" style={{ fontSize: '10px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '13px' }}>SQFT</p>
                                                                            </td>
                                                                            <td valign="top" width="67.96" style={{ paddingLeft: '8px', paddingRight: '49.54px', verticalAlign: 'top', borderRight: '1px solid rgb(0 0 0 / 20%)', paddingTop: '6px' }}>
                                                                                <p className="color-202224" style={{ fontSize: '10px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '13px' }}>Frequency</p>
                                                                            </td>
                                                                            <td valign="top" style={{ paddingLeft: '8px', verticalAlign: 'top', paddingTop: '6px' }}>
                                                                                <p className="color-202224" style={{ fontSize: '10px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '13px' }}>Price / SQFT</p>
                                                                            </td>
                                                                            </tr>
                                                                        </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" valign="top" height="38.5" style={{ height: '38.5px', verticalAlign: 'top' }}>
                                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                                            <tr>
                                                                            <td width="178" style={{ paddingTop: '10px', borderRight: '1px solid rgb(0 0 0 / 20%)', borderLeft: '1px solid rgb(0 0 0 / 20%)', width: '178px', paddingLeft: '10px' }}>
                                                                                <p className="color-000001" style={{ fontSize: '10px', fontWeight: 500, color: 'black', margin: 0, padding: 0, lineHeight: '13px' }}>{index + 1}. {value?.name}</p>
                                                                            </td>
                                                                            <td width="67" style={{ paddingTop: '10px', borderRight: '1px solid rgb(0 0 0 / 20%)', paddingLeft: '8px', width: '67px' }}>
                                                                                <p className="color-000001" style={{ fontSize: '10px', fontWeight: 500, color: 'black', margin: 0, padding: 0, lineHeight: '13px' }}>{value.quantity}</p>
                                                                            </td>
                                                                            <td width="70" style={{ paddingTop: '10px', borderRight: '1px solid rgb(0 0 0 / 20%)', paddingLeft: '8px', width: '70px' }}>
                                                                                <p className="color-000001" style={{ fontSize: '10px', fontWeight: 500, color: 'black', margin: 0, padding: 0, lineHeight: '13px' }}>{value.sqft}</p>
                                                                            </td>
                                                                            <td width="111" style={{ paddingTop: '10px', borderRight: '1px solid rgb(0 0 0 / 20%)', paddingLeft: '8px', width: '111px' }}>
                                                                                <p className="color-000001" style={{ fontSize: '10px', fontWeight: 500, color: 'black', margin: 0, padding: 0, lineHeight: '13px' }}>{value.activePlan}</p>
                                                                            </td>
                                                                            <td style={{ paddingTop: '10px', borderRight: '1px solid rgb(0 0 0 / 20%)', paddingLeft: '8px' }}>
                                                                                <p className="color-000001" style={{ fontSize: '10px', fontWeight: 500, color: 'black', margin: 0, padding: 0, lineHeight: '13px' }}>${price}</p>
                                                                            </td>
                                                                            </tr>
                                                                        </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" height="48.5" style={{ paddingTop: '10px', paddingBottom: '10px', borderLeft: '1px solid rgb(0 0 0 / 20%)', borderRight: '1px solid rgb(0 0 0 / 20%)', borderTop: '1px solid rgb(0 0 0 / 20%)', paddingLeft: '11.07px', paddingRight: '11.07px', height: '48.5px', verticalAlign: 'top' }}>
                                                                        <p className="color-000001" style={{ fontSize: '10px', fontWeight: 500, textAlign: 'center', color: 'black', margin: 0, padding: 0, lineHeight: '13px' }}>{value?.description}</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" valign="top" height="38" style={{ height: '38px', verticalAlign: 'top' }}>
                                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                                            <tr>
                                                                            <td width="196" style={{ paddingLeft: '29px', border: '1px solid rgb(0 0 0 / 20%)', borderRight: 'none', width: '196px' }}>
                                                                                <p className="color-000001" style={{ fontSize: '10px', fontWeight: 500, color: 'black', margin: 0, padding: 0, lineHeight: '13px' }}>Price Per Clean = ${perCleanCost}</p>
                                                                            </td>
                                                                            <td width="174" style={{ border: '1px solid rgb(0 0 0 / 20%)', borderRight: 'none', paddingLeft: '8px', width: '174px' }}>
                                                                                <p className="color-000001" style={{ fontSize: '10px', fontWeight: 500, color: 'black', margin: 0, padding: 0, lineHeight: '13px' }}>Annual Investment = ${annualCost}</p>
                                                                            </td>
                                                                            <td style={{ border: '1px solid rgb(0 0 0 / 20%)', paddingLeft: '8px' }}>
                                                                                <p className="color-000001" style={{ fontSize: '10px', fontWeight: 500, color: 'black', margin: 0, padding: 0, lineHeight: '13px' }}>Price Per Door / Month = ${unitPerMonth}</p>
                                                                            </td>
                                                                            </tr>
                                                                        </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" valign="top" height="18.75" style={{ borderRight: '1px solid rgb(0 0 0 / 20%)', borderLeft: '1px solid rgb(0 0 0 / 20%)', paddingTop: '9px', paddingLeft: '16px', height: '18.75px', verticalAlign: 'top' }}>
                                                                        <p className="color-000001" style={{ fontSize: '10px', fontWeight: 500, color: 'black', margin: 0, padding: 0, lineHeight: '13px' }}>
                                                                            <span>Select Service Month(s): </span><span style={{ fontSize: '10px', fontWeight: 500, color: 'red' }}>*</span>
                                                                        </p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td valign="top" height="46px" style={{ borderRight: '1px solid rgb(0 0 0 / 20%)', borderLeft: '1px solid rgb(0 0 0 / 20%)', borderBottom: '1px solid rgb(0 0 0 / 20%)', height: '46pxpx', verticalAlign: 'top' }}>
                                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                                            <tr>
                                                                            <td valign="top" height="31.97" style={{ paddingLeft: '30.5px', paddingRight: '30.5px', height: '31.97px', verticalAlign: 'top' }}>
                                                                                <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                                                <tr>
                                                                                    {value?.months?.map(value => 
                                                                                        <td width="36.21" style={{ paddingLeft: '8px', paddingRight: '4px', width: '36.21px' }}>
                                                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" height="25.97" style={{ borderRadius: '2.99678px', border: '0.49946px solid #979797', width: '100%', height: '25.97px', borderSpacing: 0 }}>
                                                                                            <tr>
                                                                                            <td valign="middle" width="100%" height="24.97" style={{ width: '100%', verticalAlign: 'middle', height: '24.97px' }}>
                                                                                                <p className="color-979797" style={{ fontSize: '10px', fontWeight: 700, color: '#979797', margin: 0, padding: 0, textAlign: 'center' }}>{short_list_month[value]}</p>
                                                                                            </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                        </td>
                                                                                    )}
                                                                                </tr>
                                                                                </table>
                                                                            </td>
                                                                            </tr>
                                                                        </table>
                                                                        </td>
                                                                    </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            <tr>
                                                <td style={{ paddingTop: '12.29px' }}>
                                                <table className="bg-388cff" cellPadding="0" cellSpacing="0" border="0" role="presentation" bgcolor="#388cff" width="100%" height="60.89" style={{ borderRadius: '3.36px', backgroundColor: '#388cff', width: '100%', height: '60.89px', borderSpacing: 0 }}>
                                                    <tr>
                                                    <td align="left" valign="middle" height="60.89" style={{ paddingLeft: '5.15px', verticalAlign: 'middle', height: '60.89px' }}>
                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                        <tr>
                                                            <td valign="top" style={{ verticalAlign: 'top' }}>
                                                            <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ borderSpacing: 0 }}>
                                                                <tr>
                                                                <td align="left" valign="top" height="13.83" style={{ paddingLeft: '41.83px', padding: '8px 0', height: '13.83px', verticalAlign: 'top' }}>
                                                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                                    <tr>
                                                                        {/* <td>
                                                                        <img src="assets/image_cc9d4978.png" width="11" height="11" style={{ width: '11px' , height: '11px', display: 'block' }} alt="Icon" />
                                                                        </td> */}
                                                                        <td width="123.76" style={{ width: '123.76px' }}>
                                                                        <p className="color-fffffe" style={{ fontSize: '9.95px', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '12px' }}>Service Analysis</p>
                                                                        </td>
                                                                    </tr>
                                                                    </table>
                                                                </td>
                                                                </tr>
                                                                <tr>
                                                                <td style={{ paddingBottom: '10px' }}>
                                                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ borderSpacing: 0 }}>
                                                                    <tr>
                                                                        <td valign="top" width="130.87" style={{ width: '130.87px', verticalAlign: 'top' }}>
                                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                                            <tr>
                                                                            <td style={{padding: '5px 0'}}>
                                                                                <p className="color-f5f6fa" style={{ fontSize: '6.71px', fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '9px' }}>{totalSqft} SQFT Total</p>
                                                                            </td>
                                                                            </tr>
                                                                            <tr>
                                                                            <td>
                                                                                <p className="color-fffffe" style={{ fontSize: '9.95px', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '12px' }}>Avg Cost per SQFT</p>
                                                                            </td>
                                                                            </tr>
                                                                        </table>
                                                                        </td>
                                                                        <td valign="top" width="46.02" style={{ width: '46.02px', verticalAlign: 'top' }}>
                                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                                            {/* <tr>
                                                                            <td align="left" valign="top" height="12.55" style={{ paddingLeft: '17.22px', height: '12.55px', verticalAlign: 'top' }}>
                                                                                <img src="assets/image_83a50466.png" width="18" height="10" style={{ width: '18px', height: '10px', display: 'block' }} alt="Icon" />
                                                                            </td>
                                                                            </tr> */}
                                                                            <tr>
                                                                            <td style={{ paddingTop: '2.55px' }}>
                                                                                <p className="color-f5f6fa" style={{ fontSize: '6.71px', fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '9px' }}>${(totalCost / totalSqft)?.toFixed(2)}/SQFT</p>
                                                                            </td>
                                                                            </tr>
                                                                        </table>
                                                                        </td>
                                                                    </tr>
                                                                    </table>
                                                                </td>
                                                                </tr>
                                                            </table>
                                                            </td>
                                                            
                                                            <td valign="top" width="2.47" style={{ paddingTop: '3.64px', width: '2.47px', verticalAlign: 'top' }}>
                                                            <div height="66.67" width="0.56" style={{ height: '66.67px', borderLeft: '0.56px solid white', width: '0.56px' }}></div>
                                                            </td>

                                                            <td valign="top" style={{ paddingLeft: '8px', verticalAlign: 'top' }}>
                                                            <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ borderSpacing: 0 }}>
                                                                <tr>
                                                                <td align="left" valign="top" height="13.83" style={{ paddingLeft: '41.83px', padding: '8px 0', height: '13.83px', verticalAlign: 'top' }}>
                                                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                                    <tr>
                                                                        {/* <td>
                                                                        <img src="assets/image_cc9d4978.png" width="11" height="11" style={{ width: '11px' , height: '11px', display: 'block' }} alt="Icon" />
                                                                        </td> */}
                                                                        <td width="123.76" style={{ width: '123.76px' }}>
                                                                        <p className="color-fffffe" style={{ fontSize: '9.95px', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '12px' }}>Investment</p>
                                                                        </td>
                                                                    </tr>
                                                                    </table>
                                                                </td>
                                                                </tr>
                                                                <tr>
                                                                <td style={{ paddingBottom: '10px' }}>
                                                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ borderSpacing: 0 }}>
                                                                    <tr>
                                                                        <td valign="top" width="130.87" style={{ width: '130.87px', verticalAlign: 'top' }}>
                                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                                            <tr>
                                                                            <td style={{padding: '5px 0'}}>
                                                                                <p className="color-f5f6fa" style={{ fontSize: '6.71px', fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '9px' }}>${totalCost} Annually</p>
                                                                            </td>
                                                                            </tr>
                                                                            <tr>
                                                                            <td>
                                                                                <p className="color-fffffe" style={{ fontSize: '9.95px', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '12px' }}>Monthly Payment</p>
                                                                            </td>
                                                                            </tr>
                                                                        </table>
                                                                        </td>
                                                                        <td valign="top" width="46.02" style={{ width: '46.02px', verticalAlign: 'top' }}>
                                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                                            {/* <tr>
                                                                            <td align="left" valign="top" height="12.55" style={{ paddingLeft: '17.22px', height: '12.55px', verticalAlign: 'top' }}>
                                                                                <img src="assets/image_83a50466.png" width="18" height="10" style={{ width: '18px', height: '10px', display: 'block' }} alt="Icon" />
                                                                            </td>
                                                                            </tr> */}
                                                                            <tr>
                                                                            <td style={{ paddingTop: '2.55px' }}>
                                                                                <p className="color-f5f6fa" style={{ fontSize: '6.71px', fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '9px' }}>${(totalCost / 12)?.toFixed(2)} PM</p>
                                                                            </td>
                                                                            </tr>
                                                                        </table>
                                                                        </td>
                                                                    </tr>
                                                                    </table>
                                                                </td>
                                                                </tr>
                                                            </table>
                                                            </td>

                                                            <td valign="top" width="2.47" style={{ paddingTop: '3.64px', width: '2.47px', verticalAlign: 'top' }}>
                                                            <div height="66.67" width="0.56" style={{ height: '66.67px', borderLeft: '0.56px solid white', width: '0.56px' }}></div>
                                                            </td>

                                                            <td valign="top" style={{ paddingLeft: '8px', paddingRight: '8px', verticalAlign: 'top' }}>
                                                            <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ borderSpacing: 0 }}>
                                                                <tr>
                                                                <td align="left" valign="top" height="13.83" style={{ paddingLeft: '41.83px', padding: '8px 0', height: '13.83px', verticalAlign: 'top' }}>
                                                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                                    <tr>
                                                                        {/* <td>
                                                                        <img src="assets/image_cc9d4978.png" width="11" height="11" style={{ width: '11px' , height: '11px', display: 'block' }} alt="Icon" />
                                                                        </td> */}
                                                                        <td width="123.76" style={{ width: '123.76px' }}>
                                                                        <p className="color-fffffe" style={{ fontSize: '9.95px', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '12px' }}>Per Door Analysis</p>
                                                                        </td>
                                                                    </tr>
                                                                    </table>
                                                                </td>
                                                                </tr>
                                                                <tr>
                                                                <td style={{ paddingBottom: '10px' }}>
                                                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ borderSpacing: 0 }}>
                                                                    <tr>
                                                                        <td valign="top" width="130.87" style={{ width: '130.87px', verticalAlign: 'top' }}>
                                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                                            <tr>
                                                                            <td style={{padding: '5px 0'}}>
                                                                                <p className="color-f5f6fa" style={{ fontSize: '6.71px', fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '9px' }}>{[propertyData?.units]} Units</p>
                                                                            </td>
                                                                            </tr>
                                                                            <tr>
                                                                            <td>
                                                                                <p className="color-fffffe" style={{ fontSize: '9.95px', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '12px' }}>Per Door Investment</p>
                                                                            </td>
                                                                            </tr>
                                                                        </table>
                                                                        </td>
                                                                        <td valign="top" width="46.02" style={{ width: '46.02px', verticalAlign: 'top' }}>
                                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                                            {/* <tr>
                                                                            <td align="left" valign="top" height="12.55" style={{ paddingLeft: '17.22px', height: '12.55px', verticalAlign: 'top' }}>
                                                                                <img src="assets/image_83a50466.png" width="18" height="10" style={{ width: '18px', height: '10px', display: 'block' }} alt="Icon" />
                                                                            </td>
                                                                            </tr> */}
                                                                            <tr>
                                                                            <td style={{ paddingTop: '2.55px' }}>
                                                                                <p className="color-f5f6fa" style={{ fontSize: '6.71px', fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '9px' }}>${(totalCost / [propertyData?.units])?.toFixed(2)} / Unit PM</p>
                                                                            </td>
                                                                            </tr>
                                                                        </table>
                                                                        </td>
                                                                    </tr>
                                                                    </table>
                                                                </td>
                                                                </tr>
                                                            </table>
                                                            </td>
                                                        </tr>
                                                        </table>
                                                    </td>
                                                    </tr>
                                                </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" style={{ paddingTop: '11.21px', paddingBottom: '10px', paddingLeft: '17px' }}>
                                                <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                    <tr>
                                                    <td width="306" style={{ width: '306px' }}>
                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                        <tr>
                                                            <td>
                                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>Accepted Payment Methods</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                            <p className="color-202224" style={{ fontSize: '13px', fontWeight: 400, color: '#202224', margin: 0, padding: 0, lineHeight: '17px' }}>Check, Cash, ACH Bank Transfer, Direct Deposit</p>
                                                            </td>
                                                        </tr>
                                                        </table>
                                                    </td>
                                                    <td width="256" style={{ width: '256px', paddingLeft: '20px' }}>
                                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                        <tr>
                                                            <td>
                                                            <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>Contact Info:</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                            <p className="color-202224" style={{ fontSize: '13px', fontWeight: 400, color: '#202224', margin: 0, padding: 0, lineHeight: '17px' }}>Email: service@lndyswcom</p>
                                                            </td>
                                                        </tr>
                                                        </table>
                                                    </td>
                                                    </tr>
                                                </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" style={{ paddingTop: '10px', paddingLeft: '17px' }}>
                                                <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>Message from Indy Soft Wash</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" style={{ paddingBottom: '7.5px', paddingLeft: '17px', paddingRight: '12px' }}>
                                                <p className="color-202224" style={{ fontSize: '13px', fontWeight: 400, textAlign: 'left', color: '#202224', margin: 0, padding: 0 }}>Thank you for reaching out to us! We appreciate any and every opportunity we get to provide the best possible service and customer experience to our customers. Please find your contract details here. Feel free to contact our sales team at Info@IndySW.com or by phone at (317)-835-9274 if you have any questions. We look forward to working with you.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" style={{ paddingTop: '7.5px', paddingLeft: '17px' }}>
                                                <p className="color-202224" style={{ fontSize: '12.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>Terms</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" style={{ paddingBottom: '5.5px', paddingLeft: '17px' }}>
                                                <p className="color-202224" style={{ fontSize: '13px', fontWeight: 400, color: '#202224', margin: 0, padding: 0, lineHeight: '17px' }}>Terms & Conditions</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right" style={{ paddingTop: '5.5px', paddingBottom: '15.25px', paddingRight: '12px' }}>
                                                <p className="color-202224" style={{ fontSize: '13px', fontWeight: 400, textAlign: 'left', color: '#202224', margin: 0, padding: 0 }}>I have read and agree to the terms of service agreement and I authorize the work to be performed.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right" style={{ paddingTop: '15.25px', paddingBottom: '7.25px', paddingRight: '12.5px' }}>
                                                <div style={{ borderTop: '1px solid black', width: '241px' }}></div>
                                                </td>
                                            </tr>
                                            <tr>
                                            </tr>
                                            </table>
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                </td>
                </tr>
            </table>
            </center>
        </div>
        </div>
    );
};

export default EmailTemplate;
