describe('Doddle', function () {

    it('Should render a simple template string', function () {
        doddle.fromString(
            $('#testing-area')[0],
            'One {{ vars["Two"] }} Three {{ vars["Four"] }}',
            {
                'Two': 2,
                'Four': 4
            }
        );
        expect($('#testing-area').html()).to.be('One 2 Three 4');
    });

    it('Should render a simple template from an id', function () {
        doddle.fromTemplate(
            $('#testing-area')[0],
            'tpl1',
            {
                'Two': 2,
                'Four': 4
            }
        );
        expect($('#testing-area').html()).to.be('\n            One 2 Three 4\n        ');
    });

    it('Should render a template with a comment from a string', function () {
        doddle.fromString(
            $('#testing-area')[0],
            'One {{ vars["Two"] }} Three {# comment #}{{ vars["Four"] }}',
            {
                'Two': 2,
                'Four': 4
            }
        );
        expect($('#testing-area').html()).to.be('One 2 Three 4');
    });

    it('Should render a template with a comment from an id', function () {
        doddle.fromTemplate(
            $('#testing-area')[0],
            'tpl2',
            {
                'Two': 2,
                'Four': 4
            }
        );
        expect($('#testing-area').html()).to.be('\n            One 2 Three 4\n        ');
    });

    it('Should render a template with logic from a string.', function () {
        doddle.fromString(
            $('#testing-area')[0],
            'One {{ vars["Two"] }} Three {% if (vars.Two === 2) { %}{{ vars["Four"] }}{% } %}',
            {
                'Two': 2,
                'Four': 4
            }
        );
        expect($('#testing-area').html()).to.be('One 2 Three 4');

        doddle.fromString(
            $('#testing-area')[0],
            'One {{ vars["Two"] }} Three {% if (vars.Two === 2) { %}{{ vars["Four"] }}{% } %}',
            {
                'Two': 3,
                'Four': 4
            }
        );
        expect($('#testing-area').html()).to.be('One 3 Three ');
    });

    it('Should render a template with logic from an id.', function () {
        doddle.fromTemplate(
            $('#testing-area')[0],
            'tpl3',
            {
                'Two': 2,
                'Four': 4
            }
        );
        expect($('#testing-area').html()).to.be('\n            One 2 Three 4\n        ');

        doddle.fromTemplate(
            $('#testing-area')[0],
            'tpl3',
            {
                'Two': 3,
                'Four': 4
            }
        );
        expect($('#testing-area').html()).to.be('\n            One 3 Three \n        ');
    });
});