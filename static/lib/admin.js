'use strict';

define('admin/plugins/s3-uploads', ['bootbox'], function (bootbox) {
	var ACP = {};

	ACP.init = function () {
		console.log('00000000000');

        $('#aws-region option[value="{region}"]').prop('selected', true)

        $("#s3-upload-bucket").on("submit", (e) => {
            e.preventDefault();
			debugger;
            save("s3settings", this);
        });

        $("#s3-upload-credentials").on("submit", (e) => {
            e.preventDefault();
			debugger;
            var form = this;
            bootbox.confirm("Are you sure you wish to store your credentials for accessing S3 in the database?", (confirm) => {
                if (confirm) {
                    save("credentials", form);
                }
            });
        });
    };

    const save = (type, form) => {
        var data = {
            _csrf: $('#csrf_token').val()
        };

        var values = $(form).serializeArray();
        for (var i = 0, l = values.length; i < l; i++) {
            data[values[i].name] = values[i].value;
        }

		debugger;

        $.post('/api/admin/plugins/s3-uploads/' + type, data).done(function (response) {
            if (response) {
                ajaxify.refresh();
                app.alertSuccess(response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            ajaxify.refresh();
            app.alertError(jqXHR.responseJSON ? jqXHR.responseJSON.error : 'Error saving!');
        });
    }
});