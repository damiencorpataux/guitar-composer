GComp.GChordManager = function(nGrids) {
    var nGrids = nGrids || 20;
    var chordsContainer = document.createElement('div');
    Element.addClassName(chordsContainer, 'chordContainer');
    for (var i=0; i<nGrids; i++) {
        var chordDiv = this.createChord();
        chordsContainer.appendChild(chordDiv);
    }
    this.domEl = chordsContainer;
}
GComp.GChordManager.prototype = new GComp.GView;
GComp.GChordManager.prototype.chords = [];
GComp.GChordManager.prototype.draw = function(divEl) {
    divEl.appendChild(this.domEl);        
}
GComp.GChordManager.prototype.createChord = function(chordDiv) {
    var chordDiv = document.createElement('div');
    Element.addClassName(chordDiv, 'chord');
    var chord = new GComp.GChord();
    chord.draw(chordDiv);
    chordDiv.appendChild(this.createChordControls(chord, chordDiv));    
    this.chords.push(chord);
    return chordDiv;
}
GComp.GChordManager.prototype.createChordControls = function(chord, chordDiv) {
    var controlsContainer = document.createElement('div');    
    // Control
    var deleteChord = document.createElement('a');
    deleteChord.href = '#';
    deleteChord.innerHTML = 'Delete<br />';
    var object = this;
    Element.observe(deleteChord, 'click', function(domEvent) {
        Element.remove(chordDiv);
    }, false);    
    controlsContainer.appendChild(deleteChord);
    // Control
    var shiftUp = document.createElement('a');
    shiftUp.href = '#';
    shiftUp.innerHTML = 'Shift up<br />';
    var object = this;
    Element.observe(shiftUp, 'click', function(domEvent) {
        chord.shift(-1);
    }, false);    
    controlsContainer.appendChild(shiftUp);
    // Control
    var shiftDown = document.createElement('a');
    shiftDown.href = '#';
    shiftDown.innerHTML = 'Shift down<br />';
    var object = this;
    Element.observe(shiftDown, 'click', function(domEvent) {
        chord.shift(1);
    }, false);    
    controlsContainer.appendChild(shiftDown);
    // Control
    var insertRow = document.createElement('a');
    insertRow.href = '#';
    insertRow.innerHTML = 'Delete row<br />';
    var object = this;
    Element.observe(insertRow, 'click', function(domEvent) {
        chord.addRows(1);
    }, false);    
    controlsContainer.appendChild(insertRow);
    // Control
    var delRow = document.createElement('a');
    delRow.href = '#';
    delRow.innerHTML = 'Add row<br />';
    var object = this;
    Element.observe(delRow, 'click', function(domEvent) {
        chord.delRows(1);
    }, false);    
    controlsContainer.appendChild(delRow);

    return controlsContainer;
}
