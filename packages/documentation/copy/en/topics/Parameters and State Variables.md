---
title: "Parameters and State Variables"
layout: docs
permalink: /docs/handbook/parameters-and-state-variables
oneline: "Parameters and state variables in Lingua Franca."
preamble: >
---

$page-showing-target$

## Parameter Declaration

A reactor class definition can parameterized as follows:

<div class="lf-c lf-cpp lf-ts lf-rs">

```lf
reactor <class-name>(<param-name>:<type>(<expr>), ...) {
    ...
}
```

Each parameter has a _type annotation_, written `:<type>`, where `<type>` has one of the following forms:

- An identifier, such as `int`<span class="lf-cpp">, possibly followed by a type argument, e.g. `vector<int>`</span>.
- An array type `type[]`<span class="lf-c lf-cpp lf-rs"> and `type[integer]`</span>.
- The keyword $time$, which designates a time value.
- A code block delimitted by `{= ... =}`, where the contents is any valid type in the target language.

</div>

<div class="lf-c lf-cpp">

- A pointer type, such as `int*`.

</div>

<div class="lf-c">

Types ending with a `*` are treated specially by the C target. See [Sending and Receiving Arrays and Structs](/docs/handbook/c-reactors#sending-and-receiving-arrays-and-structs) in the C target documentation.

To use strings conveniently in the C target, the "type" `string` is an alias for `{=const char*=}`.

</div>

<div class="lf-ts">

For example, `{= int | null =}` defines nullable integer type in TypeScript.

</div>

<div class="lf-py">

```lf
reactor <class-name>(<param-name>(<expr>), ... ) {
    ...
}
```

</div>

Each parameter must have a _default value_, written `(<expr>)`. An expression may be a numeric contant, a string enclosed in quotation marks, a time value such as `10 msec`, a list of values, or target-language code enclosed in `{= ... =}`, for example. See [Expressions](/docs/handbook/expressions) for full details on what expressions are valid.

For example, the `Double` reactor on the [previous page](/docs/handbook/inputs-and-outputs) can be replaced with a more general parameterized reactor `Scale` as follows:

$start(Scale)$

```lf-c
target C;
reactor Scale(factor:int(2)) {
    input x:int;
    output y:int;
    reaction(x) -> y {=
        SET(y, x->value * self->factor);
    =}
}
```

```lf-cpp
WARNING: No source file found: ../code/cpp/src/Scale.lf
```

```lf-py
WARNING: No source file found: ../code/py/src/Scale.lf
```

```lf-ts
WARNING: No source file found: ../code/ts/src/Scale.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/Scale.lf
```

$end(Scale)$

This reactor, given any input event `x` will produce an output `y` with value equal to the input scaled by the `factor` parameter. The default value of the `factor` parameter is 2, but this can be changed when the `Scale` reactor is instantiated.

Notice how, within the body of a reaction, the code accesses the parameter value. This is different for each target language. <span class="lf-c">In the C target, a `self` struct is provided that contains the parameter values.</span>

## State Declaration

A reactor declares a state variable as follows:

<div class="lf-c lf-cpp lf-ts lf-rs">

```lf
    state <name>:<type>(<value>);
```

The type can any of the same forms as for a parameter.

</div>

<div class="lf-py">

```lf
    state <name>(<value>);
```

</div>

The `<value>` is an initial value and, like parameter values, can be given as an [expression](/docs/handbook/expressions) or target language code with delimiters `{= ... =}`. The initial value can also be given as a parameter name. The value can be accessed and modified in a target-language-dependent way as illustrated by the following example:

$start(Count)$

```lf-c
target C;
reactor Count {
    state count:int(1);
    output y:int;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        SET(y, self->count++);
    =}
}

```

```lf-cpp
WARNING: No source file found: ../code/cpp/src/Count.lf
```

```lf-py
WARNING: No source file found: ../code/py/src/Count.lf
```

```lf-ts
WARNING: No source file found: ../code/ts/src/Count.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/Count.lf
```

$end(Count)$

This reactor has an integer state variable named `count`, and each time its reaction is invoked, it outputs the value of that state variable and increments it. The reaction is trigger by a $timer$, discussed in the next section.
