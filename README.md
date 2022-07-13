> Not working on this anymore

Turns out that the graph actually tracks only `ActionReceipts` on near and not `DataReceipts` and also skips the `Failed` tranasctions which I found out 
from their [source code](https://github.com/graphprotocol/graph-node/blob/992121bbe95880b6ed6960bd5e9732829dc98c3d/chain/near/src/chain.rs#L248)


#### STEPS

```
yarn codegen 
```

```
yarn build
```

> graph auth here

```
yarn depoloy
```
