import { useEffect, useState } from 'react'
import { getOverallCost, getPerCleaningCost, getSumOfTotalCostYearly } from '../../../utils/ArithematicCalculation'
import './style.css'
import Logo from './Logo'

const DownloadAgreement = ({ serviceData, propertyData, customerData }) => {

    const [totalSqft, setTotalSqft] = useState(null)
    const [totalCost, setTotalCost] = useState(null)
  
      useEffect(() => {    
          // console.log(service)
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
    <div lang="und" dir="auto">
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700");
          .dark-mode .bg-f5f6fa { background-color: #f5f6fa !important; }
          .dark-mode .bg-fffffe { background-color: #fffffe !important; }
          .dark-mode .color-202224 { color: #202224 !important; }
          .dark-mode .bg-f1f4f9 { background-color: rgba(241, 244, 249, 0.58) !important; }
          .dark-mode .color-979797 { color: #979797 !important; }
          .dark-mode .bg-388cff { background-color: #388cff !important; }
          .dark-mode .color-fffffe { color: #fffffe !important; }
          .dark-mode .color-f5f6fa { color: #f5f6fa !important; }
          .dark-mode .bg-ff8214 { background-color: #ff8214 !important; }
          .dark-mode .bg-e9941e { background-color: #e9941e !important; }
          @media (prefers-color-scheme: dark) {
            html:not(.light-mode) .bg-f5f6fa { background-color: #f5f6fa !important; }
            html:not(.light-mode) .bg-fffffe { background-color: #fffffe !important; }
            html:not(.light-mode) .color-202224 { color: #202224 !important; }
            html:not(.light-mode) .bg-f1f4f9 { background-color: rgba(241, 244, 249, 0.58) !important; }
            html:not(.light-mode) .color-979797 { color: #979797 !important; }
            html:not(.light-mode) .bg-388cff { background-color: #388cff !important; }
            html:not(.light-mode) .color-fffffe { color: #fffffe !important; }
            html:not(.light-mode) .color-f5f6fa { color: #f5f6fa !important; }
            html:not(.light-mode) .bg-ff8214 { background-color: #ff8214 !important; }
            html:not(.light-mode) .bg-e9941e { background-color: #e9941e !important; }
          }
          [data-ogsc] .bg-f5f6fa { background-color: #f5f6fa !important; }
          [data-ogsc] .bg-fffffe { background-color: #fffffe !important; }
          [data-ogsc] .color-202224 { color: #202224 !important; }
          [data-ogsc] .bg-f1f4f9 { background-color: rgba(241, 244, 249, 0.58) !important; }
          [data-ogsc] .color-979797 { color: #979797 !important; }
          [data-ogsc] .bg-388cff { background-color: #388cff !important; }
          [data-ogsc] .color-fffffe { color: #fffffe !important; }
          [data-ogsc] .color-f5f6fa { color: #f5f6fa !important; }
          [data-ogsc] .bg-ff8214 { background-color: #ff8214 !important; }
          [data-ogsc] .bg-e9941e { background-color: #e9941e !important; }
        `}
      </style>

      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <div style={{ margin: 0, padding: 0 }}>
        <div style={{ fontSize: '0px', lineHeight: '1px', display: 'none', maxWidth: '0px', maxHeight: '0px', opacity: 0, overflow: 'hidden' }}></div>
        <center style={{ width: '100%', tableLayout: 'fixed', WebkitTextSizeAdjust: '100%', msTextSizeAdjust: '100%' }}>
          <table className="bg-f5f6fa" cellPadding="0" cellSpacing="0" border="0" role="presentation" bgcolor="#f5f6fa" width="100%" style={{ backgroundColor: '#f5f6fa', width: '100%', borderSpacing: 0, fontFamily: "'DM Sans', Tahoma, sans-serif", minWidth: '100%' }}>
            <tr>
              <td valign="top" width="100%" style={{ paddingTop: '24px', paddingLeft: '8px', paddingRight: '8px', verticalAlign: 'top' }}>
                <table className="bg-fffffe" cellPadding="0" cellSpacing="0" border="0" role="presentation" bgcolor="white" width="100%" style={{ borderRadius: '5.83px', boxShadow: '2.5px 2.5px 22.48px rgba(0, 0, 0, 0.05)', backgroundColor: 'white', width: '100%', borderSpacing: 0, borderCollapse: 'separate' }}>
                  <tr>
                    <td valign="top" width="100%" style={{ paddingTop: '32px', paddingBottom: '312.57px', verticalAlign: 'top' }}>
                      <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                        <tr>
                          <td align="left" style={{ paddingBottom: '16.76px', paddingLeft: '16.07px' }}>
                            <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                              <tr>
                                <td valign="top" width="208.64" style={{ width: '208.64px', verticalAlign: 'top' }}>
                                  <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                    <tr>
                                      <td style={{ paddingBottom: '3.32px', padding: '16px 0px' }}>
                                        <p className="color-202224" style={{ fontSize: '22.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>Billing To</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{ padding: '0px 0px' }}>
                                        <p className="color-202224" style={{ fontSize: '22.35px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '19px' }}>{propertyData?.propertyName}</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{ padding: '10px 0px' }}>
                                        <p className="color-202224" style={{ fontSize: '16.25px', fontWeight: 400, letterSpacing: '-0.06px', color: '#202224', margin: 0, padding: 0, lineHeight: '13px' }}>{customerData?.personalDetails?.firstName}</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{padding: '10px 0px'}}>
                                        <p className="color-202224" style={{ fontSize: '16.25px', fontWeight: 400, letterSpacing: '-0.06px', color: '#202224', margin: 0, padding: 0, lineHeight: '13px' }}>{customerData?.personalDetails?.phone}</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{padding: '10px 0px'}}>
                                        <p className="color-202224" style={{ fontSize: '16.25px', fontWeight: 400, letterSpacing: '-0.06px', color: '#202224', margin: 0, padding: 0, lineHeight: '13px' }}>Management Company</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                                <td valign="top" width="170.6" style={{ paddingTop: '118.65px', width: '170.6px', verticalAlign: 'top' }}>
                                  <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                    <tr>
                                      <td style={{ paddingBottom: '11.44px' }}>
                                        <p className="color-202224" style={{ fontSize: '14.25px', fontWeight: 400, letterSpacing: '-0.06px', color: '#202224', margin: 0, padding: 0, lineHeight: '20px' }}>{propertyData?.serviceAddress}</p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{ paddingTop: '11.44px' }}>
                                        <p className="color-202224" style={{ fontSize: '14.25px', fontWeight: 400, letterSpacing: '-0.06px', color: '#202224', margin: 0, padding: 0, lineHeight: '20px' }}>{propertyData?.billingAddress}</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                                <td valign="middle" style={{ verticalAlign: 'middle', textAlign: 'right', paddingRight: '20px' }}>
                                  <Logo />
                                  {/* <img src="assets/image_72094c67.png" width="155" style={{ maxWidth: 'initial', width: '155px', display: 'block', marginLeft: 'auto' }} alt="Logo" /> */}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style={{ paddingTop: '16px', paddingBottom: '15.74px', paddingLeft: '14.82px' }}>
                            <p className="color-202224" style={{ fontSize: '18.32px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '11px' }}>Services Details</p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingTop: '5.74px', paddingBottom: '3.62px', paddingLeft: '12.9px', paddingRight: '12.9px' }}>
                            <table className="bg-f1f4f9" cellPadding="0" cellSpacing="0" border="0" role="presentation" bgcolor="#f1f4f9" width="551.11" height="19.98" style={{ borderRadius: '4.99px', backgroundColor: '#f1f4f9', width: '551.11px', height: '19.98px', borderSpacing: 0, borderCollapse: 'separate' }}>
                              <tr>
                                <td align="left" valign="middle" height="19.98" style={{ paddingLeft: '6.91px', verticalAlign: 'middle', height: '19.98px' }}>
                                  <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                    <tr>
                                      <td valign="top" width="137" style={{ padding: '10px 30.79px', width: '137px', verticalAlign: 'top' }}>
                                        <p className="color-202224" style={{ fontSize: '12.83px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, textAlign: 'center', paddingLeft: '8px', lineHeight: '15px' }}>Service Item</p>
                                      </td>
                                      <td valign="top" width="65" style={{ padding: '10px 8px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-202224" style={{ fontSize: '12.83px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, textAlign: 'center', paddingLeft: '8px', lineHeight: '15px' }}>Quantity</p>
                                      </td>
                                      <td valign="top" width="65" style={{ padding: '10px 13.73px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-202224" style={{ fontSize: '12.83px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, textAlign: 'center', paddingLeft: '8px', lineHeight: '15px' }}>Year</p>
                                      </td>
                                      <td valign="top" width="65" style={{ padding: '10px 8px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-202224" style={{ fontSize: '12.83px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, textAlign: 'center', paddingLeft: '8px', lineHeight: '15px' }}>Months</p>
                                      </td>
                                      <td valign="top" width="65" style={{ padding: '10px 0px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-202224" style={{ fontSize: '12.83px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, textAlign: 'center', paddingLeft: '8px', lineHeight: '15px' }}>SQFT</p>
                                      </td>
                                      <td valign="top" width="65" style={{ padding: '10px 0px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-202224" style={{ fontSize: '12.83px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, textAlign: 'center', paddingLeft: '15px', lineHeight: '15px' }}>Frequency</p>
                                      </td>
                                      <td valign="top" width="65" style={{ padding: '10px 0px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-202224" style={{ fontSize: '12.83px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, textAlign: 'center', paddingLeft: '15px', lineHeight: '15px' }}>Price/SQFT</p>
                                      </td>
                                      <td valign="top" width="65" style={{ padding: '10px 0px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-202224" style={{ fontSize: '12.83px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, textAlign: 'center', paddingLeft: '8px', lineHeight: '15px' }}>Price Per Clean</p>
                                      </td>
                                      {/* <td valign="top" width="64.02" style={{ padding: '10px 3.41px', width: '64.02px', verticalAlign: 'top' }}>
                                        <p className="color-202224" style={{ fontSize: '14.83px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '15px' }}>Annual Investment</p>
                                      </td>
                                      <td valign="top" width="66.77" style={{ padding: '10px 2.16px', paddingLeft: '15px', width: '66.77px', verticalAlign: 'top' }}>
                                        <p className="color-202224" style={{ fontSize: '14.83px', fontWeight: 700, color: '#202224', margin: 0, padding: 0, lineHeight: '15px' }}>Price Per Door/Month</p>
                                      </td> */}
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        {
                          serviceData?.length >= 1 && 
                          serviceData?.map((value, index) => {
                            const price = extractPrice(value, 'price')
                            const digit = extractPrice(value, 'frequencyDigit')
                            const perCleanCost = getPerCleaningCost(price, value.sqft, value.quantity)
                            const annualCost = getOverallCost(perCleanCost, digit)
                            const unitPerMonth = ((perCleanCost) * (digit) / 12 / propertyData?.units).toFixed(2);
                            return (
                              <>
                              <tr>
                                <td align="left" style={{ paddingTop: '16.62px', paddingBottom: '10.31px', paddingLeft: '21.89px' }}>
                                  <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                    <tr>
                                      <td valign="top" width="137" style={{ paddingTop: '2.33px', width: '137px', verticalAlign: 'top' }}>
                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                          <tr>
                                            <td valign="top" height="10.74" style={{ height: '10.74px', verticalAlign: 'top' }}>
                                              <p className="color-979797" style={{ fontSize: '14.66px', fontWeight: 700, color: '#979797', margin: 0, padding: 0, lineHeight: '18px' }}>{value?.name}</p>
                                            </td>
                                          </tr>
                                          {/* <tr>
                                            <td align="left" style={{ paddingTop: '1.74px', paddingLeft: '1.25px' }}>
                                              <p className="color-979797" style={{ fontSize: '14.99px', fontWeight: 400, textAlign: 'left', color: '#979797', margin: 0, padding: 0 }}>{value?.description}</p>
                                            </td>
                                          </tr> */}
                                        </table>
                                      </td>
                                      <td valign="top" width="65" style={{ paddingTop: '3px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-979797" style={{ fontSize: '14.19px', fontWeight: 700, color: '#979797', margin: 0, padding: 0, textAlign: 'center', lineHeight: '9px' }}>{value.quantity}</p>
                                      </td>
                                      <td valign="top" width="65" style={{ paddingTop: '3px', paddingLeft: '8px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-979797" style={{ fontSize: '14.19px', fontWeight: 700, color: '#979797', margin: 0, padding: 0, textAlign: 'center', lineHeight: '9px' }}>{extractYear(value.createDate)}</p>
                                      </td>
                                      <td valign="top" width="65" style={{ paddingLeft: '8px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-979797" style={{ fontSize: '14.19px', fontWeight: 700, textAlign: 'center', color: '#979797', margin: 0, padding: 0 }}>{value?.months?.map(value => value)?.join(', ')}</p>
                                      </td>
                                      <td valign="top" width="65" style={{ paddingTop: '4px', paddingLeft: '8px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-979797" style={{ fontSize: '14.19px', fontWeight: 700, color: '#979797', margin: 0, padding: 0, textAlign: 'center', lineHeight: '9px' }}>{value.sqft}</p>
                                      </td>
                                      <td valign="top" width="65" style={{ paddingLeft: '5px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-979797" style={{ fontSize: '14.19px', fontWeight: 700, color: '#979797', margin: 0, padding: 0, textAlign: 'center', lineHeight: '9px' }}>{value.activePlan}</p>
                                      </td>
                                      <td valign="top" width="65" style={{ width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-979797" style={{ fontSize: '14.19px', fontWeight: 700, color: '#979797', margin: 0, padding: 0, textAlign: 'center', lineHeight: '9px' }}>${price}</p>
                                      </td>
                                      <td valign="top" width="65" style={{ paddingLeft: '5.46px', paddingRight: '12.46px', width: '65px', verticalAlign: 'top' }}>
                                        <p className="color-979797" style={{ fontSize: '14.19px', fontWeight: 700, color: '#979797', margin: 0, padding: 0, textAlign: 'center', lineHeight: '9px' }}>${perCleanCost}</p>
                                      </td>
                                      {/* <td valign="top" width="41.54" style={{ paddingTop: '3px', paddingLeft: '8px', paddingRight: '12.46px', width: '41.54px', verticalAlign: 'top' }}>
                                        <p className="color-979797" style={{ fontSize: '14.19px', fontWeight: 700, color: '#979797', margin: 0, padding: 0, lineHeight: '9px' }}>${annualCost}</p>
                                      </td>
                                      <td valign="top" width="41.54" style={{ paddingTop: '4px', paddingLeft: '8px', width: '41.54px', verticalAlign: 'top' }}>
                                        <p className="color-979797" style={{ fontSize: '14.19px', fontWeight: 700, color: '#979797', margin: 0, padding: 0, lineHeight: '9px' }}>${unitPerMonth}</p>
                                      </td> */}
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingTop: '10.31px', paddingLeft: '17.9px', paddingRight: '17.9px' }}>
                                  <div style={{ borderTop: '0.416px solid rgba(0, 0, 0, 0.2)', width: '542.58px', marginTop: '-0.42px' }}></div>
                                </td>
                              </tr>
                              </>
                            )
                          })
                        }
                        
                        <tr>
                          <td style={{ paddingTop: '16px', paddingLeft: '26.46px', paddingRight: '26.46px' }}>
                            <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                              <tr>
                                <td width="169.76" style={{ width: '169.76px' }}>
                                  <table className="" cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" height="48.43" style={{ borderRadius: '3.19px', padding: '7px', width: '100%', height: '48.43px', borderSpacing: 0, borderCollapse: 'separate' }}>
                                    <tr>
                                      <td align="left" valign="middle" height="48.43" style={{ paddingLeft: '5.39px', verticalAlign: 'middle', height: '48.43px' }}>
                                        <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0, width :'100%' }}>
                                          <tr>
                                            <td width="169.77" style={{ paddingLeft: '7.98px', width: '169.77px', maxWidth: '169.77px', height: '100px' }}>
                                              <table className="bg-388CFF" cellPadding="0" cellSpacing="0" border="0" role="presentation" bgcolor="#388CFF" width="100%" height="48.43" style={{ borderRadius: '3.19px', padding: '10px', backgroundColor: '#388CFF', width: '100%', height: '48.43px', borderSpacing: 0, borderCollapse: 'separate' }}>
                                                <td valign="top" width="124.53" style={{ width: '124.53px', verticalAlign: 'top', padding: '5px' }}>
                                                <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                  <tr>
                                                    <td align="left" valign="top" height="13.22" style={{ height: '13.22px', verticalAlign: 'top' }}>
                                                      <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                        <tr>
                                                          {/* <td>
                                                            <img src="assets/image_ae0d7c76.png" width="10" height="10" style={{ width: '10px', height: '10px', display: 'block' }} alt="Icon" />
                                                          </td> */}
                                                          <td width="73.97" style={{ width: '73.97px' }}>
                                                            <p className="color-fffffe" style={{ fontSize: '16.51px', textAlign: 'left', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '20px' }}>Service Analysis</p>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td style={{ paddingTop: '2.22px' }}>
                                                      <p className="color-f5f6fa" style={{ fontSize: '12.39px', fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '20px' }}>{totalSqft} SQFT Total</p>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>
                                                      <p className="color-fffffe" style={{ fontSize: '16.51px', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '20px' }}>Avg Cost per SQFT</p>
                                                    </td>
                                                  </tr>
                                                </table>
                                                </td>
                                                <td valign="top" width="39.85" style={{ paddingTop: '14.9px', width: '39.85px', verticalAlign: 'top' }}>
                                                  <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                    <tr>
                                                      {/* <td align="left" valign="top" height="12.18" style={{ paddingLeft: '16.43px', height: '12.18px', verticalAlign: 'top' }}>
                                                        <img src="assets/image_99bfa880.png" width="17" height="10" style={{ width: '17px', height: '10px', display: 'block' }} alt="Icon" />
                                                      </td> */}
                                                    </tr>
                                                    <tr>
                                                      <td style={{ paddingTop: '2.18px' }}>
                                                        <p className="color-f5f6fa" style={{ fontSize: '12.39px', textAlign: 'center', fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '8px' }}>${(totalCost / totalSqft)?.toFixed(2)}/SQFT</p>
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </td>
                                              </table>
                                            </td>
                                            <td width="169.77" style={{ paddingLeft: '7.98px', width: '169.77px', maxWidth: '169.77px', height: '100px' }}>
                                              <table className="bg-ff8214" cellPadding="0" cellSpacing="0" border="0" role="presentation" bgcolor="#ff8214" width="100%" height="48.43" style={{ borderRadius: '3.19px', padding: '10px', backgroundColor: '#ff8214', width: '100%', height: '48.43px', borderSpacing: 0, borderCollapse: 'separate' }}>
                                                <tr>
                                                  <td align="left" valign="middle" height="48.43" style={{ paddingLeft: '5.92px', verticalAlign: 'middle', height: '48.43px' }}>
                                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                      <tr>
                                                        <td align="left" valign="top" height="13.48" style={{ paddingLeft: '', height: '13.48px', verticalAlign: 'top' }}>
                                                          <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                            <tr>
                                                              {/* <td>
                                                                <img src="assets/image_7faf743b.png" width="11" height="10" style={{ width: '11px', height: '10px', display: 'block' }} alt="Icon" />
                                                              </td> */}
                                                              <td width="57.47" style={{ paddingLeft: '1.84px', width: '57.47px' }}>
                                                                <p className="color-fffffe" style={{ fontSize: '16.51px', textAlign: 'left', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '11px' }}>Investment</p>
                                                              </td>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td style={{ paddingTop: '2.48px' }}>
                                                          <p className="color-f5f6fa" style={{ fontSize: '12.39px', fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '8px' }}>${totalCost} Annually</p>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          <p className="color-fffffe" style={{ fontSize: '16.51px', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '11px' }}>Monthly Payment</p>
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </td>
                                                  <td valign="top" width="45.17" style={{ paddingTop: '15.43px', width: '45.17px', verticalAlign: 'top' }}>
                                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                      <tr>
                                                        {/* <td align="left" valign="top" height="12.18" style={{ paddingLeft: '22.29px', height: '12.18px', verticalAlign: 'top' }}>
                                                          <img src="assets/image_300eb1ec.png" width="17" height="10" style={{ width: '17px', height: '10px', display: 'block' }} alt="Icon" />
                                                        </td> */}
                                                      </tr>
                                                      <tr>
                                                        <td style={{ paddingTop: '2.18px' }}>
                                                          <p className="color-f5f6fa" style={{ fontSize: '12.39px', fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '15px' }}>${(totalCost / 12)?.toFixed(2)} PM</p>
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                            <td width="169.77" style={{ paddingLeft: '7.98px', width: '169.77px', maxWidth: '169.77px', height: '100px' }}>
                                              <table className="bg-e9941e" cellPadding="0" cellSpacing="0" border="0" role="presentation" bgcolor="#e9941e" width="100%" height="48.43" style={{ borderRadius: '3.19px', padding: '10px', backgroundColor: '#e9941e', width: '100%', height: '48.43px', borderSpacing: 0, borderCollapse: 'separate' }}>
                                                <tr>
                                                  <td align="left" valign="middle" height="48.43" style={{ paddingLeft: '5.92px', verticalAlign: 'middle', height: '48.43px' }}>
                                                    <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                      <tr>
                                                        <td align="left" valign="top" height="13.02" style={{ paddingLeft: '', height: '13.02px', verticalAlign: 'top' }}>
                                                          <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ margin: 0, borderSpacing: 0 }}>
                                                            <tr>
                                                              {/* <td>
                                                                <img src="assets/image_1232ab3c.png" width="11" height="11" style={{ width: '11px', height: '11px', display: 'block' }} alt="Icon" />
                                                              </td> */}
                                                              <td width="116.09" style={{ width: '116.09px' }}>
                                                                <p className="color-fffffe" style={{ fontSize: '16.51px', textAlign: 'left', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '20px' }}>Per Door Analysis</p>
                                                              </td>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td style={{ paddingTop: '1.88px' }}>
                                                          <table cellPadding="0" cellSpacing="0" border="0" role="presentation" style={{ borderSpacing: 0 }}>
                                                            <tr>
                                                              <td width="114.42" style={{ width: '114.42px' }}>
                                                                <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                                  <tr>
                                                                    <td style={{padding: '0px 0px 21px 0px'}}>
                                                                      <p className="color-f5f6fa" style={{ fontSize: '12.39px', fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '8px' }}>{[propertyData?.units]} Units</p>
                                                                    </td>
                                                                  </tr>
                                                                  <tr>
                                                                    <td>
                                                                      <p className="color-fffffe" style={{ fontSize: '16.51px', fontWeight: 700, color: 'white', margin: 0, padding: 0, lineHeight: '20px' }}>Per Door Investment</p>
                                                                    </td>
                                                                  </tr>
                                                                </table>
                                                              </td>
                                                              <td width="49.43" style={{ width: '49.43px' }}>
                                                                <table cellPadding="0" cellSpacing="0" border="0" role="presentation" width="100%" style={{ width: '100%', borderSpacing: 0 }}>
                                                                  <tr>
                                                                    {/* <td align="left" valign="top" height="11.12" style={{ paddingLeft: '26.54px', height: '11.12px', verticalAlign: 'top' }}>
                                                                      <img src="assets/image_ab089f34.png" width="17" height="10" style={{ width: '17px', height: '10px', display: 'block' }} alt="Icon" />
                                                                    </td> */}
                                                                  </tr>
                                                                  <tr>
                                                                    <td style={{ paddingTop: '1.12px' }}>
                                                                      <p className="color-f5f6fa" style={{ fontSize: '12.39px',  fontWeight: 400, letterSpacing: '-0.06px', color: '#f5f6fa', margin: 0, padding: 0, lineHeight: '18px' }}>${(totalCost / [propertyData?.units])?.toFixed(2)} / Unit PM</p>
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

  )
}

export default DownloadAgreement