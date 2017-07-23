# Doddle.js

A basic javascript templating engine, with optional jQuery support.

## Getting started

Here is a simple (if slightly contrived) example of how to render a view, for a more detailed explanation consult the documentation.
First you'll need to define the view, which you can do by defining it as an embedded script:

    <script type="text/doddle-template" id="my-template">
        {# prints out a number and tells you if it is even #}
        <div class="num-is-even">
            <p>
                The number {{ vars.num }} is
                {% if (vars.num % 2 === 0) { %}
                    Odd
                {% } else { %}
                    Even
                {% } %}
            </p>
        </div>
    </script>

Then you can render a template by passing variables to it:

    <script type="text/javascript">
        var tplDiv = document.getElementById('my-div');
        doddle.fromTemplate(tplDiv, 'my-template', {
            num: 1
        });
    </script>

Alternatively you can use the jquery version to render the template:

    <script type="text/javascript">
        $('#my-div').doddle({
            tplId: 'my-template',
            vars: {
                num: 1
            }
        });
    </script>

The result will be something like this:

    <div class="num-is-even">
        <p>
            The number 1 is
                Even
        </p>
    </div>
