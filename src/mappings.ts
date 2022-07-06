import {
  near,
  BigInt,
  log,
  json,
  TypedMap,
  JSONValue,
  BigDecimal,
  TypedMapEntry,
} from '@graphprotocol/graph-ts';
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

  if (methodName == 'ft_transfer_call') {
    // log.debug('action = {}', [action.data.toString()]);

    // const argsString = action.toFunctionCall().args.toString();
    const args = action.toFunctionCall().args;

    const argsObject = json.try_fromBytes(args).value.toObject();

    if (argsObject) {
      let sender: string | null;
      if (argsObject.get('receiver_id')) {
        sender = argsObject.get('receiver_id')!.toString();
      } else {
        sender = '';
      }

      let amt: string | null;
      if (argsObject.get('amount')) {
        amt = argsObject.get('amount')!.toString();
      } else {
        amt = '';
      }

      let memo: string | null;
      if (argsObject.get('memo')) {
        memo = argsObject.get('memo')!.toString();
      } else {
        memo = '';
      }

      // let msgObject: TypedMap<string, JSONValue> | null;
      // let actions: TypedMap<string, JSONValue> | null;
      // let refId: string | null;
      // if (argsObject.get('msg')) {
      //   let msgString = argsObject.get('msg')!.toString();
      //   msgObject = json.try_fromString(msgString).value.toObject();

      //   refId = msgObject.get('referral_id')!.toString();
      // } else {
      //   msgObject = null;
      //   actions = null;
      //   refId = '';
      // }

      // let logs: string | null;

      // logs = outcome.logs.toString();

      // log.debug('args = {}', [argsString.slice(10)]);
      // Check for the refferal field
      if (memo !== 'arbitoor.near') {
        return;
      }

      log.debug('sendId = {} amount = {} memo = {}  ', [sender, amt, memo]);

      // let txn = Transaction.load(receipt.receipt.id.toBase58());
      // if (!txn) {
      //   // const status = getOrInitStatus();
      //   // const latestPrice = status.price;

      //   txn = new Transaction(receipt.receipt.id.toBase58());
      //   txn.senderId = sender;
      //   txn.amount = amt;
      //   txn.refferalId = refId;
      //   txn.actionString = firstPoolId.toString();

      //   txn.save();
      // } else {
      //   log.error('Internal Error: {}', ['Storing Data']);
      // }
    } else {
      log.debug('args object consturction failed', []);
    }
  }
  return;
}

// import {
//   near,
//   BigInt,
//   log,
//   json,
//   TypedMap,
//   JSONValue,
//   BigDecimal,
//   TypedMapEntry,
// } from '@graphprotocol/graph-ts';
// import { Transaction } from '../generated/schema';

// export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
//   const actions = receipt.receipt.actions;
//   for (let i = 0; i < actions.length; i++) {
//     handleAction(actions[i], receipt);
//   }
// }
// function handleAction(
//   action: near.ActionValue,
//   receipt: near.ReceiptWithOutcome
// ): void {
//   if (action.kind != near.ActionKind.FUNCTION_CALL) {
//     return;
//   }
//   const outcome = receipt.outcome;
//   const methodName = action.toFunctionCall().methodName;

//   if (methodName == 'ft_on_transfer') {
//     // log.debug('action = {}', [action.data.toString()]);

//     const argsString = action.toFunctionCall().args.toString();
//     const args = action.toFunctionCall().args;

//     const argsObject = json.try_fromBytes(args).value.toObject();

//     if (argsObject) {
//       let sender: string | null;
//       if (argsObject.get('sender_id')) {
//         sender = argsObject.get('sender_id')!.toString();
//       } else {
//         sender = '';
//       }

//       let amt: string | null;
//       if (argsObject.get('amount')) {
//         amt = argsObject.get('amount')!.toString();
//       } else {
//         amt = '';
//       }

//       let msgObject: TypedMap<string, JSONValue> | null;
//       let actions: JSONValue[];
//       let refId: string | null;
//       if (argsObject.get('msg')) {
//         let msgString = argsObject.get('msg')!.toString();
//         msgObject = json.try_fromString(msgString).value.toObject();

//         let actionsString = msgObject.get('actions')!.toString();
//         actions = json.try_fromString(actionsString).value.toArray();

//         refId = msgObject.get('referral_id')!.toString()
//       } else {
//         msgObject = null;
//         actions = [];
//         refId =''
//       }

//       // log.debug('args = {}', [argsString.slice(10)]);
//       log.debug('sendId = {} amount = {} firstAction = {} refId = {}', [
//         sender,
//         amt,
//         actions[0].toString(),
//         refId
//       ]);

//       let txn = Transaction.load(receipt.receipt.id.toBase58());
//         if (!txn) {
//           // const status = getOrInitStatus();
//           // const latestPrice = status.price;

//           txn = new Transaction(receipt.receipt.id.toBase58());
//           txn.senderId = sender;
//           txn.amount = amt;
//           txn.refferalId = refId;
//           txn.actionString = actions[0].toString();

//           txn.save();
//         } else {
//           log.error('Internal Error: {}', ['Storing Data']);
//         }
//     } else {
//       log.debug('args object consturction failed', []);
//     }

//     return;

//     // const actionData = json
//     //   .try_fromString(action.data.toString())
//     //   .value.toObject();

//     // const senderId = actionData.get('sender_id')!.toString();
//     // const amount = actionData.get('amount')!.toString();
//     // const msgObj = actionData.get('msg')!.toObject();

//     // const actions = msgObj.get('actions')!.toArray();
//     // const refferalId = msgObj.get('referral_id')!.toString();

//     // if (refferalId === 'arbitoor.near') {
//     //   let txn = Transaction.load(receipt.receipt.id.toBase58());
//     //   if (!txn) {
//     //     // const status = getOrInitStatus();
//     //     // const latestPrice = status.price;

//     //     txn = new Transaction(receipt.receipt.id.toBase58());
//     //     txn.senderId = senderId;
//     //     txn.amount = amount;
//     //     txn.refferalId = refferalId;
//     //     // txn.dataString = dataString;

//     //     txn.save();
//     //   } else {
//     //     log.error('Internal Error: {}', ['FtTransfer Event']);
//     //   }
//     // } else {
//     //   log.info('Not arbitoor', ['Not our thing']);
//     // }
//   }

//   // log.info('Not Function call = {}', ['Not our thing']);

//   //

//   // for (let logIndex = 0; logIndex < outcome.logs.length; logIndex++) {
//   //   let outcomeLog = outcome.logs[logIndex].toString();
//   //   if (outcomeLog.startsWith('EVENT_JSON:')) {
//   //     outcomeLog = outcomeLog.replace('EVENT_JSON:', '');
//   //     const jsonData = json.try_fromString(outcomeLog);
//   //     const jsonObject = jsonData.value.toObject();
//   //     const event = jsonObject.get('event')!;
//   //     const dataArr = jsonObject.get('data')!.toArray();
//   //     const dataObj: TypedMap<string, JSONValue> = dataArr[0].toObject();

//   //     handleEvent(methodName, event.toString(), dataObj, receipt);
//   //   }
//   // }
// }

// function handleEvent(
//   method: string,
//   event: string,
//   data: TypedMap<string, JSONValue>,
//   receipt: near.ReceiptWithOutcome
// ): void {
//   if (
//     method == 'ft_on_transfer' ||
//     method == 'ft_on_transfer'
//     // &&    event == 'ft_transfer'
//   ) {
//     handleFtTransfer(data, receipt);
//   } else {
//     log.info('Nope', ['NOPE']);
//   }
// }

// export function handleFtTransfer(
//   data: TypedMap<string, JSONValue>,
//   receipt: near.ReceiptWithOutcome
// ): void {
//   const timestamp = receipt.block.header.timestampNanosec;
//   const receiptHash = receipt.receipt.id.toBase58();

//   // parse event
//   const senderId = data.get('sender_id')!.toString();
//   const amount = data.get('amount')!.toString();
//   const msgObj = data.get('msg')!.toObject();

//   const actions = msgObj.get('actions')!.toArray();
//   const refferalId = msgObj.get('referral_id')!.toString();

//   if (refferalId === 'arbitoor.near') {
//     let txn = Transaction.load(receiptHash);
//     if (!txn) {
//       // const status = getOrInitStatus();
//       // const latestPrice = status.price;

//       txn = new Transaction(receiptHash);
//       txn.senderId = senderId;
//       txn.amount = amount;
//       txn.refferalId = refferalId;
//       // txn.dataString = dataString;

//       txn.save();
//     } else {
//       log.error('Internal Error: {}', ['FtTransfer Event']);
//     }
//   } else {
//     log.info('Not arbitoor', ['Not our thing']);
//   }

//   // const amount = BigInt.fromString(data.get('amount')!.toString());
//   // const amountFloat = BigDecimal.fromString(data.get('amount')!.toString());

//   // update event
//   // let txn = Transaction.load(receiptHash);
//   // if (!txn) {
//   //   // const status = getOrInitStatus();
//   //   // const latestPrice = status.price;

//   //   txn = new Transaction(receiptHash);
//   //   txn.receiverId = receiverId;
//   //   txn.amount = amount;
//   //   txn.memo = memo;
//   //   txn.dataString = dataString;

//   //   txn.save();
//   // } else {
//   //   log.error('Internal Error: {}', ['FtTransfer Event']);
//   // }
// }
