const express = require('express');
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');

const app = express();
const port = 3001;

hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.set('view engine', 'hbs');
// middle ware
// won't continue until calling next();
app.use((req, res, next) => {
    const now = new Date().toString();
    const log = `${now}: \n${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', `${log}\n`, (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// render to maintenance page.
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

app.use(express.static(path.join(__dirname, 'public')));

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', text => text.toUpperCase());

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        text: 'Welcome to my home page',
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        text: 'Some about text',
    });
});

app.get('/bad', (req, res) => {
    res.send('<h1>Oops, shit happens.</h1>');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
