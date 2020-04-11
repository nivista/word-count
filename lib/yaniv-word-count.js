"use babel";

import YanivWordCountView from "./yaniv-word-count-view";
import { CompositeDisposable } from "atom";

export default {
  yanivWordCountView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.yanivWordCountView = new YanivWordCountView(
      state.yanivWordCountViewState
    );
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.yanivWordCountView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "yaniv-word-count:toggle": () => this.toggle()
      })
    );
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.yanivWordCountView.destroy();
  },

  serialize() {
    return {
      yanivWordCountViewState: this.yanivWordCountView.serialize()
    };
  },

  toggle() {
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {
      const editor = atom.workspace.getActiveTextEditor();
      const words = editor.getText().split(/\s+/).length;
      this.yanivWordCountView.setCount(words);
      this.modalPanel.show();
    }
  }
};
