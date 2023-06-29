# Blink: Crypto Trading API Modular CLI Suite

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

    - command line arg flow
    - calculate/display risk for trade before confirmation
    - wss listen
    - set leverage for each ticker flow impl
    - prettier/more colorful error logging.
    - order book limit FOK chase orders
    - conditional trigger orders
    - other exchanges implementation (currently just bybit)
