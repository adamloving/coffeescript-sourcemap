# CoffeeScript Source Map Demo

## Goals

I love CoffeeScript because it simplifies programming (especially OO programming) with javascript. It's workable debugging it with lots of console.logs, but I'd like to use node-debug. I'd also like to get real line numbers from the CoffeeScript when an exception is thrown.

1. Include CoffeeScript in a server-side Javascript project.
2. Use CoffeeScript with node-inspector (breakpoints).
3. Get an accurate stack trace when an exception is thrown.

You can accomplish #1 with 

```js
require('coffee-script/register')
require('mystuff.coffee')
```

However, you need to generate **sourcemaps** to be able to map lines in the compiled Javascript to the original CoffeeScript lines.

Looks like [node-source-map-support](https://github.com/evanw/node-source-map-support) is the solution to #3.

## Things I tried

### 1. Precompile CoffeeScript to js with maps

Compile from the command line, include in a JS file

```bash
$ coffee -c -m precompiled/**/*.coffee
$ ./node_modules/.bin/node-debug precompiled/start.js
```

Seems to be OK, but webkit is confused about location of coffee files (because map "sourceRoot": "../.." is relative to where we compiled from).

![node-debug precompiled screenshot](https://www.evernote.com/shard/s3/sh/baae78ee-6cae-44b5-abe3-0b36d6cbba36/59bf5754b12116cbd0f5e218bf372dad/res/b134e048-4477-4080-ba46-4e7e7e77bf01/skitch.png)

This is workable, but I need a way to make this part of my build process.

### 2. Compile using gulp

The gulp-coffeescfript module proclaims to make source maps, but I couldn't get it to work without modifying the project. 

```bash
$ node gulped/compile.js
$ ./node_modules/.bin/node-debug gulped/start.js
```

The map files didn't come out right. Due to a bug, sourceRoot is set to "/source/". So, webkit can't find them.

```json
  ...
  "sourceRoot": "/source/",
  ...
```

![node-debug gulp sourcemap screenshot](https://www.evernote.com/shard/s3/sh/8fed77e3-d57a-44a8-b785-5f4c1a73c90a/9d7c50113ec8c60ef361ac31c88470b4/res/4097a84a-5628-4774-9e84-f0602f007d58/skitch.png)

So, I modified the project to allow an empty string for sourceRoot, and voila!

![working sourcemaps](https://www.evernote.com/shard/s3/sh/2ad78e26-2932-40db-a959-0f0daa95b240/0f94b5a5a34ac50168651dc066f70873/res/9fa51908-8f7b-450e-807f-3dfa8ccce7b1/skitch.png)

This is great, because we can use gulp to watch for and compile CoffeeScript files, and gitignore the .js.map files. 

I'd also like to gitignore the compiled .js, but it has to stay there for when we require() it (or else we'd have to write some new convoluted require())

_Todo: go back and test with '**/*.coffee' style blobs._

Note: I saw the includeContent flag which may come in handy later.

### 3. Enhance coffee-script/register to generate inline sourcemap

OK, so remember this?

```js
require('coffee-script/register')
require('mystuff.coffee')
```

Wouldn't it be cool if that generated the sourceMap?

I noticed [the sourcemaps](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit) format has a ```sourcesContent``` element. I also noticed that ```sourceMappingURL`` at the bottom of the Javascript could be a data URI.
It would be killer if the CoffeeScript register loadFile function could build the map and slam it into the bottom of the JS. Something like this [loadFile function](https://github.com/GiantThinkwell/coffeescript/blob/91f820b619360eff78ff716e8520522908ae615e/lib/coffee-script/register.js).

Unfortunately, it doesn't seem to work.

```bash
$ node register/start.js
```

I can see the sourceMappingURL data, and I'm pretty sure the sourceMaps are correct. But webkit isn't recognizing it. Presumably, by the time my loadFile function runs, node-debug has already primed the browser with the relevant maps, and new ones are not loaded.

Similar results with ```node debug register/start.js``` ... apparently node does [not yet support sourcemaps](https://github.com/joyent/node/issues/3712).

### 4. requireCSWithMap

Since gulp still generates .js that needs to be required using a temp path, I wrote my my own [requireCSwithMap()](https://github.com/adamloving/coffeescript-sourcemap-demo/blob/master/prerequire/requireCSWithMap.js) to generate the map (using a temporary filename) then require the .temp.js. I also threw in source-map-support to prove that it works.

```
var requireCSwithMap = require('./requireCSwithMap').requireCSwithMap;
var b = requireCSwithMap('./include/b.coffee').b;
```

This works quite nicely.

![require time source maps](https://www.evernote.com/shard/s3/sh/21399951-486c-4a13-98a0-8f3f7291e58b/81926c63959f93c8f4721eef79a82b6f/res/50813e4e-e69b-4f92-a73a-b62901c5a7ae/skitch.png)

![source-map-support](https://www.evernote.com/shard/s3/sh/4e3c8b52-819a-47a4-8e07-8803aee81a64/ba10a7d536470a2ed2cb4b16c8dbac45/res/6d9f4261-6c63-40ca-8f99-d5f9393224ef/skitch.png)


## Where to go from here?

I'm going to bounce #4 off a colleague, and see whether he prefers that approach (with .gitignored temp files). If not, I'll go back and attempt gulp source maps with temp directories and a simpler requireCSFromTemp() method so that .js and .map can be hidden/ignored.
