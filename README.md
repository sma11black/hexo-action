# GitHub Action - Hexo CI/CD 🌱

<a href="https://github.com/marketplace/actions/hexo-action"><img alt="View Action" src="https://img.shields.io/badge/action-marketplace-blue.svg?logo=github&color=orange"></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg?logo=github"></a>

This Github Action automating hexo deployment workflow, to allow you to leverage GitHub Actions to publish your hexo site on Github Pages.

## 🍑Usage
### 🍄Pre-requisites
#### Step 1: Setup `Deploy keys` and `Secrets`
The `with` portion of the workflow **must** be configured before the action will work. You can add these in the `with` section found in the [example workflow](#🍌example-workflow---hexo-deploy) below. Any `secrets` must be referenced using the bracket syntax and stored in the GitHub repositories `Settings/Secrets` menu. You can learn more about setting environment variables with GitHub actions [here](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstepsenv).

**🥕How to add your ssh key pair?**
1. Run the following terminal command, replacing the email with one connected to your GitHub account.
```sh
$ ssh-keygen -t rsa -C "username@example.com"
```
2. In *Github Pages* repo: Add the contents of the public key within your repositories deploy keys menu. You can find this option by going to `Settings > Deploy Keys`, you can name the public key whatever you want, but you **do** need to give it write access.
3. In *hexo source code* repo: Add the contents of the private key to the `Settings > Secrets` menu as DEPLOY_KEY.

#### Step 2: Configure github workflows
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#🍌example-workflow---hexo-deploy) is available below. For more information, reference the  GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### 🍆Inputs
For more information on these inputs, see the [API Documentation](https://developer.github.com/v3/repos/releases/#input)

| Key | Required | Description | Default |
| --- | --- | --- | --- |
| `user_name` | NO | The user name of your github account for deploying. | `github-actions[bot]` |
| `user_email` | NO | The user email of your github account for deploying. | `41898282+github-actions[bot]@users.noreply.github.com`[<sup>1</sup>](#refer-anchor-1) |
| `deploy_key` | **YES** | The **deploy key** to access your **GitHub Pages repository**. | `null` |
| `commit_msg` | NO | Git commit messages for your GitHub Pages repository. | `null` |

<div id="refer-anchor-1"></div>

- [1] 41898282 is the user ID for `github-actions[bot]`. Ref [Github API](https://api.github.com/users/github-actions[bot]/events/public).

**Tips**:
- `user_name` and `user_email`: Github Actions bot is just a bot account to perform these operations so that users would know that they were triggered by automation. There is an known issue if you use this bot account. In your GitHub Pages repository, if you want to filter commits by author, it will return a wrong result: `No commits found for "github-actions[bot]"`. You can avoid such error by using your github account instead of default bot account.
- `commit_msg`: For [Hexo official](https://hexo.io/docs/one-command-deployment.html#Git), the commit message is default to `Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}`. But for users who actually need to keep commit history, they may not need such one. So the recommended setting is `${{ github.event.head_commit.message }}` so that you can transfer commit messages to the GitHub Pages repository directly. If you prefer the default commit message, it is unnecessary to set in your workflow file or set `commit_msg` to `default`. For users who don’t want any commit history, you can set `commit_msg` to `none`. Since `default` and `none` are reserved words for control, you cannot set the commit message to these two words alone.

### 🥒Outputs
For more information on these outputs, see the [API Documentation](https://developer.github.com/v3/repos/releases/#response-4) for an example of what these outputs look like

- `notify`: Deploy complate notification.

### 🍌Example workflow - hexo deploy
On every `push` to this repo, generate hexo sites and publish on `username.github.io` repo.

```yaml
name: Deploy

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    name: A job to deploy blog.
    steps:
    - name: Checkout
      uses: actions/checkout@v1
      with:
        submodules: true # Checkout private submodules(themes or something else).
    
    # Caching dependencies to speed up workflows. (GitHub will remove any cache entries that have not been accessed in over 7 days.)
    - name: Cache node modules
      uses: actions/cache@v1
      id: cache
      with:
        path: node_modules
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-node-
    - name: Install Dependencies
      if: steps.cache.outputs.cache-hit != 'true'
      run: npm ci
    
    # Deploy hexo blog website.
    - name: Deploy
      id: deploy
      uses: sma11black/hexo-action@v1.0.3
      with:
        deploy_key: ${{ secrets.DEPLOY_KEY }}
        user_name: your github username  # (or delete this input setting to use bot account)
        user_email: your github useremail  # (or delete this input setting to use bot account)
        commit_msg: ${{ github.event.head_commit.message }}  # (or delete this input setting to use hexo default settings)
    # Use the output from the `deploy` step(use for test action)
    - name: Get the output
      run: |
        echo "${{ steps.deploy.outputs.notify }}"
```

### 🌽How to install additional third party node modules?
1. Add them as dependencies in the `package.json` file under your site's working directory.
2. Regenerate the `package-lock.json` file to **cache** them in your `Install Dependencies` step.

## 🐔Recommand Hexo Repository Settings
### 🥚Custom domain with CNAME
If your Github Pages needs to use a `CNAME` file to **customize the domain name**, put the `CNAME` file in the `source` directory, only then can hexo deploy push the `CNAME` file to the deployment repository.

### 🐣Make your hexo repository private
Hide your hexo source repository from the public to protect your website.

### 🐤Use submodule in your hexo repository
Add any hexo themes branch as gitmodules.

```sh
# Add submodule
$ git submodule add https://github.com/theme-next/hexo-theme-next themes/next

# Get tags list
$ cd themes/next
$ git tag -l
…
v6.0.0
v6.0.1
v6.0.2
...

# Switch on v6.0.1 tagged release version
$ git checkout tags/v6.0.1
Note: checking out 'tags/v6.0.1'.
…
HEAD is now at da9cdd2... Release v6.0.1

# If you want to switch on latest release version without defining tag (optional)
$ git checkout $(git describe --tags $(git rev-list --tags --max-count=1))
```

### 🐥Use `Hexo-Way` to store theme configuration options in site config file (hexo/_config.yml)
Copy needed theme options from theme config file into site config file, then
1. Move all this settings to the right with two spaces (in Visual Studio Code: select all strings, `CTRL + ]`).
2. Add theme_config: parameter above all this settings.

You can learn more about overriding theme config [here](https://hexo.io/docs/configuration.html#Overriding-Theme-Config).

## 🕊License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
