# Hexo CI/CD action

This action automating hexo deployment workflow.

## Inputs

### `cmd`

**Required** Hexo command. Default `"help"`. Options: `"clean"`, `"generate"`, `"deploy"`, etc.

### `user_name`

**Optional** User name of your github account for deploying.

### `user_email`

**Optional** User email of your github account for deploying.

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
    # Use the output from the `clean`, `generate` and `deploy` step
    - name: Get the output
      run: |
        echo "${{ steps.clean.outputs.notify }}"
        echo "${{ steps.generate.outputs.notify }}"
        echo "${{ steps.deploy.outputs.notify }}"
```