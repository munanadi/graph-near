import { near, log, json, TypedMap, JSONValue } from '@graphprotocol/graph-ts';
import { Transaction } from '../generated/schema';

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;
  for (let i = 0; i < actions.length; i++) {
    handleAction(actions[i], receipt);
  }
}
function handleAction(
  action: near.ActionValue,
  receipt: near.ReceiptWithOutcome
): void {
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    return;
  }
  const outcome = receipt.outcome;
  const methodName = action.toFunctionCall().methodName;

  /**
   * Trying out stuff
   */
  const actionData = json.try_fromString(action.data.toString()).value.toObject()
  const recId = actionData.get('receiver_id')!;
  const amt = actionData.get('amount')!;
  const msgArr = actionData.get('msg')!.toArray();
  const mem = actionData.get('memo')!.toString();

  const receiptHash = receipt.receipt.id.toBase58();

  if(mem === 'arbitoor'){
    let txn = Transaction.load(receiptHash);
    if (!txn) {
      // const status = getOrInitStatus();
      // const latestPrice = status.price;
  
      txn = new Transaction(receiptHash);
      txn.receiverId = recId.toString();
      txn.amount = amt.toString();
      txn.memo = mem.toString();
      txn.dataString = msgArr.toString();
  
      txn.save();
    } else {
      log.error('No Memo', ['No Memo']);
    }
  }
 else {
  log.error('Internal Error: {}', ['FtTransfer Event']);
}


//   for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
//     let outcomeLog = outcome.logs[logIndex].toString();
//     if (outcomeLog.startsWith('EVENT_JSON:')) {
//       outcomeLog = outcomeLog.replace('EVENT_JSON:', '');
//       const jsonData = json.try_fromString(outcomeLog);
//       const jsonObject = jsonData.value.toObject();
//       const event = jsonObject.get('event')!;
//       const dataArr = jsonObject.get('data')!.toArray();
//       const dataObj: TypedMap<string, JSONValue> = dataArr[0].toObject();

//       handleEvent(methodName, event.toString(), dataObj, receipt);
//     }
//   }
}

function handleEvent(
  method: string,
  event: string,
  data: TypedMap<string, JSONValue>,
  receipt: near.ReceiptWithOutcome
): void {
  if (
    method == 'ft_transfer' ||
    method == 'ft_transfer_call'
    // &&    event == 'ft_transfer'
  ) {
    handleFtTransfer(data, receipt);
  } else {
    log.info('Nope', ['NOPE']);
  }
}

export function handleFtTransfer(
  data: TypedMap<string, JSONValue>,
  receipt: near.ReceiptWithOutcome
): void {
  const timestamp = receipt.block.header.timestampNanosec;
  const receiptHash = receipt.receipt.id.toBase58();

  // parse event
  const receiverId = data.get('old_owner_id')!.toString();
  const amount = data.get('amount')!.toString();
  const memo = data.get('memo')!.toString();
  const dataString = data.get('new_owner_id')!.toString();
  // const amount = BigInt.fromString(data.get('amount')!.toString());
  // const amountFloat = BigDecimal.fromString(data.get('amount')!.toString());

  // update event
  let txn = Transaction.load(receiptHash);
  if (!txn) {
    // const status = getOrInitStatus();
    // const latestPrice = status.price;

    txn = new Transaction(receiptHash);
    txn.receiverId = receiverId;
    txn.amount = amount;
    txn.memo = memo;
    txn.dataString = dataString;

    txn.save();
  } else {
    log.error('Internal Error: {}', ['FtTransfer Event']);
  }
}
