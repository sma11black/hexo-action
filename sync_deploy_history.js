// Thanks to @Aetf
'use strict';

const pathFn = require('path');
const fs = require('fs');
const parseConfig = require('hexo-deployer-git/lib/parse_config');
const spawn = require('hexo-util/lib/spawn');
const Hexo = require('hexo');

async function sync_deploy_history() {
  console.log('\nSync start...');

  // Hexo context
  const hexo = new Hexo(process.cwd(), { silent: true });
  await hexo.init();

  const deployDir = pathFn.join(hexo.base_dir, '.deploy_git');

  // For git cmd
  function git(...args) {
    return spawn('git', args, {
      verbose: true,
      stdio: 'inherit'
    });
  }

  // Get multi deployer configurations as array
  let deployConfigs = hexo.config.deploy;
  if (!Array.isArray(deployConfigs)) {
    deployConfigs = [deployConfigs];
  }

  // Parse repo from configs and pull repo
  deployConfigs.forEach(async deployConfig => {
    if (deployConfig.type !== 'git') {
      console.log(`Skip deployer: ${deployConfig.type}.`);
      return;
    }
    const repos = parseConfig(deployConfig);
    if (repos.length > 1) {
      console.error(`Given too much repos: ${repos.length}.`);
      throw new TypeError('Only single repo is supported!');
    }
    console.log(`Located a single repo: ${repos[0].url},${repos[0].branch}.`);
    const result = await git('clone', '--branch', repos[0].branch, repos[0].url, deployDir);
    console.log(result);
  });

  console.log('Sync done\n');
}

sync_deploy_history();
