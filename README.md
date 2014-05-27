
## Usage
- a change to test versioning -
### Locate the Code

Compiled CSS and javascript can be found in `/dist`.

### Angular Components

As soon as you've got all the files downloaded and included in your page you just need to declare a dependency on the amelia.ui module:

```
angular.module('outbrainDashboard', ['amelia-ui']);
```

### LESS Variables and Mixins

Your project may also include our LESS variables and mixins into your build step for a more seamless look. Look in `/dist` for `_variables.scss` and `_mixins.scss`.

***

## Working on this project

### Commands

#### All commands are run from the amelia-ui binary: `/bin/amelia-ui`.

Serve the documentation pages locally:

```
./bin/amelia-ui serve
```

Test amelia-ui components:

```
./bin/amelia-ui test
```

Compile your own version from `/src`:

```
./bin/amelia-ui build
```

If you want to bump the current version of the library, run:

```
./bin/amelia-ui build --bump [patch/minor/major]
```

### Adding a component

1. Add a directory in `/src` that corresponds with the name of your component.
2. `*.js`, `*.html`, `*.less` can now be added. They should all be in the root of your component directory.
3. Add `/docs` to your component directory and add a `demo.html` (optional)
4. Add `/tests` to your component directory and add any `*.js` to test against (mandatory)

***

### Links to Resources
[Twitter Bootstrap 3](http://getbootstrap.com/)
[SASS](http://sass-lang.com/) (CSS compiler)
[Angular](http://angularjs.org/)
[Bootstrap UI](http://angular-ui.github.io/bootstrap/) (Angular Bootstrap components)
[Bower](http://bower.io/) (package manager)
[Gulp](http://gulpjs.com/) (task runner)

***

&copy; Outbrain Inc
