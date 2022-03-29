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
    timeout: 1 sec,
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

<!-- ![Lingua Franca diagram](/diagrams/RegressionTest.svg)  -->

An instance is created with the syntax:

```lf
    <instance_name> = new <class_name>(<parameters>)
```

A bank with several instances can be created in one such statement, as explained in the [banks of reactors documentation](/docs/handbook/multiports-banks#banks-of-reactors).

The `<parameters>` argument is a comma-separated list of assignments:

```lf
    <parameter_name> = <value>, ...
```

Like the default value for parameters, `<value>` can be a numeric contant, a string enclosed in quotation marks, a time value such as `10 msec`, target-language code enclosed in `{= ... =}`, or any of the list forms described in [Expressions](/docs/handbook/expressions).

Connections between ports are specified with the syntax:

```lf
    <source_port_reference> -> <destination_port_reference>
```

where the port references are either `<instance_name>.<port_name>` or just `<port_name>`, where the latter form is used for connections that cross hierarchical boundaries, as illustrated next.

## Hierarchy

Reactors can be composed in arbitrarily deep hierarchies. For example, the following program combines the `Count` and `Scale` reactors within on `Container`:

$start(Hierarchy)$

```lf-c
target C {
    timeout: 1 sec,
    fast: true
}
import Count from "Count.lf";
import Scale from "Scale.lf";
import TestCount from "TestCount.lf";

reactor Container(stride:int(2)) {
    output y:int;
    c = new Count();
    s = new Scale(factor = stride);
    c.y -> s.x;
    s.y -> y;
}

main reactor Hierarchy {
    c = new Container(stride = 4);
    t = new TestCount(stride = 4, num_inputs = 11);
    c.y -> t.x;
}
```

```lf-cpp
WARNING: No source file found: ../code/cpp/src/Hierarchy.lf
```

```lf-py
WARNING: No source file found: ../code/py/src/Hierarchy.lf
```

```lf-ts
WARNING: No source file found: ../code/ts/src/Hierarchy.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/Hierarchy.lf
```

$end(Hierarchy)$

<span class="warning"> IMAGES DON'T WORK!!!!</span>

<!-- ![Lingua Franca diagram](/diagrams/Hierarchy.svg)  -->

The `Container` has a parameter named `stride`, whose value is passed to the `factor` parameter of the `Scale` reactor. The line

```lf
    s.y -> y;
```

establishes a connection across levels of the hierarchy. This propagates the output of a contained reactor to the output of the container. A similar notation may be used to propagate the input of a container to the input of a contained reactor,

```lf
    x -> s.x;
```

## Connections with Logical Delays

Connections may include a **logical delay** using the $after$ keyword, as follows:

```lf
    <source_port_reference> -> <destination_port_reference> after <time_value>
```

where `<time_value>` can be any of the forms described in [Expressions](/docs/handbook/expressions).

The $after$ keyword specifies that the logical time of the event delivered to the destination port will be larger than the logical time of the reaction that wrote to source port. The time value is required to be non-negative, but it can be zero, in which case the input event at the receiving end will be one [microstep](/docs/handbook/actions#superdense-time) later than the event that triggered it.

## Physical Connections

A subtle and rarely used variant of the `->` connection is a **physical connection**, denoted `~>`. In such a connection, the logical time at the recipient is derived from the local physical clock rather than being equal to the logical time at the sender. The physical time will always exceed the logical time of the sender (unless fast is set to `true`), so this type of connection incurs a nondeterministic positive logical time delay. Physical connections are useful sometimes in [Distributed-Execution](/docs/handbook/distributed-execution) in situations where the nondeterministic logical delay is tolerable. Such connections are more efficient because timestamps need not be transmitted and messages do not need to flow through through a centralized coordinator (if a centralized coordinator is being used).
