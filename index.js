if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development';
}

const Server = require('./server/server');
const Webpack = require('./webpack/webpack');

(async () => {
	try {
		const config = require('./config/config')();
		const server = new Server(config.server);
		await webpackCompile(server, config.webpack);
	
		await server.start();
		console.log('서버가 실행되었습니다.');
	} catch (err) {
		console.log('에러 발생. 아 왜~~~~!');
		console.log(err);
		process.exit(1);
	}

	async function webpackCompile (server, config) {
		const bundler = new Webpack(config);
		switch (process.env.NODE_ENV) {
			case 'production':
				await bundler.build();
				server.setStatic(config.publicPath, config.staticPath);
				break;
			case 'test':
				break;
			case 'development':
			default:
				await bundler.applyServer(server.app);
				break;
		}
	}
})();