module.exports = {
  apps: [
    {
      name: 'sbtcr-backend',
      script: 'dist/server.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
    },
    {
      name: 'sbtcr-frontend',
      script: 'node_modules/.bin/next',
      args: 'start --port 3005',
      cwd: './client',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
    },
  ],
};
