{
  "apps": [
    {
      "name": "lead2build-crm",
      "script": "npm",
      "args": "start",
      "cwd": "Z:\\gighub\\lead2build-crm",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3000,
        "DATABASE_URL": "file:./prod.db",
        "NEXTAUTH_SECRET": "lead2build-production-secret-key-2024",
        "NEXTAUTH_URL": "http://lead2build.ru"
      },
      "instances": 1,
      "exec_mode": "fork",
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "./logs/err.log",
      "out_file": "./logs/out.log",
      "log_file": "./logs/combined.log",
      "time": true
    }
  ]
}
