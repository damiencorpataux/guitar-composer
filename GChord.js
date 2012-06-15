/**
 * A guitar grid position view (a guitar 'case')
 * @extends GView
 * @extends NotePos
 */
GComp.GChord = function(startCaseNumber, stringsNotes, nCases) {
    this.startCaseNumber = startCaseNumber || this.startCaseNumber;
    this.nCases = nCases || this.nCases;
    var stringsNotes = stringsNotes || ['E', 'B', 'G', 'D', 'A', 'E'];    
    for (var i=stringsNotes.length; i>0; i--) {
        this.stringsNotes[i] = new GComp.Note(stringsNotes[i-1]);
    }
    this.build();
}
GComp.GChord.prototype = new GComp.GView;
/**
 * @var Array GChordPosition[string][case]
 */
GComp.GChord.prototype.startCaseNumber = 1;
GComp.GChord.prototype.nCases = 4;
GComp.GChord.prototype.positions = [];
GComp.GChord.prototype.stringsNotes = [];
GComp.GChord.prototype.domEl = null;
GComp.GChord.prototype.domElCaseNumbers = [];
GComp.GChord.prototype.boundsEvents = [];
GComp.GChord.prototype.build = function() {
    var stringsNotes = []
    $A(this.stringsNotes).each(function (note) {
        if (note) stringsNotes.push(note.getName());
    });
    
    var table = document.createElement('table');
    Element.addClassName(table, 'chordGrid');
    // Special cases for plain strings
    var tr = document.createElement('tr'); // Dummy cell for padding
    var td = document.createElement('td');
    Element.addClassName(td, 'plainString');
    tr.appendChild(td);    
    for (var i=stringsNotes.length; i>0; i--) {
        var td = document.createElement('td');
        Element.addClassName(td, 'plainString');
        var position = new GComp.GChordPosition(i, 0);
        position.disable();
        position.draw(td);
        this.positions[i] = [];
        this.positions[i][0] = position;
        this.stringsNotes[i] = new GComp.Note(stringsNotes[i-1]);
        tr.appendChild(td);    
    }
    table.appendChild(tr);

    for (var i=this.startCaseNumber; i<this.nCases+this.startCaseNumber-1; i++) {
        var tr = document.createElement('tr') 
        var tdCaseNb = document.createElement('td');
        Element.addClassName(tdCaseNb, 'caseNumberIndicator');
        tdCaseNb.innerHTML = i;
        this.domElCaseNumbers[i] = tdCaseNb;
        tr.appendChild(tdCaseNb);
        for (var j=stringsNotes.length; j>0; j--) {
            var td = document.createElement('td');
            if (i == 1) Element.addClassName(td, 'topFret');
            var position = new GComp.GChordPosition(j, i);
            position.disable();
            position.draw(td);            
            this.positions[j][i] = position;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    this.domEl = table;    
}
GComp.GChord.prototype.redraw = function() {
    // Remove chordGridPos els first
    $A(this.getFlattenPositions()).each(function(position) {
        position.remove();
    }.bind(this));
    var container = this.domEl.ancestors()[0];
    this.remove();
    var positions = this.getFlattenPositions().clone();
    this.positions = [];
    this.build();
    this.rebind();
    this.draw(container);
    this.setFromPositions(positions);
}
GComp.GChord.prototype.getPositions = function(stringNumber) {
    var stringNumber = stringNumber || false;
    if (stringNumber !== false) return this.positions[stringNumber];
    else return this.positions;
}
GComp.GChord.prototype.getPosition = function(stringNumber, caseNumber) {
    return this.positions[stringNumber][caseNumber];
}
GComp.GChord.prototype.getFlattenPositions = function() {
    return this.getPositions().flatten().select(function(position) {
        return position != null;
    });
}
GComp.GChord.prototype.getEnabledPositions = function() {
    return this.getPositions().flatten().select(function(position) {
        return position != null && position.isEnabled();
    });
}
GComp.GChord.prototype.getNotes = function() {
    var notes = [];
    $A(this.getEnabledPositions()).each(function(position) {
        if (position.isEnabled()) {
            var note = this.getNote(position);
            notes.push(note);
        }
    }.bind(this));
    return notes;
}
GComp.GChord.prototype.getNote = function(chordPosition) {
    return chordPosition.getNote(this.stringsNotes[chordPosition.stringNumber])
}
GComp.GChord.prototype.isHigherPositionEnabled = function(chordPosition) {
    $H(this.getPositions(chordPosition.stringNumber)).each(function (stringPosition) {
        if (stringPosition.isEnabled()) return true;
    });
    return false;
}
GComp.GChord.prototype.clearPositions = function() {
    var enabledPositions = this.getEnabledPositions();
    $A(enabledPositions).each(function(position) {
        position.disable();
    });
}
/**
 * @param Array ChordPosition[]
 */
GComp.GChord.prototype.setFromPositions = function(positions) {
    var positions = positions || this.getFlattenPositions();
    $A(positions).each(function(position) {
        var gridPosition = this.getPosition(position.stringNumber, position.caseNumber);            
        if (gridPosition && position.isEnabled()) gridPosition.enable();
    }.bind(this));
}
GComp.GChord.prototype.addRows = function(nRows) {
    if (this.startCaseNumber + nRows < 1) return;
    if (nRows > 0) this.nCases += nRows;
    else this.startCaseNumber += nRows;
    this.redraw();
}
GComp.GChord.prototype.delRows = function(nRows) {
    if (this.startCaseNumber + nRows > 1) return;
    if (nRows > 0) this.nCases -= nRows;
    else this.startCaseNumber -= nRows;
    this.redraw();
}
GComp.GChord.prototype.shift = function(nCases) {
    if (this.startCaseNumber + nCases < 1) return;
    this.startCaseNumber += nCases;
    this.redraw();

/* Solution 1: manage domEls and this.position shift: bit of a headache
    // Shifts position caseNumbers
    // Shifts this.position 2nd dim indexes
    this.startCaseNumber += nCases;
    var shiftedPositions = [];
    
    $A(this.getPositions()).each(function(string) {
        if (nCases < 0) string.reverse();
        $A(string).each(function(position) {
            if (!position) return;
            if (position.caseNumber != 0 && !(position.caseNumber == 1 && nCases<0))
                position.caseNumber += nCases;
            var stringNumber = position.stringNumber;
            var caseNumber = position.caseNumber;
            if (!shiftedPositions[stringNumber]) shiftedPositions[stringNumber] = [];
            shiftedPositions[stringNumber][caseNumber] = position;
        });
    });
    this.positions = shiftedPositions;

    // Pads positions holes in the array
    $A(this.getPositions()).each(function(string, stringNumber) {
        $A(string).each(function(position, caseNumber) {
            if (position) return;
            var padPosition = new GComp.GChordPosition(stringNumber, caseNumber);
            padPosition.disable();
            this.positions[stringNumber][caseNumber] = padPosition;
        }.bind(this));
    }.bind(this));

    // Shifts case numbers indicators
    $A(this.domElCaseNumbers).each(function(domElCaseNumber) {
        if (domElCaseNumber) domElCaseNumber.innerHTML = parseInt(domElCaseNumber.innerHTML) + nCases;
    });    

    // Manages topfret css class
    if (this.startCaseNumber == 1) Element.addClassName(this.domElTopFret, 'topFret');
    else Element.removeClassName(this.domElTopFret, 'topFret');

    // Shifts enabled positions
    $A(this.getPositions()).each(function(string, stringNumber) {
        $A(string).each(function(position, caseNumber) {
            if (!this.positions[stringNumber][caseNumber+nCases]) {
                position.disable();
                return;
            }
            if (position.caseNumber != 0) {
                if (this.positions[stringNumber][caseNumber+nCases].isEnabled()) {
                    position.enable();
                } else {
                    position.disable();
                }
            }
        }.bind(this));
    }.bind(this));
*/   
}
/**
 * Trims the disabled upper and lower positions
 */
GComp.GChord.prototype.trimPositions = function() {
    // TODO: for before saving
}
GComp.GChord.prototype.toString = function() {
    var s = '\n';
    s += '   Cases:    ';
    $A(this.getPositions()[1]).each(function(position, positionNumber) {
        if (!position) return;
        s += positionNumber + '      ';
    });
    $A(this.getPositions()).each(function(string, stringNumber) {
        if (!string) return;
        s += '\nString ' + stringNumber + ':   ';
        $A(string).each(function(position, caseNumber) {
            if (!position) return;
            var noteName = this.getNote(position).getName();
            if (position.isEnabled()) s += '*';
            else s += ' ';
            s += noteName + '    ';
            if (noteName.length == 1) s += ' ';
        }.bind(this));
    }.bind(this));
    return s;    
}