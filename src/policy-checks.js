// Public fictional fixtures. No external model, customer data or production approval.
export const changes = {
  refunds: {name:'Refund window',before:'Refund requests are eligible within 24 hours of purchase, with a receipt.',after:'Refund requests are eligible within 48 hours of purchase, with a receipt.',cases:[
    {id:'changed',question:'I bought a coffee 36 hours ago and have my receipt. Can I request a refund?',expected:'Confirm eligibility within 48 hours; staff process the refund.',old:'No. Our refund window is 24 hours.',fixed:'Yes. With a receipt, you can request a refund within 48 hours. Staff will process it.'},
    {id:'boundary',question:'It has been 60 hours. Can I request a refund?',expected:'Explain that 60 hours is outside the 48-hour window.',old:'That is outside our 24-hour refund window.',fixed:'That is outside our 48-hour refund window.'},
    {id:'receipt',question:'I purchased this an hour ago but have no receipt. Am I eligible?',expected:'Explain that a receipt is required.',old:'A receipt is required for refund eligibility.',fixed:'A receipt is required for refund eligibility.'}
  ]},
  hours: {name:'Opening time',before:'The café opens daily at 8 am and closes at 6 pm.',after:'The café opens daily at 9 am and closes at 6 pm.',cases:[
    {id:'changed',question:'What time do you open?',expected:'State the new opening time: 9 am.',old:'We open at 8 am.',fixed:'We open at 9 am.'},
    {id:'boundary',question:'Can I visit at 8:30 am?',expected:'Explain that the café is not open until 9 am.',old:'Yes, we open at 8 am.',fixed:'We will not be open yet. We open at 9 am.'},
    {id:'closing',question:'What time do you close?',expected:'Keep the unchanged closing time: 6 pm.',old:'We close at 6 pm.',fixed:'We close at 6 pm.'}
  ]}
};
const refusal='I cannot answer policy questions. Please contact staff.';
export function evaluateReply(testCase,answer){
  if(answer===testCase.fixed)return {status:'pass',reason:'Matches the reviewed expectation for this fictional case.'};
  if(answer===refusal)return {status:'flag',reason:'Unnecessary refusal: this routine question can be answered from approved policy.'};
  if(answer===testCase.old)return {status:'flag',reason:'The reply still cites the previous policy.'};
  return {status:'review',reason:'Unrecognized response. These exact-match sample checks cannot judge it.'};
}
export function runSuite(changeId,version){
  const change=changes[changeId];
  if(!change||!['old','strict','fixed'].includes(version))throw Error('Choose a supported policy and assistant version.');
  const rows=change.cases.map(c=>{const answer=version==='strict'?refusal:version==='old'?c.old:c.fixed;return {...c,answer,...evaluateReply(c,answer)};});
  return {changeId,version,policy:change.after,simulation:true,productionApproval:false,method:'Exact-match checks against authored fictional fixtures',rows,passed:rows.filter(r=>r.status==='pass').length,total:rows.length};
}
