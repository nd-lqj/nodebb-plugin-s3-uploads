'use strict';
const Package = require("../package.json");
const db = require.main.require("./src/database");
const Controllers = {};
const AWS = require("aws-sdk");

var settings = {
	"accessKeyId": false,
	"secretAccessKey": false,
	"region": process.env.AWS_DEFAULT_REGION || "us-east-1",
	"bucket": process.env.S3_UPLOADS_BUCKET || undefined,
	"host": process.env.S3_UPLOADS_HOST || "s3.amazonaws.com",
	"path": process.env.S3_UPLOADS_PATH || undefined
};

var accessKeyIdFromDb = false;
var secretAccessKeyFromDb = false;

Controllers.renderAdminPage = async (req, res) => {
	const fields = await db.getObjectFields(Package.name, Object.keys(settings));
	if (fields.accessKeyId) {
		settings.accessKeyId = fields.accessKeyId;
		accessKeyIdFromDb = true;
	} else {
		settings.accessKeyId = false;
	}

	if (fields.secretAccessKey) {
		settings.secretAccessKey = fields.secretAccessKey;
		secretAccessKeyFromDb = false;
	} else {
		settings.secretAccessKey = false;
	}

	if (!fields.bucket) {
		settings.bucket = process.env.S3_UPLOADS_BUCKET || "";
	} else {
		settings.bucket = fields.bucket;
	}

	if (!fields.host) {
		settings.host = process.env.S3_UPLOADS_HOST || "";
	} else {
		settings.host = fields.host;
	}

	if (!fields.path) {
		settings.path = process.env.S3_UPLOADS_PATH || "";
	} else {
		settings.path = fields.path;
	}

	if (!fields.region) {
		settings.region = process.env.AWS_DEFAULT_REGION || "";
	} else {
		settings.region = fields.region;
	}

	if (settings.accessKeyId && settings.secretAccessKey) {
		AWS.config.update({
			accessKeyId: settings.accessKeyId,
			secretAccessKey: settings.secretAccessKey
		});
	}

	if (settings.region) {
		AWS.config.update({
			region: settings.region
		});
	}

	var token = req.csrfToken();

	var data = {
		bucket: settings.bucket,
		host: settings.host,
		path: settings.path,
		region: settings.region,
		accessKeyId: (accessKeyIdFromDb && settings.accessKeyId) || "",
		secretAccessKey: (accessKeyIdFromDb && settings.secretAccessKey) || "",
		csrf: token
	};

	res.render('admin/plugins/s3-uploads', data);
};

module.exports = Controllers;
