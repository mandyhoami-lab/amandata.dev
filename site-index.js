"use strict";
/* Shared searchable index of site pages, used by the nav autocomplete and /search.html. */
(function () {
    "use strict";
    var pages = [
        { url: "/index.html", title: "Home", desc: "mandy's space", keys: "home welcome start" },
        { url: "/about.html", title: "About", desc: "who i am", keys: "about me bio who" },
        { url: "/projects.html", title: "Projects", desc: "research + code projects", keys: "projects work research" },
        { url: "/cv.html", title: "CV", desc: "curriculum vitae", keys: "cv resume curriculum vitae academic" },
        { url: "/contact.html", title: "Contact", desc: "get in touch", keys: "contact email reach message" },
        { url: "/commissions.html", title: "Commissions", desc: "hire me for a build", keys: "commissions hire freelance work" },
        { url: "/blog.html", title: "Blog", desc: "posts and essays", keys: "blog posts writing essays" },
        { url: "/creations.html", title: "Creations", desc: "things i build to play with", keys: "creations play games playground" },
        { url: "/othello.html", title: "Othello", desc: "reversi, beginner + advanced", keys: "othello reversi game board play coach" },
        { url: "/psy410.html", title: "PSY 410 Resources", desc: "myers exp psych study hub", keys: "psy410 psychology myers study flashcards resources" },
        { url: "/psy410-flashcards/", title: "Myers Flashcards", desc: "170-card exp psych deck", keys: "flashcards myers psychology study cards" },
        { url: "/synergy.html", title: "Synergy", desc: "the corporate buzzword esolang", keys: "synergy esolang programming language code buzzword corporate" },
        { url: "/synergy-wiki.html", title: "Synergy Wiki", desc: "every buzzword in plain language", keys: "synergy wiki commands reference help buzzwords" },
        { url: "/stat200-practice.html", title: "R Practice Hub", desc: "stat 200 drills, quizzes + console", keys: "stat200 r practice drills quiz console statistics" },
        { url: "/coding-projects.html", title: "Web projects", desc: "othello, r hub, synergy", keys: "web projects code software" },
        { url: "/website-management.html", title: "Website management", desc: "amandata.dev, tgupsd.org, amandata.org", keys: "website management sites web" },
        { url: "/research-activity.html", title: "Research activity", desc: "cv + linkedin", keys: "research activity lab academic" },
        { url: "/repository.html", title: "Repository", desc: "this site's source", keys: "repository source code github repo" }
    ];
    window.SITE_INDEX = pages;
})();
