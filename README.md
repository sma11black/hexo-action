# Hexo CI/CD action

This action automating hexo deployment workflow.

## Inputs

### `cmd`

**Required** Hexo command. Default `"help"`. Option: `"clean"`, `"generate"`, `"deploy"`, etc.

### `user_name`

**Required for deploy** User name of your github account.

### `user_email`

**Required for deploy** User email of your github account.

## Outputs

### `notify`

The notification of deployment result.

## Example usage

```yaml
name: Deploy

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    name: A job to deploy blog
    steps:
    # To use this repository's private action, you must check out the repository
    - name: Checkout
      uses: actions/checkout@v1
    - name: Clean
      id: clean
      uses: sma11black/hexo-action@master
      with:
        cmd: clean
    - name: Generate
      id: generate
      uses: sma11black/hexo-action@master
      with:
        cmd: generate
    - name: Deploy
      id: deploy
      uses: sma11black/hexo-action@master
      with:
        cmd: deploy
        user_name: sma11black
        user_email: sma11black@example.com
    # Use the output from the `deploy` step
    - name: Get the output
      run: echo "The output was ${{ steps.deploy.outputs.notify }}"
```