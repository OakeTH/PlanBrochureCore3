oak.dropdown.addressbox = function (args) {

    let inputCantonWidth = 350;
    let inputCantonSpiltSym = ' &gt; ';
    let addressbox = function () {
        this.input_province = this.validate_input(args.province);
        this.input_canton = this.validate_input(args.canton);
        this.input_district = this.validate_input(args.district);
        this.input_zipcode = this.validate_input(args.zipcode);

        this.add_refer(this.input_province, 'P');
        this.add_refer(this.input_canton, 'C');
        this.add_refer(this.input_district, 'D');

        //<--On function launched --<<
        this.add_dropdownfn(this.input_province, 'P', 'จังหวัด');
        this.add_dropdownfn(this.input_canton, 'C', 'อำเภอ/เขต');
        this.add_dropdownfn(this.input_district, 'D', 'ตำบล/แขวง');
        this.add_dropdownfn(this.input_zipcode, 'Z', 'ไปรษณีย์');
    }

    addressbox.prototype = {
        validate_input: function (input) {
            return $(oak.pureHtml(input));
        },
        separate_source: function (source, usefor) {
            //<-- New Canton display ---<<
            if (usefor === 'C')
                return Array.from(
                    new Set($.map(source, function (value) {
                        return value.C + inputCantonSpiltSym + value.D + inputCantonSpiltSym + value.Z
                    })));

            else
                return Array.from(
                    new Set($.map(source, function (value) {
                        return value[usefor]
                    })));
        },
        focusout_for_province: function () {
            let curr = this.value
            let prev = this.prev

            if (!prev || curr !== prev) {
                let newsource = $.grep(oak.dropdown.thaiaddress, function (value) {
                    return value.P === curr
                });

                this.prev = this.value;
                this.my_canton && $(this.my_canton)
                    .dropdown({ source: this.separate_source(newsource, 'C') })
                    .val('');

                if (this.my_district) {
                    this.my_district.value = '';
                    oak.dropdown.source[this.my_district.id] = [];
                }

                if (this.my_zipcode) {
                    this.my_zipcode.value = '';
                    oak.dropdown.source[this.my_zipcode.id] = [];
                }
                //this.my_district && $(this.my_district)
                //    .dropdown({ source: this.separate_source(newsource, 'D') })
                //    .val('');

                //this.my_zipcode && $(this.my_zipcode)
                //    .dropdown({ source: this.separate_source(newsource, 'Z') })
                //    .val('');
            }
        },
        focusout_for_canton: function () {
            let district = '';
            let zipcode = '';

            if (this.value.indexOf(inputCantonSpiltSym) > -1) {
                let text = this.value.split(inputCantonSpiltSym);
                this.value = text[0];
                district = text[1];
                zipcode = text[2];
            }
            let curr = this.value
            if (this.my_district.value !== district || this.my_zipcode.value !== zipcode) {
                let newsource = $.grep(oak.dropdown.thaiaddress, function (item) {
                    return item.C === curr
                });

                this.prev = this.value;
                this.my_district && $(this.my_district)
                    .dropdown({ source: this.separate_source(newsource, 'D') });

                if (this.my_zipcode)
                    oak.dropdown.source[this.my_zipcode.id] = [];

                if (district)
                    this.my_district.value = district;
                if (zipcode)
                    this.my_zipcode.value = zipcode;
            }
        },
        focusout_for_district: function () {
            let curr = this.value
            let prev = this.prev

            if (!prev || curr !== prev) {
                let newsource = $.grep(oak.dropdown.thaiaddress, function (value) {
                    return value.D === curr
                });

                this.prev = this.value;
                this.my_zipcode && $(this.my_zipcode)
                    .dropdown({ source: this.separate_source(newsource, 'Z') })
                    .val('');
            }
        },
        add_refer: function (input, usefor) {
            if (!input) return;

            let changeevent = input[0].tagName == 'SELECT' ? 'change' : 'focusout';
            if (usefor === 'P')
                input
                    .refer('my_canton', this.input_canton)
                    .refer('my_district', this.input_district)
                    .refer('my_zipcode', this.input_zipcode)
                    .refer('separate_source', this.separate_source)
                    .on(changeevent, this.focusout_for_province);
            else if (usefor === 'C')
                input
                    .refer('my_district', this.input_district)
                    .refer('my_zipcode', this.input_zipcode)
                    .refer('separate_source', this.separate_source)
                    .on(changeevent, this.focusout_for_canton);
            else if (usefor === 'D')
                input
                    .refer('my_zipcode', this.input_zipcode)
                    .refer('separate_source', this.separate_source)
                    .on(changeevent, this.focusout_for_district);

            if (input[0].tagName === 'INPUT')
                input.on('click', function () { this.prev = this.value; });

        },
        add_dropdownfn: function (input, userfor, placeholder) {
            if (!input) return;

            if (userfor === 'P')
                input.dropdown({
                    source: this.separate_source(oak.dropdown.thaiaddress, userfor),
                    placeholder: placeholder
                });

            else if (userfor === 'C')
                input.dropdown({
                    placeholder: placeholder,
                    width: inputCantonWidth
                });
            else
                input.dropdown({ placeholder: placeholder });

        }
    }

    new addressbox();
};