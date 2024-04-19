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

class SpoilerTextPlugin implements PluginValue {
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
					console.log(node);
					const listCharFrom = node.from - 2; // TODO: figure out what is this node.from

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

const pluginSpec: PluginSpec<SpoilerTextPlugin> = {
	decorations: (value: SpoilerTextPlugin) => value.decorations,
};

export const examplePlugin = ViewPlugin.fromClass(
	SpoilerTextPlugin,
	pluginSpec
);
