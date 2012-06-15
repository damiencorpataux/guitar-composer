GComp.GChordPosition = function(stringNumber, caseNumber) {
    this.stringNumber = stringNumber || 1;
    this.caseNumber = caseNumber || 0;

    var containerDiv = document.createElement('div');
    Element.addClassName(containerDiv, 'case');
    var stringDiv = document.createElement('div');
    Element.addClassName(stringDiv, 'string');
    containerDiv.appendChild(stringDiv);
    this.domEl = containerDiv;
    this.domElCase = containerDiv;
    this.domElString = stringDiv;
    this.bindEvents();
    this.enable();
}
GComp.GChordPosition.prototype = new GComp.GView;
GComp.GChordPosition.prototype.stringNumber = null;
GComp.GChordPosition.prototype.caseNumber = null;
GComp.GChordPosition.prototype.finger = 5;
GComp.GChordPosition.prototype.possibleFingers = {
    1: 'index', 
    2: 'majeur', 
    3: 'annulaire', 
    4: 'auriculaire', 
    5: 'thumb'
};
GComp.GChordPosition.prototype.enabled = false;
GComp.GChordPosition.prototype.bindEvents = function() {
    this.bind('mouseover', function(evt, model) {
        model.highlight();
    });
    this.bind('mouseout', function(evt, model) {
        model.lowlight();
    });
    this.bind('click', function(evt, model) {
        model.toggle();
        model.flash();
    });
};
GComp.GChordPosition.prototype.draw = function(divEl) {    
    divEl.appendChild(this.domEl);
}
GComp.GChordPosition.prototype.toggle = function() {
    this.enabled = !this.enabled;
    Element.toggleClassName(this.domElCase, 'active');
}
GComp.GChordPosition.prototype.enable = function() {
    this.enabled = true;
    Element.addClassName(this.domElCase, 'active');
}
GComp.GChordPosition.prototype.disable = function() {
    this.enabled = false;
    Element.removeClassName(this.domElCase, 'active');
}
GComp.GChordPosition.prototype.isEnabled = function() {
    return this.enabled;
}
/**
 * @param Note
 */
GComp.GChordPosition.prototype.getNote = function(stringNote) {
// FIXME
//    if (!stringNote)
//        throw new Exception('Please give a GComp.Note specifying the note of the string corresponding to the position');
    var note = new GComp.Note();
    var noteIndex = stringNote.noteIndex + this.caseNumber;
    note.noteIndex = noteIndex;
    return note;
}