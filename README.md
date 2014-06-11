#small chanage no. 2
## Usage
### Locate the Code

Compiled CSS and javascript can be found in `/dist`.

### Angular Components

As soon as you've got all the files downloaded and included in your page you just need to declare a dependency on the amelia.ui module:

```
angular.module('outbrainDashboard', ['amelia-ui']);
```

***

## Working on this project

### Commands

#### All commands are run from the amelia-ui binary: `/bin/amelia-ui`.

Serve the documentation pages locally:

```
./bin/amelia-ui -t serve
```

Test the amelia-ui library:

```
./bin/amelia-ui -t test
```

Compile your own version from `/src`:

```
./bin/amelia-ui -t build
```

### Adding a component

1. Add a directory in `/src/components` that corresponds with the name of your component.
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
