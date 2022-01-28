---
title: Writing Reactors in Python
layout: docs
permalink: /docs/handbook/write-reactor-py
oneline: "Writing Reactors in Python."
preamble: >
---
In the Python reactor target for Lingua Franca, reactions are written in Python. The user-written reactors are then generated into a Python 3 script that can be executed on several platforms. The Python target has been tested on Linux, MacOS, and Windows. To facilitate efficient and fast execution of Python code, the generated program relies on a C extension to facilitate Lingua Franca APIs such as `set` and `schedule`. To learn more about the structure of the generated Python program, see [Implementation Details](#implementation-details).

Python reactors can bring the vast library of scientific modules that exist for Python into a Lingua Franca program. Moreover, since the Python reactor target is based on a fast and efficient C runtime library, Lingua Franca programs can execute much faster than native equivalent Python programs in many cases. Finally, interoperability with C reactors is planned for the future.

> :spiral_notepad: In comparison to the C reactor target, the Python target can be up to an order of magnitude slower. However, depending on the type of application and the implementation optimizations in Python, you can achieve an on-par performance to the C target in many applications.

## Setup

First, install Python 3 on your machine. See [downloading python](https://wiki.python.org/moin/BeginnersGuide/Download).

> :spiral_notepad: The Python target requires a C implementation of Python (nicknamed CPython). This is what you will get if you use the above link, or with most of the alternative Python installations such as Anaconda. See [this](https://www.python.org/download/alternatives/) for more details.

The Python reactor target relies on `pip` and `setuptools` to be able to compile and install a [Python C extension](https://docs.python.org/3/extending/extending.html) for each LF program. To install `pip3`, you can follow instructions [here](https://pip.pypa.io/en/stable/installation/).
`setuptools` can be installed using `pip3`:

```bash
pip3 install setuptools
```

> :spiral_notepad: A [Python C extension](https://docs.python.org/3/extending/extending.html) is currently generated for each Lingua Franca program. To ensure cross-compatibility across multiple platforms, this extension is installed in the user space once code generation is finished (see [Implementation Details](#implementation-details)). This extension module will have the name LinguaFranca[your_LF_program_name]. There is a handy script [here](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/uninstallAllLinguaFrancaTestPackages.sh) that can uninstall all extension modules that are installed automatically by Lingua Franca tools (such as `lfc`).

## A Minimal Example

A “Hello World” reactor for the target looks like this:

```python
target Python;
main reactor Minimal {
    reaction(startup) {=
        print("Hello World.")
    =}
}
```

The `startup` trigger causes the reaction to execute at the logical start time of the program. This program can be found in a file called [Minimal.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/Minimal.lf) in the [test directory], where you can also find quite a few more interesting examples. If you compile this using the `lfc` [command-line compiler](https://github.com/lf-lang/lingua-franca/wiki/downloading-and-building#Command-Line-Tools) or the [Eclipse-base IDE], then a generated file called `Minimal.py` plus supporting files will be put into a subdirectory called `src-gen/Minimal`. If you are in the test directory, you can run the generated `Minimal.py` by running the following code in a shell:

```bash
python3 src-gen/Minimal/Minimal.py
```


The resulting output should look something like this:

```bash
---- Start execution at time Mon Oct 12 14:31:00 2020
---- plus 213090100 nanoseconds.
Hello World.
---- Elapsed logical time (in nsec): 0
---- Elapsed physical time (in nsec): 96,100
```



## The Python Target Specification 

To have Lingua Franca generate Python code, start your `.lf` file with the following target specification:

```
target Python;
```

A Python target specification may optionally specify any of the [standard parameters]() (except for flags) that are supported by all targets.

For example, for the Python target, in a source file named `Foo.lf`, you might specify:

```
target Python {
    fast: true,
    timeout: 10 secs
};
```

The `fast` option given above specifies to execute the file as fast as possible, ignoring timing delays. This is achieved by not waiting for physical time to match logical time.

The `timeout` option specifies to stop after 10 seconds of logical time have elapsed.

These specify the _default_ behavior of the generated code, the behavior it will exhibit if you give no command-line option. FIXME: command-line options are not supported yet.

> :warning: The LFC lexer does not support single-quoted strings in Python. This limitation also applies to target property values.

## Command-Line Arguments 

The Python reactor target currently does not support dynamically changing arguments at runtime.

## Imports 

The [import statement](Language-Specification#import-statement) can be used to share reactor definitions across several applications. Suppose for example that we modify the above Minimal.lf program as follows and store this in a file called [HelloWorld.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/HelloWorld.lf):

```python
target Python;
reactor HelloWorld {
	state success(false);
	reaction(startup) {=
		print("Hello World.")
		self.success = True
	=}
}
main reactor HelloWorldTest {
	a = new HelloWorld();
}
```

This can be compiled and run, and its behavior will be identical to the version above. But now, this can be imported into another reactor definition as follows:

```
target Python;
import HelloWorld.lf;
main reactor TwoHelloWorlds {
	a = new HelloWorld();
	b = new HelloWorld();
}
```

This will create two instances of the HelloWorld reactor, and when executed, will print “Hello World” twice.

> :spiral_notepad: In the above example, the order in which the two reactions are invoked is undefined because there is no causal relationship between them.

A more interesting illustration of imports can be found in the [Import.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/Import.lf) test case in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/test/Python).

## Preamble

Reactions may contain arbitrary Python code, but often it is convenient for that code to use external packages and modules or to share class and method definitions. For either purpose, a reactor may include a preamble section. For example, the following reactor uses the `platform` module to print the platform information and a defined method to add 42 to an integer:

```python
main reactor Preamble {
	preamble {=
		import platform
		def add_42(self, i):
			return i + 42
	=}
	timer t;
	reaction(t) {=
		s = "42"
		i = int(s)
		print("Converted string {:s} to int {:d}.".format(s, i))
		print("42 plus 42 is ", self.add_42(42))
		print("Your platform is ", self.platform.system())
	=}
}
```

On a Linux machine, this will print:

```bash
Converted string 42 to int 42.
42 plus 42 is 84
Your platform is Linux
```

By putting import in the **preamble**, the module becomes available in all reactions of this reactor using the self modifier.

> :spiral_notepad: Preambles will be put in the generated Python class for the given reactor, and thus is part of the instance of the reactor (and cannot be shared between different instantiations of the reactor). For more information about implementation details of the Python target, see [Implementation Details](#implementation-details).

Alternatively, top level preambles could be used that don't belong to any particular reactor. These preambles can be used for functions such as import. The following example shows importing the [hello](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/include/hello.py) module:

```python
target Python {
    files: include/hello.py
};

preamble {=
import hello
=}
```

Notice the usage of the `files` target property to move the `hello.py` module located in the `include` folder of the test directory into the working directory (located in `src-gen/NAME`).

## Reactions

[Recall](https://github.com/lf-lang/lingua-franca/wiki/Language-Specification#reaction-declaration) that a reaction is defined within a reactor using the following syntax:

> **reaction**(*triggers*) *uses* -> *effects* {=<br/>
> &nbsp;&nbsp; ... target language code ... <br/>
> =}

In this section, we explain how **triggers**, **uses**, and **effects** variables work in the Python target.

## Types

In the Python target, reactor elements like inputs, outputs, actions, parameters, and state variables are not typed. This effectively allows for any valid Python object to be passed on these elements. For more details and examples on using various Python object types, see [Sending and Receiving Objects](#sending-and-receiving-objects).

### Inputs and Outputs

In the body of a reaction in the Python target, the value of an in put is obtained using the syntax `name.value`, where `name` is the name of the input port. To determine whether an input is present, use `name.is_present`. For example, the [Determinism.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/Determinism.lf) test case in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/test/Python) includes the following reactor:

```python
reactor Destination {
    input x;
    input y;
    reaction(x, y) {=
        sm = 0
        if x.is_present:
            sm += x.value
        if y.is_present:
            sm += y.value
        print("Received ", sm)
        if sm != 2:
            sys.stderr.write("FAILURE: Expected 2.\n")
            exit(4)
    =}
}
```

The reaction refers to the input values `x.value` and `y.value` and tests for their presence by referring to the variables `x.is_present` and `y.is_present`. If a reaction is triggered by just one input, then normally it is not necessary to test for its presence; it will always be present. But in the above example, there are two triggers, so the reaction has no assurance that both will be present.

Inputs declared in the **uses** part of the reaction do not trigger the reaction. Consider the following modification to the above reaction:

```python
reaction(x) y {=
    sm = x.value
    if y.is_present:
        sm += y.value;
    print("Received ", sm)
=}
```

It is no longer necessary to test for the presence of `x` because that is the only trigger. The input `y`, however, may or may not be present at the logical time that this reaction is triggered. Hence, the code must test for its presence.

The **effects** portion of the reaction specification can include outputs and actions. Actions will be described below. Outputs are set using a `SET` macro. For example, we can further modify the above example as follows:

```python
output z;
reaction(x) y -> z {=
    sm = x.value
    if y.is_present:
        sm += y.value
    z.set(sm)
=}
```

The `set` function on an output port will perform the following operation:

```
z.value = sm
z.is_present = True
```

The `set` function can be used to set any valid Python object. For more information, see [Sending and Receiving Objects](#sending-and-receiving-objects).

If an output gets set more than once at any logical time, downstream reactors will see only the _final_ value that is set. Since the order in which reactions of a reactor are invoked at a logical time is deterministic, and whether inputs are present depends only on their timestamp, the final value set for an output will also be deterministic.

An output may even be set in different reactions of the same reactor at the same logical time. In this case, one reaction may wish to test whether the previously invoked reaction has set the output. It can check `name.is_present` to determine whether the output has been set. For example, the following reactor (see [TestForPreviousOutput.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/TestForPreviousOutput.lf)) will always produce the output 42:

```python
reactor Source {
    output out;
    preamble {=
        import random
    =}

    reaction(startup) -> out {=
        # Set a seed for random number generation based on the current time.
        self.random.seed()
        # Randomly produce an output or not.
        if self.random.choice([0,1]) == 1:
            out.set(21)
    =}
    reaction(startup) -> out {=
        if out.is_present:
            out.set(2 * out.value)
        else:
            out.set(42)
    =}
}
```

The first reaction may or may not set the output to 21. The second reaction doubles the output if it has been previously produced and otherwise produces 42.

### Using State Variables

A reactor may declare state variables, which become properties of each instance of the reactor. For example, the following reactor (see [Count.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/lib/Count.lf)) will produce the output sequence 1, 2, 3, ... :

```python
reactor Count {
    state count(1);
    output out;
    timer t(0, 1 sec);
    reaction(t) -> out {=
        out.set(self.count)
        self.count += 1
    =}
}
```

The declaration on the second line gives the variable the name "count", and initializes its value to 1.

The initial value is the expression enclosed within the parentheses. It may be any [LF expression](Language-Specification.md#appendix-lf-expressions), including an integer like seen above. LF supports only simple expression forms, if you need an arbitrary Python expression, you can enclose it within the Python-code delimiters `{= ... =}` (see example below).

In the body of the reaction, the state variable is referenced using the syntax `self.count`. Here, `self` is a keyword that refers to the generated reactor class in Python and contains all the instance-specific data associated with an instance of the reactor. For more information regarding the implementation details of the Python target, see [Implementation Details](#implementation-details). Since each instance of a reactor has its own state variables, these variables are carried in the self object.

In certain cases, such as when more control is needed for initialization of certain class objects, this method might be preferable. Nonetheless, the code delimiters `{= ... =}` can also also be used. The following example, taken from [StructAsState.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/StructAsState.lf) demonstrates this usage:

```python
main reactor StructAsState {
    preamble {=
        class hello:
            def __init__(self, name, value):
                self.name = name
                self.value = value    
    =}
    state s ({=self.hello("Earth", 42) =});
    reaction(startup) {=
        print("State s.name='{:s}', value={:d}.".format(self.s.name, self.s.value))
        if self.s.value != 42:
            sys.stderr.write("FAILED: Expected 42.\n")
            exit(1)
    =}
}
```

Notice that a class `hello` is defined in the preamble. The state variable `s` is then initialized to an instance of `hello` constructed within the `{= ... =}` delimiters.

State variables may be initialized to lists or tuples without requiring `{==}` delimiters. The following illustrates the difference:
```python
target Python;
main reactor Foo {
    state a_tuple(1, 2, 3);
    state a_list([1, 2, 3]);
    reaction(startup) {=
        # will print "<class 'tuple'> != <class 'list'>"
        print("{0} != {1}".format(type(self.a_tuple), type(self.a_list)))
    =}
}
```

In Python, tuples are immutable, while lists can be modified. Be aware also that the syntax for declaring tuples in the Python target is the same syntax as to declare an array in the C target, so the immutability might be a surprise.

### Using Parameters

Reactor parameters are also referenced in the Python code using the `self` object. The [Stride.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/Stride.lf) example modifies the above `Count` reactor so that its stride is a parameter:

```python
target Python;
reactor Count(stride(1)) {
    state count(1);
    output y;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        y.set(self.count)
        self.count += self.stride
    =}
}
reactor Display {
    input x;
    state expected(1); // for testing.
    reaction(x) {=
        print("Received: ", x.value)
        if x.value != self.expected:
            sys.stderr.write("ERROR: Expected {:d}.\n".format(self.expected))
        self.expected += 2
    =}
}
main reactor Stride {
    c = new Count(stride = 2);
    d = new Display();
    c.y -> d.x;
}
```

The second line defines the `stride` parameter and gives its initial value. As with state variables, types are not allowed. The initial value can be alternatively put in `{= ... =}` if necessary. The parameter is referenced in the reaction with the syntax `self.stride`.

When the reactor is instantiated, the default parameter value can be overridden. This is done in the above example near the bottom with the line:

```
c = new Count(stride = 2);
```

If there is more than one parameter, use a comma-separated list of assignments.

Like state variables, parameters can have list or tuple values. In the following example, the parameter `sequence` has as default value the list `[0, 1, 2]`:

```python
reactor Source(sequence([0, 1, 2])) {
    output out;
    state count(0);
    logical action next;
    reaction(startup, next) -> out, next {=
        out.set(self.sequence[self.count])
        self.count+=1
        if self.count < len(self.sequence):
            next.schedule(0)
    =}
}
```
That default value can be overridden when instantiating the reactor using a similar syntax:

```
s = new Source(sequence = [1, 2, 3, 4]);
```

Notice that as any ordinary Python list, `len(self.sequence)` has been used in the code to deduce the length of the list.

In the above example, the [**logical action**](https://github.com/lf-lang/lingua-franca/wiki/Language-Specification#action-declaration) named `next` and the `schedule` function are explained below in [Scheduling Delayed Reactions](#scheduling-delayed-reactions); here, they are used simply to repeat the reaction until all elements of the array have been sent.

### Sending and Receiving Objects

You can define your own data types in Python and send and receive those. Consider the [StructAsType](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/StructAsType.lf) example:

```
target Python {files: include/hello.py};

preamble {=
import hello
=}

reactor Source {
    output out;
    
    reaction(startup) -> out {=
        temp = hello.hello("Earth", 42)
        out.set(temp)
    =}
}
```

The top-level preamble has imported the [hello](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/include/hello.py) module, which contains the following class:

```python
class hello:
    def __init__(self, name = "", value = 0):
        self.name = name
        self.value = value  
```

In the reaction to **startup**, the reactor has created an instance object of this class (as local variable named `temp`) and passed it downstream using the `set` method on output port `out`.

Alternatively, you can forego the variable and pass an instance object of the class directly to the port value, as is used in the [StructAsTypeDirect](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/StructAsTypeDirect.lf) example:

```python
reactor Source {
    output out;
    reaction(startup) -> out {=
        out.value = hello.hello()
        out.value.name = "Earth"
        out.value.value = 42
        out.set(out.value)
    =}
}
```

The call to the `set` function is necessary to inform downstream reactors that the class object has a new value. In short, the `set` method is defined as follows:

> **.set**_(value)_; Set the specified output (or input of a contained reactor) to the specified value. This value can be any Python object (including None and objects of type Any). The value is copied and therefore the variable carrying the value can be subsequently modified without changing the output.

A reactor receiving the class object message can take advantage of Python's duck typing and directly access the object:

```python
reactor Print(expected(42)) {
    input _in;
    reaction(_in) {=
        print("Received: name = {:s}, value = {:d}\n".format(_in.value.name, 
                                                             _in.value.value))
    =}
}
```

> :spiral_notepad: The `hello` module has been imported using a top-level preamble, therefore, the contents of the module are available to all reactors defined in the current Lingua Franca file (similar situation arises if the `hello` class itself was in the top-level preamble).



## Timed Behavior

Timers are specified exactly as in the [Lingua Franca language specification](Language-Specification#timer-declaration). When working with time in the Python code body of a reaction, however, you will need to know a bit about its internal representation.

In the Python target, similar to the C target, the value of a time instant or interval is an integer specifying a number of nanoseconds. An instant is the number of nanoseconds that have elapsed since January 1, 1970. An interval is the difference between two instants. When an LF program starts executing, logical time is (normally) set to the instant provided by the operating system (on some embedded platforms without real-time clocks, it will be set to zero instead).

Time in the Python target is an `int`, which is unbounded. For better clarity, two derived types are defined in `LinguaFrancaBase`, `instant_t` and `interval_t`, which you can use for time instants and intervals respectively. These are both equivalent to `int`, but using those types will insulate your code against changes and platform-specific customizations. 

Lingua Franca uses a superdense model of time. A reaction is invoked at a logical **Tag**, an object consists of a `time` value (an int) and a `microstep` value (an unsigned int). The tag is guaranteed to not increase during the execution of a reaction.  Outputs produced by a reaction have the same tag as the inputs, actions, or timers that trigger the reaction, and hence are **logically simultaneous**.

`Tag`s can be initialized using `Tag(time=some_number, microstep=some_other_number)`.

The functions for working with time are defined in [pythontarget.c](https://github.com/lf-lang/reactor-c-py/blob/main/lib/pythontarget.c#L971).  The most useful functions are:

* `get_current_tag() -> Tag`: Returns a Tag instance of the current tag at which this reaction has been invoked. 
* `get_logical_time() -> int`: Get the current logical time (the first part of the current tag).
* `get_microstep() -> unsigned int`: Get the current microstep (the second part of the current tag).
* `get_elapsed_logical_time() -> int`: Get the logical time elapsed since program start.
* `compare_tags(Tag, Tag) -> int`: Compare two `Tag` instances, returning -1, 0, or 1 for less than, equal, and greater than. `Tag`s can also be compared using rich comparators (ex. `<`, `>`, `==`), which returns `True` or `False`.

There are also some useful functions for accessing physical time:

* `get_physical_time() -> int`: Get the current physical time.
* `get_elapsed_physical_time() -> int`: Get the physical time elapsed since program start.
* `get_start_time() -> int`: Get the starting physical and logical time.

The last of these is both a physical and logical time because, at the start of execution, the starting logical time is set equal to the current physical time as measured by a local clock.

A reaction can examine the current logical time (which is constant during the execution of the reaction). For example, consider the [GetTime.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/GetTime.lf) example:

```python
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        logical = get_logical_time()
        print("Logical time is ", logical)
    =}
}
```

When executed, you will get something like this:

```bash
---- Start execution at time Thu Nov  5 08:51:02 2020
---- plus 864237900 nanoseconds.
Logical time is  1604587862864237900
Logical time is  1604587863864237900
Logical time is  1604587864864237900
...
```

The first two lines give the current time-of-day provided by the execution platform at the start of execution. This is used to initialize logical time. Subsequent values of logical time are printed out in their raw form, rather than the friendlier form in the first two lines. If you look closely, you will see that each number is one second larger than the previous number, where one second is 1000000000 nanoseconds.

You can also obtain the _elapsed_ logical time since the start of execution:

```python
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        elapsed = get_elapsed_logical_time()
        print("Elapsed logical time is ", elapsed)
    =}
}
```

This will produce:

```bash
---- Start execution at time Thu Nov  5 08:51:02 2020
---- plus 864237900 nanoseconds.
Elapsed logical time is  0
Elapsed logical time is  1000000000
Elapsed logical time is  2000000000
...
```

You can also get physical time, which comes from your platform's real-time clock:

```python
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        physical = get_physical_time()
        print("Physical time is ", physical)
    =}
}
```

This will produce something like this:

```bash
---- Start execution at time Thu Nov  5 08:51:02 2020
---- plus 864237900 nanoseconds.
Physical time is  1604587862864343500
Physical time is  1604587863864401900
Physical time is  1604587864864395200
...
```

Finally, you can get elapsed physical time:

```python
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        elapsed_physical = get_elapsed_physical_time()
        print("Elapsed physical time is ", elapsed_physical)
    =}
}
```

This will produce something like this:

```bash
---- Start execution at time Thu Nov  5 08:51:02 2020
---- plus 864237900 nanoseconds.
Elapsed physical time is  110200
Elapsed physical time is  1000185400
Elapsed physical time is  2000178600
...
```

Notice that these numbers are increasing by roughly one second each time. If you set the `fast` target parameter to `true`, then physical time will elapse much faster than logical time.

Working with nanoseconds in the Python code can be tedious if you are interested in longer durations. For convenience, a set of functions are available to the Python programmer to convert time units into the required nanoseconds. For example, you can specify 200 msec in Python code as `MSEC(200)` or two weeks as `WEEKS(2)`. The provided functions are `NSEC`, `USEC` (for microseconds), `MSEC`, `SEC`, `MINUTE`, `HOUR`, `DAY`, and `WEEK`. You may also use the plural of any of these. Examples are given in the next section.

### Scheduling Delayed Reactions

The Python target provides a `.schedule()` method to trigger an action at a future logical time. Actions are described in the [Language Specification](language-specification#action-declaration) document. Consider the [Schedule](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/Schedule.lf) reactor:

```python
target Python;
reactor Schedule {
    input x;
    logical action a;
    reaction(a) {=
        elapsed_time = get_elapsed_logical_time()
        print("Action triggered at logical time {:d} nsec after start.".format(elapsed_time))
    =}
    reaction(x) -> a {=
        a.schedule(MSEC(200))
    =}
}
```

When this reactor receives an input `x`, it calls `a.schedule()`, specifying the action `a` to be triggered and the logical time offset (200 msec). The action `a` will be triggered at a logical time 200 milliseconds after the arrival of input `x`. At that logical time, the second reaction will trigger and will use the `get_elapsed_logical_time()` function to determine how much logical time has elapsed since the start of execution.

Notice that after the logical time offset of 200 msec, there may be another input `x` simultaneous with the action `a`. Because the reaction to `a` is given first, it will execute first. This becomes important when such a reactor is put into a feedback loop (see below).

### Zero-Delay actions

If the specified delay in a `.schedule()` call is zero, then the action `a` will be triggered one **microstep** later in **superdense time** (see [Superdense Time](https://github.com/lf-lang/lingua-franca/wiki/language-specification#superdense-time)). Hence, if the input `x` arrives at metric logical time t, and you call `.schedule()` as follows:

```
a.schedule(0)
```

then when a reaction to `a` is triggered, the input `x` will be absent (it was present at the _previous_ microstep). The reaction to `x` and the reaction to `a` occur at the same metric time _t_, but separated by one microstep, so these two reactions are _not_ logically simultaneous.

The metric time is visible to the Python programmer and can be obtained in a reaction using either `get_elapsed_logical_time()`, as above or `get_logical_time()`. The latter function also returns an `int` (aka `instant_t`), but its meaning is now the time elapsed since January 1, 1970 in nanoseconds.

As described in the [Language Specification](https://github.com/lf-lang/lingua-franca/wiki/language-specification#action-declaration) document, action declarations can have a _min_delay_ parameter. This modifies the timestamp further. Also, the action declaration may be **physical** rather than **logical**, in which case the assigned timestap will depend on the physical clock of the executing platform.

## Actions With Values

Actions can also carry a **value**, a Python object that becomes available to any reaction triggered by the action. This is particularly useful for physical actions that are externally triggered because it enables the action to convey information to the reactor. This could be, for example, the body of an incoming network message or a numerical reading from a sensor.

Recall from the [Contained Reactors](https://github.com/lf-lang/lingua-franca/wiki/language-specification#Contained-Reactors) section in the Language Specification document that the **after** keyword on a connection between ports introduces a logical delay. This is actually implemented using a logical action. We illustrate how this is done using the [DelayInt](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/DelayInt.lf) example:

```python
reactor Delay(delay(100 msec)) {
    input _in;
    output out;
    logical action a;
    reaction(a) -> out {=
        if (a.value is not None) and a.is_present:
            out.set(a.value)
    =}
    reaction(_in) -> a {=
        a.schedule(self.delay, _in.value)
    =}
}
```

Using this reactor as follows:

```
d = new Delay();
source.out -> d._in;
d._in -> sink.out;
```

is equivalent to:

```
source.out -> sink.in after 100 msec;
```

The reaction to the input `in` declares as its effect the action `a`. This declaration makes it possible for the reaction to schedule a future triggering of `a`. As with other constructs in the Python reactor target, types are avoided.

The first reaction declares that it is triggered by `a` and has effect `out`. To read the value, it uses the `a.value` class variable. Because this reaction is first, the `out` at any logical time can be produced before the input `_in` is even known to be present. Hence, this reactor can be used in a feedback loop, where `out` triggers a downstream reactor to send a message back to `_in` of this same reactor. If the reactions were given in the opposite order, there would be causality loop and compilation would fail.

## Stopping Execution
A reaction may request that the execution stop after all events with the current timestamp have been processed by calling the built-in function `request_stop()`, which takes no arguments. In a non-federated execution, the actual last tag of the program will be one microstep later than the tag at which `request_stop()` was called. For example, if the current tag is `(2 seconds, 0)`, the last (stop) tag will be `(2 seconds, 1)`.

> :spiral_notepad: The [[ timeout | Target-Specification#timeout ]] target specification will take precedence over this function. For example, if a program has a timeout of `2 seconds` and `request_stop()` is called at the `(2 seconds, 0)` tag, the last tag will still be `(2 seconds, 0)`.

## Log and Debug Information
The Python supports the [[ logging | Target-Specification#logging ]] target specification. This will cause the runtime to produce more or less information about the execution. However, user-facing functions for different logging levels are not yet implemented (see issue [#619](https://github.com/lf-lang/lingua-franca/issues/619)).

## Implementation Details
The Python target is built on top of the C runtime to enable maximum efficiency where possible. The Python target uses the [[ single threaded C runtime | Writing-Reactors-in-C#single-threaded-implementation ]] by default but will switch to the [[ multithreaded C runtime | Writing-Reactors-in-C#multithreaded-implementation ]] if a physical action is detected. The [[ threads | Writing-Reactors-in-C#threads ]] target specification can be used to override this behavior.

Running [[ lfc | downloading-and-building#Command-Line-Tools ]] on a `XXX.lf` program that uses the Python target specification will create the following files:
```
├── src
│   └── XXX.lf
└── src-gen
    └── XXX
        ├── core
        │   ...             # C runtime files
        ├── ctarget.c       # C target API implementations
        ├── ctarget.h       # C target API definitions
        ├── pythontarget.c  # Python target API implementations
        ├── pythontarget.h  # Python target API definitions
        ├── setup.py        # Setup file used to install the Python C extension
        ├── XXX.c           # Source code of the Python C extension
        └── XXX.py          # Actual Python code containing reactors and reaction code
```

There are two major components in the `src-gen/XXX` directory that together enable the execution of a Python target application: A [[ XXX.py | Writing-Reactors-in-Python#the-xxxpy-file-containing-user-code ]] file containing the user code (e.g., reactor definitions and reactions) and the source code for a [[ Python C extension module | Writing-Reactors-in-Python#the-generated-linguafrancaxxx-python-module-a-c-extension-module ]] called `LinguaFrancaXXX` containing the C runtime, as well as hooks to execute the user-defined reactions. The interactions between the `src-gen/XXX/XXX.py` file and the `LinguaFrancaXXX` module are explained [[ here | Writing-Reactors-in-Python#interactions-between-xxxpy-and-linguafrancaxxx ]].

### The `XXX.py` file containing user code
The `XXX.py` file contains all the reactor definitions in the form of Python classes. The contents of a reactor are converted as follows:
 - Each **Reaction** in a reactor definition will be converted to a class method.
 - Each **Parameter** will be converted to a class [property](https://docs.python.org/3/library/functions.html?highlight=property#property) to make it read-only.
 - Each **State** variable will be converted to an [instance variable](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables).
 - Each trigger and effect will be converted to an object passed as a method function argument to reaction methods, allowing the body of the reaction to access them.
 - Each reactor **Preamble** will be put in the class definition verbatim.

Finally, each reactor class instantiation will be converted to a Python object class instantiation.

For example, imagine the following program:
```Python
# src/XXX.lf
target Python;
reactor Foo(bar(0)) {
    preamble {=
        import random
    =}
    state baz
    input _in
    logical action act
    reaction(_in, act) {=
        # Body of the reaction
        self.random.seed() # Note the use of self
    =}
}
main reactor {
    foo = new Foo()
}
```
Th reactor `Foo` and its instance, `foo`, will be converted to
```Python
# src-gen/XXX/XXX.py
...
                
# Python class for reactor Foo
class _Foo:

    # From the preamble, verbatim:
    import random
    def __init__(self, **kwargs):
        #Define parameters and their default values
        self._bar = 0
        # Handle parameters that are set in instantiation
        self.__dict__.update(kwargs)
        
        # Define state variables
        self.baz = None
        
    @property
    def bar(self):
        return self._bar
            
    def reaction_function_0(self , _in, act):
        # Body of the reaction
        self.random.seed() # Note the use of self
        return 0
                    
        
# Instantiate classes
xxx_foo_lf = \
    [_Foo(bank_index = 0, \
        _bar=0)]

...
```

### The generated LinguaFrancaXXX Python module (a C extension module)
The rest of the files in `src-gen/XXX` form a [Python C extension module](https://docs.python.org/3/extending/building.html#building-c-and-c-extensions) called `LinguaFrancaXXX` that can be installed by executing `python3 -m pip install .` in the `src-gen/XXX/` folder. In this case, `pip` will read the instructions in the `src-gen/XXX/setup.py` file and install a `LinguaFrancaXXX` module in your local Python module installation directory. 

> :spiral_notepad: LinguaFrancaXXX does not necessarily have to be installed if you are using the "traditional" Python implementation (CPython) directly. You could simply use `python3 setup.py build` to build the module in the `src-gen/XXX` folder. However, we have found that [other C Python implementations](https://www.python.org/download/alternatives/) such as Anaconda will not work with this kind of local module.

As mentioned before, the LinguaFrancaXXX module is separate from `src-gen/XXX/XXX.py` but interacts with it. Next, we explain this interaction.

### Interactions between XXX.py and LinguaFrancaXXX
The LinguaFrancaXXX module is imported in `src-gen/XXX/XXX.py`:
```
from LinguaFrancaXXX import *
```

This is done to enable the main function in `src-gen/XXX/XXX.py` to make a call to the `start()` function, which is part of the generated (and installed) `LinguaFrancaXXX` module. This function will start the main event handling loop of the C runtime.

From then on, `LinguaFrancaXXX` will call reactions that are defined in `src-gen/XXX/XXX.py` when needed.

### The LinguaFrancaBase package
[LinguaFrancaBase](https://pypi.org/project/LinguaFrancaBase/) is a package that contains several helper methods and definitions that are necessary for the Python target to work. This module is installable via `python3 -m pip install LinguaFrancaBase` but is automatically installed if needed during the installation of `LinguaFrancaXXX`. The source code of this package can be found [here](https://github.com/lf-lang/reactor-c-py).

This package's modules are imported in the `XXX.py` program:
```
from LinguaFrancaBase.constants import * #Useful constants
from LinguaFrancaBase.functions import * #Useful helper functions
from LinguaFrancaBase.classes import * #Useful classes
```
### Already imported Python modules
The following packages are already imported and thus do not need to be re-imported by the user:
```
import sys
import copy
```

## Examples
To see a few interactive examples written using the Python target, see [here](https://github.com/lf-lang/lingua-franca/tree/master/example/Python/src).

The [Python CI tests](https://github.com/lf-lang/lingua-franca/tree/master/test/Python) might also act as a reference in some cases for the capabilities of the Python target.
