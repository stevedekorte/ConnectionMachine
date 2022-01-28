

## CM2 panel Python software


Low-level driver code for the RPI is in `htlib` directory. See the README there. That code is compiled for the library `libht1632c-py.so` which must be in this directory or in the python load path. 

Several test programs exist to excercise the CM2 display panel. 'setxy.py' turns on a pixel at x and y, for example to turn on a pixel at x=10 and y=11 type:

```console
$ python setxy.py 10 11
```

## The CM2 HTTP Server

`cm2_server.py` drives the display by running an http server at port
8000 and responding to query strings in the URL of a GET request. Several command line options are available:

```
  -h, --help         show this help message and exit
  --silent           don't print anything to stdout
  --simulate         print a simulated screen to stdout
  --flip_horizontal  reverse horizontal direction, x=0 is at right
  --swap_xy          swap x and y directions, y is horizontal, x is vertical
  --flip_vertical    reverse vertical direction, y=0 is at bottom
```

To send a frame of data, send 128 characters of hexadecimal data in
column-major order with the `frame` query parameter.

Each 8 hex characters represent 32 bits in one column of LEDs. For
example the following curl command will send data to light the
leftmost and rightmost columns and top and bottom rows, drawing a box
around the perimeter of the display.


```console
$ curl -s 'http://cm2.local:8000/?frame=FFFFFFFF800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001800000018000000180000001FFFFFFFF'
```

Other query parameters are:

* `?bright=n` sets the PWM brightness where `n` is an integer between 0
  and 15.

* `?x=10&y=11&font=8x12&text=HELLO%20WORLD` will display the text
  "HELLO WORLD" (use URL string encoding) at position x=10 and y=11,
  using the `8x12` pixel font. If the `x` and `y` parameters are not
  specified the default position of zero (top left corner) is
  used. Negative positions can be used so that decrementing the `x`
  position will scroll the text left to right so that text wider than
  32 pixels can be displayed sequentially.

* `?clear=0` clears the display. This can be used with the `text`
  query to display text on a blank background. Note this only works with 
  the `text` command; to clear the display completely, send a `clear=0` 
  together with `text=%20` (space).


Several fonts are available, specified by character size as follows:


* 3x4num
* 4x5num
* 7x8num
* 4x6
* 4x6sym
* 5x8
* 6x8
* 7x12
* 8x12
* 12x16

A suffix of 'num' means that only numeric characters are available,
alphabetic characters will be rendered as an open rectangle. The font
selected by the `font` command is persistant and further `text`
commands will be rendered in that font.

As usual, multiple parameters may be used in one command, for example
the following command will display text at 10, 10 with a brightness of
25% on a dark background. 

```console
$ curl -s 'http://cm2.local:8000/?clear=0&x=10&y=10&bright=4&&text=Hello%20World'
```

# ----------------

README
======

Examples for the SURE electronics 32x16 bicolor LED dot matrix display.

The very same set of examples is once written in C and once in Python.


Connection
----------

Using a Raspberry PI model B2, you need to connect some GPIO pins to the
LED BR1 port, the input port, like this:

RPI                   SURE
---                   ----
GND             6     GND  8
GPIO 10 (MOSI) 19     DATA 7
GPIO 11 (SCLK) 23     WR   5
GPIO 8  (CE0)  24     CLK  2
GPIO 7  (CE1)  26     CS   1


Build and run C examples
------------------------ 

On your Raspberry PI open a shell, or connect to it by ssh, then inside
this directory execute:

make

Which will build the examples, have a look at the example source code,
the header will tell you what they do, and the steps inside the code
are also documented.

To run the examples you need first to enable the wiringPi spi module like:

gpio load spi


The examples them selfes need to be run with sudo, because you are about
to write to GPIO, hence for example:

sudo ./example1


Python examples
---------------

For instance you need to copy and run the examples from within the project
it's python directory, right there where the modules are placed.

First you need to enable the wiringPi spi module like:

gpio load spi


The examples them selfes need to be run with sudo, because you are about
to write to GPIO, hence for example:

sudo ./example1.py

