'use strict';

const Package = require("./package.json");
const controllers = require('./lib/controllers');
const db = require.main.require("./src/database");
const routeHelpers = require.main.require('./src/routes/helpers');

const plugin = {};

plugin.init = async (params) => {
	const { router, middleware } = params;

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/s3-uploads', middleware, [], controllers.renderAdminPage);
};

plugin.addRoutes = async ({ router, middleware, helpers }) => {
	const middlewares = [
		middleware.ensureLoggedIn,
		middleware.admin.checkPrivileges,
	];

	routeHelpers.setupApiRoute(router, 'post', '/api/admin/plugins/s3-uploads/s3settings', middlewares, async (req, res) => {
		const data = req.body;
		const settings = {
			bucket: data.bucket || "",
			host: data.host || "",
			path: data.path || "",
			region: data.region || ""
		};

		await db.setObject(Package.name, settings);

		helpers.formatApiResponse(200, res);
	});

	routeHelpers.setupApiRoute(router, 'get', '/api/admin/plugins/s3-uploads/credentials', middlewares, async (req, res) => {
		const data = req.body;
		const settings = {
			accessKeyId: data.accessKeyId || "",
			secretAccessKey: data.secretAccessKey || ""
		};


		await db.setObject(Package.name, settings);
		helpers.formatApiResponse(200, res);
	});
};

module.exports = plugin;
