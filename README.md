# Hexo CI action

This action automating hexo deployment workflow.

## Inputs

### `user_name`

**Required** User name of your github account. Default `"username"`.

### `user_email`

**Required** User email of your github account. Default `"username@example.com"`.

## Outputs

### `notify`

The notification of deployment result.

## Example usage

```yaml
uses: sma11black/hexo-action@master
with:
  user_name: 'sma11black'
  user_email: 'sma11black@example.com'
```