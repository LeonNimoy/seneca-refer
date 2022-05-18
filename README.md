# @seneca/refer

> _Seneca Refer_ is a plugin for [Seneca](http://senecajs.org)

    User referral business logic plugin for the Seneca platform.

[![npm version](https://img.shields.io/npm/v/@seneca/refer.svg)](https://npmjs.com/package/@seneca/refer)
[![build](https://github.com/senecajs/seneca-refer/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-refer/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-refer/badge.svg?branch=main)](https://coveralls.io/github/senecajs/seneca-refer?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-refer/badge.svg)](https://snyk.io/test/github/senecajs/seneca-refer)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/20872/branches/581541/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=20872&bid=581541)
[![Maintainability](https://api.codeclimate.com/v1/badges/8242b80adb8acb685afd/maintainability)](https://codeclimate.com/github/senecajs/seneca-refer/maintainability)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |

## Install

```sh
$ npm install @seneca/refer
```

## Quick Example

```js
// Setup - get the key value (<SECRET>) separately from a vault or
// environment variable.
Seneca().use('refer', {})

TODO
```

<!--START:options-->

## Options

_None._

<!--END:options-->

<!--START:action-list-->

## Action Patterns

- [biz:refer,create:entry](#-bizrefercreateentry-)
- [biz:refer,accept:entry](#-bizreferacceptentry-)
- [biz:refer,load:rules](#-bizreferloadrules-)

<!--END:action-list-->

<!--START:action-desc-->

## Action Descriptions

### &laquo; `biz:refer,create:entry` &raquo;

Create referral entry.

---

---

### &laquo; `biz:refer,accept:entry` &raquo;

Accept referral entry.

---

### &laquo; `biz:refer,load:rules` &raquo;

No description provided.

---

<!--END:action-desc-->

## More Examples

## Motivation

## Support

## API

## Contributing

## Code Formatter

This project uses [Prettier](https://prettier.io/) to format its code.

Please, use the library along with the rules added to this project, following
the code format pattern.

### Configuration Guide Examples:

<details>
<summary>VSCode</summary>

Install the official [extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).
Then, add this to your settings:

```
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
}
```

If you prefer, add the following configuration to format your conde on save:

```
{
  "editor.formatOnSave": true,
}
```

For more options see their
[repository](https://github.com/prettier/prettier-vscode).

</details>

<details>
<summary>Jetbrains</summary>

Follow the official [documentation](https://www.jetbrains.com/help/webstorm/prettier.html),
selecting the option:

```
Tools -> Actions on Save -> Run Prettier.

```

Also, certifies that the IDE is using the Prettier rules defined by this project.

</details>

<details>
<summary>Emacs</summary>

Install prettier [package](https://github.com/jscheid/prettier.el) through
[MELPA](https://melpa.org/#/prettier). Then add this hook, to your **.
emacs** file, to format your changes on save:

```
(add-hook 'after-init-hook #'global-prettier-mode)

```

</details>

For more IDE configuration guides, see prettier official
[documentation](https://prettier.io/docs/en/editors.html) and install the proper plugin for your IDE.

### Troubleshooting

If you had any trouble configuring prettier - after you make your changes -
run the following command to apply the code formatter:

```bash
npm run prettier
```

**Or**

Feel free to
[open an Issue](https://github.com/senecajs/seneca-refer/issues).

## Background
