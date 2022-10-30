Generates a project with thousands of modules to test scalability of bundlers.

## Usage

```
node generate.js <depth> <count> <asyncFraction> <plain|react>
```

For example:

```
rm -rf src; node generate.js 5 5 Infinity plain
```

To try out Metro, add a `.babelrc` with

```json
{
    "presets": [["@babel/preset-env", { "targets": { "chrome": "100" } }]]
}
```

and run `yarn metro serve --reset-cache` and then `time curl -v --silent --output /dev/null localhost:8080/entry-plain.bundle`
