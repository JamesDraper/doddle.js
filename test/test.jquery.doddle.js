describe('jQuery Doddle plugin', function () {

    it('Should throw an error if no template string or id are specified.', function () {
        expect(function () {
            $('#testing-area').doddle();
        }).to.throwException(/Either tplStr or tplId must passed as doddle plugin options/);
    });

    it('Should throw an error if both template string and id are specified.', function () {
        expect(function () {
            $('#testing-area').doddle({ tplStr: 'tplStr', tplId: 'tplId' });
        }).to.throwException(/Either tplStr or tplId must passed as doddle plugin options/);
    });

    it('Should render a simple template string', function () {
        $('#testing-area').doddle({
            tplStr: 'One {{ vars["Two"] }} Three {{ vars["Four"] }}',
            vars: {
                'Two': 2,
                'Four': 4
            }
        });
        expect($('#testing-area').html()).to.be('One 2 Three 4');
    });

    it('Should render a simple template from an id', function () {
        $('#testing-area').doddle({
            tplId: 'tpl1',
            vars: {
                'Two': 2,
                'Four': 4
            }
        });
        expect($('#testing-area').html()).to.be('\n            One 2 Three 4\n        ');
    });

    it('Should render a template with a comment from a string', function () {
        $('#testing-area').doddle({
            tplStr: 'One {{ vars["Two"] }} Three {# comment #}{{ vars["Four"] }}',
            vars: {
                'Two': 2,
                'Four': 4
            }
        });
        expect($('#testing-area').html()).to.be('One 2 Three 4');
    });

    it('Should render a template with a comment from an id', function () {
        $('#testing-area').doddle({
            tplId: 'tpl2',
            vars: {
                'Two': 2,
                'Four': 4
            }
        });
        expect($('#testing-area').html()).to.be('\n            One 2 Three 4\n        ');
    });

    it('Should render a template with logic from a string.', function () {
        $('#testing-area').doddle({
            tplStr: 'One {{ vars["Two"] }} Three {% if (vars.Two === 2) { %}{{ vars["Four"] }}{% } %}',
            vars: {
                'Two': 2,
                'Four': 4
            }
        });
        expect($('#testing-area').html()).to.be('One 2 Three 4');

        $('#testing-area').doddle({
            tplStr: 'One {{ vars["Two"] }} Three {% if (vars.Two === 2) { %}{{ vars["Four"] }}{% } %}',
            vars: {
                'Two': 3,
                'Four': 4
            }
        });
        expect($('#testing-area').html()).to.be('One 3 Three ');
    });

    it('Should render a template with logic from an id.', function () {
        $('#testing-area').doddle({
            tplId: 'tpl3',
            vars: {
                'Two': 2,
                'Four': 4
            }
        });
        expect($('#testing-area').html()).to.be('\n            One 2 Three 4\n        ');

        $('#testing-area').doddle({
            tplId: 'tpl3',
            vars: {
                'Two': 3,
                'Four': 4
            }
        });
        expect($('#testing-area').html()).to.be('\n            One 3 Three \n        ');
    });
});