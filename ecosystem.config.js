module.exports = {
  apps: [{
    name: "legalclick-bot",
    script: "./server/index.js",
    watch: false,
    env: {
      NODE_ENV: "production",
    },
    // Persistent logs outside deploy directory
    error_file: "./logs/errors.log",
    out_file: "./logs/output.log",
    log_file: "./logs/combined.log",
    time: true,

    // Restart strategy
    autorestart: true,
    max_memory_restart: "500M",
    exp_backoff_restart_delay: 100, // Exponential backoff: 100ms → 200ms → 400ms → ... → 15s max

    // Crash protection: max 10 restarts within 60 seconds
    max_restarts: 10,
    min_uptime: "5s",

    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 10000,

    cwd: "./"
  }]
}
