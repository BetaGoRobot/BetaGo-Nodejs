// pm2 设置文件
module.exports = {
  apps: [
    {
      cwd: './',
      kill_timeout: 10000,
      name: 'bot',
      namespace: "kook",
      script: "./node_modules/.bin/ts-node",
      args: "-T -r tsconfig-paths/register ./src/index.ts",
      wait_ready: true,
      watch: false,
      // watch: ['server'],
      ignore_watch: ['node_modules'],
      env: {
        "NODE_ENV": "production"
      },
      watch_options: {
        "usePolling": true
      }
    }
  ]
};
