// Path: src/services/nginxService.ts
import fs from 'fs';
import fse from 'fs-extra'
import { exec } from 'child_process';

const proxyList = []

export const configureNginx = async (domain: string, ip: string): Promise<void> => {
  
  
  const upstream = `
  upstream ${domain}
  {
  
  }
  `
  
  const config = `
  server {
    listen 80;
    server_name ${domain};

    location / {
      proxy_pass http://${ip};
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }`;

  fs.writeFileSync(`/etc/nginx/sites-available/${domain}`, config);
  fs.symlinkSync(`/etc/nginx/sites-available/${domain}`, `/etc/nginx/sites-enabled/${domain}`);

  exec('nginx -s reload', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error reloading Nginx: ${error.message}`);
      throw new Error('Failed to reload Nginx');
    }
  });
};


// Path: src/services/nginx/Service.ts
export const readNginxConfig = async (name): Promise<string> => {

  const configName = (!name ? 'nginx.conf' | name)

  

  path.join('/etc/nginx/', name)
  return new Promise((resolve, reject) => {
    exec('cat /etc/nginx/nginx.conf', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error reading Nginx config: ${error.message}`);
        reject('Failed to read Nginx config');
      }
      resolve(stdout);
    });
  });
};

// const sync = () => {}


// // Path: src/controllers/syncController.ts
// import { Context } from 'koa';
// // import { syncData } from '../services/syncService';

// export const syncRouters = async (ctx: Context) => {
//   try {
//     const data = await syncData();
//     ctx.body = data;
//   } catch (error) {
//     ctx.status = 500;
//     ctx.body = { error: error.message };
//   }
// };
