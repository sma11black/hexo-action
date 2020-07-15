// Thanks to @Aetf
const pathFn = require('path');
const fs = require('fs');
const parseConfig = require('hexo-deployer-git/lib/parse_config');
const spawn = require('hexo-util/lib/spawn');
const Hexo = require('hexo');

function sync_deploy_history() {
  // For git cmd
  function git(...args) {
    return spawn('git', args, {
      cwd: deployDir,
      verbose: verbose,
      stdio: 'inherit'
    });
  }

  // Clone published hexo site
  function clone(repo) {
    const deployDir = pathFn.join(hexo.base_dir, '.deploy_git');
    return git('clone', '--branch', repo.branch, repo.url, deployDir);
  }

  // Hexo context
  const hexo = new Hexo(process.cwd(), { silent: true });
  hexo.init();
  // Get multi deployer configurations as array
  let deployConfigs = hexo.config.deploy;
  if (!Array.isArray(deployConfigs)) {
    deployConfigs = [deployConfigs];
  }

  deployConfigs.forEach(deployConfig => {
    if (deployConfig.type !== 'git') {
      return;
    }
    const repos = parseConfig(deplyConfig);
    if (repos.length > 1) {
      throw new TypeError('Only single repo is supported!');
    }
    clone(repos[0]);
  });
}

sync_deploy_history();
