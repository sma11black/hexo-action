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
  const logger = hexo.log;
  logger.info('\nSync start...');

  // Get multi deployer configurations as array
  let deployConfigs = hexo.config.deploy;
  if (!Array.isArray(deployConfigs)) {
    deployConfigs = [deployConfigs];
  }

  // Parse repo from configs and sync repo
  deployConfigs.forEach(deployConfig => {
    if (deployConfig.type !== 'git') {
      logger.info(`Skip deployer: ${deployConfig.type}.`);
      return;
    }
    const repos = parseConfig(deployConfig);
    if (repos.length > 1) {
      logger.error(`Given too much repos: ${repos.length}.`);
      throw new TypeError('Only single repo is supported!');
    }
    result = clone(repos[0]);
    logger.info(result);
  });

  logger.info('Sync done\n');
}

sync_deploy_history();
