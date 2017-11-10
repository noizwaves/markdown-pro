document.addEventListener("DOMContentLoaded", function(event) {

  var workingNote;

  var permissions = [
    {
      name: "stream-context-item"
    }
  ]

  var componentManager = new ComponentManager(permissions, function(){
    // on ready
  });

  var ignoreTextChange = false;
  var initialLoad = true;
  var lastValue;

  componentManager.streamContextItem((note) => {

    workingNote = note;

    if(!window.simplemde) {
      return;
    }

    if(note.content.text !== lastValue) {
      ignoreTextChange = true;
      window.simplemde.value(note.content.text);
      ignoreTextChange = false;
    }

    if(initialLoad) {
      initialLoad = false;
      window.simplemde.codemirror.getDoc().clearHistory();
    }
  });

  window.simplemde = new SimpleMDE({
     element: document.getElementById("editor"),
     spellChecker: false,
     status: false,
     toolbar:[
           "heading", "bold", "italic", "strikethrough",
           "|", "quote", "code",
           "|", "unordered-list", "ordered-list",
           "|", "clean-block",
           "|", "link", "image",
           "|", "table",
           "|", "preview", "side-by-side", "fullscreen"
           ],
   });

  window.simplemde.toggleFullScreen();

  simplemde.codemirror.on("change", function(){
    if(!ignoreTextChange) {
      lastValue = simplemde.value();
      if(workingNote) {
        workingNote.content.text = lastValue;
        componentManager.saveItem(workingNote);
      }
    }
  });
});
