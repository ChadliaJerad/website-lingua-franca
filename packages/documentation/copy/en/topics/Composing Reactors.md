---
title: "Composing Reactors"
layout: docs
permalink: /docs/handbook/composing-reactors
oneline: "Composing reactors in Lingua Franca."
preamble: >
---

$page-showing-target$

## Contained Reactors

Reactors can contain instances of other reactors defined in the same file or in an imported file. Assume the `Count` and `Scale` reactors defined in [Parameters and State Variables](/docs/handbook/parameters-and-state-variables) are stored in files `Count.lf` and `Scale.lf`, respectively,
and that the `TestCount` reactor from [Time and Timers](/docs/handbook/time-and-timers) is stored in `TestCount.lf`. Then the following program composes one instance of each of the three:

$start(RegressionTest)$

```lf-c
target C {
    timeout: 10 sec,
    fast: true
}
import Count from "Count.lf";
import Scale from "Scale.lf";
import TestCount from "TestCount.lf";

main reactor RegressionTest {
    c = new Count();
    s = new Scale(factor = 4);
    t = new TestCount(stride = 4, num_inputs = 11);
    c.y -> s.x;
    s.y -> t.x;
}
```

```lf-cpp
WARNING: No source file found: ../code/cpp/src/RegressionTest.lf
```

```lf-py
WARNING: No source file found: ../code/py/src/RegressionTest.lf
```

```lf-ts
WARNING: No source file found: ../code/ts/src/RegressionTest.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/RegressionTest.lf
```

$end(RegressionTest)$

As soon as programs consist of more than one reactor, it becomes particularly useful to reference the diagrams that are automatically created and displayed by the Lingua Franca IDEs. The diagram for the above program is as follows:

<span class="warning"> IMAGES DON'T WORK!!!!</span>

![](diagrams/RegressionTest.svg)

An instance is created with the syntax:

> _instance_name_ = **new** _class_name_(_parameters_);

A bank with several instances can be created in one such statement, as explained in the [banks of reactors documentation](Multiports-and-Banks-of-Reactors#banks-of-reactors).

The _parameters_ argument has the form:

> _parameter1_name_ = _parameter1_value_, _parameter2_name_ = _parameter2_value_, ...

Connections between ports are specified with the syntax:

> _output_port_ -> _input_port_

where the ports are either _instance_name.port_name_ or just _port_name_, where the latter form denotes a port belonging to the reactor that contains the instances.

### Physical Connections

A subtle and rarely used variant is a **physical connection**, denoted `~>`. In such a connection, the logical time at the recipient is derived from the local physical clock rather than being equal to the logical time at the sender. The physical time will always exceed the logical time of the sender, so this type of connection incurs a nondeterministic positive logical time delay. Physical connections are useful sometimes in [[Distributed-Execution]] in situations where the nondeterministic logical delay is tolerable. Such connections are more efficient because timestamps need not be transmitted and messages do not need to flow through through a centralized coordinator (if a centralized coordinator is being used).

### Connections with Delays

Connections may include a **logical delay** using the **after** keyword, as follows:

> _output_port_ -> _input_port_ **after** 10 **msec**

This means that the logical time of the message delivered to the _input_port_ will be 10 milliseconds larger than the logical time of the reaction that wrote to _output_port_. If the time value is greater than zero, then the event will appear at microstep 0. If it is equal to zero, then it will appear at the current microstep plus one.

When there are multiports or banks of reactors, several channels can be connected with a single connection statement. See [Multiports and Banks of Reactors](Multiports-and-Banks-of-Reactors#banks-of-reactors).

The following example defines a reactor that adds a counting sequence to its input. It uses the above Count and Add reactors (see [Hierarchy2](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Hierarchy2.lf)):

```
import Count.lf;
import Add.lf;
reactor AddCount {
    input in:int;
    output out:int;
    count = new Count();
    add = new Add();
    in -> add.in1;
    count.out -> add.in2;
    add.out -> out;
}
```

A reactor that contains other reactors may, within a reaction, send data to the contained reactor. The following example illustrates this (see [SendingInside](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SendingInside.lf)):

```
target C;
reactor Printer {
	input x:int;
	reaction(x) {=
		printf("Inside reactor received: %d\n", x->value);
	=}
}
main reactor SendingInside {
	p = new Printer();
	reaction(startup) -> p.x {=
		SET(p.x, 1);
	=}
}
```

Running this will print:

```
Inside reactor received: 1
```
