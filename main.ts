import { Plugin } from "obsidian";

import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import {
	WidgetType,
	ViewUpdate,
	PluginValue,
	EditorView,
	ViewPlugin,
	PluginSpec,
	Decoration,
	DecorationSet,
} from "@codemirror/view";

class SpoilerTextWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		const div = document.createElement("span");

		div.innerText = "wow it works";

		return div;
	}
}

class SpoilerText implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		if (update.docChanged) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy() {}

	buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();

		for (const { from, to } of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from,
				to,
				enter(node) {
					console.log('node', node);
					const listCharFrom = node.from - 2;

					// TODO: figure out how to get the value of the node

					builder.add(
						listCharFrom,
						listCharFrom + 1,
						Decoration.replace({
							widget: new SpoilerTextWidget(),
						})
					);
				},
			});
		}

		return builder.finish();
	}
}

const pluginSpec: PluginSpec<SpoilerText> = {
	decorations: (value: SpoilerText) => value.decorations,
};

export const spoilerTextPlugin = ViewPlugin.fromClass(SpoilerText, pluginSpec);

export default class SpoilerTextPlugin extends Plugin {
	async onload() {
		this.registerEditorExtension(spoilerTextPlugin);
	}

	onunload(): void {}
}
