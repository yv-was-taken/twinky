# Blink: Crypto Trading API Modular CLI Suite

---

blink is a discretionary CLI suite designed by weeb traders, for weeb traders.

It is important to note that, as of right now, this is not designed to be a
competitive execution tool for HFT/low latency strategies. Trades are executed
via REST requests, and functionally speaking takes the same amount of time as
click trading in the UI.

But blink is designed with modular systems in mind. Meaning it enables anyone to
build their systems on top ,where blink can handle trade executions and API
KEY/secret payloads, as well as data regarding portfolios, markets, etc.

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

### todo:

    - calculate/display risk for trade before confirmation
    - wss listen
    - prettier/more colorful error logging.
    - order book limit FOK chase orders
    - conditional trigger orders
    - other exchanges implementation (currently just bybit)
