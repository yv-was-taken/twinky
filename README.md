# twinky: Crypto Trading API Modular CLI Suite

---

twinky is a discretionary CLI suite designed by crypto traders that hate GUIs, for crypto traders that hate GUIs.

this is **not** designed to be competitive in terms of execution, but instead intended for discretionary use. if you want HFT speed execution, rewrite yourself in a lower level lang, or wait for the rust version 🐱

twinky is designed from a modular approach. Meaning, it enables anyone to
build their systems on top, and is intended to be utilized as a tool that can handle otherwise tedious tasks of other automated trading systems such as env handling/exchange-specific api nuances, etc. twinky was created to help unify authentication, execution and data parsing across exchange APIs.

it is recommended to run `twinky` after install to setup config/env. this is requried for making any actions with twinky, and twinky will make you set up config/env before allowing any actions anyway.

twinky has two different modes...
-----------------------------
### interactive cli
```

  actions:
          -trade(t)
          --> execute trades.

          -listen(l)
          --> listen for and log portfolio updates in real time.

          -view(v)
          --> view portfolio, open orders, order history.

          -settings(s)
          --> view/modify config settings.

          -help(h)
          --> log this message.

          -exit
          --> exit the program.

```

`twinky {action}` then feed prompts on request.
##### `trade(t)`
interactive command to execute a trade...

walks the user through a list of prompts (in order):
  1. symbol
  2. leverage
  3. order type (market/limit)
    - if (limit):
       - execution style
         - point: executes at a specific price
         - range: spreads order throughout a range of prices
         - if (range):
           - from: starting point of range
           - to: ending point of range
           - iterations: number of times to split up trade within range
           - range sizing distribution:
             - linear: distributes evenly throughout range
             - exponential: increases sizing from "from" to "to" on a scale of y=x^2
  5. direction (long/short)
  6. order amount, denominated in token (i.e. ETH, BTC, DOGE, etc.)
  7. stop loss? (yes/no)
  8. reduce only? (yes/no)
        
##### `listen(l)`
wss connection listen to the market for new positions opened, closed, volume spikes, etc.
  - ...coming soon!

##### `view`

inspect data regarding user account
- balance: user balance, (including available and unavailable collateral)
- open orders: orders on the market yet to be filled
- closed orders: view closed orders executed using the given API key
- open postions: information regarding current open positions on the market

##### `settings(s)`

view/modify config settings
  - view/modify:
      - config
      - env

##### `help(h)`
  display help message

#### `exit`
  exit the program
  
### command line

same commands as the interactive version except meant to be used from the command line directly in one shot, or by other shell programs/languages capable of executing shell commands...

- `trade(t)`
  - flags:
    - type(required): market/limit
      - if (limit):
        - scale: execute trade on a point or range basis. takes no argument, if not listed, defaults to false
        - scale-type: required if scale is true, type of scaling, can be either "linear" or "exponential". defaults to linear.
        - price(required if scale === false): price value for the limit order to be executed at.
        - from(required if scale === true): starting value for range
        - to(required if scale === true): ending value for range
    - side(required): buy/sell
    - amount(required): order amount
    - symbol: asset to be traded. if none given, defaults to default symbol set in config.
    - stop: price value for stop loss. if none given, no stop will be set.
    - reduce: takes no argument, if given, sets order to reduce only.
- `listen(l)`
  - wss connection listen to the market for new positions opened, closed, volume spikes, etc.
    - ...coming soon!
- `view(v)`
  - takes no flags and only inputs
  - "balance"
  - "open orders"
  - "closed orders"
  - "positions" (open positions)
  - if either option is excluded, goes into interactive mode for the left out values.
- `settings(s)`
  - takes no flags, only inputs
  - "view/modify" "config/env"
  - if either option is excluded, goes into interactive mode for the left out values.

### todo:

    - calculate/display risk for trade before confirmation
    - wss listen
    - prettier/more colorful error logging.
    - order book limit FOK chase orders
    - conditional trigger orders
    - other exchanges implementation (currently just bybit)
