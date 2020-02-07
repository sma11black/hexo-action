# GitHub Action - Hexo CI/CD 🌱

<a href="https://github.com/marketplace/actions/hexo-action"><img alt="View Action" src="https://img.shields.io/badge/action-marketplace-blue.svg?logo=github&color=orange"></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg?logo=github"></a>

This Github Action automating hexo deployment workflow, to allow you to leverage GitHub Actions to publish your hexo site on Github Pages.

## 🌰Usage
### 🍉Pre-requisites
#### Step 1: Setup `Deploy keys` and `Secrets`
The `with` portion of the workflow **must** be configured before the action will work. You can add these in the `with` section found in the [example workflow](#🍌example-workflow---hexo-deploy) below. Any `secrets` must be referenced using the bracket syntax and stored in the GitHub repositories `Settings/Secrets` menu. You can learn more about setting environment variables with GitHub actions [here](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstepsenv).

**🥕How to add your ssh key pair?**
1. Run the following terminal command, replacing the email with one connected to your GitHub account.
```sh
ssh-keygen -t rsa -C "username@example.com"
```
2. In *Github Pages* repo: Add the contents of the public key within your repositories deploy keys menu. You can find this option by going to `Settings > Deploy Keys`, you can name the public key whatever you want, but you **do** need to give it write access.
3. In *hexo source code* repo: Add the contents of the private key to the `Settings > Secrets` menu as DEPLOY_KEY.

#### Step 2: Configure github workflows
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#🍌example-workflow---hexo-deploy) is available below. For more information, reference the  GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### 🍆Inputs
For more information on these inputs, see the [API Documentation](https://developer.github.com/v3/repos/releases/#input)

- `user_name`: **Required** The user name of your github account for deploying.
- `user_email`: **Required** The user email of your github account for deploying.
- `deploy_key`: **Required** The deploy key to access your GitHub Pages repository.

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
      run: npm install
    
    # Deploy hexo blog website.
    - name: Deploy
      id: deploy
      uses: sma11black/hexo-action@v1.0.0
      with:
        deploy_key: ${{ secrets.DEPLOY_KEY }}
        user_name: your github username
        user_email: your github useremail
    # Use the output from the `deploy` step(use for test action)
    - name: Get the output
      run: |
        echo "${{ steps.deploy.outputs.notify }}"
```

## 🐔Recommand Settings
### 🐣Custom domain with CNAME
If your Github Pages needs to use a `CNAME` file to **customize the domain name**, put the `CNAME` file in the `source` directory, only then can hexo deploy push the `CNAME` file to the deployment repository.

### 🐤Make your hexo repository private
Hide your hexo source repository from the public to protect your website.

### 🐥Using submodule in your hexo repository
Add any hexo themes branch as gitmodules.

```sh
git submodule add https://github.com/theme-next/hexo-theme-next.git themes/next -b 87305b1
```

## 🕊License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
