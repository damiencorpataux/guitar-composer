if (typeof(console) == 'undefined') {
    console = {};
    console.log = function(msg) { alert(msg) }
    console.debug = function(msg) { alert(msg) }
    console.warn = function(msg) { alert(msg) }
};

GComp = {

    initialize: function() {
        // Find base path
        scriptName = 'GComp.js';
        var s = (document.getElementsByTagName("script"));
        for (i=0; i<s.length; i++) {
            if (s[i].src && s[i].src.match(/GComp\.js/)) {
                s = s[i];
                break;
            }
        }
        this.basePath = s.src.replace(/GComp\.js(\?.*)?$/,'');

        this.includeCss();
        this.includeScripts();
    },
    
    includeScripts: function() {
        var filenames = [
            'include/scriptaculous/lib/prototype.js',
            'include/scriptaculous/src/scriptaculous.js',
            'GBase.js',
            'GChordPosition.js',
            'GChord.js',
            'GChordManager.js'
        ];
        for (i=0; i < filenames.length; i++) {
            document.write('<script type="text/javascript" src="' + this.basePath + filenames[i] +'"></script>');
        }
    },

    includeCss: function() {
        var filenames = [
            'css/GChord.css',
            'css/GChordManager.css',
        ];
        for (i=0; i < filenames.length; i++) {
            document.write('<link rel="stylesheet" type="text/css" href="' + this.basePath + filenames[i] +'" />');
        }
    },
    
    // TODO: ,make this work
    getTemplate: function(filename) {
        var url = this.basePath + 'templates/' + filename; console.log(url);
        new Ajax.Request(url);
    },
    injectTemplate: function(filename, domEl) {
        Ajax.Updater(domEl, this.basePath + 'templates/' + filename);
    }

}

GComp.initialize();