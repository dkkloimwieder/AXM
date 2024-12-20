const { postgraphile, makePluginHook } = require('postgraphile');
const PgSimplifyInflectorPlugin = require('@graphile-contrib/pg-simplify-inflector');
const { default: PgPubsub } = require('@graphile/pg-pubsub');

const pluginHook = makePluginHook([PgPubsub]);

const {
	POSTGRES_DB,
	POSTGRES_HOST,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_PORT,
} = process.env;

postgraphile(
	{
		database: POSTGRES_DB,
		host: POSTGRES_HOST,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
		port: POSTGRES_PORT,
	},
	'public',
	{
		appendPlugins: [PgSimplifyInflectorPlugin],
		watchPg: true,
		graphiql: true,
		enhanceGraphiql: true,
		simpleCollections: 'both',
		graphileBuildOptions: { pgOmitListSuffix: true },
		classicIds: true,
		pluginHook,
		subscriptions: true,
		simpleSubscriptions: true,
	}
);
