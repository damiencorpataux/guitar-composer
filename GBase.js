GComp.GView = function() {
}
/**
 * @abstract
 */
GComp.GView.prototype.bind = function(domEventName, func, useCapture) {
    var useCapture = useCapture || false;
    var object = this;
    Element.observe(this.domEl, domEventName, function(domEvent){func(domEvent, object)}, useCapture);
    this.boundEvents.push({
        'domEventName': domEventName,
        'func': func,
        'useCapture': useCapture 
    });
}
GComp.GView.prototype.rebind = function() {
    var boundEvents = this.boundEvents.clone();
    this.boundEvents = [];    
    $A(boundEvents).each(function(boundEvent) {
        this.bind(boundEvent.domEventName, boundEvent.func, boundEvent.useCapture);
    }.bind(this));
}
GComp.GView.prototype.draw = function(containerDomEl) {
   containerDomEl.appendChild(this.domEl);
}
GComp.GView.prototype.remove = function() {
    Element.remove(this.domEl);
    this.domEl = null;
}
GComp.GView.prototype.show = function() {
}
GComp.GView.prototype.hide = function() {
}
GComp.GView.prototype.toggle = function() {
}
GComp.GView.prototype.highlight = function() {
    Element.addClassName(this.domElCase, 'highlight');
}
GComp.GView.prototype.lowlight = function() {
    Element.removeClassName(this.domElCase, 'highlight');    
}
GComp.GView.prototype.flash = function() {
    var object = this;
    for (var i=0; i<4; i++) {
        if (i == 0) this.highlight();
        setTimeout(object.lowlight, 500)
        setTimeout(object.highlight, 300)
    }
}
GComp.GView.prototype.domEl = null;
GComp.GView.prototype.boundEvents = [];
//----------------------------------------------------------------------------//

/**
 * A music note
 */
GComp.Note = function(note) {
    var note = note || 0;
    this.set(note);
}
GComp.Note.prototype.noteIndex = 0;
GComp.Note.prototype.possibleNotes = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
]
GComp.Note.prototype.set = function(note) {
    // TODO: take args like A, A#, Bb
    // TODO check with possibleNotes
    if (typeof(note) == 'number') {
        this.noteIndex = note;
    } else {
        // Trying to parse note
        $A(this.possibleNotes).each(function(possibleNote, key) {
            if (possibleNote == note) {
                this.noteIndex = key;
            }
        }.bind(this));
    }
}

GComp.Note.prototype.shift = function(nHalfTones) {
    this.noteIndex = (this.noteIndex+nHalfTones) % this.possibleNotes.length;
    // TODO: Set the octave accordingly !!!!!!!
}

GComp.Note.prototype.getName = function() {
    return this.possibleNotes[this.noteIndex % this.possibleNotes.length];
}